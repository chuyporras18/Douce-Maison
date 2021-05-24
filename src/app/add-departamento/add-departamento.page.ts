import { DepartamentoService } from './../departamentos/departamentos.service';
import { LoginService } from './../login/login.service';
import { PhotoService } from './photo.service';
import { Departamento } from './../departamentos/departamentos.model';
import { AlertController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-departamento',
  templateUrl: './add-departamento.page.html',
  styleUrls: ['./add-departamento.page.scss'],
})
export class AddDepartamentoPage implements OnInit {

  isDisabled = false;
  aux: string[];
  dataDepa: FormGroup;

  //Inicializamos el model del Departamentos para poder utilizar la propiedad push.
  public datos: Departamento = {
    id: null,
    imagenes: null,
    titulo: null,
    precio: null,
    habitaciones: null,
    banos: null,
    condicion: null,
    nombre: null,
    telefono: null,
    ubicacion: null,
    userId: null,
    correo: null
  };

  //Dependencias
  constructor(
    private _builder: FormBuilder,
    private alertCtrl: AlertController,
    private router: Router,
    private _service: DepartamentoService,
    public photoService: PhotoService,
    public DepartamentosPage: DepartamentoService,
    private LoadingController: LoadingController,
    private LoginService: LoginService,
  ) {
    
    //Creamos un formulario con los datos necesarios para el departamento.
    this.dataDepa = this._builder.group({
      titulo: ['', Validators.required],
      precio: ['', Validators.required],
      habitaciones: ['', Validators.required],
      baños: ['', Validators.required],
      condicion: ['', Validators.required],
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      ubicacion: ['', Validators.required],
    })
  }

  ngOnInit() {
  }

  //Metodo que se va a llamar cuando se llene el fomrulario.
  enviar() {

    //Se valida que al menos haya 1 foto.
    if (this.photoService.photos.length >= 1) {

      //Se crea un LoadingController que se mostrará hasta que finalice la carga de las fotos a Firebase.
      this.LoadingController.create({
        message: 'Publicando departamento...'
      }).then(res => {
        res.present();

        //Esperamos a la funcion async que sube las imagenes a Firebase y nos devuelve su enlace para visualizarlos en el HTML con la pripiedad "src".
        this.photoService.loadSaved().then(() => {

          //Cerramos el LoadingControler y nos muestra un AlertController con un mensaje y un boton que nos mandara a la pagina principal.
          this.LoadingController.dismiss();
          this.LoadingController.dismiss().then(res => {
            this.alertCtrl.create({

              //Datos del AlertController.
              header: 'Listo!',
              message: 'Departamento añadido correctamente.',
              buttons: [
                {
                  text: 'Aceptar'
                  , handler: () => {
                    //Cuando pulsemos el boton, se agregara el departamento a la coleccion.
                    this.data(this.photoService.rutas);

                    //Navegamos hacia la pagian de los departamentos.
                    this.router.navigate(['/departamentos']);
                  }
                },
              ]
            }).then(alert => {
              alert.present();
            });
          });
        });
      });

      //Si no hay al menos 1 foto, nos manda un AlertController de Error y no podremos publicar el Departamento.
      //Por lo cual, no se cargaran aun las imagenes a Firebase.
    } else {
      this.alertCtrl.create({
        header: 'Error!',
        message: 'Debes añadir al menos 1 foto a tu publicación.',
        buttons: [
          {
            text: 'Aceptar'
          },
        ]
      }).then(alert => {
        alert.present();
      });
    }
  }

  //Guardamos los datos del formulario en nuestro model de Departamento.
  async data(aux: string[]) {
    this.datos = {
      id: '',

      //Obtenemos el userId del usuario actual que publicó el departamento para despues filtrarlos.
      userId: this.LoginService.getUserId(),
      imagenes: aux,
      titulo: "" + this.dataDepa.value['titulo'],
      precio: this.dataDepa.value['precio'],
      habitaciones: "" + this.dataDepa.value['habitaciones'],
      banos: "" + this.dataDepa.value['baños'],
      condicion: "" + this.dataDepa.value['condicion'],
      nombre: "" + this.dataDepa.value['nombre'],
      telefono: "" + this.dataDepa.value['telefono'],
      ubicacion: "" + this.dataDepa.value['ubicacion'],
      correo: "" + (await this.LoginService.getUser(0)).user
    }

    //Mandamos el departamento al Servicio para cargarlos a la coleccion de Firebase.
    this._service.setArray(this.datos);
  }

  //Este metodo se ejecuta cada que pulsamos sobre el boton de la camara para abrirla y captural la imagen.
  //Tiene un limitador de maximo 10 fotografias.
  addPhotoToGallery() {
    this.photoService.addNewToGallery();
    if ((this.photoService.photos.length) == 9) {
      this.isDisabled = true;
    }
  }

  //Este metodo se ejecuta cada que pulsamos sobre el boton de la camara para abrirla y captural la imagen.
  //Tiene un limitador de maximo 10 fotografias contando las que se tomaron con la camara.
  addFromGallery() {
    this.photoService.addNewFromGallery();
    if ((this.photoService.photos.length) == 9) {
      this.isDisabled = true;
    }
  }

  //Limpiamos el arreglo de las Fotos
  ionViewWillLeave() {
    this.photoService.photos = [];
  }

  //Limpiamos el arreglo de las Fotos y de los Enlaces
  ionViewWillEnter() {
    this.photoService.photos = [];
    this.photoService.rutas = [];
  }

  //Ajusta automaticamente el tamaño del textarea de la Descripcion.
  autogrow(){
    let  textArea = document.getElementById("textarea")       
    textArea.style.overflow = 'hidden';
    textArea.style.height = '0px';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

}
