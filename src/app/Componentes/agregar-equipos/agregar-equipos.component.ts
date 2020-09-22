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

const tipoLaptop = 'LAPTOP';
const tipoEscritorio = 'ESCRITORIO';
const idEstatusAsignado = 1;
let datosUser: RolesUser = {
  rol: '',
  nombre: '',
  id_user: '',
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

  tiposEquipos: any[] = [
    { nombre: 'LAPTOP'},
    { nombre: 'ESCRITORIO'}
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
    email_gnp: ''
  };
  public dequipo: DEquipos;
  public Eliminador: Accesorios;
  ifNumero = false;
  ifLongitud = false;
  ifFechaCorrecta = false;

  constructor(
    private router: Router,
    protected servicioConUser: ServiciosService,
    private dataSvc: DataService,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private toastr: ToastrService
  ) { }
  ngOnInit() {
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
      correo: ['', Validators.required]
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
    }
  }
  operacionesEquipos(idEquipo?: string) {
    datosEquipo = EquipoAE;
    if (datosEquipo.operacion === 'editar') {
      console.log('soy editar');
      this.dataSvc.getEquipo(datosEquipo.idEquipo).subscribe(
        response => {
          this.equipo = response.body;
//          console.log(this.equipo);
          this.equipo.cuenta_usuario_contraseña = response.body.cuenta_usuario_contraseña;
          console.log(this.equipo);
        },
        error => {
          console.log(error);
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
    const regExp    = new RegExp( /[0-9]{1}[0-9]{1}/ );
    console.log(this.datepipe.transform(date, 'yyyy-MM-dd'));
    if (fecha > this.datepipe.transform(date, 'yyyy-MM-dd')){
      console.log('fecha errornea');
      this.ifFechaCorrecta = false;
      this.fechaIncorrecta();
    } else {
      this.ifFechaCorrecta = true;
    }
    if (nombre !== '' && modeloE !== '' && modeloCMD !== '' && numSerie !== '' && numSerieCMD !== '' && procesadorE !== ''
      && (ramE !== '' && ramE !== 0 )&& disco !== '' && cuenta !== '' && cuenta !== '' && tipoEquipo !== ''
      && fecha !== '' && SO !== '' && vSO !== '' && mac !== '' && this.ifFechaCorrecta === true) {
        console.log(ramE.length)
        if (regExp.test(ramE) === false) {
          this.ifNumero = true;
        } else if (regExp.test(ramE) === true && ramE.length >= 3) {
          this.ifLongitud = true;
        } else if (regExp.test(ramE) === true && ramE.length < 3) {
          this.ifLongitud = false;
          this.ifNumero = false;

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
          nombre_sistema_operativo: SO,
          tipo_sistema_operativo: vSO,
          direccion_mac: mac,
          email_gnp: correo
        };
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
              id_equipo: 0
            };
          } else {
            this.mensajeDatosVaciosAccesorio();
          }
        }
        this.dataSvc.crearEquipo(this.equipo).subscribe(
          response => {
            console.log(response.status);
            if (response.status === 200) {
              console.log('Registro Correcto');
              console.log(this.equipo);
              this.dequipo = {
                id_dequipo: '',
                disco_duro_solido: '0',
                fecha_actualizacion_estatus: date,
                id_equipo: 0,
                id_estatus: 0
              };
              if ( this.ifLaptop === false ) {
                this.Eliminador.id_equipo = response.body.id_equipo;
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
              this.dataSvc.crearDEquipo(this.dequipo, response.body.id_equipo).subscribe(
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
            }
          },
          error => {
            console.log('Error en el registro', error);
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
    this.toastr.warning('Llene los campos con (*)', 'Datos incompletos');
  }
  mensajeDatosVaciosAccesorio() {
    this.toastr.warning('Llene los campos con (*)', 'Datos incompletos del Eliminador');
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
    }
  }
}
