import { Component, OnInit, ViewChild } from '@angular/core';
import { usuarioRol, RolesUser, token, LoginComponent } from '../login/login.component';
import { ServiciosService } from '../../Servicios/servicios.service';
import { Router } from '@angular/router';

let ifRol: boolean;
let datosUser: RolesUser = {
  rol: '',
  nombre: '',
  id_user: '',
};

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    protected servicioConUser: ServiciosService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.usuarioLogeado();
    // console.log(this.servicioConUser.getToken());
  }

  ifToken;
  ifToken2=true;
  usuarioLogeado() {
    datosUser = usuarioRol;
    const token = this.servicioConUser.getToken();

    if ( token.length === 0) {
      console.log('error en el acceso');
      this.ifToken = true;
      this.token2 = true;
    } else {
      this.ifToken = false;
      this.token2 = false;
    }
    //window.location.assign('/')
    /* if (datosUser.rol !== 'N/A' && datosUser.rol !== null && datosUser.rol !== '') {
      console.log('acceso correcto');
      ifRol = false;
    } else {
      ifRol = true;
    }
    console.log(ifRol); */
  }

  cerrarSesion() {
    this.servicioConUser.deleteToken();
    this.router.navigate(['Login']);
  }
  otraFuncion(parms:string) {
    const token2 = token;
    console.log("soy otra", token2)
    if ( token2.length === 0) {
      console.log('error en el acceso');
      this.ifToken = true;
      console.log(this.ifToken)
    } else {
      this.ifToken = false;
      console.log(this.ifToken)
    }
  }
  token2=true;
  activaMenu(token: boolean) {
    console.log(token);
    if (token === true){
      
      this.router.navigate(['Login']);
      this.token2=true;
      console.log(this.token2)
    }else{
      this.token2=false;
      console.log(this.token2)
    }
  }

}
