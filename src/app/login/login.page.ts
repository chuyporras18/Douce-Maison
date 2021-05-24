import { LoginService, LoginResponseData } from './login.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-login'
  ,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLoading: boolean = false;
  isLoginMode: boolean = true;
  isLogged: boolean = false;

  //Dependencias.
  constructor(
    private loginService: LoginService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
  }
  //Se obtienen los datos del Formulario de Login y se mandan al metodo para Autenticar.
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return false;
    }
    const email = form.value.email;
    const pass = form.value.password;
    this.authenticate(email, pass);

  }

  //Regulamos si se esta Loguenando o Registrando, ya que cambiara el HTML.
  onSwitchAuthMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  //Mostramos un AlertController si se Registro correctamente.
  showAlert(titulo: string, mensaje: string) {
    this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    }).then(alertEl => alertEl.present());
  }

  //Autenticamos el usuario segun los que se encuentren almacenados en el Firebase.
  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl.create({
      keyboardClose: true,
      message: 'Iniciando Sesión...'
    })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<LoginResponseData>;
        if (this.isLoginMode) {
          authObs = this.loginService.login(email, password);
        }
        else {
          authObs = this.loginService.signup(email, password);
        }
        authObs.subscribe(response => {
          console.log(response);
          
          //Guardamos el ID del usuario que sera el que se utilice en varios elementos.
          this.loginService.setUserId(response.localId);
          console.log(response.localId);
          this.isLoading = false;
          loadingEl.dismiss();

          //Nos manda a la pagina principal despues de haber inciado sesion.
          this.router.navigateByUrl('/departamentos');
          this.isLogged = true;

          //Guardamos el estado el Loguin.
          this.loginService.setLogged(this.isLogged);

          //Almacenamos localmente el usuario y contraseña para inciar sesion 
          //en segundo plano cada que se entra a la aplicacion para mantenernos logueados.
          //this.loginService.setUserLoged('user', 'pass', email, password);

          //Almacenamos en SQLite el usuario y contraseña para inciar sesion 
          //en segundo plano cada que se entra a la aplicacion para mantenernos logueados.
          this.loginService.addUser(email, password, 0);
          
        },
        
        //Mostramos algun error presentado en un una Alerta
          errorResponse => {
            this.isLoading = false;
            loadingEl.dismiss();
            const error = errorResponse.error.error.message;
            let mensaje =
              'Acceso incorrecto!';
            switch (error) {
              case 'EMAIL_EXISTS':
                mensaje = 'El usuario ya existe!';
                break;
              case 'EMAIL_NOT_FOUND':
                mensaje = 'El usuario no existe!';
                break;
              case 'INVALID_PASSWORD':
                mensaje = 'Contraseña incorrecta!';
                break;
            }
            console.log(mensaje);
            this.showAlert('Error'
              , mensaje);
          });

      });
  }

}
