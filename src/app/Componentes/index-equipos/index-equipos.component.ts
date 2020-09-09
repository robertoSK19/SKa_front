import { Component, OnInit } from '@angular/core';
import { DataService } from '../list/data.service';
import { Equipos } from '../../Models/equipos/equipos.interface';
import { Router} from '@angular/router';
import { usuarioRol, RolesUser } from '../login/login.component';
import { ServiciosService } from 'src/app/Servicios/servicios.service';

let datosUser: RolesUser = {
  rol: '',
  nombre: '',
  id_user: '',
};

export interface DatosEquipo {
  idEquipo: string;
  operacion: string;
}

export let EquipoAE: DatosEquipo = {
  idEquipo: '',
  operacion: ''
};

@Component({
  selector: 'app-index-equipos',
  templateUrl: './index-equipos.component.html',
  styleUrls: ['./index-equipos.component.scss']
})

export class IndexEquiposComponent implements OnInit {
  //equipos: Equipos[];
  MsgError: string;
  equipos: any[];
  constructor(
    private dataSvc: DataService,
    private router: Router,
    protected servicioConUser: ServiciosService
    ) { }

  ngOnInit() {
    this.usuarioLogeado();

    //this.dataSvc.getAllEquipos().subscribe(data => console.log(data))
    this.dataSvc.getAllEquipos().subscribe(
      response => {
        this.equipos = response.body;
      },
      error => {
        console.log(error);
      }
    );
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

  editarEquipo(EquipoID: string, tipoOper: string) {
   EquipoAE = { idEquipo : EquipoID, operacion: tipoOper };
  }
}
