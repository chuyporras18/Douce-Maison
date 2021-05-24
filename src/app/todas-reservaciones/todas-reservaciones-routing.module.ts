import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodasReservacionesPage } from './todas-reservaciones.page';

const routes: Routes = [
  {
    path: '',
    component: TodasReservacionesPage
  },
  {
    path: ':id',
    loadChildren: () => import('./todas-reservaciones-detalles/todas-reservaciones-detalles.module').then( m => m.TodasReservacionesDetallesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodasReservacionesPageRoutingModule {}
