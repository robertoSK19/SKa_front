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
  ifLaptop = true;
  Softwares: any[];
  softSO: any[];
  softOf: any[];
  softExtra: any[];

  tiposEquipos: any[];
  tiposProcesadorBits: any[];

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
    tipo_disco_duro: ''
  };
  public dequipo: DEquipos;
  public Eliminador: Accesorios;
  ifNumero = false;
  ifLongitud = false;
  ifFechaCorrecta = false;

  public software: Software = {
    fecha_licencia: '',
    no_serie: '',
    nombre_software: '',
    id_software: '',
  };

  public equipoSoftware: EquipoSoftware = {
    id_equipo: null,
    id_software: null,
  };
  public tiposDiscos: any[];
  constructor(
    private router: Router,
    protected servicioConUser: ServiciosService,
    private dataSvc: DataService,
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
    });
    this.datosAccesorioForm = this.formBuilder.group({
      marcaA: ['', Validators.required],
      modeloA: ['', Validators.required],
      productoA: ['', Validators.required],
      hechoEnA: ['', Validators.required],
      numeroSerieA: ['', Validators.required]
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
   /* console.log('guardar');
    console.log(this.datosEquipoForm.controls.nombre_equipo.value);
    console.log(this.datosEquipoForm.controls.modelo.value);
    console.log(this.datosEquipoForm.controls.modelo_cmd.value);
    console.log(this.datosEquipoForm.controls.numero_serie.value);
    console.log(this.datosEquipoForm.controls.serie_cmd.value);
    console.log(this.datosEquipoForm.controls.procesador.value);
    console.log(this.datosEquipoForm.controls.ram.value);
    console.log(this.datosEquipoForm.controls.disco_duro.value);
    console.log(this.datosEquipoForm.controls.cuenta.value);
    console.log(this.datosEquipoForm.controls.cuenta_pass.value);
    console.log(this.datosEquipoForm.controls.tipo_equipo.value);
    console.log(this.datepipe.transform(this.datosEquipoForm.controls.fecha_fabrica.value, 'yyyy-MM-dd'));
    console.log(this.datosEquipoForm.controls.nombre_SO.value);
    console.log(this.datosEquipoForm.controls.tipo_SO.value);
    console.log(this.datosEquipoForm.controls.mac.value);
    console.log(this.datosEquipoForm.controls.correo.value);
*/
    const date = new Date();

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
    const regExp    = new RegExp( /^\d{0,2}$/ );
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
      && fecha !== '' && SO !== null && vSO !== '' && mac !== '' && tipoDD !== '' && generacionProcesador !== '' &&
      fechaCompra !== '' &&  lugarCompra !== this.ifFechaCorrecta === true) {
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
          nombre_sistema_operativo: SO.nombre_software,
          tipo_sistema_operativo: vSO,
          direccion_mac: mac,
          email_gnp: correo,
          fecha_compra: fechaCompra,
          fecha_garantia_termino: fechaGarantia,
          generacion_procesador: generacionProcesador,
          lugar_compra: lugarCompra,
          tamaño_pantalla: tamañoPantalla,
          tipo_disco_duro: tipoDD,
        };
          this.software = {
          fecha_licencia: SO.fecha_licencia,
          id_software: SO.id_software,
          no_serie: SO.no_serie,
          nombre_software: SO.nombre_software,
        };
          console.log(this.software);

          if ( this.ifLaptop === false ) {
          const marcaAc = this.datosAccesorioForm.controls.marcaA.value;
          const modeloAc = this.datosAccesorioForm.controls.modeloA.value;
          const productoAc = this.datosAccesorioForm.controls.productoA.value;
          const hechoEnAc = this.datosAccesorioForm.controls.hechoEnA.value;
          const numeroSerieAc = this.datosAccesorioForm.controls.numeroSerieA.value;
          if (marcaAc !== '' && modeloAc !== '' && productoAc !== '' && hechoEnAc !== '' && numeroSerieAc !== '') {
            this.Eliminador = {
              id_accesorio: '',
              nombre_accesorio: 'ELIMINADOR DE CORRIENTE',
              marca: marcaAc,
              modelo: modeloAc,
              producto: productoAc,
              hecho_en: hechoEnAc,
              serie: numeroSerieAc,
              id_estatus: 0,
              id_equipo: 0,
              costo: 0
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
                id_software: this.software
              };
              this.dataSvc.crearEquipoSoftware(responseCE.body.id_equipo, idSoftware, this.equipoSoftware).subscribe(
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
    } else if (tipoCompu === tipoEscritorio) {
      this.ifLaptop = true;
    } else if (tipoCompu === tipoServidor) {
      this.ifLaptop = true;
    }
  }
}
