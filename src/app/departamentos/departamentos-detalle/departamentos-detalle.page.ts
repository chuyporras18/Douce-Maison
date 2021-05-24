import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from './../../login/login.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { AngendarVisitaService } from './../../crear-visita/crear-visita.service';
import { DepartamentoService } from './../departamentos.service';
import { Departamento } from './../departamentos.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-departamentos-detalle',
  templateUrl: './departamentos-detalle.page.html',
  styleUrls: ['./departamentos-detalle.page.scss'],
})
export class DepartamentosDetallePage implements OnInit {

  departamento: Departamento = {
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
  }
  photos: number;

  id: string;

  userId: string;

  isEditing: boolean = false;

  dataDepa: FormGroup;

  isExpanded: boolean = false;

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

  //Dependencias.
  constructor(
    private _builder: FormBuilder,
    private DepartamentoService: DepartamentoService,
    private AngendarVisitaService: AngendarVisitaService,
    private router: Router,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private LoginService: LoginService,
    private LoadingController: LoadingController,
  ) {

    //Formulario para mostrar los datos de manera ordenada.
    this.dataDepa = this._builder.group({
      titulo: ['', Validators.required],
      precio: ['$' + '', Validators.required],
      habitaciones: ['', Validators.required],
      baños: ['', Validators.required],
      condicion: ['', Validators.required],
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      ubicacion: ['', Validators.required],
      correo: ['', Validators.required]
    })
  }

  //Se crea un LoadingController mientras se leen los datos desde el Firebase.
  ngOnInit() {
    this.LoadingController.create({
      message: 'Cargando información del departamento...'
    }).then(res => {
      res.present();
      this.getDetalles().then(() => {
        this.LoadingController.dismiss();
        res.dismiss();
      });
    });
  }

  //Metodo para eliminar el Departamento unicamente por el usuario que lo publico.
  onDeleteDepartamento(todoId: string) {
    this.alertCtrl.create({
      header: 'Estas seguro?',
      message: 'Realmente quieres borrar este departamento? ',
      buttons: [
        {
          text: 'Cancelar'
          , role: 'cancel'
        },
        {
          text: 'Eliminar'
          , handler: () => {
            //Navegamos a la pagina principal.
            this.router.navigate(['/departamentos']);

            //Llamamos al metodo que elimina el departamento de Firebase.
            this.DepartamentoService.deleteDepartamento(todoId);
          }
        },
      ]
    }).then(alert => {
      alert.present();
    });
  }

  //Se obtienen los detalles desde el Firebase.
  async getDetalles() {
    
    //Navegamos a la ruta que tiene como id la coleccion de Firebase
    //que es el que se muestra en la url.
    this.id = this.route.snapshot.params['id'];

    this.userId = this.LoginService.getUserId();

    //Esperamos a que se obtenga el departamento.
    await this.DepartamentoService.getDepartamento(this.id).subscribe(departamento => {

      //Y se lo agregamos a la variable local.
      this.departamento = departamento;
    });
  }

  //Regulamos si se esta editando o no el departamento, ya que cambiara el HTML.
  onEditDepartamento() {
    this.isEditing = !this.isEditing;
    this.isExpanded = false;
  }

  //Editamos el departamento unicamente por el usuario que lo publico.
  async editar() {
    this.datos = {
      id: this.departamento.id,
      userId: this.LoginService.getUserId(),
      imagenes: this.departamento.imagenes,
      titulo: "" + this.dataDepa.value['titulo'],
      precio: this.dataDepa.value['precio'],
      habitaciones: "" + this.dataDepa.value['habitaciones'],
      banos: "" + this.dataDepa.value['baños'],
      condicion: "" + this.dataDepa.value['condicion'],
      nombre: "" + this.dataDepa.value['nombre'],
      telefono: "" + this.dataDepa.value['telefono'],
      ubicacion: "" + this.dataDepa.value['ubicacion'],
      correo: "" + this.dataDepa.value['correo']
    }

    //Cargamos los nuevos datos al Firebase del departamento.
    await this.DepartamentoService.editTodo(this.datos);
  }

  //Se termina de editar el Departamento y se crea un LoadingController mientras se sube.
  editarDepartamento() {
    this.LoadingController.create({
      message: 'Editanto información del departamento...'
    }).then(res => {
      res.present();
      this.editar().then(() => {

        //Se crea un AlertController con un mensaje y un boton.
        this.LoadingController.dismiss();
        this.LoadingController.dismiss().then(res => {
          this.alertCtrl.create({
            header: 'Listo!',
            message: 'Se actualizó la información del departamento.',
            buttons: [
              {
                text: 'Aceptar'
                , handler: () => {

                  //Nos redirige a la pagina del departamento actual con los datos modificados.
                  this.router.navigate(['/departamentos/' + this.departamento.id]);

                  //Establecemos la variable que identifica si se esta editando o no el departamento
                  //como falso.
                  this.isEditing = false;
                }
              },
            ]
          }).then(alert => {
            alert.present();
          });
        });
      });
    });
  }

  //Nos manda a la pagina para hacer la reservacion y mandamos el departamento actual 
  //para rellenas algunos datos.
  agendarVisita() {
    if (this.LoginService.getLogged()) {
      this.AngendarVisitaService.setDepa(this.departamento);
    this.router.navigate(['/crear-visita']);
    } else {
      this.alertCtrl.create({
        header: 'Error!',
        message: 'Inicia sesión para publicar tu departamento.',
        buttons: [
          {
            text: 'Aceptar', handler: () => {

              //Navegamos a la pagina para iniciar sesion.
              this.router.navigate(['/login']);
            }

          },
        ]
      }).then(alert => {
        alert.present();
      });
    }
  }

  //Ajusta automaticamente el tamaño del textarea de la Descripcion.
  autogrow(){
    let  textArea = document.getElementById("textarea")       
    textArea.style.overflow = 'hidden';
    textArea.style.height = '0px';
    textArea.style.height = textArea.scrollHeight + 'px';
    this.isExpanded = true;
    console.log(textArea.scrollHeight + 'px');
  }
}
