import { Platform } from '@ionic/angular';
import { LoginService } from './../login/login.service';
import { Component, OnInit } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.page.html',
  styleUrls: ['./mi-cuenta.page.scss'],
})
export class MiCuentaPage implements OnInit {

  userId: string;
  email: string;
  allowed: boolean = false;
  storage: SQLiteObject;

  //Dependencias.
  constructor(
    private LoginService: LoginService,
    private platform: Platform, 
    private sqlite: SQLite, 

  ) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'positronx_db.db',
        location: 'default'
      })
      .then(async (db: SQLiteObject) => {
          this.storage = db;
          this.email = (await this.LoginService.getUser(0)).user;
      });
    });
  }

  //Obtenemos el userId y el Email Almacenados Localmete para mostrarlos en el HTML.
  ngOnInit() {
    this.userId = this.LoginService.getUserId();
  }
}
