import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { DataService } from '../list/data.service';
import { RolesUser, usuarioRol } from '../login/login.component';

let datosUser: RolesUser = {
  rol: '',
  nombre: '',
  id: 0,
};
export interface DatosSoftware {
  idSoft: string;
}
export let idSoftware: DatosSoftware = {
  idSoft: '',
};

@Component({
  selector: 'app-index-software',
  templateUrl: './index-software.component.html',
  styleUrls: ['./index-software.component.scss']
})
export class IndexSoftwareComponent implements OnInit {

  softwares: any[];
  ifProgreso = false;
  ifResultados = true;

  constructor(
    protected servicioConUser: ServiciosService,
    protected servicioSoftware: DataService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.usuarioLogeado();
  }

  usuarioLogeado() {
    datosUser = usuarioRol;
    console.log(datosUser)
    const token = this.servicioConUser.getToken();
    const cookieN64 = window.atob(unescape(encodeURIComponent(token)));
    datosUser = JSON.parse(cookieN64)
    console.log(token)
    if ( token.length === 0 ) {
      console.log('error en el acceso');
      this.router.navigate(['Login']);
    } else {
      if (datosUser.rol === 'Admin') {
        console.log('acceso correcto');
        this.getSoftware();
      } else if (datosUser.rol !== 'Admin') {
        this.router.navigate(['Principal']);
      }
    }
  }
  getSoftware() {
    this.servicioSoftware.getAllSoftware().subscribe(
      response => {
        console.log(response)
        if ( response.status === 200 ) {
          this.softwares = response.body;
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
        console.log(error)
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
  editarSoftware(id: string) {
    idSoftware = {
      idSoft: id,
    };
  }
  eliminarSoftware(id: string) {
    console.log(id)
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
