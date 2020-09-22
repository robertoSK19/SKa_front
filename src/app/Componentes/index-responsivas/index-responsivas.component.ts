import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  idResponsiva = '';
  idDEquipo = '';
  datosDEquipo: DEquipos;
  datosAsignacion: Asignacion;

  constructor(
    private router: Router,
    protected servicioConUser: ServiciosService,
    protected servicioResponsivas: DataService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.usuarioLogeado();
    this.getAllResponsivas();
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
  getAllResponsivas() {
    //this.servicioResponsivas.getAllResponsivas().subscribe(
      this.servicioResponsivas.getAllAsignaciones().subscribe(
      response => {
        console.log(response);
        if (response.status === 200) {
          this.responsivas = response.body;
        } else {
          console.log('Error del servicio');
        }
      },
      error => {
        console.log(error);
        if (error.status === 500) {
          console.log('Error del Servidor');
        } else {
          console.log('otro error');
        }
      }
    );
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
        this.datosAsignacion= responseAsig.body;
      }
    );
  }
  cancelarResponsiva() {
    console.log(this.idResponsiva, this.idDEquipo);
    if (this.idDEquipo === '' && this.idResponsiva === '') {
      this.mensajeDatosIncompletos();
    } else if (this.idDEquipo !== ''  && this.idResponsiva !== ''){
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
    this.toastr.success('Se cancelo la responsiva', 'Cancelación Correcta');
  }
  mensajeDatosIncompletos() {
    this.toastr.error('Debe de seleccionar una responsiva', 'Error en la cancelación');
  }
}
