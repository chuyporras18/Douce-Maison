import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepartamentosDetallePage } from './departamentos-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: DepartamentosDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartamentosDetallePageRoutingModule { }
