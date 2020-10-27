import { Component, OnInit } from '@angular/core';
import { usuarioRol, RolesUser } from '../login/login.component';
import { Router} from '@angular/router';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { DatosEquipo, EquipoAE } from '../index-equipos/index-equipos.component';
import { DataService } from '../list/data.service';
import { Equipos } from '../../Models/equipos/equipos.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DEquipos } from 'src/app/Models/equipos/dequipos.interface';
import { ToastrService } from 'ngx-toastr';
import { Accesorios } from 'src/app/Models/accesorios/accesorios.interface';
import { Software } from 'src/app/Models/Software/software.interface';
import { EquipoSoftware } from 'src/app/Models/equipos/equipoSotware.interface';
import { tiposDisco, tiposEquipo, tipoLaptop, tipoEscritorio, tipoServidor, tiposPbit } from 'src/app/Constantes/constante';


const idEstatusAsignado = 1;
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
  selector: 'app-agregar-equipos',
  templateUrl: './agregar-equipos.component.html',
  styleUrls: ['./agregar-equipos.component.scss']
})
export class AgregarEquiposComponent implements OnInit {

  datosEquipoForm: FormGroup;
  datosAccesorioForm: FormGroup;
  datosAccesorioFormEscritorio: FormGroup;
  datosMouseForm: FormGroup;
  datosTecladoForm: FormGroup;
  datosMonitor: FormGroup;
  ifLaptop = true;
  ifEscritorio = true;
  ifMouseN = true;
  ifMouseS = true;
  ifTecladoN = true;
  ifTecladoS = true;
  Softwares: any[];
  softSO: any[];
  softOf: any[];
  softExtra: any[];
  aux: any;
  tiposEquipos: any[];
  tiposProcesadorBits: any[];
  opciones: any[] = [
    'Nuevo'
  ];
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
    lugar_compra: '',
    tamaño_pantalla: '',
    tipo_disco_duro: '',
    factura: null,
    direccion_mac_wifi: '',
  };
  public dequipo: DEquipos;
  public Eliminador: Accesorios;
  
  public mouse: Accesorios;
  public teclado: Accesorios;
  AccesoriosPc: Accesorios[];
  ifNumero = false;
  ifLongitud = false;
  ifFechaCorrecta = false;

  public software: Software = {
    vigencia_final: '',
    version: '',
    factura: null,
    tipo_licencia: '',
    tipo_software: '',
    vigencia_inicial: '',
    no_serie: '',
    nombre_software: '',
    id_software: '',
  };

  public equipoSoftware: EquipoSoftware = {
    id_equipo: null,
    id_software: null,
    id_historico: null,
  };
  public tiposDiscos: any[];
  idHistorico = '';
  listaHistorico: any[];
  constructor(
    private router: Router,
    protected servicioConUser: ServiciosService,
    private dataSvc: DataService,
    private dataSvcAcce: DataService,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private toastr: ToastrService
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
      nombre_SO: [null, Validators.required],
      tipo_SO: ['', Validators.required],
      mac: ['', Validators.required],
      correo: ['', Validators.required],
      fecha_compra: ['', Validators.required],
      fecha_garantia: ['', Validators.required],
      generacion_procesador: ['', Validators.required],
      lugar_compra: ['', Validators.required],
      tamaño_pantalla: ['', Validators.required],
      tipo_disco_duro: ['', Validators.required],
      direccion_mac_w: ['', Validators.required],
    });
    this.datosAccesorioForm = this.formBuilder.group({
      marcaA: ['', Validators.required],
      modeloA: ['', Validators.required],
      productoA: ['', Validators.required],
      hechoEnA: ['', Validators.required],
      numeroSerieA: ['', Validators.required],
      costo: ['', Validators.required],
      descripcionA: ['', Validators.required],
    });
    this.datosAccesorioFormEscritorio = this.formBuilder.group({
      checkMouse:  ['', Validators.required],
      checkTeclado:  ['', Validators.required],
      checkMonitorIn:  ['', Validators.required],
      checkMonitor:  ['', Validators.required],
    });
    this.datosMouseForm = this.formBuilder.group({
      marcaA: ['', Validators.required],
      modeloA: ['', Validators.required],
      productoA: ['', Validators.required],
      hechoEnA: ['', Validators.required],
      numeroSerieA: ['', Validators.required],
      costo: ['', Validators.required],
      descripcionA: ['', Validators.required],
    });
    this.datosTecladoForm = this.formBuilder.group({
      marcaAT: ['', Validators.required],
      modeloAT: ['', Validators.required],
      productoAT: ['', Validators.required],
      hechoEnAT: ['', Validators.required],
      numeroSerieAT: ['', Validators.required],
      costo: ['', Validators.required],
      descripcionAT: ['', Validators.required],
    });
  }

  usuarioLogeado() {
    datosUser = usuarioRol;
    const token = this.servicioConUser.getToken();
    if ( token.length === 0) {
      console.log('error en el acceso');
      this.router.navigate(['Login']);
    } else {
      console.log('acceso correcto');
      this.getSoftware();
    }
  }
  operacionesEquipos(idEquipo?: string) {
    datosEquipo = EquipoAE;
    if (datosEquipo.operacion === 'editar') {
      console.log('soy editar');
      this.dataSvc.getEquipo(datosEquipo.idEquipo).subscribe(
        responseE => {
          this.equipo = responseE.body;
//          console.log(this.equipo);
          this.equipo.cuenta_usuario_contraseña = responseE.body.cuenta_usuario_contraseña;
          console.log(this.equipo);
        },
        errorE => {
          console.log(errorE);
          this.mensaje500();
        }
      );
    } else if (datosEquipo.idEquipo === 'mostrar') {
      console.log('soy mostrar');
    }

  }
  guardarDatos() {
    this.AccesoriosPc = [];
    const date = new Date();
    this.listaHistorico = [];
    this.Eliminador = null;

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
    const lugarCompra = this.datosEquipoForm.controls.lugar_compra.value;
    const fechaCompra = this.datepipe.transform(this.datosEquipoForm.controls.fecha_compra.value, 'yyyy-MM-dd');
    const fechaGarantia = this.datepipe.transform(this.datosEquipoForm.controls.fecha_garantia.value, 'yyyy-MM-dd');
    const tipoDD = this.datosEquipoForm.controls.tipo_disco_duro.value;
    const tamañoPantalla = this.datosEquipoForm.controls.tamaño_pantalla.value;
    const generacionProcesador = this.datosEquipoForm.controls.generacion_procesador.value;
    const idSoftware = SO.id_software;
    const macWifi = this.datosEquipoForm.controls.direccion_mac_w.value;
    const regExp    = new RegExp( /^\d{0,2}$/ );
    let datosHistorico: any;
    if (regExp.test(ramE) === false) {
      this.ifNumero = true;
      console.log(this.ifNumero, this.ifLongitud);
    } else if (regExp.test(ramE) === true && ramE.length >= 3) {
      this.ifLongitud = true;
      console.log(this.ifNumero, this.ifLongitud);
    } else if (regExp.test(ramE) === true && ramE.length < 3) {
      this.ifLongitud = false;
      this.ifNumero = false;
    }
    console.log(this.datepipe.transform(date, 'yyyy-MM-dd'));
    if (fecha > this.datepipe.transform(date, 'yyyy-MM-dd')) {
      console.log('fecha errornea');
      this.ifFechaCorrecta = false;
      this.fechaIncorrecta();
    } else {
      this.ifFechaCorrecta = true;
    }
    if (nombre !== '' && modeloE !== '' && modeloCMD !== '' && numSerie !== '' && numSerieCMD !== '' && procesadorE !== ''
      && (ramE !== '' && ramE !== 0 ) && disco !== '' && cuenta !== '' && cuenta !== '' && tipoEquipo !== ''
      && fecha !== '' && SO !== null && vSO !== '' && mac !== '' && tipoDD !== '' && macWifi !== '' &&
      this.ifFechaCorrecta === true) {
        if (this.aux === undefined) {
          this.aux = null;
        } else {
          this.aux = btoa(this.aux);
        }
        if (regExp.test(ramE) === false) {
          this.ifNumero = true;
          console.log(this.ifNumero, this.ifLongitud);
        } else if (regExp.test(ramE) === true && ramE.length >= 3) {
          this.ifLongitud = true;
          console.log(this.ifNumero, this.ifLongitud);
        } else if (regExp.test(ramE) === true && ramE.length < 3) {
          this.ifLongitud = false;
          this.ifNumero = false;
          console.log(this.ifNumero, this.ifLongitud);
          console.log('Datos correctos');
          this.equipo = {
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
          nombre_sistema_operativo: SO.nombre_software + ' ' + SO.version,
          tipo_sistema_operativo: vSO,
          direccion_mac: mac,
          email_gnp: correo,
          fecha_compra: fechaCompra,
          fecha_garantia_termino: fechaGarantia,
          generacion_procesador: generacionProcesador,
          lugar_compra: lugarCompra,
          tamaño_pantalla: tamañoPantalla,
          tipo_disco_duro: tipoDD,
          factura: this.aux,
          direccion_mac_wifi: macWifi,
        };
          this.software = {
          factura: SO.factura,
          tipo_licencia: SO.tipo_licencia,
          tipo_software: SO.tipo_software,
          version: SO.version,
          vigencia_final: SO.vigencia_final,
          vigencia_inicial: SO.vigencia_inicial,
          id_software: SO.id_software,
          no_serie: SO.no_serie,
          nombre_software: SO.nombre_software,
        };
          console.log(this.software);

          if ( this.ifLaptop === false ) {
          const marcaAc = this.datosAccesorioForm.controls.marcaA.value;
          const modeloAc = this.datosAccesorioForm.controls.modeloA.value;
          const hechoEnAc = this.datosAccesorioForm.controls.hechoEnA.value;
          const numeroSerieAc = this.datosAccesorioForm.controls.numeroSerieA.value;
          const descripcionAc = this.datosAccesorioForm.controls.descripcionA.value;
          const costoAc =  this.datosAccesorioForm.controls.costo.value;
          if (marcaAc !== '' && modeloAc !== '' && hechoEnAc !== '' && numeroSerieAc !== '') {
            this.Eliminador = {
              id_accesorio: '',
              nombre_accesorio: '',
              marca: marcaAc,
              modelo: modeloAc,
              producto: 'ELIMINADOR DE CORRIENTE',
              hecho_en: hechoEnAc,
              serie: numeroSerieAc,
              id_estatus: null,
              id_equipo: 0,
              costo: costoAc,
              descripcion: descripcionAc,
              capacidad: null,
              ram_bus: null,
              ram_ranura: null,
              tipo_disco_duro: null,
            };
          } else {
            this.mensajeDatosVaciosAccesorio();
          }
        }
          if (this.ifEscritorio === false ) {
          const marcaAcM = this.datosMouseForm.controls.marcaA.value;
          const modeloAcM = this.datosMouseForm.controls.modeloA.value;
          const productoAcM = this.datosMouseForm.controls.productoA.value;
          const hechoEnAcM = this.datosMouseForm.controls.hechoEnA.value;
          const numeroSerieAcM = this.datosMouseForm.controls.numeroSerieA.value;
          const descripcionAcM = this.datosMouseForm.controls.descripcionA.value;
          const costoM = this.datosMouseForm.controls.costo.value;
          const marcaAcT = this.datosTecladoForm.controls.marcaAT.value;
          const modeloAcT = this.datosTecladoForm.controls.modeloAT.value;
          const productoAcT = this.datosTecladoForm.controls.productoAT.value;
          const hechoEnAcT = this.datosTecladoForm.controls.hechoEnAT.value;
          const numeroSerieAcT = this.datosTecladoForm.controls.numeroSerieAT.value;
          const costoT = this.datosTecladoForm.controls.costo.value;
          const descripcionAcT = this.datosTecladoForm.controls.descripcionAT.value;
          if (marcaAcM !== '' && modeloAcM !== '' && hechoEnAcM !== '' && numeroSerieAcM !== '') {
            this.mouse = {
              id_accesorio: '',
              nombre_accesorio: '',
              marca: marcaAcM,
              modelo: modeloAcM,
              producto: 'Mouse',
              hecho_en: hechoEnAcM,
              serie: numeroSerieAcM,
              id_estatus: null,
              id_equipo: 0,
              costo: costoM,
              descripcion: descripcionAcM,
              capacidad: null,
              ram_bus: null,
              ram_ranura: null,
              tipo_disco_duro: null,
            };
          } else {
            this.mensajeDatosVaciosAccesorio();
          }
          if (marcaAcT !== '' && modeloAcT !== '' && hechoEnAcT !== '' && numeroSerieAcT !== '') {
            this.teclado = {
              id_accesorio: '',
              nombre_accesorio: '',
              marca: marcaAcT,
              modelo: modeloAcT,
              producto: 'Teclado',
              hecho_en: hechoEnAcT,
              serie: numeroSerieAcT,
              id_estatus: null,
              id_equipo: 0,
              costo: costoT,
              descripcion: descripcionAcT,
              capacidad: null,
              ram_bus: null,
              ram_ranura: null,
              tipo_disco_duro: null,
            };
          } else {
            this.mensajeDatosVaciosAccesorio();
          }

        }
          this.dataSvc.crearEquipo(this.equipo).subscribe(
          responseCE => {
            console.log(responseCE.status);
            if (responseCE.status === 200) {
              console.log('Registro Correcto');
              console.log(this.equipo);
              this.dequipo = {
                id_dequipo: '',
                disco_duro_solido: '0',
                fecha_actualizacion_estatus: date,
                id_equipo: 0,
                id_estatus: 0,
              };
              if ( this.ifLaptop === false ) {
                this.Eliminador.id_equipo = responseCE.body.id_equipo;
                this.dataSvc.crearAccesorio(this.Eliminador, idEstatusAsignado ).subscribe(
                  responseAc => {
                    if (responseAc.status === 200) {
                      console.log('codigo 200');
                    }
                  },
                  errorAc => {
                    if (errorAc === 500) {
                      console.log('codigo 500');
                    }
                  }
                );
              }
              if (this.ifEscritorio  === false ) {
                this.mouse.id_equipo = responseCE.body.id_equipo;
                this.teclado.id_equipo = responseCE.body.id_equipo;
                this.dataSvc.crearAccesorio(this.mouse, idEstatusAsignado).subscribe(
                  responseAcM => {
                    if (responseAcM.status === 200) {
                      console.log('codigo 200', responseAcM.id_accesorio);
                      this.dataSvcAcce.crearAccesorio(this.teclado, idEstatusAsignado).subscribe(
                        responseAcT => {
                          if (responseAcT.status === 200) {
                            console.log('codigo 200 -2', responseAcT.id_accesorio);
                          }
                        },
                        errorAcT => {
                          if (errorAcT === 500) {
                            console.log('codigo 500 AccePC 2' );
                          }
                        }
                      );
                    }
                  },
                  errorAcM => {
                    if (errorAcM === 500) {
                      console.log('codigo 500 AccePC' );
                    }
                  }
                );
              }
              this.dataSvc.crearDEquipo(this.dequipo, responseCE.body.id_equipo).subscribe(
                responseDE => {
                  if (responseDE.status === 200) {
                    console.log('Registro completo');
                    this.mensaje200Nuevo();
                    setTimeout( () => {this.router.navigate(['IndexEquipo']); }, 3000 );
                  }
                },
                errorDE => {
                  console.log('Error en el estatus del equipo');
                  this.mensaje500();
                }
              );
              this.equipoSoftware = {
                id_equipo: responseCE.body,
                id_software: idSoftware,
                id_historico: datosHistorico,
              };
              console.log(responseCE.body.id_equipo, idSoftware, this.equipoSoftware, Number(this.idHistorico));
              console.log(datosHistorico);
              this.dataSvc.getAllHistorico().subscribe(
                responseH => {
                  this.listaHistorico = responseH.body;
                  datosHistorico = this.listaHistorico.pop();
                  this.idHistorico = datosHistorico.id_historico;
                  console.log(datosHistorico);
                  console.log(this.idHistorico);
                  this.equipoSoftware = {
                    id_equipo: responseCE.body,
                    id_software: idSoftware,
                    id_historico: datosHistorico,
                  };
                  this.dataSvc.crearEquipoSoftware(responseCE.body.id_equipo, idSoftware, this.equipoSoftware, Number(this.idHistorico)).subscribe(
                    responseES => {
                      if (responseES.status === 200 ) {
                        console.log('codigo 200');
                      } else {
                        console.log('error respuesta', responseES);
                      }
                    },
                    errorES => {
                      if (errorES.status === 500) {
                        console.log(500);
                      } else {
                        console.log('error', errorES);
                      }
                    }
                  );
                }
              );
             /*  this.dataSvc.crearEquipoSoftware(responseCE.body.id_equipo, idSoftware, this.equipoSoftware, Number(this.idHistorico)).subscribe(
                responseES => {
                  if (responseES.status === 200 ) {
                    console.log('codigo 200');
                  } else {
                    console.log('error respuesta', responseES);
                  }
                },
                errorES => {
                  if (errorES.status === 500) {
                    console.log(500);
                  } else {
                    console.log('error', errorES);
                  }
                }
              ); */
            }
          },
          errorCE => {
            console.log('Error en el registro', errorCE);
            this.mensaje500();
          }
        );
      }
    } else {
      console.log('Datos imcompletos');
      this.mensajeDatosVacios();
    }

  }

  cancelar() {
    console.log('cancelar');
    this.datosEquipoForm.controls.nombre_equipo.reset();
    this.datosEquipoForm.controls.marca.reset();
    this.datosEquipoForm.controls.modelo.reset();
    this.datosEquipoForm.controls.modelo_cmd.reset();
    this.datosEquipoForm.controls.numero_serie.reset();
    this.datosEquipoForm.controls.serie_cmd.reset();
    this.datosEquipoForm.controls.procesador.reset();
    this.datosEquipoForm.controls.ram.reset();
    this.datosEquipoForm.controls.disco_duro.reset();
    this.datosEquipoForm.controls.cuenta.reset();
    this.datosEquipoForm.controls.cuenta_pass.reset();
    this.datosEquipoForm.controls.tipo_equipo.reset();
    this.datosEquipoForm.controls.fecha_fabrica.reset();
    this.datosEquipoForm.controls.nombre_SO.reset();
    this.datosEquipoForm.controls.tipo_SO.reset();
    this.datosEquipoForm.controls.mac.reset();
    this.datosEquipoForm.controls.correo.reset();
    this.router.navigate(['IndexEquipo']);
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
  getSoftware() {
    this.dataSvc.getAllSoftware().subscribe(
      responseGS => {
        if (responseGS.status === 200) {
          this.Softwares = responseGS.body;
          this.softSO = this.Softwares.filter(so => so.nombre_software.toLowerCase().includes('windows') === true
          || so.nombre_software.toLowerCase().includes('mac os') === true);
          this.softOf = this.Softwares.filter(so => so.nombre_software.toLowerCase().includes('office') === true);
          this.softExtra = this.Softwares.filter(so => so.nombre_software.toLowerCase().includes('office') === false
           || so.nombre_software.toLowerCase().includes('mac os') === false
           || so.nombre_software.toLowerCase().includes('office') === false );
        } else {
          this.mensaje500();
        }
      },
      errorSG => {
        this.mensaje500();
      }
    );
  }
  mensaje200Nuevo() {
    this.toastr.success('Se registro el nuevo equipo', 'Registro Correcto');
  }
  mensaje204Nuevo() {
    this.toastr.error('No se registro el nuevo equipo', 'Error en el registro');
  }
  mensaje500() {
    this.toastr.error('Intentar más tarde', 'Error del Servidor ');
  }
  mensajeDatosVacios() {
    this.toastr.warning('Llene los campos que tienen un (*)', 'Datos incompletos');
  }
  mensajeDatosVaciosAccesorio() {
    this.toastr.warning('Llene los campos que tienen un (*)', 'Datos incompletos del Eliminador');
  }
  fechaIncorrecta() {
    this.toastr.error('La fecha no debe ser un dia \n mayor a la  fecha actual', 'Error en la fecha de fabricación');
  }
  tipoComputadora(tipo: any) {
    const tipoCompu = tipo;
    if (tipoCompu === tipoLaptop) {
      this.ifLaptop = false;
      this.ifEscritorio = true;
    } else if (tipoCompu === tipoEscritorio) {
      this.ifEscritorio = false;
      this.ifLaptop = true;
    } else if (tipoCompu === tipoServidor) {
      this.ifLaptop = true;
      this.ifEscritorio = true;
    }
  }
  tipoMouse(tipo: any) {
    console.log(tipo);
    const tipoM = tipo;
    if (tipoM === this.opciones[0]) {
      this.ifMouseN = false;
      this.ifMouseS = true;
    } else if (tipoM === this.opciones[1]) {
      this.ifMouseN = true;
      this.ifMouseS = false;
    }
  }
  tipoTeclado(tipo: any) {
    console.log(tipo);
    const tipoM = tipo;
    if (tipoM === this.opciones[0]) {
      this.ifTecladoN = false;
      this.ifTecladoS = true;
    } else if (tipoM === this.opciones[1]) {
      this.ifTecladoN = true;
      this.ifTecladoS = false;
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
        // console.log(this.aux);
    };
    // funcion para recuperar los datos en blob de la bd y muestra una vista previa
/*     this.dataSvc.getEquipo('244').subscribe(
      response => {
        const aux2 = atob(response.body.factura);
        console.log(aux2);
        const partes = aux2.split(",");
        console.log(partes);
        const byteArray = new Uint8Array(atob(partes[1]).split('').map(char => char.charCodeAt(0)));
        let archivo = new Blob([byteArray], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(archivo);
        // i.e. display the PDF content via iframe
        document.querySelector("iframe").src = url;
      },
      error => {

      }
    ); */
// funcion para recuperar los datos en base64 de la bd sin vista previa
    /* this.dataSvc.getEquipo('244').subscribe(
      response => {

        const datosFile = response.body.factura;
        console.log(datosFile);
        const downloadLink = document.createElement('a');
        const fileName = 'factura_' + response.body.numero_serie_cmd + '.pdf';
        downloadLink.href = datosFile;
        downloadLink.download = fileName;
        downloadLink.click();
      },
      error => {

      }
    ); */
  }

}
