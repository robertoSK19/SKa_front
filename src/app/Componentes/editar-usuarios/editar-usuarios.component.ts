import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Edicion, usuarioC } from 'src/app/Constantes/constante';
import { Usuario } from 'src/app/Models/usuario/usuario.interface';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { DatosUsuario, idUsuario } from '../index-usuarios/index-usuarios.component';
import { RolesUser, usuarioRol } from '../login/login.component';
import { ModalCancelarRegitrosComponent } from '../modal-cancelar-regitros/modal-cancelar-regitros.component';

let datosUsuario: DatosUsuario;
let datosUser: RolesUser = {
  rol: '',
  nombre: '',
  id: 0,
};
let token = '';

@Component({
  selector: 'app-editar-usuarios',
  templateUrl: './editar-usuarios.component.html',
  styleUrls: ['./editar-usuarios.component.scss']
})

export class EditarUsuariosComponent implements OnInit {

  usuario: any;
  datosUsuarioForm: FormGroup;
  roles: any[];
  rolUser: any;

  constructor(
    private router: Router,
    protected servicioConUser: ServiciosService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.datosUsuarioForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidoP: ['', Validators.required],
      apellidoM: ['', Validators.required],
      correo: ['', Validators.required],
      contraseña: ['', Validators.required],
      rol: ['', Validators.required]
    });
    this.usuarioLogeado();
  }

  usuarioLogeado() {
    datosUser = usuarioRol;
    console.log(datosUser);
    datosUsuario = idUsuario;
    token = this.servicioConUser.getToken();
    const cookieN64 = window.atob(unescape(encodeURIComponent(token)));
    datosUser = JSON.parse(cookieN64);
    if (datosUser.rol === 'Admin') {
      // token = this.servicioConUser.getToken();
      if (token.length !== 0 && datosUsuario.idUser !== '') {
        console.log('acceso correcto');
        this.cargaDatosUsuario();
        this.getRoles();
      } else {
        console.log('error en el acceso');
        this.router.navigate(['IndexUsuario']);
      }
    } else if (datosUser.rol !== 'Admin') {
      this.router.navigate(['Principal']);
    }
  }

  cargaDatosUsuario() {
    this.servicioConUser.getUsuario(Number (datosUsuario.idUser), token).subscribe(
      response => {
        if (response.status === 200) {
          this.usuario = response.body;
          this.llenaFormulario();
        } else if (response.status === 204) {
          this.mensajeErroConsulta();
          setTimeout( () => {this.router.navigate(['AgregarUsuario']); }, 1000 );
        }
      },
      error => {
        if (error.status === 500 ) {
          this.mensaje500();
        } else {
          this.mensajeErrorConsulta2();
          setTimeout( () => {this.router.navigate(['AgregarUsuario']); }, 1000 );
        }
      }
    );
  }
  getRoles() {
    this.servicioConUser.getRoles(token).subscribe(
      response => {
        if (response.status === 200) {
          this.roles = response.body;
        } else {
          this.mensajeErrorConsulta2();
        }
      },
      error => {
        if (error.status === 500 ) {
          this.mensaje500();
        } else {
          this.mensajeErrorConsulta2();
        }
      }
    );
  }
  guardarDatos() {
    //console.log(this.rolUser[0].id_rol)
    const fecha = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    const regExp    =  /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    const nombreU = this.datosUsuarioForm.controls.nombre.value;
    const apellido1 = this.datosUsuarioForm.controls.apellidoP.value;
    const apellido2 =  this.datosUsuarioForm.controls.apellidoM.value;
    const correoU = this.datosUsuarioForm.controls.correo.value;
    const contraseñaU = this.datosUsuarioForm.controls.contraseña.value;
    const rol = this.datosUsuarioForm.controls.rol.value;
    this.rolUser = this.roles.filter(item => item.rol === rol);
    if (nombreU !== '' && apellido2 !== '' && apellido1 !== '' && correoU !== '' && contraseñaU !== '' && rol !== '') {
      if (regExp.test(correoU) === true) {
        const usuario = {
          nombres: nombreU,
          id_usuario: this.usuario.id_usuario,
          apellido_p: apellido1,
          apellido_m: apellido2,
          correo: correoU,
          contraseña: contraseñaU,
          fecha_creacion: fecha,
          id_rol: 0,
        };
        this.servicioConUser.updateUsuario(this.rolUser[0].id_rol, usuario, token).subscribe(
          response => {
            if (response.status === 200 ) {
              this.mensaje200();
              setTimeout( () => {this.router.navigate(['IndexUsuario']); }, 3000 );
            } else {
              this.mensajeError();
              setTimeout( () => {this.router.navigate(['IndexUsuario']); }, 3000 );
            }
          },
          error => {
            if ( error.status === 500 ) {
              this.mensaje500();
              setTimeout( () => {this.router.navigate(['IndexUsuario']); }, 3000 );
            } else {
              this.mensajeError();
              setTimeout( () => {this.router.navigate(['IndexUsuario']); }, 3000 );
            }
          }
        );
      } else if (regExp.test(correoU) === false) {
        this.mensajeCorreoInvalido();
        console.log('formato no valido');
      }
    } else {
      console.log('datos vacios');
      this.mensajesDatosIncompletos();
    }
  }
  cancelar() {
    //this.llenaFormulario();
    //this.mensajeCancelarEdicion();
    //setTimeout( () => {this.router.navigate(['IndexUsuario']); }, 3000 );
    this.salirResgistro();
  }
  llenaFormulario() {
    this.datosUsuarioForm.controls.nombre.setValue(this.usuario.nombres);
    this.datosUsuarioForm.controls.apellidoP.setValue(this.usuario.apellido_p);
    this.datosUsuarioForm.controls.apellidoM.setValue(this.usuario.apellido_m);
    this.datosUsuarioForm.controls.correo.setValue(this.usuario.correo);
    this.datosUsuarioForm.controls.contraseña.setValue(this.usuario.contraseña);
    this.datosUsuarioForm.controls.rol.setValue(this.usuario.rol.rol);
  }
  salirResgistro() {
    const dialogRef = this.dialog.open(ModalCancelarRegitrosComponent, {
      data: {nombre: usuarioC, opcion: Edicion}
    });
  }
  mensaje200() {
    this.toastr.success('Se actualizaron los datos', 'Registro Actualizado');
  }
  mensaje500() {
    this.toastr.error('Intentar más tarde', 'Error del Servidor ');
  }
  mensajeErroConsulta() {
    this.toastr.error('No se encontró el usuario', 'Error en el servicio');
  }
  mensajeErrorConsulta2() {
    this.toastr.error('Intentar más tarde', 'Error en el servicio');
  }
  mensajeCancelarEdicion() {
    this.toastr.warning('Se canceló la edición');
  }
  mensajeError() {
    this.toastr.error('No se registro al nuevo usuario', 'Error en el registro');
  }
  mensajeCorreoInvalido() {
    this.toastr.error('El correo ingresano no tiene un formato valido', 'Correo Electrónico');
  }
  mensajesDatosIncompletos() {
    this.toastr.error('Llene los datos que tienen un (*)', 'Datos incompletos');
  }
}
