import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { RolesUser, usuarioRol } from '../login/login.component';

export interface DatosUsuario {
  idUser: string;
}
export let idUsuario: DatosUsuario = {
  idUser: '',
};
let datosUser: RolesUser = {
  rol: '',
  nombre: '',
  id: 0,
};

let token = '';
@Component({
  selector: 'app-index-usuarios',
  templateUrl: './index-usuarios.component.html',
  styleUrls: ['./index-usuarios.component.scss']
})
export class IndexUsuariosComponent implements OnInit {

  usuarios: any[];
  ifProgreso = false;
  ifResultados = true;
  constructor(
    protected servicioConUser: ServiciosService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.usuarioLogeado();
  }

  usuarioLogeado() {
    datosUser = usuarioRol;
    token = this.servicioConUser.getToken();
    const cookieN64 = window.atob(unescape(encodeURIComponent(token)));
    datosUser = JSON.parse(cookieN64);
    if ( token.length === 0 ) {
      console.log('error en el acceso');
      this.router.navigate(['Login']);
    } else {

      if (datosUser.rol === 'Admin') {
        console.log('acceso correcto');
        this.getUsuarios();
      } else if (datosUser.rol !== 'Admin') {
        this.router.navigate(['Principal']);
      }
    }
  }
  getUsuarios() {
    this.servicioConUser.getAllUsuarios(token).subscribe(
      response => {
        if ( response.status === 200 ) {
          this.usuarios = response.body;
          const usuariosFilter =  this.usuarios.filter(item => item.id_usuario !== datosUser.id);
          this.usuarios = usuariosFilter;
          this.ifResultados = false;
          this.ifProgreso = true;
        } else {
          console.log('error en el servicio');
          this.ifResultados = false;
          this.ifProgreso = true;
          this.mensajeErrorConsulta();
        }
      },
      error => {
        if (error.status === 500 ) {
          this.ifResultados = false;
          this.ifProgreso = true;
          this.mensaje500();
        } else {
          this.mensajeErrorConsulta();
          this.ifResultados = false;
          this.ifProgreso = true;
        }
      }
    );
  }
  editarUsuario(id: string) {
    idUsuario = {
      idUser: id,
    };
  }
  eliminarUsuario(id: string) {
    this.servicioConUser.borrarUsuario(Number(id), token).subscribe(
      response => {
        if (response.status === 204) {
          this.mensajeUsuarioEliminado204();
          this.getUsuarios();
        } else {
          this.mensajeErrorEliminacion();
        }
      },
      error => {
        if (error.status === 500 ) {
          this.mensaje500();
        } else {
          this.mensajeErrorEliminacion();
        }
      }
    );

  }
  mensajeUsuarioEliminado204() {
    this.toastr.success('Se eliminó el usuario correctamente', 'Registro Eliminado');
  }
  mensajeErrorEliminacion() {
    this.toastr.error('No se eliminó el usuario', 'Error en el registro');
  }
  mensaje500() {
    this.toastr.error('Intentar más tarde', 'Error del Servidor ');
  }
  mensajeErrorConsulta() {
    this.toastr.error('Intentar más tarde', 'No se pudo obtener la información ');
  }
}
