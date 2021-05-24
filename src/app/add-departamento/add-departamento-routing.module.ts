import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddDepartamentoPage } from './add-departamento.page';

const routes: Routes = [
  {
    path: '',
    component: AddDepartamentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDepartamentoPageRoutingModule { }
