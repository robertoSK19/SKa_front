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

const estatusAsignado = 1;

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
    email_gnp: ''
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
      estatus: ['', Validators.required]
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
          console.log(response)
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
    } else if (datosEquipo.operacion === 'mostrar') {
      console.log('soy mostrar');
      this.ifMostrar = false;
      this.ifEditar = true;
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
          console.log(response)
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
    const fechaActual = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
   /* console.log(this.datosEquipoForm.controls.nombre_equipo.value);
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
    console.log(this.datosEquipoForm.controls.fecha_fabrica.value);
    console.log(this.datosEquipoForm.controls.nombre_SO.value);
    console.log(this.datosEquipoForm.controls.tipo_SO.value);
    console.log(this.datosEquipoForm.controls.mac.value);
    console.log(this.datosEquipoForm.controls.correo.value);*/

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
    //const fecha = this.datosEquipoForm.controls.fecha_fabrica.value;
    const fecha = this.datepipe.transform(this.datosEquipoForm.controls.fecha_fabrica.value, 'yyyy-MM-dd');
    const SO = this.datosEquipoForm.controls.nombre_SO.value;
    const vSO = this.datosEquipoForm.controls.tipo_SO.value;
    const mac = this.datosEquipoForm.controls.mac.value;
    const correo = this.datosEquipoForm.controls.correo.value;
    const estatus = this.datosEquipoForm.controls.estatus.value;
    if (fecha > this.datepipe.transform(new Date(), 'yyyy-MM-dd')) {
      console.log('fecha errornea');
      this.ifFechaCorrecta = false;
      this.fechaIncorrecta();
    } else {
      this.ifFechaCorrecta = true;
    }
    if (nombre !== null && modeloE !== null && modeloCMD !== null && numSerie !== null && numSerieCMD !== null && procesadorE !== null
      && nombre !== '' && modeloE !== '' && modeloCMD !== '' && numSerie !== '' && numSerieCMD !== '' && procesadorE !== ''
      && ramE !== null && disco !== null && cuenta !== null && tipoEquipo !== null
      && ramE !== '' && disco !== '' && cuenta !== '' && tipoEquipo !== ''
      && fecha !== null && SO !== null && vSO !== null && mac !== null
      && fecha !== '' && SO !== '' && vSO !== '' && mac !== '' && this.ifFechaCorrecta === true) {
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
          nombre_sistema_operativo: SO,
          tipo_sistema_operativo: vSO,
          direccion_mac: mac,
          email_gnp: correo
        };
        this.datosDEquipoReq = {
          disco_duro_solido: this.datosDEquipo.disco_duro_solido,
          fecha_actualizacion_estatus: new Date(),
          id_dequipo: this.datosDEquipo.id_dequipo,
          id_equipo: this.datosDEquipo.id_equipo,
          id_estatus: this.datosDEquipo.id_estatus,
          comentarios: this.datosDEquipo.comentarios,
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
        console.log('error datos del DEquipo')
      }
    );
    this.dataSvc.getEquipo(datosEquipo.idEquipo).subscribe(
      response => {
        this.equipo = response.body;
        // this.equipo.cuenta_usuario_contrasena = response.body.cuenta_usuario_contraseña;
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
}
