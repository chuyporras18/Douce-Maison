import { LoadingController } from '@ionic/angular';
import { LoginService } from './../login/login.service';
import { ReservacionesService } from './reservaciones.service';
import { Reservaciones } from './reservaciones.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.page.html',
  styleUrls: ['./reservaciones.page.scss'],
})
export class ReservacionesPage implements OnInit {
  reservaciones: Reservaciones[] = [];

  //Dependencias.
  constructor(
    private ReservacionesService: ReservacionesService,
    private LoginService: LoginService,
    private LoadingController: LoadingController
  ) {

  }

  //Creamos un LoadingController mientras se cargan todas las Reservaciones.
  ngOnInit() {
    this.LoadingController.create({
      message: 'Cargando reservaciones...'
    }).then(res => {
      res.present();
      this.getAllReservaciones().then(() => {
        res.dismiss();
      });
    });
  }

   //Con éste método obtenemos las nuevas reservaciones al deslizar hacia abajo en el HTML
   doRefresh(event) {
    console.log('Begin async operation');
    this.getAllReservaciones();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  //Obetenemos dichas Reservaciones desde Firebase
  async getAllReservaciones() {
    await this.ReservacionesService.getAllReservaciones().subscribe(response => {
      this.reservaciones = [];
      response.docs.forEach(element => {
        const data = element.data();
        const id = element.id
        const res: Reservaciones = {
          id: id,
          icono: data.icono,
          titulo: data.titulo,
          correo: data.correo,
          telefono: data.telefono,
          fechaI: data.fechaI,
          fechaF: data.fechaF,
          nombre: data.nombre,
          total: data.total,
          userId: data.userId,
        };

        //Si la reservacion que se va a agregar no tiene como userId el userId que esta logueado, 
        //no se agrega, ya que solo muestra las que cada usuario haya realizado.
        if (this.LoginService.getUserId() === data.userId)
          this.reservaciones.push(res);
      });
    });
  }


  //Actualizamos la lista por si se elimino una Reservacion.
  ionViewWillEnter() {
    this.getAllReservaciones();
  }

}
