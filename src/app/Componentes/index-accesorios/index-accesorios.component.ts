import { Component, OnInit } from '@angular/core';
import { usuarioRol, RolesUser } from '../login/login.component';
import { Router} from '@angular/router';
import { ServiciosService } from 'src/app/Servicios/servicios.service';


let datosUser: RolesUser = {
  rol: '',
  nombre: '',
  id_user: '',
};
@Component({
  selector: 'app-index-accesorios',
  templateUrl: './index-accesorios.component.html',
  styleUrls: ['./index-accesorios.component.scss']
})
export class IndexAccesoriosComponent implements OnInit {

  constructor(
    private router: Router,
    protected servicioConUser: ServiciosService
  ) {
  }

  ngOnInit() {
    this.usuarioLogeado();
  }

  usuarioLogeado() {
    datosUser = usuarioRol;
    const token = this.servicioConUser.getToken();
    if ( token.length === 0) {
      console.log('error en el acceso');
      this.router.navigate(['Login']);
    } else {
      console.log('acceso correcto');
    }
  }
}
