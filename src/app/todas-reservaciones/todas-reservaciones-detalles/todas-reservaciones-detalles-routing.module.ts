import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodasReservacionesDetallesPage } from './todas-reservaciones-detalles.page';

const routes: Routes = [
  {
    path: '',
    component: TodasReservacionesDetallesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodasReservacionesDetallesPageRoutingModule {}
