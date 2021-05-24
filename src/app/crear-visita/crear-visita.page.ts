import { LoginService } from './../login/login.service';
import { Departamento } from './../departamentos/departamentos.model';
import { ReservacionesService } from './../reservaciones/reservaciones.service';
import { AngendarVisitaService } from './crear-visita.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Reservaciones } from '../reservaciones/reservaciones.model';

@Component({
  selector: 'app-crear-visita',
  templateUrl: './crear-visita.page.html',
  styleUrls: ['./crear-visita.page.scss'],
})
export class CrearVisitaPage implements OnInit {

  signupForm: FormGroup;
  titulo: string;
  icono: string;
  id: number;
  total: number;
  fechaI: string;
  fechaF: string;
  precioDepa: number;

  departamento: Departamento;

  //Inicializamos el model de Reservaciones.
  public datos: Reservaciones = {
    nombre: null,
    correo: null,
    telefono: null,
    fechaI: null,
    fechaF: null,
    icono: null,
    titulo: null,
    id: null,
    total: null,
    userId: null
  };

  //Dependencias.
  constructor(
    private _builder: FormBuilder,
    private alertCtrl: AlertController,
    private router: Router,
    private AngendarVisitaService: AngendarVisitaService,
    private _service: ReservacionesService,
    private LoadingController: LoadingController,
    public LoginService: LoginService
  ) {
    //Obtenemos el Departamento que fue seleccionado para rellenar algunos datos necesarios.
    this.departamento = this.AngendarVisitaService.getDepa();

    //Formulario.
    this.signupForm = this._builder.group({
      nombre: ['', Validators.required],
      telefono: ['', [Validators.required]],
      fechaI: ['', Validators.required],
      fechaF: ['', Validators.required],
      depa: [this.titulo],
      icono: [this.icono],
      id: [this.id]
    })
  }

  ngOnInit() {
  }

  //Metodo al mandar el formulario.
  enviar() {
    //Verificamos que la fecha final no sea menor que la fecha inical
    //checando el precio, si es 0 o negativo
    if (!(this.total <= 0)) {
      //Se crea el LoadingController mientras se almacena la Reservacion en Firebase.
      this.LoadingController.create({
        message: 'Agendando visita...'
      }).then(res => {
        res.present();

        //Llamamos al metodo para almacenar la Reservacion y esperamos.
        this.sendArray().then(() => {
          this.LoadingController.dismiss();

          //Despues se crea un AlertController cuando finalice con un mensaje y un boton.
          this.LoadingController.dismiss().then(res => {
            this.alertCtrl.create({
              header: 'Listo!',
              message: 'Visita agendada correctamente.',
              buttons: [
                {
                  //Nos redirige a la pagina de las Reservaciones.
                  text: 'Aceptar'
                  , handler: () => {
                    this.router.navigate(['/reservaciones']);
                  }
                },
              ]
            }).then(alert => {
              alert.present();
            });
          });
        });
      });
      //Sino, mandamos un error.
    } else {
      this.alertCtrl.create({
        header: 'Error!',
        message: 'La Fecha Final debe ser mayor a la Fecha Inicial.',
        buttons: [
          {
            text: 'Aceptar', handler: () => {
            }

          },
        ]
      }).then(alert => {
        alert.present();
      });
    }

  }

  //Guardamos los datos del Formulario a la Reservacion y la mandamos cargar a Firebase.
  async sendArray() {
    this.datos = {
      nombre: "" + this.signupForm.value['nombre'],
      correo: (await this.LoginService.getUser(0)).user,
      telefono: "" + this.signupForm.value['telefono'],
      fechaI: "" + this.signupForm.value['fechaI'],
      fechaF: "" + this.signupForm.value['fechaF'],

      //Le agregamos como icono, la imagen numero 1 o indice 0 de las imagenes del departamento.
      icono: "" + this.departamento.imagenes[0],

      //Le agregamos el titulo del departamento.
      titulo: "" + this.departamento.titulo,

      //Le agregamos el id del departamento.
      id: this.departamento.id,

      //El precio se calcula con un metodo.
      total: this.total,

      //Se guarda el userId que hizo la reservacion.
      userId: this.LoginService.getUserId(),
    }
    //Mandamos la reservacion a cargar a Firebase y esperamos.
    await this._service.setArray(this.datos);
  }

  //Calculamos el precio segun los dias seleccionados y 
  //lo muestra en el formulario y es el que se almacena en el formulario.
  precio() {
    let fi = new Date(this.fechaF).getTime() - new Date(this.fechaI).getTime();
    fi /= (1000 * 3600 * 24);
    fi += 1;
    let precioFinal = (fi * this.departamento.precio) / 30;
    console.log(precioFinal)
    this.total = precioFinal;
  }

}
