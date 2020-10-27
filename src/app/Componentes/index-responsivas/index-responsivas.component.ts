import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { tipoFiltroResponsibas } from 'src/app/Constantes/constante';
import { Accesorios } from 'src/app/Models/accesorios/accesorios.interface';
import { Asignacion } from 'src/app/Models/asignacion/asignacion.interface';
import { DEquipos } from 'src/app/Models/equipos/dequipos.interface';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { DataService } from '../list/data.service';

const idEstatusCancelar = 6;
const idEstatusAsignada = 1;
const idEstatusNoAginada = 2;
@Component({
  selector: 'app-index-responsivas',
  templateUrl: './index-responsivas.component.html',
  styleUrls: ['./index-responsivas.component.scss']
})
export class IndexResponsivasComponent implements OnInit {

  responsivas: any[];
  responsivasAccesorios: any[];
  idResponsiva = '';
  idDEquipo = '';
  idAccesorio = '';
  datosDEquipo: DEquipos;
  datosAsignacion: Asignacion;
  datosAccesorioUpdate: Accesorios;
  datosAccesorio: any[];
  accesoriosCancelar;
  ifProgreso = true;
  ifResultados = true;
  filtros: any[];
  tipofiltro = '';
  sinFiltro = true;
  responsivasBackup: any[];
  responsivasBackupAcc: any[];
  valor: any;
  valorAcc: any;
  tipoResponsiva: any[] = [
    { nombre: 'Accesorios' },
    { nombre: 'Equipos' }
  ];

  constructor(
    private router: Router,
    protected servicioConUser: ServiciosService,
    protected servicioResponsivas: DataService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.usuarioLogeado();
    // this.getAllResponsivas();
    this.filtros = tipoFiltroResponsibas;
    this.servicioResponsivas.getAllAccesorios().subscribe(
      response => {
        this.datosAccesorio = response.body.filter(x => x.id_estatus.id_estatus === 1);
        console.log(this.datosAccesorio);
      }
    );
  }

  usuarioLogeado() {
    // datosUser = usuarioRol;
    const token = this.servicioConUser.getToken();
    if (token.length === 0) {
      console.log('error en el acceso');
      this.router.navigate(['Login']);
    } else {
      console.log('acceso correcto');
    }
  }

  getAllResponsivas() {
    // this.servicioResponsivas.getAllResponsivas().subscribe(
    this.servicioResponsivas.getAllAsignaciones().subscribe(
      response => {
        console.log(response);
        if (response.status === 200) {
          this.responsivas = response.body;
          this.responsivasBackup = response.body;
          this.ifResultados = false;
          this.ifProgreso = true;
        } else {
          this.ifResultados = false;
          this.ifProgreso = true;
          console.log('Error del servicio');
        }
      },
      error => {
        console.log(error);
        if (error.status === 500) {
          console.log('Error del Servidor');
          this.ifResultados = false;
          this.ifProgreso = true;
        } else {
          console.log('otro error');
          this.ifResultados = false;
          this.ifProgreso = true;
        }
      }
    );
  }

  getAllResponsivasAccesorios() {
    this.servicioResponsivas.getAllAccesorioN().subscribe(
      response => {
        console.log(response);
        this.accesoriosCancelar = response.body;
        console.log(this.accesoriosCancelar);
        if (response.status === 200) {
          this.responsivasAccesorios = response.body;
          this.responsivasBackupAcc = response.body;
          this.ifResultados = false;
          this.ifProgreso = true;
        } else {
          this.ifResultados = false;
          this.ifProgreso = true;
          console.log('Error del servicio');
        }
      },
      error => {
        console.log(error);
        if (error.status === 500) {
          console.log('Error del Servidor');
          this.ifResultados = false;
          this.ifProgreso = true;
        } else {
          console.log('otro error');
          this.ifResultados = false;
          this.ifProgreso = true;
        }
      }
    );
  }
  seleccionarREsponsivaAccesorios(idResponsiva: string, idAccesorio: string) {
    this.idResponsiva = idResponsiva;
    this.idAccesorio = idAccesorio;

    this.servicioResponsivas.getAccesorio(this.idAccesorio).subscribe(
      responseAcce => {
        this.datosAccesorioUpdate = responseAcce.body;
      }
    )
  }

  seleccionarResponsiva(idResponsiva: string, idDEquipo: string) {
    this.idResponsiva = idResponsiva;
    this.idDEquipo = idDEquipo;

    this.servicioResponsivas.getDEquipo(this.idDEquipo).subscribe(
      responseEquipo => {
        this.datosDEquipo = responseEquipo.body;
      }
    );
    this.servicioResponsivas.getAsignacion(Number(this.idResponsiva)).subscribe(
      responseAsig => {
        this.datosAsignacion = responseAsig.body;
      }
    );
  }
  cancelarResponsiva() {
    console.log(this.idResponsiva, this.idDEquipo);
    if (this.idDEquipo === '' && this.idResponsiva === '') {
      this.mensajeDatosIncompletos();
    } else if (this.idDEquipo !== '' && this.idResponsiva !== '') {
      this.servicioResponsivas.putResponsivas2(Number(this.idDEquipo), idEstatusCancelar, this.datosAsignacion).subscribe(
        res => {
          if (res.status === 200) {
            console.log('se actualizo responsiva');
            this.servicioResponsivas.updateDEquipo(idEstatusNoAginada, this.datosDEquipo).subscribe(
              responseEquipo => {
                if (responseEquipo.status === 200) {
                  console.log('se actuliza equipo y se cancela responsiva');
                  this.mensaje200();
                  this.getAllResponsivas();
                } else {
                  console.log('error en el estatus del equipo');
                  this.servicioResponsivas.putResponsivas2(Number(this.idDEquipo), idEstatusAsignada, this.datosAsignacion).subscribe();
                  this.mensaja204DEquipos();
                }
              },
              errorEquipo => {
                console.log('error estatus dequipo');
                this.mensaje500();
                this.servicioResponsivas.putResponsivas2(Number(this.idDEquipo), idEstatusAsignada, this.datosAsignacion).subscribe();
              }
            );
            if (this.datosAccesorio.length !== 0) {
              const accesorioFiltro = this.datosAccesorio.filter(x => x.id_equipo === Number(this.idDEquipo));
              console.log(accesorioFiltro);
              accesorioFiltro.map((x => {
                x.id_equipo = 0;
                console.log(x);
                this.servicioResponsivas.updateAccesorio(x, idEstatusNoAginada).subscribe(
                  response => {
                    console.log(response);
                  }
                );
              }))
            }
          } else if (res.status === 204) {
            console.log('error en la actualizacion');
            this.mensaja204();
          }
        },
        error => {
          if (error.status === 500) {
            this.mensaje500();
          }
        }
      );
    }
    /* //console.log(this.servicioResponsivas.putResponsiva(Number(this.idDEquipo), idEstatusCancelar, Number(this.idResponsiva)).subscribe());
    this.servicioResponsivas.putResponsiva(Number(this.idDEquipo), idEstatusCancelar, Number(this.idResponsiva)).subscribe(
      respuesta => {
        console.log(respuesta);
      },
      errorREs => {
        console.log(errorREs)
      }
    ) */
  }
  cancelarResponsivaAcce() {
    console.log(this.idResponsiva, this.idAccesorio);
    if (this.idAccesorio === '' && this.idResponsiva === '') {
      this.mensajeDatosIncompletos();
    } else if (this.idAccesorio !== '' && this.idResponsiva !== '') {
      this.accesoriosCancelar.map((x => {
        this.servicioResponsivas.putAsignacionAcc(idEstatusCancelar, x.id_asignacion).subscribe(
          response => {
            console.log(response);
            this.servicioResponsivas.updateAccesorio(x.id_accesorio, idEstatusNoAginada).subscribe(
              responseA => {
                console.log(responseA);
                console.log('se actuliza equipo y se cancela responsiva');
                this.mensaje200();
                this.getAllResponsivas();
              }
            )
          }
        )
      }))
    }
  }

  filtroSelect(value: any) {
    console.log();
    this.tipofiltro = value;
    this.sinFiltro = false;
  }

  selectResponsiva(value: any) {
    let a = document.getElementById("accesorio")
    let b = document.getElementById("equipo")
    let c = document.getElementById("filtroEquipo")
    let d = document.getElementById("filtroAccesorio")
    let e = document.getElementById("filtro")
    if (value === "Accesorios") {
      a.className = "table visible";
      b.className = "table invisible";
      c.className = "col-sm-3 invisible"
      d.className = "col-sm-3 invisible"
      e.className = "col-sm-3 invisible"
      this.getAllResponsivasAccesorios();
    } else if (value === "Equipos") {
      b.className = "table visible";
      a.className = "table invisible";
      c.className = "col-sm-3 visible"
      d.className = "col-sm-3 invisible"
      e.className = "col-sm-3 visible"
      this.getAllResponsivas();
    }
  }

  filtroAcc(parametro: any) {
    const valorAcc = parametro;
    if (valorAcc.lenght < 3) {
      this.responsivasAccesorios = this.responsivasBackupAcc;
    } else {
      const responsivasNoNull = this.responsivasAccesorios.filter(item => item.id_accesorio.serie !== null);
      switch (this.tipofiltro) {
        case this.filtros[0]:
          console.log('responsable');
          const filtroResponsable = responsivasNoNull.filter(item => item.id_asignacion.nombre_consultor.toLowerCase().startsWith(valorAcc.toLowerCase()));
          this.responsivasAccesorios = filtroResponsable;
          break;
        case this.filtros[1]:
          console.log('id');
          const filtroId = this.responsivasAccesorios.filter(item => item.id_accesorio.id_accesorio === Number(valorAcc));
          this.responsivasAccesorios = filtroId;
          break;
        case this.filtros[2]:
          console.log('serie');
          const filtroNserie = responsivasNoNull.filter(item => item.id_accesorio.serie.toLowerCase().startsWith(valorAcc.toLowerCase()));
          this.responsivasAccesorios = filtroNserie;
          break;
      }
    }
  }

  filtro(parametro: any) {
    const valor = parametro;
    if (valor.length < 3) {
      this.responsivas = this.responsivasBackup;
    } else {
      const responsivasNoNull = this.responsivas.filter(item => item.dequipo.mequipo.numero_serie !== null);
      switch (this.tipofiltro) {
        case this.filtros[0]:
          console.log('responsable');
          const filtroResponsable = responsivasNoNull.filter(item => item.nombre_consultor.toLowerCase().startsWith(valor.toLowerCase()));
          this.responsivas = filtroResponsable;
          break;
        case this.filtros[1]:
          const filtroId = this.responsivas.filter(item => item.dequipo.mequipo.id_equipo === Number(valor));
          this.responsivas = filtroId;
          console.log('id');
          break;
        case this.filtros[2]:
          console.log('serie');
          const filtroNserie = responsivasNoNull.filter(item => item.dequipo.mequipo.numero_serie.toLowerCase().startsWith(valor.toLowerCase()));
          this.responsivas = filtroNserie;
          console.log('id');
          break;
      }
    }
  }
  mensaja204() {
    this.toastr.error('No se pudo cancelar la Responsiva', 'Error en la actualizacion');
  }
  mensaja204DEquipos() {
    this.toastr.error('No se pudo obtener la información', 'Error en la consulta');
  }
  mensaje500() {
    this.toastr.error('Intentar más tarde', 'Error del Servidor ');
  }
  mensaje200() {
    this.toastr.success('Se canceló la responsiva', 'Cancelación Correcta');
  }
  mensajeDatosIncompletos() {
    this.toastr.error('Debe de seleccionar una responsiva', 'Error en la cancelación');
  }
}
