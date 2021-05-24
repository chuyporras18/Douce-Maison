import { DepartamentoService } from './departamentos/departamentos.service';
import { Component } from '@angular/core';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  logueado: boolean;

  constructor(
    private LoginService: LoginService,
    private DepartamentoService: DepartamentoService

  ) {
    this.logueado = this.LoginService.getLogged();
  }

  ionViewWillEnter() {
    this.logueado = this.LoginService.getLogged();
  }

  logout() {
    this.DepartamentoService.logueado = false;
    //localStorage.removeItem('user');
    //localStorage.removeItem('pass');
    localStorage.removeItem('isLogged');

    this.LoginService.deleteUser(0);
  }

  update() {
    this.logueado = this.LoginService.getLogged();
    console.log(this.logueado)
  }

}
