import { LoginService } from './../../login/login.service';
import { TodasReservacionesService } from './../todas-reservaciones.service';
import { Reservaciones } from './../../reservaciones/reservaciones.model';
import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todas-reservaciones-detalles',
  templateUrl: './todas-reservaciones-detalles.page.html',
  styleUrls: ['./todas-reservaciones-detalles.page.scss'],
})
export class TodasReservacionesDetallesPage implements OnInit {

  reservaciones: Reservaciones[];
  reservacion: Reservaciones = {
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

  //Dependencias.
  constructor(
    private LoadingController: LoadingController,
    private TodasReservacionesService: TodasReservacionesService,
    public LoginService: LoginService
  ) { }

  //Creamos un LoadingController mientras se cargan los detalles de la reservacion.
  ngOnInit() {
    this.LoadingController.create({
      message: 'Cargando información de la reservación...'
    }).then(res => {
      res.present();
      this.getDetalles().then(() => {
        this.LoadingController.dismiss();
      });
    });
  }

  //Se obtienen los detalles de las reservaciones.
  async getDetalles() {
    this.reservaciones = this.TodasReservacionesService.getArray();
    for (let i of this.reservaciones) {
      
      //Se verifica el id de la reservacion seleccionada para navegar a dicha pagina 
      //con los departamentos almacenados localmente.
      if (i.id === this.TodasReservacionesService.getId()) {
        this.reservacion = i;
      }
    }
  }

}
