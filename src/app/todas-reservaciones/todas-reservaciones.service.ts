import { Reservaciones } from './../reservaciones/reservaciones.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TodasReservacionesService {

  reservaciones: Reservaciones[] = [];
  id: string;

  //Ahora no hubo dependencias profe :/
  constructor(
  ) {
  }

  //Agreamos la reservacion a un arreglo local.
  setArray(res: Reservaciones) {
    this.reservaciones.push(res);
  }

  //Obtenemos dicha reservacion.
  getArray() {
    return this.reservaciones;
  }

  //Agregamos el id.
  setId(id: string) {
    this.id = id;
  }

  //Obtenemos el id.
  getId() {
    return this.id;
  }
}
