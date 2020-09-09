import { Component, OnInit } from '@angular/core';
import { usuarioRol, RolesUser } from '../login/login.component';
import { Router} from '@angular/router';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { DatosEquipo, EquipoAE } from '../index-equipos/index-equipos.component';
import { DataService } from '../list/data.service';
import { Equipos } from '../../Models/equipos/equipos.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  selector: 'app-editar-equipos',
  templateUrl: './editar-equipos.component.html',
  styleUrls: ['./editar-equipos.component.scss']
})
export class EditarEquiposComponent implements OnInit {

  datosEquipoForm: FormGroup;

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
    cuenta_usuario_contrasena: '',
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
    cuenta_usuario_contrasena: '',
    tipo_computadora: '',
    fecha_fabricacion: '',
    nombre_sistema_operativo: '',
    tipo_sistema_operativo: '',
    direccion_mac: '',
    email_gnp: ''
  };
  constructor(
    private router: Router,
    protected servicioConUser: ServiciosService,
    private dataSvc: DataService,
    private formBuilder: FormBuilder,
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
    if (datosEquipo.operacion === 'editar') {
      console.log('soy editar');
      this.dataSvc.getEquipo(datosEquipo.idEquipo).subscribe(
        response => {
          this.equipo = response.body;
          this.equipo.cuenta_usuario_contrasena = response.body.cuenta_usuario_contraseña;
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
          this.datosEquipoForm.controls.cuenta_pass.setValue(this.equipo.cuenta_usuario_contrasena);
          this.datosEquipoForm.controls.tipo_equipo.setValue(this.equipo.tipo_computadora);
          this.datosEquipoForm.controls.fecha_fabrica.setValue(this.equipo.fecha_fabricacion);
          this.datosEquipoForm.controls.nombre_SO.setValue(this.equipo.nombre_sistema_operativo);
          this.datosEquipoForm.controls.tipo_SO.setValue(this.equipo.tipo_sistema_operativo);
          this.datosEquipoForm.controls.mac.setValue(this.equipo.direccion_mac);
          this.datosEquipoForm.controls.correo.setValue(this.equipo.email_gnp);
        },
        error => {
          console.log(error);
        }
      );
    } else if (datosEquipo.idEquipo === 'mostrar') {
      console.log('soy mostrar');
    }

  }

  guardarDatos() {
    console.log('guardar');
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
    const fecha = this.datosEquipoForm.controls.fecha_fabrica.value;
    const SO = this.datosEquipoForm.controls.nombre_SO.value;
    const vSO = this.datosEquipoForm.controls.tipo_SO.value;
    const mac = this.datosEquipoForm.controls.mac.value;
    const correo = this.datosEquipoForm.controls.correo.value;
    if (nombre !== null && modeloE !== null && modeloCMD !== null && numSerie !== null && numSerieCMD !== null && procesadorE !== null
      && ramE !== null && disco !== null && cuenta !== null && cuenta !== null && cuentaPass !== null && tipoEquipo !== null
      && fecha !== null && SO !== null && vSO !== null && mac !== null) {
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
          cuenta_usuario_contrasena: cuentaPass,
          tipo_computadora: tipoEquipo,
          fecha_fabricacion: fecha,
          nombre_sistema_operativo: SO,
          tipo_sistema_operativo: vSO,
          direccion_mac: mac,
          email_gnp: correo
        };
        console.log(this.equipoReq);
        this.dataSvc.updateEquipo(this.equipoReq).subscribe(
          response => {
            console.log(response.status);
            if (response.status === 200) {
              console.log('Actualizacion Correcta');
            }
          },
          error => {
            console.log('Error en la actualizacion', error);
          }
        );
    } else {
      console.log('Datos imcompletos');
    }

  }
  cancelar() {
    this.dataSvc.getEquipo(datosEquipo.idEquipo).subscribe(
      response => {
        this.equipo = response.body;
        this.equipo.cuenta_usuario_contrasena = response.body.cuenta_usuario_contraseña;
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
        this.datosEquipoForm.controls.cuenta_pass.setValue(this.equipo.cuenta_usuario_contrasena);
        this.datosEquipoForm.controls.tipo_equipo.setValue(this.equipo.tipo_computadora);
        this.datosEquipoForm.controls.fecha_fabrica.setValue(this.equipo.fecha_fabricacion);
        this.datosEquipoForm.controls.nombre_SO.setValue(this.equipo.nombre_sistema_operativo);
        this.datosEquipoForm.controls.tipo_SO.setValue(this.equipo.tipo_sistema_operativo);
        this.datosEquipoForm.controls.mac.setValue(this.equipo.direccion_mac);
        this.datosEquipoForm.controls.correo.setValue(this.equipo.email_gnp);
      },
      error => {
        console.log(error);
      }
    );
    console.log('cancelar');
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

}
