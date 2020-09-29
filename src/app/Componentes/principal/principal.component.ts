import { Component, OnInit } from '@angular/core';
import { usuarioRol, RolesUser } from '../login/login.component';
import { Router} from '@angular/router';
import { ServiciosService } from '../../Servicios/servicios.service';

let datosUser: RolesUser = {
  rol: '',
  nombre: '',
  id: 0,
};


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})

export class PrincipalComponent implements OnInit {

  constructor(
    private router: Router,
    protected servicioConUser: ServiciosService
  ) { }

  ngOnInit() {
    this.usuarioLogeado();
  }

  usuarioLogeado() {
    datosUser = usuarioRol;
    const token = this.servicioConUser.getToken();
    /* if (datosUser.rol !== 'N/A' && datosUser.rol !== null && datosUser.rol !== '') {
    } else {
      console.log('error en el acceso');
      this.router.navigate(['Login']);
    } */
    if ( token.length === 0) {
      console.log('error en el acceso');
      this.router.navigate(['Login']);
    } else {
      console.log('acceso correcto');
    }
  }

}
