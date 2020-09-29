import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { Router } from '@angular/router';
import { EquipoResp, DatosEquipoResponsiva, DatosAccesorioResponsiva, AccesorioResp} from '../agregar-responsivas/agregar-responsivas.component';
import { DataService } from '../list/data.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Accesorios } from '../../Models/accesorios/accesorios.interface';
import { DatePipe } from '@angular/common';
import { Asignacion } from '../../Models/asignacion/asignacion.interface';
import { DEquipos } from '../../Models/equipos/dequipos.interface';
import { CrearPDFComponent } from '../formatos_pdf/pdf kabec/crear-pdf.component';
import { ToastrService } from 'ngx-toastr';
import { Aaccesorio } from 'src/app/Models/accesorios/aaccesorio.interface';

const idEestatusAsignada = '1';
const idEstatusNoAsignada = '2';
let datosResponsiva: DatosEquipoResponsiva = {
   idEquipo : '',
};
let datosResponsivaAccesorio: DatosAccesorioResponsiva = {
  idAcceosrio: '',
};

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
let datosAaccesorio: Aaccesorio = {
  id_aaccesorio: '',
  id_asignacion: '',
  id_accesorio: ''
};
let datosDEquipoG: any[];
let datosDEquipoG2: DEquipos;
let datosAccesorioG: Accesorios;
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

  @ViewChild(CrearPDFComponent, {static: false}) pdf: CrearPDFComponent;
  public uno = CrearPDFComponent;

  datosRespForm: FormGroup;
  datosRespAccForm: FormGroup;
  mostrarAccesorios = false;
  ifAccesorios: boolean;
  accesorios: any[];
  selection = new SelectionModel<Accesorios>(true, []);
  datosDEquipo: any[];
  ifAccesorio = true;
  datosAccesorios: any[];
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
    });
    this.datosRespAccForm = this.formBuilder.group({
      id_accesorio: ['', Validators.required],
      responsable: ['', Validators.required],
    });
    // this.cargaIdEquipo(datosResponsiva.idEquipo);
    this.validarRecurso();
    // this.getAllAccesorios();
  }

  usuarioLogeado() {
    datosResponsiva = EquipoResp;
    datosResponsivaAccesorio = AccesorioResp;
    const token = this.servicioConUser.getToken();
    if ( token.length !== 0 && datosResponsiva.idEquipo !== '') {
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
    this.datosRespForm.controls.id_equipo.disable();
    this.ServiceConsulta.getDEquipo(datosResponsiva.idEquipo).subscribe(
      response => {
        if (response.status === 200) {
          this.datosRespForm.controls.discoDS.setValue(response.body.disco_duro_solido);
          this.datosRespForm.controls.comentarios.setValue(response.body.comentarios);
        } else if (response.status === 204) {
          console.log( 'Equipo no encontrado');
        }
      },
      error => {
        console.log(error);
        if (error.status === 500) {
          console.log('Error del Servidor');
        }
      }
    );
    this.ServiceConsulta.getAccesorioEquipo(Number (datosResponsiva.idEquipo)).subscribe(
      responseAE => {
        if (responseAE.status === 200 ) {
          accesorioEquipo = responseAE.body;
        } else if (responseAE.status === 204) {
          this.mensajeErrorObtencionDatos();
        }
      },
      errorAE => {
        if (errorAE.status === 500) {
          this.mensaje500();
        } else if (errorAE.status === 400 ) {
          this.mensaje400();
        }
      }
    );
  }

  generarResponsiva(opcion: string) {
    const date = new Date();
    const accion = opcion;
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
        if (this.selection.selected.length === 0) {
          console.log('no selecciono un dispositivo');
        } else {
          console.log('selecciono al menos uno');
          for (let accesorio of this.accesorios) {
            if (this.selection.isSelected(accesorio)) {
              console.log(accesorio.id_accesorio);
            }
          }
        }
      } else if (this.mostrarAccesorios === false || this.mostrarAccesorios === undefined) { // si no selecciona otro accesorio
        datosAsignacion = {
          id_asignacion: '',
          id_dequipo: equipo,
          nombre_consultor: nombre,
          costo: Number(costoNum) ,
          letra: this.uno.prototype.costoLetra(costoEquipo),
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
              this.uno.prototype.generarPDF(accion, accesorioEquipo, nombreDia, datosDEquipoG, nombre, costoEquipo, disco);
            }
          },
          error => {
            console.log(error);
            this.mensajeErrorVistaPrevia();
          }
        );
        if (accion === 'crear')  {
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
                          this.uno.prototype.generarPDF(accion, accesorioEquipo, nombreDia, datosDEquipoG, nombre, costoEquipo, disco);
                          this.mensajeResponsivaGenerada();
                          setTimeout( () => {this.router.navigate(['IndexResponsiva']); }, 3000 );
                        } else {
                          this.mensajeErrorResponsiva();
                        }
                      },
                      errorA => {
                        if (errorA.status === 500) {
                          console.log('Error en el Servicio');
                          // en caso de que no se cree la asginacion
                          this.mensajeErrorResponsiva();
                          this.ServiceConsulta.updateDEquipo(Number(idEstatusNoAsignada), datosDEquipoG2).subscribe();
                        }
                      }
                    );
                  }
                },
                errorDE => {
                  if (errorDE.status === 500) {
                    console.log('Error en el Servicio');
                    this.mensaje500();
                  } else {
                    this.mensajeErrorResponsiva();
                  }
                }
              );
            },
            error => {
              console.log(error);
              if (error.status === 500) {
                console.log('Error en el Servicio');
                this.mensaje500();
              } else {
                this.mensajeErrorResponsiva();
              }
            }
          );
        }
      }
    }
  }

  cancelar() {
    this.mensajeCancelar();
    setTimeout( () => {this.router.navigate(['AgregarResponsiva']); }, 1000 );

  }

  seleccinarAccesorios() {
    const agregarAccesorios = this.datosRespForm.controls.opcionAccesorio.value;
    if (agregarAccesorios === true) {
      this.mostrarAccesorios = true;
      // this.getAllAccesorios();
    } else if (agregarAccesorios === false) {
      this.mostrarAccesorios = false;
    }
  }

  getAllAccesorios() {
    this.ServiceConsulta.getAllAccesorios().subscribe(
      response => {
        if (response.status === 200) {
          this.accesorios = response.body;
          const accesoriosDisp =  this.accesorios.filter(item => item.id_Estatus.id_estatus === 2);
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
  validarRecurso() {
    datosResponsiva = EquipoResp;
    datosResponsivaAccesorio = AccesorioResp;
    if (datosResponsivaAccesorio.idAcceosrio !== '') {
      this.ifAccesorio = false;
      this.cargaAccesorio();
    }
    if (datosResponsiva.idEquipo !== '') {
      this.ifAccesorio = true;
      this.cargaIdEquipo();
      this.getAllAccesorios();
    }
  }
  cargaAccesorio() {
    this.datosRespAccForm.controls.id_accesorio.setValue(datosResponsivaAccesorio.idAcceosrio);
    this.datosRespAccForm.controls.id_accesorio.disable();
    this.ServiceConsulta.getAccesorio(datosResponsivaAccesorio.idAcceosrio).subscribe(
      response => {
        if (response.status === 200) {
          this.datosAccesorios = response.body;
          datosAccesorioG = response.body;
          console.log(this.datosAccesorios);
        } else if (response.status === 204 ) {
          console.log('Accesorio no encontrado');
        }
      },
      error => {
        if (error.status === 500) {
          console.log('Error 500');
          this.mensaje500();
        }
      }
    );
  }
  generarResponsivaAccesorio(opcion: string) {
    const date = new Date();
    const responsableAcc = this.datosRespAccForm.controls.responsable.value;
    const accesorio = this.datosRespAccForm.controls.id_accesorio.value;
    const costoAcc = datosAccesorioG.costo;
    const fecha = this.datepipe.transform(date, 'yyyy-MM-dd');
    if ( responsableAcc === '' ) {
      this.mensajeDatosVacios();
    } else {
      datosAsignacion = {
        id_asignacion: '',
        id_dequipo: accesorio,
        nombre_consultor: responsableAcc,
        costo: costoAcc,
        letra: costoAcc.toString(),
        fecha_asignacion: fecha,
        id_estatus: 0,
        usuario: '',
      };
      datosAaccesorio = {
        id_aaccesorio: '',
        id_accesorio: accesorio,
        id_asignacion: '',
      };
      this.ServiceConsulta.updateAccesorio(datosAccesorioG, Number(idEestatusAsignada)).subscribe(
        response => {
          if (response.status === 200 ) {
          }
        },
        error => {

        }
      );
/*       if (opcion === 'vista') {

      } else if (opcion === 'crear') {

      } */
  }
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
    this.toastr.warning('Llene los campos que tienen un (*)', 'Faltan datos');
  }
  mensajeCancelar() {
    this.toastr.warning('Se canceló el formulario');
  }
  mensajeErrorVistaPrevia() {
    this.toastr.warning('Se presento un error para mostrar el archivo PDF', 'Error en Vista Previa');
  }
  mensajeErrorObtencionDatos() {
    this.toastr.warning('Se presento un error para obtener los datos del equipo', 'Error en los datos');
  }
  mensajeResponsivaGenerada() {
    this.toastr.success('Se descargará el archivo', 'Responsiva Generada');
  }
  mensajeErrorResponsiva() {
    this.toastr.error('La responsiva no pudo generarse', 'Fallo Generacion');
  }
}
