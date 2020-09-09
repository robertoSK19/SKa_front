import { Component, OnInit } from '@angular/core';
import { usuarioRol, RolesUser } from '../login/login.component';
import { Router} from '@angular/router';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { DatosEquipo, EquipoAE } from '../index-equipos/index-equipos.component';
import { DataService } from '../list/data.service';
import { Equipos } from '../../Models/equipos/equipos.interface';

let datosUser: RolesUser = {
  rol: '',
  nombre: '',
  id_user: '',
};

let datosEquipo: DatosEquipo = {
  idEquipo: '',
  operacion: ''
};

@Component({
  selector: 'app-agregar-equipos',
  templateUrl: './agregar-equipos.component.html',
  styleUrls: ['./agregar-equipos.component.scss']
})
export class AgregarEquiposComponent implements OnInit {

  idEquipoL: string;
  // equipo: Equipos;

  public equipo: Equipos = {
    id_equipo: '',
    nombre_equipo: '',
    marca: '',
    modelo: '',
    modelo_equipo_cmd: '',
    numero_serie: '',
    numero_serie_cmd: '',
    procesador: '',
    ram: 0,
    disco_duro: '',
    cuenta_usuario: '',
    cuenta_usuario_contrasena: '',
    tipo_computadora: '',
    fecha_fabricacion: '',
    nombre_sistema_operativo: '',
    tipo_sistema_operativo: '',
    direccion_mac: '',
    email_gnp: ''
  };

  constructor(
    private router: Router,
    protected servicioConUser: ServiciosService,
    private dataSvc: DataService
  ) { }
  ngOnInit() {
    this.usuarioLogeado();
    // this.operacionesEquipos();
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
  operacionesEquipos(idEquipo?: string) {
    datosEquipo = EquipoAE;
    if (datosEquipo.operacion === 'editar') {
      console.log('soy editar');
      this.dataSvc.getEquipo(datosEquipo.idEquipo).subscribe(
        response => {
          this.equipo = response.body;
//          console.log(this.equipo);
          this.equipo.cuenta_usuario_contrasena = response.body.cuenta_usuario_contraseña;
          console.log(this.equipo);
        },
        error => {
          console.log(error);
        }
      );
    } else if (datosEquipo.idEquipo === 'mostrar') {
      console.log('soy mostrar');
    }

  }
  guardarDatos() {
    console.log('guardar');
  }

  formatofecha(fecha: string): string {
    let dia: string;
    let mes: string;
    let anio: string;
    dia = fecha.slice(6, 8);
    mes = fecha.slice(4, 6);
    anio = fecha.slice(0, 4);
    return dia + '/' + mes + '/' + anio;
  }

}
