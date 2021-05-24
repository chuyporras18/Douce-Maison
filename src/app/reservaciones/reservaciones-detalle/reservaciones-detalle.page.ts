import { LoginService } from './../../login/login.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { ReservacionesService } from './../reservaciones.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservaciones } from '../reservaciones.model';

@Component({
  selector: 'app-reservaciones-detalle',
  templateUrl: './reservaciones-detalle.page.html',
  styleUrls: ['./reservaciones-detalle.page.scss'],
})
export class ReservacionesDetallePage implements OnInit {

  reservaciones: Reservaciones = {
    id: null,
    icono: null,
    titulo: null,
    correo: null,
    telefono: null,
    fechaI: null,
    fechaF: null,
    nombre: null,
    total: null,
    userId: null,
  };
  id: string;
  userId: string;

  //Dependencias
  constructor(
    private activatedRoute: ActivatedRoute,
    private reservacionesService: ReservacionesService,
    private LoadingController: LoadingController,
    private AlertController: AlertController,
    private router: Router,
    public LoginService: LoginService
  ) { }

  //Creamos un LoadingController mientras se carga la informacion de la Reservacion desde Firebase
  ngOnInit() {
    this.LoadingController.create({
      message: 'Cargando información de la reservación...'
    }).then(res => {
      res.present();
      this.getDetalles().then(() => {
        res.dismiss();
      });
    });
  }

  //Obtenemos los detalles de la Reservacion
  async getDetalles() {
    this.id = this.activatedRoute.snapshot.params['reservacionId'];
    console.log(this.id)
    await this.reservacionesService.getReservaciones(this.id).subscribe(reservaciones => {
      this.reservaciones = reservaciones;
      console.log(this.reservaciones)
    });
  }

  //Eliminamos dicha reservacion
  onDeleteReservacion(todoId: string) {
    this.AlertController.create({
      header: 'Estas seguro?',
      message: 'Realmente quieres cancelar esta reservación?',
      buttons: [
        {
          text: 'Cancelar'
          , role: 'cancel'
        },
        {
          text: 'Eliminar'
          , handler: () => {
            this.router.navigate(['/reservaciones']);
            console.log(todoId)
            this.reservacionesService.deleteReservacion(todoId);
          }
        },
      ]
    }).then(alert => {
      alert.present();
    });
  }
}
