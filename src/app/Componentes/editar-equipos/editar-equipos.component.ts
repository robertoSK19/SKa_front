import { Component, OnInit } from '@angular/core';
import { usuarioRol, RolesUser } from '../login/login.component';
import { Router} from '@angular/router';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { DatosEquipo, EquipoAE } from '../index-equipos/index-equipos.component';
import { DataService } from '../list/data.service';
import { Equipos } from '../../Models/equipos/equipos.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DEquipos } from 'src/app/Models/equipos/dequipos.interface';
import { DatePipe } from '@angular/common';
import { Software } from 'src/app/Models/Software/software.interface';
import { EquipoSoftware } from 'src/app/Models/equipos/equipoSotware.interface';
import { tiposDisco, tiposEquipo, tiposPbit } from 'src/app/Constantes/constante';

const estatusAsignado = 1;
const tipoLaptop = 'LAPTOP';
const tipoEscritorio = 'ESCRITORIO';
const tipoServidor = 'SERVIDOR';

let datosUser: RolesUser = {
  rol: '',
  nombre: '',
  id: 0,
};

let datosEquipo: DatosEquipo = {
  idEquipo: '',
  operacion: ''
};

@Component({
  selector: 'app-editar-equipos',
  templateUrl: './editar-equipos.component.html',
  styleUrls: ['./editar-equipos.component.scss']
})
export class EditarEquiposComponent implements OnInit {

  datosEquipoForm: FormGroup;
  Estatus: any[];
  datosDEquipo: DEquipos;
  ifAsignado = false;
  Softwares: any[];
  tiposEquipos: any[];
  tiposProcesadorBits: any[];
  public tiposDiscos: any[];
  softSO: any[];
  softOf: any[];
  softExtra: any[];
  ifCambioOfi = true;
  ifOfimaticaOk = true;
  ifLaptop = true;
  aux: any;
  ifFactura = false;
  ifLongitud = 2;

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
    cuenta_usuario_contraseña: '',
    tipo_computadora: '',
    fecha_fabricacion: '',
    nombre_sistema_operativo: '',
    tipo_sistema_operativo: '',
    direccion_mac: '',
    email_gnp: '',
    fecha_compra: '',
    fecha_garantia_termino: '',
    generacion_procesador: '',
    id_equipo_software: 0,
    id_historico_equipo: 0,
    lugar_compra: '',
    tamaño_pantalla: '',
    tipo_disco_duro: '',
  };

  public equipoReq: Equipos = {
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
    cuenta_usuario_contraseña: '',
    tipo_computadora: '',
    fecha_fabricacion: '',
    nombre_sistema_operativo: '',
    tipo_sistema_operativo: '',
    direccion_mac: '',
    email_gnp: '',
    fecha_compra: '',
    fecha_garantia_termino: '',
    id_historico_equipo: 0,
    generacion_procesador: '',
    id_equipo_software: 0,
    lugar_compra: '',
    tamaño_pantalla: '',
    tipo_disco_duro: '',
  };
  public software: Software = {
    id_software: '',
    no_serie: '',
    version: '',
    vigencia_inicial: '',
    vigencia_final: '',
    tipo_licencia: '',
    nombre_software: '',
    factura: null,
    tipo_software: ''
  };
  public softwareSO: Software = {
    id_software: '',
    no_serie: '',
    version: '',
    vigencia_inicial: '',
    vigencia_final: '',
    tipo_licencia: '',
    nombre_software: '',
    factura: null,
    tipo_software: ''
  };
  public equipoSoft: EquipoSoftware = {
    id_equipo: null,
    id_software: null,
  };

  public datosDEquipoReq: DEquipos;

  ifMostrar;
  ifEditar;
  ifFechaCorrecta = false;

  constructor(
    private router: Router,
    protected servicioConUser: ServiciosService,
    private dataSvc: DataService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public datepipe: DatePipe,
  ) { }
  ngOnInit() {
    this.tiposDiscos = tiposDisco;
    this.tiposEquipos = tiposEquipo;
    this.tiposProcesadorBits = tiposPbit;
    this.usuarioLogeado();
    // this.operacionesEquipos();
    this.datosEquipoForm = this.formBuilder.group({
      nombre_equipo: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      modelo_cmd: ['', Validators.required],
      numero_serie: ['', Validators.required],
      serie_cmd: ['', Validators.required],
      procesador: ['', Validators.required],
      ram: ['', Validators.required],
      disco_duro: ['', Validators.required],
      cuenta: ['', Validators.required],
      cuenta_pass: ['', Validators.required],
      tipo_equipo: ['', Validators.required],
      fecha_fabrica: ['', Validators.required],
      nombre_SO: ['', Validators.required],
      tipo_SO: ['', Validators.required],
      mac: ['', Validators.required],
      correo: ['', Validators.required],
      estatus: ['', Validators.required],
      checkOfimatica: ['', Validators.required],
      nombre_OF: ['', Validators.required],
      fecha_compra: ['', Validators.required],
      fecha_garantia: ['', Validators.required],
      generacion_procesador: ['', Validators.required],
      lugar_compra: ['', Validators.required],
      tamaño_pantalla: ['', Validators.required],
      tipo_disco_duro: ['', Validators.required],
    });

  }

  usuarioLogeado() {
    datosUser = usuarioRol;
    datosEquipo = EquipoAE;
    const token = this.servicioConUser.getToken();
    if ( token.length !== 0 && datosEquipo.idEquipo !== '') {
      console.log('acceso correcto');
      // console.log('error en el acceso');
      this.operacionesEquipos();
    } else {
      console.log('error en el acceso');
      // console.log('acceso correcto');
      // this.operacionesEquipos();
      this.router.navigate(['IndexEquipo']);
    }
  }
  operacionesEquipos(idEquipo?: string) {
    // datosEquipo = EquipoAE;
    this.getEstatus(datosEquipo.operacion);
    this.getSoftware();
    if (datosEquipo.operacion === 'editar') {
      console.log('soy editar');
      this.ifMostrar = true;
      this.ifEditar = false;
      this.dataSvc.getEquipo(datosEquipo.idEquipo).subscribe(
        response => {
          if (response.status === 200) {
            this.equipo = response.body;
            this.datosEquipoForm.controls.nombre_equipo.setValue(this.equipo.nombre_equipo);
            this.datosEquipoForm.controls.marca.setValue(this.equipo.marca);
            this.datosEquipoForm.controls.modelo.setValue(this.equipo.modelo);
            this.datosEquipoForm.controls.modelo_cmd.setValue(this.equipo.modelo_equipo_cmd);
            this.datosEquipoForm.controls.numero_serie.setValue(this.equipo.numero_serie);
            this.datosEquipoForm.controls.serie_cmd.setValue(this.equipo.numero_serie_cmd);
            this.datosEquipoForm.controls.procesador.setValue(this.equipo.procesador);
            this.datosEquipoForm.controls.ram.setValue(this.equipo.ram);
            this.datosEquipoForm.controls.disco_duro.setValue(this.equipo.disco_duro);
            this.datosEquipoForm.controls.cuenta.setValue(this.equipo.cuenta_usuario);
            this.datosEquipoForm.controls.cuenta_pass.setValue(this.equipo.cuenta_usuario_contraseña);
            this.datosEquipoForm.controls.tipo_equipo.setValue(this.equipo.tipo_computadora);
            const fechaFabricacion = this.convertirFecha(this.equipo.fecha_fabricacion);
            this.datosEquipoForm.controls.fecha_fabrica.setValue(fechaFabricacion);
            this.datosEquipoForm.controls.nombre_SO.setValue(this.equipo.nombre_sistema_operativo);
            this.datosEquipoForm.controls.tipo_SO.setValue(this.equipo.tipo_sistema_operativo);
            this.datosEquipoForm.controls.mac.setValue(this.equipo.direccion_mac);
            this.datosEquipoForm.controls.correo.setValue(this.equipo.email_gnp);
            this.datosEquipoForm.controls.tipo_disco_duro.setValue(this.equipo.tipo_disco_duro);
            this.datosEquipoForm.controls.generacion_procesador.setValue(this.equipo.generacion_procesador);
            this.datosEquipoForm.controls.fecha_garantia.setValue(this.equipo.fecha_garantia_termino);
            this.datosEquipoForm.controls.lugar_compra.setValue(this.equipo.lugar_compra);
            this.datosEquipoForm.controls.fecha_compra.setValue(this.equipo.fecha_compra);
            this.datosEquipoForm.controls.tamaño_pantalla.setValue(this.equipo.tamaño_pantalla);
            if (this.equipo.tipo_computadora !== tipoLaptop) {
              this.ifLaptop = true;
            } else {
              this.ifLaptop = false;
            }
            if ( this.equipo.factura !== null) {
              this.ifFactura = true;
            } else {
              this.ifFactura = false;
            }
          } else if (response.status === 204) {
            console.log( 'Equipo no encontrado');
            this.deshabilitaForm();
          }
        },
        error => {
          console.log(error);
          if (error.status === 500) {
            console.log('Error del Servidor');
          }
        }
      );
      this.dataSvc.getAllEquipos().subscribe(
        response => {
          console.log(response);
          if (response.status === 200 ) {
            for (const auxDE of response.body) {
              if (auxDE.mequipo.id_equipo === datosEquipo.idEquipo) {
                this.datosDEquipo = auxDE;
                console.log(this.datosDEquipo);
                this.datosEquipoForm.controls.estatus.setValue(auxDE.estatusRecurso.id_estatus);
                if (auxDE.estatusRecurso.id_estatus === estatusAsignado) {
                  this.ifAsignado = true;
                } else {
                  this.ifAsignado = false;
                }
              }
            }
          }
        },
        error => {
          this.mensajeErrorEstatus();
        }
      );
    } else if (datosEquipo.operacion === 'mostrar') {
      console.log('soy mostrar');
      this.ifMostrar = false;
      this.ifEditar = true;
      this.dataSvc.getEquipo(datosEquipo.idEquipo).subscribe(
        response => {
          if (response.status === 200) {
            this.equipo = response.body;
            console.log(this.equipo);
            this.datosEquipoForm.controls.nombre_equipo.setValue(this.equipo.nombre_equipo);
            this.datosEquipoForm.controls.marca.setValue(this.equipo.marca);
            this.datosEquipoForm.controls.modelo.setValue(this.equipo.modelo);
            this.datosEquipoForm.controls.modelo_cmd.setValue(this.equipo.modelo_equipo_cmd);
            this.datosEquipoForm.controls.numero_serie.setValue(this.equipo.numero_serie);
            this.datosEquipoForm.controls.serie_cmd.setValue(this.equipo.numero_serie_cmd);
            this.datosEquipoForm.controls.procesador.setValue(this.equipo.procesador);
            this.datosEquipoForm.controls.ram.setValue(this.equipo.ram);
            this.datosEquipoForm.controls.disco_duro.setValue(this.equipo.disco_duro);
            this.datosEquipoForm.controls.cuenta.setValue(this.equipo.cuenta_usuario);
            this.datosEquipoForm.controls.cuenta_pass.setValue(this.equipo.cuenta_usuario_contraseña);
            this.datosEquipoForm.controls.tipo_equipo.setValue(this.equipo.tipo_computadora);
            const fechaFabricacion = this.convertirFecha(this.equipo.fecha_fabricacion);
            this.datosEquipoForm.controls.fecha_fabrica.setValue(fechaFabricacion);
            this.datosEquipoForm.controls.nombre_SO.setValue(this.equipo.nombre_sistema_operativo);
            this.datosEquipoForm.controls.tipo_SO.setValue(this.equipo.tipo_sistema_operativo);
            this.datosEquipoForm.controls.mac.setValue(this.equipo.direccion_mac);
            this.datosEquipoForm.controls.correo.setValue(this.equipo.email_gnp);
            this.datosEquipoForm.controls.tipo_disco_duro.setValue(this.equipo.tipo_disco_duro);
            this.datosEquipoForm.controls.generacion_procesador.setValue(this.equipo.generacion_procesador);
            this.datosEquipoForm.controls.fecha_garantia.setValue(this.equipo.fecha_garantia_termino);
            this.datosEquipoForm.controls.lugar_compra.setValue(this.equipo.lugar_compra);
            this.datosEquipoForm.controls.fecha_compra.setValue(this.equipo.fecha_compra);
            this.datosEquipoForm.controls.tamaño_pantalla.setValue(this.equipo.tamaño_pantalla);
            if (this.equipo.tipo_computadora !== tipoLaptop) {
              this.ifLaptop = true;
            } else {
              this.ifLaptop = false;
            }
            this.deshabilitaForm();
          } else if (response.status === 204) {
            console.log( 'Equipo no encontrado');
            this.deshabilitaForm();
          }
        },
        error => {
          console.log(error);
          if (error.status === 500) {
            console.log('Error del Servidor');
          }
        }
      );
      this.dataSvc.getDEquipo(datosEquipo.idEquipo).subscribe(
        response => {
          console.log(response);
          if (response.status === 200 ) {
            this.datosDEquipo = response.body;
            this.datosEquipoForm.controls.estatus.setValue(response.body.estatusRecurso.id_estatus);
            if (response.body.estatusRecurso.id_estatus === estatusAsignado) {
              this.ifAsignado = true;
            } else {
              this.ifAsignado = false;
            }
          }
        },
        error => {
          this.mensajeErrorEstatus();
        }
      );
    }

  }

  guardarDatos() {
    console.log('guardar');
    const nombre = this.datosEquipoForm.controls.nombre_equipo.value;
    const marcaE = this.datosEquipoForm.controls.marca.value;
    const modeloE = this.datosEquipoForm.controls.modelo.value;
    const modeloCMD = this.datosEquipoForm.controls.modelo_cmd.value;
    const numSerie = this.datosEquipoForm.controls.numero_serie.value;
    const numSerieCMD = this.datosEquipoForm.controls.serie_cmd.value;
    const procesadorE = this.datosEquipoForm.controls.procesador.value;
    const ramE = this.datosEquipoForm.controls.ram.value;
    const disco = this.datosEquipoForm.controls.disco_duro.value;
    const cuenta = this.datosEquipoForm.controls.cuenta.value;
    const cuentaPass = this.datosEquipoForm.controls.cuenta_pass.value;
    const tipoEquipo = this.datosEquipoForm.controls.tipo_equipo.value;
    const fecha = this.datepipe.transform(this.datosEquipoForm.controls.fecha_fabrica.value, 'yyyy-MM-dd');
    const SO = this.datosEquipoForm.controls.nombre_SO.value;
    const vSO = this.datosEquipoForm.controls.tipo_SO.value;
    const mac = this.datosEquipoForm.controls.mac.value;
    const correo = this.datosEquipoForm.controls.correo.value;
    const estatus = this.datosEquipoForm.controls.estatus.value;
    const cambioOf = this.datosEquipoForm.controls.checkOfimatica.value;
    const tipoProcesador = this.datosEquipoForm.controls.generacion_procesador.value;
    const fechaGarantia = this.datepipe.transform(this.datosEquipoForm.controls.fecha_garantia.value, 'yyyy-MM-dd');
    const tipoDiscoDuro = this.datosEquipoForm.controls.tipo_disco_duro.value;
    const lugarCompra = this.datosEquipoForm.controls.lugar_compra.value;
    const fechaCompra = this.datepipe.transform(this.datosEquipoForm.controls.fecha_compra.value, 'yyyy-MM-dd');
    const tamañoPantalla = this.datosEquipoForm.controls.tamaño_pantalla.value;
    let  idSoftware = '';
    if (fecha > this.datepipe.transform(new Date(), 'yyyy-MM-dd')) {
      console.log('fecha errornea');
      this.ifFechaCorrecta = false;
      this.fechaIncorrecta();
    } else {
      this.ifFechaCorrecta = true;
    }
    if (cambioOf === true) {
      const ofimatica = this.datosEquipoForm.controls.nombre_OF.value;
      console.log(ofimatica);
      if (ofimatica !== '' ) {
        this.ifOfimaticaOk = true;
        console.log('valor correcto');
        idSoftware = ofimatica.id_software;
        this.software = {
          id_software: ofimatica.id_software,
          nombre_software: ofimatica.nombre_software,
          no_serie: ofimatica.no_serie,
          version: '',
          vigencia_inicial: '',
          vigencia_final: '',
          tipo_licencia: '',
          factura: null,
          tipo_software: ''
        };
      } else {
        console.log('Falta indicar el nombre de la ofimática');
        this.ifOfimaticaOk = false;
        this.mensajeSinOfimatica();
      }
    } else if (cambioOf === false) {
      this.ifOfimaticaOk = true;
    }
    if (nombre !== null && modeloE !== null && modeloCMD !== null && numSerie !== null && numSerieCMD !== null && procesadorE !== null
      && nombre !== '' && modeloE !== '' && modeloCMD !== '' && numSerie !== '' && numSerieCMD !== '' && procesadorE !== ''
      && ramE !== null && disco !== null && cuenta !== null && tipoEquipo !== null
      && ramE !== '' && disco !== '' && cuenta !== '' && tipoEquipo !== ''
      && fecha !== null && SO !== null && vSO !== null && mac !== null
      && fecha !== '' && SO !== '' && vSO !== '' && mac !== '' && this.ifFechaCorrecta === true  && this.ifOfimaticaOk === true) {
        console.log(this.aux);
        if (this.aux === undefined) {
          this.aux = null;
        } else {
          console.log(this.aux);
          this.aux = btoa(this.aux);
        }
        
        console.log('Datos correctos');
        this.equipoReq = {
          id_equipo: this.equipo.id_equipo,
          nombre_equipo: nombre,
          marca: marcaE,
          modelo: modeloE,
          modelo_equipo_cmd: modeloCMD,
          numero_serie: numSerie,
          numero_serie_cmd: numSerieCMD,
          procesador: procesadorE,
          ram: ramE,
          disco_duro: disco,
          cuenta_usuario: cuenta,
          cuenta_usuario_contraseña: cuentaPass,
          tipo_computadora: tipoEquipo,
          fecha_fabricacion: fecha,
          nombre_sistema_operativo: SO.nombre_software,
          tipo_sistema_operativo: vSO,
          direccion_mac: mac,
          email_gnp: correo,
          fecha_compra: fechaCompra,
          fecha_garantia_termino: fechaGarantia,
          generacion_procesador: tipoProcesador,
          id_equipo_software: Number(this.equipo.id_equipo),
          id_historico_equipo: Number (this.equipo.id_equipo),
          lugar_compra: lugarCompra,
          tamaño_pantalla: tamañoPantalla,
          tipo_disco_duro: tipoDiscoDuro,
          factura: this.aux,
        };
        this.datosDEquipoReq = {
          disco_duro_solido: this.datosDEquipo.disco_duro_solido,
          fecha_actualizacion_estatus: new Date(),
          id_dequipo: this.datosDEquipo.id_dequipo,
          id_equipo: this.datosDEquipo.id_equipo,
          id_estatus: this.datosDEquipo.id_estatus,
          comentarios: this.datosDEquipo.comentarios,
        };
        this.equipoSoft = {
          id_equipo: this.equipoReq,
          id_software: this.software,
        };
        this.softwareSO = {
          id_software: SO.id_software,
          no_serie: SO.no_serie,
          nombre_software: SO.nombre_software,
          version: '',
          vigencia_inicial: '',
          vigencia_final: '',
          tipo_licencia: '',
          factura: null,
          tipo_software: ''
        };
        console.log(this.equipoReq);
        this.dataSvc.updateEquipo(this.equipoReq).subscribe(
          response => {
            console.log(response.status);
            if (response.status === 200) {
              console.log('Actualizacion Correcta');
              // this.mensaje200Actulizacion();
              // setTimeout( () => {this.router.navigate(['IndexEquipo']); }, 3000 );
            }
          },
          error => {
            console.log('Error en la actualizacion', error);
            this.mensaje500();
          }
        );
        this.dataSvc.updateDEquipo(estatus, this.datosDEquipoReq).subscribe(
          response => {
            if (response.status === 200 ) {
              console.log(this.equipoSoft);
              if (this.equipoSoft.id_software.id_software !== '') {
                  this.dataSvc.crearEquipoSoftware(Number(this.equipo.id_equipo), Number(idSoftware), this.equipoSoft ).subscribe(
                    responseES => {
                      console.log(responseES);
                    },
                    errorES => {
                      console.log(errorES);
                    }
                  );
              }
              this.mensaje200Actulizacion();
              setTimeout( () => {this.router.navigate(['IndexEquipo']); }, 3000 );
            }
          },
          error => {
            console.log('Error en la actualizacion del estatus', error);
            this.mensaje500();
          }
        );
    } else {
      console.log('Datos imcompletos');
      this.mensajeDatosVacios();
    }

  }
  cancelar() {
    this.dataSvc.getDEquipo(datosEquipo.idEquipo).subscribe(
      response => {
        this.datosEquipoForm.controls.estatus.setValue(response.body.estatusRecurso.id_estatus);
      },
      error => {
        console.log('error datos del DEquipo');
      }
    );
    this.dataSvc.getEquipo(datosEquipo.idEquipo).subscribe(
      response => {
        this.equipo = response.body;
        console.log(this.equipo);
        this.datosEquipoForm.controls.nombre_equipo.setValue(this.equipo.nombre_equipo);
        this.datosEquipoForm.controls.marca.setValue(this.equipo.marca);
        this.datosEquipoForm.controls.modelo.setValue(this.equipo.modelo);
        this.datosEquipoForm.controls.modelo_cmd.setValue(this.equipo.modelo_equipo_cmd);
        this.datosEquipoForm.controls.numero_serie.setValue(this.equipo.numero_serie);
        this.datosEquipoForm.controls.serie_cmd.setValue(this.equipo.numero_serie_cmd);
        this.datosEquipoForm.controls.procesador.setValue(this.equipo.procesador);
        this.datosEquipoForm.controls.ram.setValue(this.equipo.ram);
        this.datosEquipoForm.controls.disco_duro.setValue(this.equipo.disco_duro);
        this.datosEquipoForm.controls.cuenta.setValue(this.equipo.cuenta_usuario);
        this.datosEquipoForm.controls.cuenta_pass.setValue(this.equipo.cuenta_usuario_contraseña);
        this.datosEquipoForm.controls.tipo_equipo.setValue(this.equipo.tipo_computadora);
        this.datosEquipoForm.controls.fecha_fabrica.setValue(this.equipo.fecha_fabricacion);
        this.datosEquipoForm.controls.nombre_SO.setValue(this.equipo.nombre_sistema_operativo);
        this.datosEquipoForm.controls.tipo_SO.setValue(this.equipo.tipo_sistema_operativo);
        this.datosEquipoForm.controls.mac.setValue(this.equipo.direccion_mac);
        this.datosEquipoForm.controls.correo.setValue(this.equipo.email_gnp);
        this.datosEquipoForm.controls.tipo_disco_duro.setValue(this.equipo.tipo_disco_duro);
        this.datosEquipoForm.controls.generacion_procesador.setValue(this.equipo.generacion_procesador);
        this.datosEquipoForm.controls.fecha_garantia.setValue(this.equipo.fecha_garantia_termino);
        this.mensajeCancelar();
        this.router.navigate(['IndexEquipo']);
      },
      error => {
        console.log(error);
      }
    );
  }
  opcionesVistaVer(opcion: string) {
    if (opcion === 'editar') {
      this.ifMostrar = true;
      this.ifEditar = false;
      this.habilitaForm();
      this.getEstatus('editar');
      this.getSoftware();
    } else if (opcion === 'aceptar') {
      this.router.navigate(['IndexEquipo']);
    }
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
  deshabilitaForm() {
    this.datosEquipoForm.controls.nombre_equipo.disable();
    this.datosEquipoForm.controls.marca.disable();
    this.datosEquipoForm.controls.modelo.disable();
    this.datosEquipoForm.controls.modelo_cmd.disable();
    this.datosEquipoForm.controls.numero_serie.disable();
    this.datosEquipoForm.controls.serie_cmd.disable();
    this.datosEquipoForm.controls.procesador.disable();
    this.datosEquipoForm.controls.ram.disable();
    this.datosEquipoForm.controls.disco_duro.disable();
    this.datosEquipoForm.controls.cuenta.disable();
    this.datosEquipoForm.controls.cuenta_pass.disable();
    this.datosEquipoForm.controls.tipo_equipo.disable();
    this.datosEquipoForm.controls.fecha_fabrica.disable();
    this.datosEquipoForm.controls.nombre_SO.disable();
    this.datosEquipoForm.controls.tipo_SO.disable();
    this.datosEquipoForm.controls.mac.disable();
    this.datosEquipoForm.controls.correo.disable();
    this.datosEquipoForm.controls.estatus.disable();
    this.datosEquipoForm.controls.checkOfimatica.disable();
    this.datosEquipoForm.controls.tipo_disco_duro.disable();
    this.datosEquipoForm.controls.generacion_procesador.disable();
    this.datosEquipoForm.controls.fecha_garantia.disable();
    this.datosEquipoForm.controls.lugar_compra.disable();
    this.datosEquipoForm.controls.fecha_compra.disable();
    this.datosEquipoForm.controls.tamaño_pantalla.disable();
  }
  habilitaForm() {
    this.datosEquipoForm.controls.nombre_equipo.enable();
    this.datosEquipoForm.controls.marca.enable();
    this.datosEquipoForm.controls.modelo.enable();
    this.datosEquipoForm.controls.modelo_cmd.enable();
    this.datosEquipoForm.controls.numero_serie.enable();
    this.datosEquipoForm.controls.serie_cmd.enable();
    this.datosEquipoForm.controls.procesador.enable();
    this.datosEquipoForm.controls.ram.enable();
    this.datosEquipoForm.controls.disco_duro.enable();
    this.datosEquipoForm.controls.cuenta.enable();
    this.datosEquipoForm.controls.cuenta_pass.enable();
    this.datosEquipoForm.controls.tipo_equipo.enable();
    this.datosEquipoForm.controls.fecha_fabrica.enable();
    this.datosEquipoForm.controls.nombre_SO.enable();
    this.datosEquipoForm.controls.tipo_SO.enable();
    this.datosEquipoForm.controls.mac.enable();
    this.datosEquipoForm.controls.correo.enable();
    this.datosEquipoForm.controls.estatus.enable();
    this.datosEquipoForm.controls.checkOfimatica.enable();
    this.datosEquipoForm.controls.tipo_disco_duro.enable();
    this.datosEquipoForm.controls.generacion_procesador.enable();
    this.datosEquipoForm.controls.fecha_garantia.enable();
    this.datosEquipoForm.controls.lugar_compra.enable();
    this.datosEquipoForm.controls.fecha_compra.enable();
    this.datosEquipoForm.controls.tamaño_pantalla.enable();
  }
  getEstatus(opcion: string) {
    this.dataSvc.getAllEstatus().subscribe(
      response => {
        if (response.status === 200) {
          this.Estatus = response.body;
          if (opcion === 'mostrar') {
            const estatusEquiposDisp = this.Estatus.filter(item => item.id_estatus !== 6 );
            this.Estatus = estatusEquiposDisp;
          } else {
            const estatusfiltro = this.Estatus.filter(item => item.id_estatus !== 1 && item.id_estatus !== 6 );
            this.Estatus = estatusfiltro;
          }
        } else {
          console.log('error');
          this.mensajeErrorEstatus();
        }
      },
      error => {
        this.mensaje500();
      }
    );
  }
  convertirFecha(fecha: string): any {
    let valores: any[];
    valores = fecha.split('-');
    const miFechaPasada = new Date(Number(valores[0]), (Number(valores[1])) - 1, Number(valores[2]));
    return miFechaPasada;
  }
  getSoftware() {
    this.dataSvc.getAllSoftware().subscribe(
      response => {
        if (response.status === 200) {
          console.log(response)
          this.Softwares = response.body;
          this.softSO = this.Softwares.filter(so => so.nombre_software.toLowerCase().includes('windows') === true
          || so.nombre_software.toLowerCase().includes('mac os') === true);
          this.softOf = this.Softwares.filter(so => so.nombre_software.toLowerCase().includes('office') === true);
          this.softExtra = this.Softwares.filter(so => so.nombre_software.toLowerCase().includes('office') === false
           || so.nombre_software.toLowerCase().includes('mac os') === false
           || so.nombre_software.toLowerCase().includes('office') === false );
           console.log(this.softSO);
        } else {
          this.mensaje500();
        }
      },
      error => {
        this.mensaje500();
      }
    );
  }

cambioOfimatica() {
  const cambioOfimatica = this.datosEquipoForm.controls.checkOfimatica.value;
  if (cambioOfimatica === true) {
    this.ifCambioOfi = false;
  } else if (cambioOfimatica === false) {
    this.ifCambioOfi = true;
  }
}
fileEvent(valor: Event): any  {
  const file = (<HTMLInputElement>valor.target).files[0];
  const reader = new FileReader();
  const tipoArchivo = '';
  reader.readAsDataURL(file);
  const pathSplitted = file.name.split('.');
  const extension = pathSplitted.pop();
  reader.onload = () => {
      this.aux = reader.result;
      //console.log(this.aux);
  };
}
  mensaje200Actulizacion() {
    this.toastr.success('Se actualizaron los datos', 'Registro Actualizado');
  }
  mensaje204Actualizacion() {
    this.toastr.error('No se actualizaron los datos', 'Error en el registro');
  }
  mensaje500() {
    this.toastr.error('Intentar más tarde', 'Error del Servidor ');
  }
  mensajeDatosVacios() {
    this.toastr.warning('Llene los campos que tienen un (*)', 'Faltan datos');
  }
  mensajeCancelar() {
    this.toastr.warning('Se canceló la edición');
  }
  mensajeErrorEstatus() {
    this.toastr.error('No se pudo obtener los datos', 'Error del Servidor');
  }
  fechaIncorrecta() {
    this.toastr.error('La fecha no debe ser un dia \n mayor a la  fecha actual', 'Error en la fecha de fabricación');
  }
  mensajeSinOfimatica() {
    this.toastr.error('No se indico un nombre para la Ofimática', 'Faltan Datos');
  }
}
