import { Component, OnInit } from '@angular/core';
import { usuarioRol, RolesUser } from '../login/login.component';
import { Router} from '@angular/router';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { DataService } from '../list/data.service';
import { ToastrService } from 'ngx-toastr';

export interface DatosAccesorio {
  idAccesorio: string;
  operacion: string;
}
export let AccesorioAA: DatosAccesorio = {
  idAccesorio: '',
  operacion: ''
};

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

  accesorios: any[];
  ifProgreso = false;
  ifResultados = true;
  accesoriosback: any[];
  valor = '';
  constructor(
    private router: Router,
    protected servicioConUser: ServiciosService,
    private ServiceConsultaAccesorios: DataService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.usuarioLogeado();
    this.getAllAccesorios();
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

  getAllAccesorios() {
    this.ServiceConsultaAccesorios.getAllAccesorios().subscribe(
      response => {
        console.log(response);
        if (response.status === 200) {
          console.log(status);
          this.accesorios = response.body;
          this.accesoriosback = response.body;
          this.ifResultados = false;
          this.ifProgreso = true;
        } else {
          console.log('Error de servicio');
          this.ifResultados = false;
          this.ifProgreso = true;
          this.mensaje500();
        }
      },
      error => {
        if (error.tatus === 500) {
          console.log('Error de Servidor');
          this.ifResultados = false;
          this.ifProgreso = true;
          this.mensaje500();
        }
      }
    );
  }

  editarAccesorio(id: string, tipoOperacion: string) {
    AccesorioAA = {idAccesorio: id, operacion: tipoOperacion};
  }
  mensaje500() {
    this.toastr.error('Intentar más tarde', 'Error del Servidor ');
  }
  filtrarNoSerie(nombre: string): any {
    const valor = nombre;
    if (valor.length < 2 ) {
      this.accesorios = this.accesoriosback;
    } else {
      const equipoNoNull = this.accesorios.filter(item => item.nombre_accesorio !== null);
      const equiposFiltro = equipoNoNull.filter(item => item.nombre_accesorio.toLowerCase().startsWith(nombre.toLowerCase()));
      this.accesorios = equiposFiltro;
    }
  }
}
