import { Component, OnInit,Inject } from '@angular/core';
import { DataService } from '../list/data.service';
import { Router } from '@angular/router';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

export interface DatosEquipoResponsiva {
  idEquipo: string;
}
export let EquipoResp: DatosEquipoResponsiva = {
  idEquipo: '',
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
  idEquipoResponsiva = '';

  tiposResponsivas: any[] = [
    {nombre: 'Kabec'},
    {nombre: 'GNP'},
    {nombre: 'Sura'}
  ];

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
        } else if (response.status === 204) {
          this.mensaje204();
        }
      },
      error => {
        if (error.status === 500) {
        console.log(error);
        this.mensaje500();
        }
      }
    );
  }

  soyCheck(idEquipo: string) {
    this.idEquipoResponsiva = idEquipo;
  }
  llenarResponsiva() {
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
      if (this.tipoResponsiva.value === this.tiposResponsivas[0].nombre) {
        this.router.navigate(['FormularioKabec']);
        /* console.log('Kabec');
        const dialogRef = this.dialog.open(DialogResponsivaKabecComponent, {
          width: '50%',
          data: {name: 'test', animal: 'test2'}
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
        });  */
      } else if (this.tipoResponsiva.value === this.tiposResponsivas[1].nombre) {
        console.log('GNP');
      } else if (this.tipoResponsiva.value === this.tiposResponsivas[2].nombre) {
        console.log('Sura');
      }
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
  mensajeDatosVacios2() {
    this.toastr.warning('No se selecciono un tipo de responsiva', 'Datos incompletos');
  }
  mensajeDatosVacios3() {
    this.toastr.warning('No se selecciono un equipo', 'Datos incompletos');
  }

}

