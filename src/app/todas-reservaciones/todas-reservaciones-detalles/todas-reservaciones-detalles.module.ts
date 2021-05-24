import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodasReservacionesDetallesPageRoutingModule } from './todas-reservaciones-detalles-routing.module';

import { TodasReservacionesDetallesPage } from './todas-reservaciones-detalles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodasReservacionesDetallesPageRoutingModule
  ],
  declarations: [TodasReservacionesDetallesPage]
})
export class TodasReservacionesDetallesPageModule {}
