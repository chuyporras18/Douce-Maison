import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Reservaciones } from './reservaciones.model';

@Injectable({
  providedIn: 'root'
})

export class ReservacionesService {

  reservaciones: Reservaciones[] = [];

  //Documentos de Firebase con el Model del Reservaciones.
  resDoc: AngularFirestoreDocument<Reservaciones>;
  res: Observable<Reservaciones>;

  //Dependencias.
  constructor(
    private AngularFirestore: AngularFirestore
  ) {
  }

  //Guardamos una Reservacion creada y la cargamos a Firebase.
  setArray(array: Reservaciones): Promise<DocumentReference> {
    this.reservaciones.push(array);
    console.log(this.reservaciones)
    return this.AngularFirestore.collection('reservaciones').add(array);
  }

  //Obtenemos todas las Reservaciones y las ordenamos por fecha inicial.
  getAllReservaciones(): Observable<firebase.firestore.QuerySnapshot> {
    return this.AngularFirestore.collection<Reservaciones>('reservaciones', ref => ref.orderBy('fechaI')).get();
  }

  //Obtenemos solo una reservacion seleccionada.
  getReservaciones(idDepartamento: string) {
    this.resDoc = this.AngularFirestore.doc<Reservaciones>(`reservaciones/${idDepartamento}`);
    this.res = this.resDoc.snapshotChanges().map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as Reservaciones;
        data.id = action.payload.id;
        return data;
      }
    });
    return this.res;
  }

  //Eliminamos la reservacion de Firebase.
  deleteReservacion(reservacionId: string): Promise<void> {
    return this.AngularFirestore.collection('reservaciones').doc(reservacionId).delete();
  }

}
