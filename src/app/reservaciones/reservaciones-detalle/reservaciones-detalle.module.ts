import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservacionesDetallePageRoutingModule } from './reservaciones-detalle-routing.module';

import { ReservacionesDetallePage } from './reservaciones-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservacionesDetallePageRoutingModule
  ],
  declarations: [ReservacionesDetallePage]
})
export class ReservacionesDetallePageModule { }
