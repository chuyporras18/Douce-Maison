import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Observable } from 'rxjs';
import { LoginService, LoginResponseData } from './../login/login.service';
import { AppComponent } from './../app.component';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { DepartamentoService } from './departamentos.service';
import { Departamento } from './departamentos.model';
import { Component, OnInit } from '@angular/core';
import { Account } from '../login/login.model';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.page.html',
  styleUrls: ['./departamentos.page.scss'],
})
export class DepartamentosPage implements OnInit {

  public departamentos: Departamento[] = [];
  textoBuscar = '';
  loged: boolean;
  isLogged: boolean = false;
  user: Account;
  private storage: SQLiteObject;
  userId: string;

  //Dependencias.
  constructor(
    private DepartamentoService: DepartamentoService,
    private Router: Router,
    private AlertController: AlertController,
    private AppComponent: AppComponent,
    private LoginService: LoginService,
    private loginService: LoginService,
    private router: Router,
    private LoadingController: LoadingController,
    private platform: Platform,
    private sqlite: SQLite,
  ) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'positronx_db.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.storage = db;
          //Establecemos la variable que identifica el logueo
          //segun lo que se tenga almacenado.
          this.loged = this.LoginService.getLogged();
          if (this.loged)
            this.Login();
        });
    });
  }

  ngOnInit(){
    
  }

  //Con éste método obtenemos los nuevos departamentos al deslizar hacia abajo en el HTML
  doRefresh(event) {
    console.log('Begin async operation');
    this.getAllDepartamentos();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  //Obtenemos todos los departamentos desde Firebase y los agregamos al arreglo local.
  async getAllDepartamentos() {
    await this.DepartamentoService.getAllDepartamentos().subscribe(response => {
      this.departamentos = [];
      response.docs.forEach(element => {
        const data = element.data();
        const id = element.id
        const _depa: Departamento = {
          id: id,
          imagenes: data.imagenes,
          titulo: data.titulo,
          userId: data.userId,
          precio: data.precio,
          habitaciones: data.habitaciones,
          banos: data.banos,
          condicion: data.condicion,
          nombre: data.nombre,
          telefono: data.telefono,
          ubicacion: data.ubicacion,
          correo: data.correo
        };
        this.departamentos.push(_depa);
      });
    });
  }

  ionViewWillEnter() {

    //Volvemos a obtener los departamentos por si se actualizo alguno.
    this.LoadingController.create({
      keyboardClose: true,
      message: 'Cargando departamentos...'
    }).then(res => {
      res.present();
      this.getAllDepartamentos().then(() => {
        res.dismiss();
      });
    });
    this.loged = this.LoginService.getLogged();
    this.userId = this.LoginService.getUserId();
  }

  //Pipe para filtrar los departamentos segun el texto introducido, buscando en el titulo.
  buscar(event) {
    this.textoBuscar = event.detail.value;
  }

  //Añadimos un departamento.
  addDepartamento() {

    //Si no se esta logueado, no nos permite y nos manda un mensaje de error para iniciar sesion.
    if (this.loged) {
      this.Router.navigate(['/add-departamento']);
    } else {
      this.AlertController.create({
        header: 'Error!',
        message: 'Inicia sesión para publicar tu departamento.',
        buttons: [
          {
            text: 'Aceptar', handler: () => {

              //Navegamos a la pagina para iniciar sesion.
              this.Router.navigate(['/login']);
            }

          },
        ]
      }).then(alert => {
        alert.present();
      });
    }
  }

  //Actualziamos el menu lateral para cuando se este logueado o no.
  update() {
    this.AppComponent.update();
  }

  //Creamos un login en segundo plano para mantener la sesion abierta
  //cada que se abra la aplicacion y no tener que iniciar sesion manualmente.
  async Login() {
    this.user = {
      user: (await this.loginService.getUser(0)).user,
      password: (await this.loginService.getUser(0)).password
    };
    //let email = await this.LoginService.getEmail('user');
    //let password = await this.LoginService.getPass('pass');
    let email = this.user.user;
    let password = this.user.password;
    console.log(email, password);
    this.LoadingController.create({
      keyboardClose: true,
      message: 'Cargnado departamentos...'
    })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<LoginResponseData>;
        authObs = this.loginService.login(email, password);
        authObs.subscribe(response => {
          console.log(response);
          this.loginService.setUserId(response.localId);
          loadingEl.dismiss();

          //Volvemos a obtener los departamentos por si se actualiza alguno y
          //nos vamos a la pagina principal.
          this.getAllDepartamentos();
          this.router.navigateByUrl('/departamentos');

          //Establecemos la variable de logueo como true, ya que se inicio sesion.
          this.isLogged = true;

          //Guardamos esa variable y el email y password en el almacenamiento local
          //para iniciar sesion con esas credenciales cada que se abra la aplicacion.
          this.loginService.setLogged(this.isLogged);
          //this.loginService.setUserLoged('user', 'pass', email, password);

          //Almacenamos en SQLite el usuario y contraseña para inciar sesion 
          //en segundo plano cada que se entra a la aplicacion para mantenernos logueados.
          this.loginService.addUser(email, password, 0);
          this.userId = this.LoginService.getUserId();
        });
      });
  }
}
