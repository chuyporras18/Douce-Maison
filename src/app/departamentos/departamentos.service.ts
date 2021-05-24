import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Departamento } from './departamentos.model';
import { Injectable } from "@angular/core";
import * as firebase from 'firebase';
import 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})

export class DepartamentoService {

  public departamentos: Departamento[] = [];

  logueado = false;
  isPage = false;

  //Documentos de Firebase con el Model del Departamento.
  depaDoc: AngularFirestoreDocument<Departamento>;
  depa: Observable<Departamento>;

  //Dependencias.
  constructor(
    private AngularFirestore: AngularFirestore,
  ) {
    //Obtenemos todos los departamentos almacenados en Firebase y los llenamos en un arreglo local.
    this.getAllDepartamentos().subscribe(response => {
      this.departamentos = [];
      response.docs.forEach(element => {
        const data = element.data();
        const _depa: Departamento = {
          id: data.id,
          imagenes: data.imagenes,
          titulo: data.titulo,
          precio: data.precio,
          userId: data.userId,
          habitaciones: data.habitaciones,
          banos: data.banos,
          condicion: data.condicion,
          nombre: data.nombre,
          telefono: data.telefono,
          ubicacion: data.ubicacion,
          correo: data.correo
        };
        this.departamentos.push(_depa);
      });
    });
  }

  //Se obtiene la coleccion de Firebase de los Departamentos ordenados por precio.
  getAllDepartamentos(): Observable<firebase.firestore.QuerySnapshot> {
    return this.AngularFirestore.collection<Departamento>('departamentos', ref => ref.orderBy('precio')).get();
  }

  //Obtenemos solamente un departamento seleccionado de acuerdo a su id.
  getDepartamento(idDepartamento: string) {
    this.depaDoc = this.AngularFirestore.doc<Departamento>(`departamentos/${idDepartamento}`);
    this.depa = this.depaDoc.snapshotChanges().map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as Departamento;
        data.id = action.payload.id;
        return data;
      }
    });
    return this.depa;
  }

  //Eliminamos un departamento seleccioando de la coleccion de Firebase.
  deleteDepartamento(departamentoiId: string): Promise<void> {
    return this.AngularFirestore.collection('departamentos').doc(departamentoiId).delete();
  }

  //Agregamos un nuevo departamento a la coleccion de Firebase desde la Pagina de Agregar Departamentos.
  setArray(array: Departamento): Promise<DocumentReference> {
    this.departamentos.push(array);
    console.log(this.departamentos)
    return this.AngularFirestore.collection('departamentos').add(array);
  }

  //Almacenamos una variable que verifica si estamos logueados o no para mantener sesion abierta.
  set(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(JSON.parse(localStorage.getItem(key)));
    } catch (e) {
      console.log(e);
    }
  }

  //Devuelve la variable anterior.
  get(key: string) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.log(e);
    }
  }

  //Retornamos esa variable.
  login() {
    return this.logueado;
  }

  //Editamos solo una parte del deparamento.
  editTodo(todo: Departamento): Promise<void> {
    return this.AngularFirestore.collection('departamentos').doc(todo.id).update(todo);
  }

}
