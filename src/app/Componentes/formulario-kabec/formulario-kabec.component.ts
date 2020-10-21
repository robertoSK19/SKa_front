import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupName } from '@angular/forms';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { Router } from '@angular/router';
import { EquipoResp, DatosEquipoResponsiva, DatosAccesorioResponsiva, AccesorioResp, accesoriosID} from '../agregar-responsivas/agregar-responsivas.component';
import { DataService } from '../list/data.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Accesorios } from '../../Models/accesorios/accesorios.interface';
import { DatePipe } from '@angular/common';
import { Asignacion } from '../../Models/asignacion/asignacion.interface';
import { DEquipos } from '../../Models/equipos/dequipos.interface';
import { CrearPDFComponent } from '../formatos_pdf/pdf kabec/crear-pdf.component';
import { ToastrService } from 'ngx-toastr';
import { Aaccesorio } from 'src/app/Models/accesorios/aaccesorio.interface';
import { tipoLicencia } from '../../Constantes/constante';
import { Software } from '../../Models/Software/software.interface';
const idEestatusAsignada = '1';
const idEstatusNoAsignada = '2';
let datosResponsiva: DatosEquipoResponsiva = {
  idEquipo: '',
};
let datosResponsivaAccesorio: DatosAccesorioResponsiva = {
  idAcceosrio: [],
};

export let accesor = [];
export let checkAccesorios = false;
let accesorAsig = [];
let equipoID = 0;

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

let accesorioAsig: Accesorios = {
  id_accesorio: '',
  nombre_accesorio: '',
  marca: '',
  modelo: '',
  producto: '',
  hecho_en: '',
  serie: '',
  costo: 0,
  descripcion: '',
  capacidad: '',
  tipo_disco_duro: '',
  ram_bus: '',
  ram_ranura: '',
}


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

  @ViewChild(CrearPDFComponent, { static: false }) pdf: CrearPDFComponent;
  public uno = CrearPDFComponent;

  acceId = '';
  acceNom = '';
  acceMarca = '';
  acceModelo = '';
  acceSerie = '';
  acceIdEstatus = '';
  acceProducto = '';
  accHecho = ''; 
  accCosto = 0;
  accDescrip = '';
  accCapacidad = '';
  accTipoDD = '';
  accBus = '';
  accRanura = '';
  datosRespForm: FormGroup;
  datosRespAccForm: FormGroup;
  mostrarAccesorios = false;
  ifAccesorios: boolean;
  accesorios: any[];
  selection = new SelectionModel<Accesorios>(true, []);
  datosDEquipo: any[];
  ifAccesorio = true;
  datosAccesorios: any[];
  tiposLicencias: any[];
  ifOriginalSO = true;
  ifGenericoSO = true;
  ifOriginalOF = true;
  ifGenericoOF = true;
  ifOriginalOt = true;
  ifGenericoOt = true;
  softwares: any[];
  softSO: any[];
  softOf: any[];
  softAV: any[];
  softExtra: any[];
  datosNuevoSO: FormGroup;
  datosOfimatica: FormGroup;
  nuevoSO = false;
  nuevoOf = false;
  nuevoSistema: Software;
  nuevoOffice: Software;
  ArregloSoftware: Software[];
  
  constructor(
    private formBuilder: FormBuilder,
    protected servicioConUser: ServiciosService,
    private router: Router,
    private ServiceConsulta: DataService,
    public datepipe: DatePipe,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.tiposLicencias = tipoLicencia;
    this.getSoftwares();
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
    this.datosRespAccForm = this.formBuilder.group({
      id_accesorio: ['', Validators.required],
      responsable: ['', Validators.required],
    });
    this.datosNuevoSO = this.formBuilder.group({
      datosSoftware: [null],
      fecha_inicio_vigencia: [''],
      fecha_termino_vigencia: ['']
    });
    this.datosOfimatica = this.formBuilder.group({
      datosSoftware: [null],
      fecha_inicio_vigencia: [''],
      fecha_termino_vigencia: ['']
    });
    // this.cargaIdEquipo(datosResponsiva.idEquipo);
    this.validarRecurso();
    // this.getAllAccesorios();
  }

  usuarioLogeado() {
    datosResponsiva = EquipoResp;
    datosResponsivaAccesorio = AccesorioResp;
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
    this.datosRespForm.controls.id_equipo.disable();
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
        if (responseAE.status === 200 || responseAE.status === 204) {
          accesorioEquipo = responseAE.body;
        } else {
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

  accesoriosCheck(accID: string, accNom: string, accMarca: string, accModelo: string, accSerie: string,
                  accStatusId: string, accProducto: string, accHecho: string, accCosto: number, accDescrip: string,
                  accCapacidad: string, accTipoDD: string, accBus: string, accRanura: string) {
    this.acceId = accID;
    this.acceNom = accNom;
    this.acceMarca = accMarca;
    this.acceModelo = accModelo;
    this.acceSerie = accSerie;
    this.acceIdEstatus = accStatusId;
    this.acceProducto = accProducto;
    this.accHecho = accHecho;
    this.accCosto = accCosto;
    this.accDescrip = accDescrip;
    this.accCapacidad = accCapacidad;
    this.accTipoDD = accTipoDD;
    this.accBus = accBus;
    this.accRanura = accRanura;

    const acceId = this.acceId;

    const objAcc = {
      accId: acceId,
      accNom: this.acceNom,
      accMarca: this.acceMarca,
      accModelo: this.acceModelo,
      accSerie: this.acceSerie,
      accStatusId: this.acceIdEstatus,
      accProducto: this.acceProducto
    };

    const objAccAsignar = {
      id_accesorio: acceId,
      nombre_accesorio: this.acceNom,
      marca: this.acceMarca,
      modelo: this.acceModelo,
      producto: this.acceProducto,
      hecho_en: this.accHecho,
      serie: this.acceSerie,
      costo: accCosto,
      id_equipo: equipoID,
      descripcion: this.datosRespForm.controls.comentarios.value,
      capacidad: accCapacidad,
      tipo_disco_duro: accTipoDD,
      ram_bus: accBus,
      ram_ranura: accRanura
    };

    if (accesor.length !== 0) {
      if ((accesor.findIndex(x => x.accId === acceId)) === -1) {
        accesor.push(objAcc);
        accesorAsig.push(objAccAsignar);
      } else {
        let index: number = accesor.findIndex(x => x.accId === acceId);
        accesor.splice(index, 1);
        let indexs: number = accesorAsig.findIndex(x => x.id_accesorio === acceId);
        accesorAsig.splice(indexs, 1);
      }
    } else {
      accesor.push(objAcc);
      accesorAsig.push(objAccAsignar);
    }
    console.log(accesor);
    console.log(accesorAsig);
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
//    const costoNum = costoEquipo.replace(',', '');
    const comentarios = this.datosRespForm.controls.comentarios.value;
    const disco = this.datosRespForm.controls.discoDS.value;
    equipoID = parseInt(equipo);
    if (nombre === '' && costoEquipo === '') {
      console.log('no lleno todos los datos');
      this.mensajeDatosVacios();
    } else if (nombre !== ''  && costoEquipo === '') {
      // console.log('falta costo');
      this.mensajeFaltaCosto();
    } else if (nombre === ''  && costoEquipo !== '') {
      //  console.log('falta respomsable');
      this.mensajeFaltaResponsable();
    } else {
      const costoNum = costoEquipo.replace(',', '');
      /* if (this.mostrarAccesorios === true) { // si selecciona otro accesorio
        if (accesor.length === 0) {
          console.log('no selecciono un dispositivo');
        } else {
          console.log('selecciono al menos uno');
         /* for (let accesorio of accesor) {
            console.log(accesorio.accId);
          }*/
       /*   datosAsignacion = {
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
                this.uno.prototype.generarPDF(accion, accesor, nombreDia, datosDEquipoG, nombre, costoEquipo, disco, accesorioEquipo );
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
                            this.uno.prototype.generarPDF(accion, accesor, nombreDia, datosDEquipoG, nombre,
                              costoEquipo, disco, accesorioEquipo);
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
      } else if (this.mostrarAccesorios === false || this.mostrarAccesorios === undefined) {*/ // si no selecciona otro accesorio
        this.datosNuevoSOyOF();
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
              if (accesor.length === 0){
              this.uno.prototype.generarPDF(accion, accesorioEquipo, nombreDia, datosDEquipoG, nombre, costoEquipo, disco, accesorioEquipo);
              } else {
                this.uno.prototype.generarPDF(accion, accesor, nombreDia, datosDEquipoG, nombre, costoEquipo, disco, accesorioEquipo );
              }
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
              accesorAsig.map((x =>{
                accesorioAsig.id_accesorio = x.id_accesorio;
                accesorioAsig.nombre_accesorio = x.nombre_accesorio;
                accesorioAsig.marca = x.marca;
                accesorioAsig.modelo = x.modelo;
                accesorioAsig.producto = x.producto;
                accesorioAsig.hecho_en = x.hecho_en;
                accesorioAsig.serie = x.serie;
                accesorioAsig.costo = x.costo;
                accesorioAsig.id_equipo = x.id_equipo;
                accesorioAsig.descripcion = x.descripcion;
                accesorioAsig.capacidad = x.capacidad;
                accesorioAsig.tipo_disco_duro = x.tipo_disco_duro;
                accesorioAsig.ram_bus = x.ram_bus;
                accesorioAsig.ram_ranura = x.ram_ranura;
                this.ServiceConsulta.updateAccesorio(accesorioAsig, Number(idEestatusAsignada));
              }))
              this.ServiceConsulta.updateDEquipo(Number(idEestatusAsignada), datosDEquipoG2).subscribe(
                responseDE => {
                  if (responseDE.status === 200) {
                    this.ServiceConsulta.crearAsignacion(equipo, idEestatusAsignada, datosAsignacion).subscribe(
                      responseA => {
                        if (responseA.status === 200) {
                          console.log('asignacion correcta');
                          if (accesor.length === 0){
                            this.uno.prototype.generarPDF(accion, accesorioEquipo, nombreDia, datosDEquipoG, nombre, costoEquipo, disco, accesorioEquipo);
                            } else {
                              this.uno.prototype.generarPDF(accion, accesor, nombreDia, datosDEquipoG, nombre, costoEquipo, disco, accesorioEquipo );
                            }
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
                          accesorAsig.map((x =>{
                            accesorioAsig.id_accesorio = x.id_accesorio;
                            accesorioAsig.nombre_accesorio = x.nombre_accesorio;
                            accesorioAsig.marca = x.marca;
                            accesorioAsig.modelo = x.modelo;
                            accesorioAsig.producto = x.producto;
                            accesorioAsig.hecho_en = x.hecho_en;
                            accesorioAsig.serie = x.serie;
                            accesorioAsig.costo = x.costo;
                            accesorioAsig.id_equipo = null;
                            accesorioAsig.descripcion = x.descripcion;
                            accesorioAsig.capacidad = x.capacidad;
                            accesorioAsig.tipo_disco_duro = x.tipo_disco_duro;
                            accesorioAsig.ram_bus = x.ram_bus;
                            accesorioAsig.ram_ranura = x.ram_ranura;
                            this.ServiceConsulta.updateAccesorio(accesorioAsig, Number(idEstatusNoAsignada));
                          }))
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
       // }
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
      checkAccesorios = true;
    } else if (agregarAccesorios === false) {
      this.mostrarAccesorios = false;
      checkAccesorios = false;
    }
  }

  getAllAccesorios() {
    this.ServiceConsulta.getAllAccesorios().subscribe(
      response => {
        if (response.status === 200) {
          this.accesorios = response.body;
          const accesoriosDisp = this.accesorios.filter(item => item.id_estatus.id_estatus === 2);
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

    if (datosResponsivaAccesorio.idAcceosrio.length !== 0) {
      this.ifAccesorio = false;
      this.cargaAccesorio();
    }
    if (datosResponsiva.idEquipo !== '') {
      this.ifAccesorio = true;
      this.cargaIdEquipo();
      this.getAllAccesorios();
      this.getSoftwares();
    }
  }
  cargaAccesorio() {
    console.log(datosResponsivaAccesorio);
    this.datosRespAccForm.controls.id_accesorio.setValue
    (datosResponsivaAccesorio.idAcceosrio);
    this.datosRespAccForm.controls.id_accesorio.disable();
    console.log(accesoriosID);
    
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
      this.ServiceConsulta.updateAccesorio(datosAccesorioG, Number(idEestatusAsignada)).subscribe(
        response => {
          console.log(response.body);
          if (response.status === 200 ) {
            this.softwares = response.body;
          } else {
            console.log('otra respuesta', response);
            this.mensajeErrorObtencionDatos();
          }
        },
        error => {
          if (error.status === 500) {
            console.log('error 500 - softwares');
            this.mensaje500();
          } else {
            console.log(error);
            this.mensajeErrorObtencionDatos();
          }
        }
      );
  }
  }
  tipoLicenciaSO(tipo: any) {
    console.log(tipo);
    this.softSO = this.softwares.filter(so => so.tipo_software.toLowerCase() === 'sistema operativo' && so.tipo_licencia === tipo);
    if (tipo === this.tiposLicencias[0]) {
      this.ifOriginalSO = false;
      this.ifGenericoSO = true;
    } else if (tipo === this.tiposLicencias[1]) {
      this.ifOriginalSO = true;
      this.ifGenericoSO = false;
    }
    this.nuevoSO = true;
  }
  tipoLicenciaOF(tipo: any) {
    console.log(tipo);
    this.softOf = this.softwares.filter(so => so.tipo_software.toLowerCase() === 'ofimatica' && so.tipo_licencia === tipo) ;
    if (tipo === this.tiposLicencias[0]) {
      this.ifOriginalOF = false;
      this.ifGenericoOF = true;
    } else if (tipo === this.tiposLicencias[1]) {
      this.ifOriginalOF = true;
      this.ifGenericoOF = false;
    }
    this.nuevoOf = true;
  }
  getSoftwares() {
    this.ServiceConsulta.getAllSoftware().subscribe(
      response => {
        console.log(response);
        if (response.status === 200) {
          this.softwares = response.body;
          this.softAV = this.softwares.filter(so => so.tipo_software.toLowerCase() === 'antivirus');
          this.softExtra = this.softwares.filter(so => so.tipo_software.toLowerCase() !== 'ofimatica'
          && so.tipo_software.toLowerCase() !== 'sistema operativo' && so.tipo_software.toLowerCase() !== 'antivirus');
        } else {
          console.log('otra respuesta', response);
          this.mensajeErrorObtencionDatos();
        }
      },
      error => {
        if (error.status === 200) {
          console.log('error 500-software');
          this.mensaje500();
        } else {
          console.log('error software', error);
          this.mensajeErrorObtencionDatos();
        }
      }
    );
  }
  datosNuevoSOyOF() {
    console.log('nuevo softwares')
    if (this.nuevoSO === true ) {
      const fechaI =  this.datosNuevoSO.controls.fecha_inicio_vigencia.value;
      const fechaT =  this.datosNuevoSO.controls.fecha_termino_vigencia.value;
      if (this.ifOriginalSO === false && this.ifGenericoSO === true) {
 //        console.log('es original');
        if (fechaI === '' && fechaT === '' && this.datosNuevoSO.controls.datosSoftware.value === null) {
          this.mensajeFaltaDatosSO();
        } else if (fechaI !== '' && fechaT !== '' && this.datosNuevoSO.controls.datosSoftware.value !== null) {
          this.nuevoSistema = this.datosNuevoSO.controls.datosSoftware.value;
          this.nuevoSistema.vigencia_inicial = fechaI;
          this.nuevoSistema.vigencia_final = fechaT;
          console.log('datos del SO');
        }
      } else if (this.ifOriginalSO === true && this.ifGenericoSO === false) {
   //     console.log('es generico')
        if (this.datosNuevoSO.controls.datosSoftware.value === null) {
          this.mensajeFaltaDatosSO();
        } else {
          this.nuevoSistema = this.datosNuevoSO.controls.datosSoftware.value;
          console.log('datos del SO');
        }
      }
    }
    if (this.nuevoOf === true) {
      const fechaIOf = this.datosOfimatica.controls.fecha_termino_vigencia.value;
      const fechaTOf = this.datosOfimatica.controls.fecha_termino_vigencia.value;
      if (this.ifOriginalOF === false && this.ifGenericoOF === true) {
        //        console.log('es original');
        if (fechaIOf === '' && fechaTOf === '' && this.datosOfimatica.controls.datosSoftware.value === null) {
          this.mensajeFaltaDatosOf();
        } else if (fechaIOf !== '' && fechaTOf !== '' && this.datosOfimatica.controls.datosSoftware.value !== null) {
          this.nuevoOffice = this.datosOfimatica.controls.datosSoftware.value;
          this.nuevoOffice.vigencia_inicial = fechaIOf;
          this.nuevoOffice.vigencia_final = fechaTOf;
          console.log('datos del OF');
        }
      } else if (this.ifOriginalOF === true && this.ifGenericoOF === false) {
          //     console.log('es generico')
        if (this.datosOfimatica.controls.datosSoftware.value === null) {
          this.mensajeFaltaDatosOf();
        } else {
          console.log('datos de la OF');
          this.nuevoOffice = this.datosOfimatica.controls.datosSoftware.value;
        }
      }
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
  mensajeFaltaCosto() {
    this.toastr.warning('Llene el campo de Costo', 'Faltan datos');
  }
  mensajeFaltaResponsable() {
    this.toastr.warning('Llene el campo de Responsable', 'Faltan datos');
  }
  mensajeFaltaDatosSO() {
    this.toastr.warning('Llene los campos con (*)', 'Faltan datos del Sistema Operativo');
  }
  mensajeFaltaDatosOf() {
    this.toastr.warning('Llene los campos con (*)', 'Faltan datos del la Ofimática');
  }

}
