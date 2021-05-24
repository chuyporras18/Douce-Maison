import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { DepartamentoService } from './../departamentos/departamentos.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Usuario } from './usuario.model';
import { Platform, ToastController } from '@ionic/angular';
import { Account } from './login.model';
export interface LoginResponseData {
  kind: string;
  idToken: string,
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  _login: boolean = false;
  userId: string;

  private _usuario = new BehaviorSubject<Usuario>(null);

  private storage: SQLiteObject;
  userList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  //Verificamos si se esta logueado o no.
  get usuarioLoggeado() {
    return this._usuario.asObservable().pipe(map(user => {
      if (user) {
        return !!user.token;
      }
      else {
        return false;
      }
    }));
  }

  //Dependencias.
  constructor(
    private http: HttpClient,
    private DepartamentoService: DepartamentoService,
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
    private ToastController: ToastController
  ) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'positronx_db.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.storage = db;
          this.getFakeData();
        });
    });
  }

  //Cerramos sesion.
  logout() {
    this._usuario.next(null);
  }

  //Registra el usuario mediante HTTP Cliente a la API de Firebase con la Key introducida en "environment".
  signup(email: string, password: string) {
    return this.http.post<LoginResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      { email: email, password: password, returnSecureToken: true }
    );
  }

  //Guardamos el usuario logeado y le damos un tiempo de expiracion.
  private setUserDate(userData: LoginResponseData) {
    const expTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    this._usuario.next(new Usuario(userData.localId, userData.email, userData.idToken, expTime));
  }

  //Nos Logueamos con un email y password que se pide en el formulario en le HTML.
  login(email: string, password: string) {
    return this.http.post<LoginResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
      { email: email, password: password, returnSecureToken: true }
    ).pipe(tap(this.setUserDate.bind(this)));
  }

  //Obtenemos el estado del Logueo Alamcenado Localmente.
  getLogged() {
    this._login = this.DepartamentoService.get('isLogged') || false;
    return this._login;
  }

  //Establecemos el Logueo en una variable local.
  setLogged(log: boolean) {
    this.DepartamentoService.set('isLogged', log);
  }

  //Establecemos el userId que le pasamoe en el LoginPage.
  setUserId(id: string) {
    this.userId = id;
  }

  //Obetenemos ese userId pata usarlo despues.
  getUserId() {
    return this.userId;
  }

  //Almacenamos Localmente el usuario y contraseña ingresados en el Login
  //para inciar sesion cada que se abra la aplicacion sin necesidad de volverlos a introducir.
  setUserLoged(keyEmail: string, keyPass: string, email: string, password: string) {
    try {
      localStorage.setItem(keyEmail, JSON.stringify(email));
      localStorage.setItem(keyPass, JSON.stringify(password));
      localStorage.setItem('isLogged', JSON.stringify(true));
    } catch (e) {
      console.log(e);
    }
  }

  //Obtenemos el Email que se almaceno localmente.
  getEmail(keyEmail: string) {
    try {
      return JSON.parse(localStorage.getItem(keyEmail));
    } catch (e) {
      console.log(e);
    }
  }

  //Obtenemos el Password que se almaceno localmente.
  getPass(keyPass: string) {
    try {
      return JSON.parse(localStorage.getItem(keyPass));
    } catch (e) {
      console.log(e);
    }
  }

  //Guardamos el usuario en la tabla de SQLite.
  addUser(user, pass, id) {
    let data = [id, user, pass];
    return this.storage.executeSql('INSERT INTO USER (ID, EMAIL, PASS) VALUES (?, ?, ?)', data)
      .then(() => {
      });
  }

  //Obtenemos el usuario de la tabla de SQLite.
  getUser(id): Promise<Account> {
    return this.storage.executeSql('SELECT * FROM USER WHERE ID = ?', [id]).then(res => {
      return {
        user: res.rows.item(0).EMAIL,
        password: res.rows.item(0).PASS
      }

    });
  }

  //Esperamos a que se aliste la tabla.
  getFakeData() {
    this.httpClient.get(
      'assets/dump.sql',
      { responseType: 'text' }
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.storage, data)
        .then(_ => {
          this.getUser(0);
          this.isDbReady.next(true);
          console.log("USER: " + this.getUser(0));
        })
        .catch(error => console.error("EL ERROR ES: " + error));
    });
  }

  //Borramos el usuario cuando se salga de la sesión.
  deleteUser(id) {
    return this.storage.executeSql('DELETE FROM USER WHERE ID = ?', [id])
      .then(_ => {
        this.getUser(0);
      });
  }
}
