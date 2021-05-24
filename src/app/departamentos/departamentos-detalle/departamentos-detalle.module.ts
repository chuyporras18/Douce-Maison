import { CrearVisitaPage } from './../../crear-visita/crear-visita.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DepartamentosDetallePageRoutingModule } from './departamentos-detalle-routing.module';

import { DepartamentosDetallePage } from './departamentos-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DepartamentosDetallePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DepartamentosDetallePage]
})
export class DepartamentosDetallePageModule { }
