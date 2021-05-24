import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodasReservacionesPageRoutingModule } from './todas-reservaciones-routing.module';

import { TodasReservacionesPage } from './todas-reservaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodasReservacionesPageRoutingModule
  ],
  declarations: [TodasReservacionesPage]
})
export class TodasReservacionesPageModule {}
