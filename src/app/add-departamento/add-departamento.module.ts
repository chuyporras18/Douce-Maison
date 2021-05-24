import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddDepartamentoPageRoutingModule } from './add-departamento-routing.module';

import { AddDepartamentoPage } from './add-departamento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddDepartamentoPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AddDepartamentoPage]
})
export class AddDepartamentoPageModule { }
