import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservacionesPage } from './reservaciones.page';

const routes: Routes = [
  {
    path: '',
    component: ReservacionesPage
  },
  {
    path: ':reservacionId',
    loadChildren: () => import('./reservaciones-detalle/reservaciones-detalle.module').then(m => m.ReservacionesDetallePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservacionesPageRoutingModule { }
