import { Departamento } from './../departamentos/departamentos.model';
import { Injectable } from "@angular/core"

@Injectable({
  providedIn: 'root'
})

export class AngendarVisitaService {

  titulo: string;
  icono: string;
  id: number;
  precio: number;

  departamento: Departamento;

  //Establecemos el departamento
  setDepa(depa: Departamento) {
    this.departamento = depa;
  }

  //Devolvemos el departamento
  getDepa() {
    return this.departamento;
  }
}
