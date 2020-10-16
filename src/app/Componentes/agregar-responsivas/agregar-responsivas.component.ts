import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from '../list/data.service';
import { Router } from '@angular/router';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { Accesorios } from 'src/app/Models/accesorios/accesorios.interface';
import { Equipos } from 'src/app/Models/equipos/equipos.interface';
import { DEquipos } from 'src/app/Models/equipos/dequipos.interface';

export interface DatosEquipoResponsiva {
  idEquipo: string;
}
export interface DatosAccesorioResponsiva {
  idAcceosrio: any[];
}
export let EquipoResp: DatosEquipoResponsiva = {
  idEquipo: '',
};
export let AccesorioResp: DatosAccesorioResponsiva = {
  idAcceosrio: [],
};

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-agregar-responsivas',
  templateUrl: './agregar-responsivas.component.html',
  styleUrls: ['./agregar-responsivas.component.scss']
})
export class AgregarResponsivasComponent implements OnInit {

  equipos: any[];
  tipoResponsiva: FormControl;
  tipoRecurso: FormControl;
  idEquipoResponsiva = '';
  ifProgreso = false;
  ifResultados = true;
  accesorios: any[];
  ifAccesorio = true;
  idAccesorioResponsiva = '';
  equiposBack: any[];

  tiposResponsivasAce: any[] = [
    {nombre: 'Kabec'}
  ];

  tiposResponsivasEqu: any[] = [
    {nombre: 'Kabec'},
    {nombre: 'SURA'}
  ];

  tiposRecursoTI: any[] = [
    {nombre: 'Equipo'},
    {nombre: 'Accesorio'}
  ];

  tiposResponsivas: any[];
  selection = new SelectionModel<Accesorios>(true, []);
  selectionEquipos = new SelectionModel<DEquipos>(true, []);
  constructor(
    private dataSvc: DataService,
    private router: Router,
    protected servicioConUser: ServiciosService,
    public dialog: MatDialog,
    private toastr: ToastrService
   // public dialogKabec: MatDialogRef<DialogResponsivaKabecComponent>,
   // public dialogGnp: MatDialogRef<DialogResponsivaGNPComponent>,
    // public dialogSura: MatDialogRef<DialogResponsivaSuraComponent>
  ) { }

  ngOnInit() {
    this.usuarioLogeado();
    this.listaEquiposDisponibles();
    this.tipoResponsiva = new FormControl('');
    this.tipoRecurso = new FormControl('');
  }

  usuarioLogeado() {
    // datosUser = usuarioRol;
    const token = this.servicioConUser.getToken();
    if ( token.length === 0) {
      console.log('error en el acceso');
      this.router.navigate(['Login']);
    } else {
      console.log('acceso correcto');
    }
  }
  editarEquipo(EquipoID: string, tipoOper: string) {
    EquipoResp = { idEquipo : EquipoID };
  }
  listaEquiposDisponibles() {
    this.dataSvc.getAllEquipos().subscribe(
      response => {
        if (response.status === 200) {
        this.equipos = response.body;
        const equiposDisp =  this.equipos.filter(item => item.estatusRecurso.id_estatus === 2);
        this.equipos = equiposDisp;
        this.equiposBack = equiposDisp;
        this.ifProgreso = true;
        this.ifResultados = false;
        } else if (response.status === 204) {
          this.ifResultados = false;
          this.ifProgreso = true;
          this.mensaje204();
        }
      },
      error => {
        if (error.status === 500) {
        console.log(error);
        this.ifProgreso = true;
        this.ifResultados = false;
        this.mensaje500();
        }
      }
    );
  }

  soyCheck(idEquipo: string) {
    this.idEquipoResponsiva = idEquipo;
  }
  llenarResponsiva() {
    AccesorioResp = {idAcceosrio: []};
    console.log(this.tipoResponsiva.value, this.idEquipoResponsiva);
    if (this.tipoResponsiva.value === '' && this.idEquipoResponsiva === '') {
      console.log('No se selecciono tipo de responsiva o un equipo');
      this.mensajeDatosVacios1();
    } else if (this.tipoResponsiva.value === '' && this.idEquipoResponsiva !== '') {
      this.mensajeDatosVacios2();
      console.log('No se selecciono un tipo de responsiva');
    } else if (this.tipoResponsiva.value !== '' && this.idEquipoResponsiva === '') {
      console.log('No se selecciono un equipo');
      this.mensajeDatosVacios3();
    } else if (this.tipoResponsiva.value !== '' && this.idEquipoResponsiva !== '') {
      console.log('Datos correctos');
      EquipoResp = {idEquipo : this.idEquipoResponsiva};
      if (this.tipoRecurso.value === this.tiposRecursoTI[0].nombre) {
        if (this.tipoResponsiva.value === this.tiposResponsivasEqu[0].nombre) {
          this.router.navigate(['FormularioKabec']);
        } else if (this.tipoResponsiva.value === this.tiposResponsivasEqu[1].nombre) {
          console.log('Suras');
          this.router.navigate(['FormularioSURA']);
        }
      } else if (this.tipoResponsiva.value === '') {
        this.mensajeDatosVacios4();
      }
       /*else if (this.tipoRecurso === this.tiposRecursoTI[1].nombre) {
        if (this.tipoResponsiva.value === this.tiposResponsivasAce[0].nombre) {
          this.router.navigate(['FormularioKabec']);
        }
      }*/
    }
  }
  tipoRecursoSelect(tipo: string) {
    if (tipo === this.tiposRecursoTI[0].nombre) {
      this.tiposResponsivas = this.tiposResponsivasEqu;
      this.listaEquiposDisponibles();
      this.ifAccesorio = true;
      this.selection.clear();
    } else if (tipo === this.tiposRecursoTI[1].nombre) {
      this.tiposResponsivas = this.tiposResponsivasAce;
      this.ifAccesorio = false;
      this.getAllAccesorios();
      this.selectionEquipos.clear();
      
    }
  }


  getAllAccesorios() {
    this.dataSvc.getAllAccesorios().subscribe(
      response => {
        console.log(response);
        if (response.status === 200) {
          console.log(status);
          this.accesorios = response.body;
          const accesoriosDisp =  this.accesorios.filter(item => item.id_estatus.id_estatus === 2);
          this.accesorios = accesoriosDisp;
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
  accesorioCheck(idAccesorio: string) {
    this.idAccesorioResponsiva = idAccesorio;
    console.log(idAccesorio)
  }
  llenarResponsivaAccesorio() {
    let idAccesorios: any[];
    idAccesorios = [];
    let aux: any[];
    aux=[];
    if (this.selection.selected.length === 0) {
      console.log('no selecciono un dispositivo');
      idAccesorios = [];
    } else {
      console.log('selecciono al menos uno');
      for (const accesorio of this.accesorios) {
        if (this.selection.isSelected(accesorio)) {
          console.log(accesorio.id_accesorio);
          idAccesorios.push(accesorio)
          

        }
      }
    }
    //aux = idAccesorios.filter(item => {item.id_accesorio !== item.id_accesorio})

    console.log(idAccesorios);
    /* EquipoResp = {idEquipo: ''};
    console.log(this.tipoResponsiva.value, this.idAccesorioResponsiva);
    if (this.tipoResponsiva.value === '' && this.idAccesorioResponsiva === '') {
      console.log('No se selecciono tipo de responsiva o un equipo');
      this.mensajeDatosVacios1Ace();
    } else if (this.tipoResponsiva.value === '' && this.idAccesorioResponsiva !== '') {
      this.mensajeDatosVacios2();
      console.log('No se selecciono un tipo de responsiva');
    } else if (this.tipoResponsiva.value !== '' && this.idAccesorioResponsiva === '') {
      console.log('No se selecciono un equipo');
      this.mensajeDatosVacios3Ace();
    } else if (this.tipoResponsiva.value !== '' && this.idAccesorioResponsiva !== '') {
      console.log('Datos correctos');
      AccesorioResp = {idAcceosrio: this.idAccesorioResponsiva};
      if (this.tipoRecurso.value === this.tiposRecursoTI[1].nombre) {
        if (this.tipoResponsiva.value === this.tiposResponsivasAce[0].nombre) {
          this.router.navigate(['FormularioKabec']);
        } else if (this.tipoResponsiva.value === '') {
          this.mensajeDatosVacios4();
        }
      }
    } */
  }
  filtrarNoSerie(noSerie: string): any {
    const valor = noSerie;
    if (valor.length < 2 ) {
      this.equipos = this.equiposBack;
    } else {
      const equipoNoNull = this.equipos.filter(item => item.mequipo.numero_serie !== null);
      const equiposFiltro = equipoNoNull.filter(item => item.mequipo.numero_serie.toLowerCase().startsWith(noSerie.toLowerCase()));
      this.equipos = equiposFiltro;
    }
  }
  datosKabec() {
  }
  mensaje200() {
    this.toastr.success('Se registro el nuevo equipo', 'Registro Correcto');
  }
  mensaje204() {
    this.toastr.error('No se obtuvo la información', 'Error en el servicio');
  }
  mensaje500() {
    this.toastr.error('Intentar más tarde', 'Error del Servidor ');
  }
  mensajeDatosVacios1() {
    this.toastr.warning('No se selecciono un tipo de responsiva y/o un equipo', 'Datos incompletos');
  }
  mensajeDatosVacios1Ace() {
    this.toastr.warning('No se selecciono un tipo de responsiva y/o un Accesorio', 'Datos incompletos');
  }
  mensajeDatosVacios2() {
    this.toastr.warning('No se selecciono un tipo de responsiva', 'Datos incompletos');
  }
  mensajeDatosVacios3() {
    this.toastr.warning('No se selecciono un equipo', 'Datos incompletos');
  }
  mensajeDatosVacios3Ace() {
    this.toastr.warning('No se selecciono un accesorio', 'Datos incompletos');
  }
  mensajeDatosVacios4() {
    this.toastr.warning('No se selecciono un recurso', 'Datos incompletos');
  }

}

