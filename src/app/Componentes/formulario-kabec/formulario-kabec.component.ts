import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { Router } from '@angular/router';
import { EquipoResp, DatosEquipoResponsiva } from '../agregar-responsivas/agregar-responsivas.component';
import { DataService } from '../list/data.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Accesorios } from '../../Models/accesorios/accesorios.interface';
import { DatePipe } from '@angular/common';
import { Asignacion } from '../../Models/asignacion/asignacion.interface';
import { DEquipos } from '../../Models/equipos/dequipos.interface';
import { CrearPDFComponent } from '../crear-pdf/crear-pdf.component';
import { ToastrService } from 'ngx-toastr';

const idEestatusAsignada = '1';
const idEstatusNoAsignada = '2';
let datosResponsiva: DatosEquipoResponsiva = {
  idEquipo: '',
};

export let accesor = [];
export let checkAccesorios = false;

let datosAsignacion: Asignacion = {
  id_asignacion: '',
  nombre_consultor: '',
  fecha_asignacion: '',
  costo: 0,
  id_dequipo: 0,
  id_estatus: 0,
  letra: '',
  usuario: ''
};

let datosAccesorios: Accesorios = {
  id_accesorio: '',
  nombre_accesorio: '',
  marca: '',
  modelo: '',
  producto: '',
  hecho_en: '',
  serie: '',
  id_estatus: 0,
  id_equipo: 0
}

let datosDEquipoG: any[];
let datosDEquipoG2: DEquipos;
let accesorioEquipo: any;

let datosDEquipo: DEquipos = {
  id_equipo: 0,
  id_dequipo: '',
  disco_duro_solido: '',
  fecha_actualizacion_estatus: new Date(),
  id_estatus: 0,
};

@Component({
  selector: 'app-formulario-kabec',
  templateUrl: './formulario-kabec.component.html',
  styleUrls: ['./formulario-kabec.component.scss']
})
export class FormularioKabecComponent implements OnInit {

  @ViewChild(CrearPDFComponent, { static: false }) pdf: CrearPDFComponent;
  public uno = CrearPDFComponent;

  acceId = "";
  acceNom = "";
  acceMarca = "";
  acceModelo = "";
  acceSerie = "";
  acceIdEstatus = "";
  datosRespForm: FormGroup;
  mostrarAccesorios = false;
  ifAccesorios: boolean;
  accesorios: any[];
  selection = new SelectionModel<Accesorios>(true, []);
  datosDEquipo: any[];
  constructor(
    private formBuilder: FormBuilder,
    protected servicioConUser: ServiciosService,
    private router: Router,
    private ServiceConsulta: DataService,
    public datepipe: DatePipe,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.datosRespForm = this.formBuilder.group({
      id_equipo: ['', Validators.required],
      responsable: ['', Validators.required],
      costo: ['', Validators.required],
      comentarios: ['', Validators.required],
      discoDS: ['', Validators.required],
      opcionAccesorio: ['', Validators.required],
      id_accesorio: ['', Validators.required],
      nombre_accesorio: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      serie: ['', Validators.required],
      id_estatus: ['', Validators.required],
    });
    this.cargaIdEquipo(datosResponsiva.idEquipo);
    this.getAllAccesorios();
  }

  usuarioLogeado() {
    datosResponsiva = EquipoResp;
    const token = this.servicioConUser.getToken();
    if (token.length !== 0 && datosResponsiva.idEquipo !== '') {
      console.log('acceso correcto');
      // this.cargaIdEquipo(datosResponsiva.idEquipo);
    } else {
      console.log('error en el acceso');
      this.router.navigate(['Login']);
    }
  }

  cargaIdEquipo(id?: string) {
    datosResponsiva = EquipoResp;
    this.datosRespForm.controls.id_equipo.setValue(datosResponsiva.idEquipo);
    this.ServiceConsulta.getDEquipo(datosResponsiva.idEquipo).subscribe(
      response => {
        if (response.status === 200) {
          this.datosRespForm.controls.discoDS.setValue(response.body.disco_duro_solido);
          this.datosRespForm.controls.comentarios.setValue(response.body.comentarios);
        } else if (response.status === 204) {
          console.log('Equipo no encontrado');
        }
      },
      error => {
        console.log(error);
        if (error.status === 500) {
          console.log('Error del Servidor');
        }
      }
    );
    this.ServiceConsulta.getAccesorioEquipo(Number(datosResponsiva.idEquipo)).subscribe(
      responseAE => {
        if (responseAE.status === 200) {
          accesorioEquipo = responseAE.body;
        } else if (responseAE.status === 204) {
          this.mensajeErrorObtencionDatos();
        }
      },
      errorAE => {
        if (errorAE.status === 500) {
          this.mensaje500();
        } else if (errorAE.status === 400) {
          this.mensaje400();
        }
      }
    );
  }

  accesoriosCheck(accID: string, accNom: string, accMarca: string, accModelo: string, accSerie: string, accStatusId: string) {
    this.acceId = accID;
    this.acceNom = accNom;
    this.acceMarca = accMarca;
    this.acceModelo = accModelo;
    this.acceSerie = accSerie;
    this.acceIdEstatus = accStatusId;

    let acceId = this.acceId;
    let arrayFiltrado = [];

    let objAcc = {
      accId: acceId,
      accNom: this.acceNom,
      accMarca: this.acceMarca,
      accModelo: this.acceModelo,
      accSerie: this.acceSerie,
      accStatusId: this.acceIdEstatus
    }

    if (accesor.length !== 0) {
      console.log(accesor.findIndex(x => x.accId === acceId));
      if((accesor.findIndex(x => x.accId === acceId)) === -1){
        accesor.push(objAcc);
      } else{
        var index: number = accesor.findIndex(x => x.accId === acceId)
        accesor.splice(index, 1);        
      }
    } else {
      accesor.push(objAcc);
    }
    console.log("Accesorios");    
    console.log(accesor);
  }

  generarResponsiva(opcion: string) {
    const date = new Date();
    const accion = opcion;
    const activaAcc = this.datosRespForm.controls.opcionAccesorio.value;
    console.log(this.datosRespForm.controls.id_equipo.value);
    console.log(this.datosRespForm.controls.responsable.value);
    console.log(this.datosRespForm.controls.costo.value);
    const fecha = this.datepipe.transform(date, 'yyyy-MM-dd');
    const nombreDia = this.datepipe.transform(date, 'EEEE');
    const equipo = this.datosRespForm.controls.id_equipo.value;
    const nombre = this.datosRespForm.controls.responsable.value;
    const costoEquipo = this.datosRespForm.controls.costo.value;
    const costoNum = costoEquipo.replace(',', '');
    const comentarios = this.datosRespForm.controls.comentarios.value;
    const disco = this.datosRespForm.controls.discoDS.value;

    if (nombre === '' && costoEquipo === '') {
      console.log('no lleno todos los datos');
      this.mensajeDatosVacios();
    } else {
      if (this.mostrarAccesorios === true) { // si selecciona otro accesorio
        if (accesor.length === 0) {
          console.log('no selecciono un dispositivo');
        } else {
          console.log('selecciono al menos uno');
          for (let accesorio of accesor) {
            console.log(accesorio.accId);
          }
          datosAsignacion = {
            id_asignacion: '',
            id_dequipo: equipo,
            nombre_consultor: nombre,
            costo: Number(costoNum),
            letra: costoEquipo,
            fecha_asignacion: fecha,
            id_estatus: 0,
            usuario: '',
          };
          datosDEquipo = {
            id_dequipo: equipo,
            disco_duro_solido: disco,
            fecha_actualizacion_estatus: new Date(),
            id_equipo: equipo,
            id_estatus: 1,
          };
          this.ServiceConsulta.getDEquipo(equipo).subscribe(
            response => {
              this.datosDEquipo = response.body;
              datosDEquipoG = response.body;
              if (accion === 'vista') {
                this.uno.prototype.generarPDF(accion, accesor, nombreDia, datosDEquipoG, nombre, costoEquipo);
              }
            },
            error => {
              console.log(error);
              this.mensajeErrorVistaPrevia();
            }
          );
          if (accion === 'crear') {
            this.ServiceConsulta.getDEquipo(equipo).subscribe(
              response => {
                datosDEquipoG2 = response.body;
                datosDEquipoG2.comentarios = comentarios;
                this.ServiceConsulta.updateDEquipo(Number(idEestatusAsignada), datosDEquipoG2).subscribe(
                  responseDE => {
                    if (responseDE.status === 200) {
                      this.ServiceConsulta.crearAsignacion(equipo, idEestatusAsignada, datosAsignacion).subscribe(
                        responseA => {
                          if (responseA.status === 200) {
                            console.log('asignacion correcta');
                            this.uno.prototype.generarPDF(accion, accesor, nombreDia, datosDEquipoG, nombre, costoEquipo);
                          }
                        },
                        errorA => {
                          if (errorA.status === 500) {
                            console.log('Error en el Servicio');
                            // en caso de que no se cree la asginacion
                            this.ServiceConsulta.updateDEquipo(Number(idEstatusNoAsignada), datosDEquipoG2).subscribe();
                          }
                        }
                      );
                    }
                  },
                  errorDE => {
                    if (errorDE.status === 500) {
                      console.log('Error en el Servicio');
                    }
                  }
                );
              },
              error => {
                console.log(error);
                if (error.status === 500) {
                  console.log('Error en el Servicio');
                }
              }
            );
          }
        }
      } else if (this.mostrarAccesorios === false || this.mostrarAccesorios === undefined) { // si no selecciona otro accesorio
        datosAsignacion = {
          id_asignacion: '',
          id_dequipo: equipo,
          nombre_consultor: nombre,
          costo: Number(costoNum),
          letra: costoEquipo,
          fecha_asignacion: fecha,
          id_estatus: 0,
          usuario: '',
        };
        datosDEquipo = {
          id_dequipo: equipo,
          disco_duro_solido: disco,
          fecha_actualizacion_estatus: new Date(),
          id_equipo: equipo,
          id_estatus: 1,
        };
        this.ServiceConsulta.getDEquipo(equipo).subscribe(
          response => {
            this.datosDEquipo = response.body;
            datosDEquipoG = response.body;
            if (accion === 'vista') {
              this.uno.prototype.generarPDF(accion, accesorioEquipo, nombreDia, datosDEquipoG, nombre, costoEquipo);
            }
          },
          error => {
            console.log(error);
            this.mensajeErrorVistaPrevia();
          }
        );
        if (accion === 'crear') {
          this.ServiceConsulta.getDEquipo(equipo).subscribe(
            response => {
              datosDEquipoG2 = response.body;
              datosDEquipoG2.comentarios = comentarios;
              this.ServiceConsulta.updateDEquipo(Number(idEestatusAsignada), datosDEquipoG2).subscribe(
                responseDE => {
                  if (responseDE.status === 200) {
                    this.ServiceConsulta.crearAsignacion(equipo, idEestatusAsignada, datosAsignacion).subscribe(
                      responseA => {
                        if (responseA.status === 200) {
                          console.log('asignacion correcta');
                          this.uno.prototype.generarPDF(accion, accesorioEquipo, nombreDia, datosDEquipoG, nombre, costoEquipo);
                        }
                      },
                      errorA => {
                        if (errorA.status === 500) {
                          console.log('Error en el Servicio');
                          // en caso de que no se cree la asginacion
                          this.ServiceConsulta.updateDEquipo(Number(idEstatusNoAsignada), datosDEquipoG2).subscribe();
                        }
                      }
                    );
                  }
                },
                errorDE => {
                  if (errorDE.status === 500) {
                    console.log('Error en el Servicio');
                  }
                }
              );
            },
            error => {
              console.log(error);
              if (error.status === 500) {
                console.log('Error en el Servicio');
              }
            }
          );
        }
      }
    }
  }

  cancelar() {

  }

  seleccinarAccesorios() {
    const agregarAccesorios = this.datosRespForm.controls.opcionAccesorio.value;
    if (agregarAccesorios === true) {
      this.mostrarAccesorios = true;
      checkAccesorios = true;
    } else if (agregarAccesorios === false) {
      this.mostrarAccesorios = false;
      checkAccesorios = false
      var element = <HTMLInputElement>document.getElementById("male");
      element.checked = false;
      accesor = [];
    }
  }

  getAllAccesorios() {
    this.ServiceConsulta.getAllAccesorios().subscribe(
      response => {
        if (response.status === 200) {
          this.accesorios = response.body;
          const accesoriosDisp = this.accesorios.filter(item => item.id_Estatus.id_estatus === 2);
          this.accesorios = accesoriosDisp;
        } else {
          console.log('Error de servicio');
        }
      },
      error => {
        if (error.tatus === 500) {
          console.log('Error de Servidor');
        }
      }
    );
  }

  soyCheck(valor?: string) {
    console.log(valor);
  }
  mensaje200() {
    this.toastr.success('Se actualizaron los datos', 'Registro Actualizado');
  }
  mensaje204() {
    this.toastr.error('No se actualizaron los datos', 'Error en el registro');
  }
  mensaje500() {
    this.toastr.error('Intentar más tarde', 'Error del Servidor ');
  }
  mensaje400() {
    this.toastr.error('Datos de consulta incorrectos', 'Error en el servicio');
  }
  mensajeDatosVacios() {
    this.toastr.warning('Llene los campos con (*)', 'Faltan datos');
  }
  mensajeCancelar() {
    this.toastr.warning('Se cancelo la edición');
  }
  mensajeErrorVistaPrevia() {
    this.toastr.warning('Se presento un error para mostrar el archivo PDF', 'Error en Vista Previa');
  }
  mensajeErrorObtencionDatos() {
    this.toastr.warning('Se presento un error para obtener los datos del equipo', 'Error en los datos');
  }
}
