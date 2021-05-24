import { LoadingController } from '@ionic/angular';
import { TodasReservacionesService } from './todas-reservaciones.service';
import { Reservaciones } from './../reservaciones/reservaciones.model';
import { ReservacionesService } from './../reservaciones/reservaciones.service';
import { LoginService } from './../login/login.service';
import { Departamento } from './../departamentos/departamentos.model';
import { DepartamentoService } from './../departamentos/departamentos.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todas-reservaciones',
  templateUrl: './todas-reservaciones.page.html',
  styleUrls: ['./todas-reservaciones.page.scss'],
})
export class TodasReservacionesPage implements OnInit {

  departamentos: Departamento[] = [];
  reservaciones: Reservaciones[] = [];
  allMyReservacionesDepartamentos: Reservaciones[] = [];

  //Dependencias.
  constructor(
    private DepartamentoService: DepartamentoService,
    private LoginService: LoginService,
    private ReservacionesService: ReservacionesService,
    private TodasReservacionesService: TodasReservacionesService,
    private router: Router,
    private LoadingController: LoadingController
  ) { }

  //Obtenemos solamente las reservaciones que se crearon de los departamentos publicados
  //por el usuario logueado.
  ngOnInit() {
    this.LoadingController.create({
      message: 'Cargando reservaciones...'
    }).then(res => {
      res.present();
      this.getMyOwnDepartamentos().then(() => {
        res.dismiss();
      });
    });
  }

   //Con éste método obtenemos las nuevas reservaciones al deslizar hacia abajo en el HTML
   doRefresh(event) {
    console.log('Begin async operation');
    this.getMyOwnDepartamentos();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  //Obtenemos solamente los departamentos que el usuario haya publicado.
  async getMyOwnDepartamentos() {
    await this.DepartamentoService.getAllDepartamentos().subscribe(async response => {
      this.departamentos = [];
      response.docs.forEach(element => {
        const data = element.data();
        const id = element.id
        const _depa: Departamento = {
          id: id,
          imagenes: data.imagenes,
          titulo: data.titulo,
          userId: data.userId,
          precio: data.precio,
          habitaciones: data.habitaciones,
          banos: data.banos,
          condicion: data.condicion,
          nombre: data.nombre,
          telefono: data.telefono,
          ubicacion: data.ubicacion,
          correo: data.correo
        };

        //Verificamos si el departamento tiene como userId el mismo que el que 
        //esta logueado para ver si le pertenece.
        if (this.LoginService.getUserId() === data.userId)
          this.departamentos.push(_depa);
      });

      //Una vez que finalice el metodo anterior, llamamos al otro metodo para obtener las reservaciones.
      await this.getAllReservaciones();
    });
  }

  //Obtenemos todas las reservaciones.
  async getAllReservaciones() {
    await this.ReservacionesService.getAllReservaciones().subscribe(response => {
      this.reservaciones = [];
      response.docs.forEach(element => {
        const data = element.data();
        const id = element.id
        const res: Reservaciones = {
          id: data.id,
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
        this.reservaciones.push(res);
      });

      //Llamamos al metodo que nos filtrara las reservaciones que se hayan creado 
      //de los departamentos que el usuario publico.
      this.allReservaciones();
    });
  }

  //Obtenemos las reservaciones unicamente de los departamentos publicados por el usuario actual.
 async allReservaciones() {
    for (let i of this.departamentos) {
      for (let j of this.reservaciones) {
        if (i.id === j.id) {
          this.allMyReservacionesDepartamentos.push(j);
          this.TodasReservacionesService.setArray(j);
        }
      }
    }
  }

  //Obtenemos los detalles de la reservacion seleccionada.
  detalles(id: string) {
    this.router.navigate(['/todas-reservaciones/' + id]);
    this.TodasReservacionesService.setId(id);
  }

}
