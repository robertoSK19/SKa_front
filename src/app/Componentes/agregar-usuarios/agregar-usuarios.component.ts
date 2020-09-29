import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { cssNumber } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/Models/usuario/usuario.interface';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { DatosUsuario, idUsuario } from '../index-usuarios/index-usuarios.component';
import { RolesUser, usuarioRol } from '../login/login.component';

let datosUsuario: DatosUsuario = {
  idUser: '',
};
let usuario: Usuario = {
  id_usuario: 0,
  nombres: '',
  apellido_p: '',
  apellido_m: '',
  correo: '',
  contraseña: '',
  fecha_creacion: '',
  id_rol: 0
};
let datosUser: RolesUser = {
  rol: '',
  nombre: '',
  id: 0,
};

let token = '';
@Component({
  selector: 'app-agregar-usuarios',
  templateUrl: './agregar-usuarios.component.html',
  styleUrls: ['./agregar-usuarios.component.scss']
})
export class AgregarUsuariosComponent implements OnInit {
  datosUsuario: FormGroup;
  roles: any[];
  rolUser: any;

  constructor(
    protected servicioConUser: ServiciosService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public datepipe: DatePipe,
  ) { }

  ngOnInit() {
    this.datosUsuario = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidoP: ['', Validators.required],
      apellidoM: ['', Validators.required],
      correo: ['', Validators.required],
      contraseña: ['', Validators.required],
      rol: ['', Validators.required],
    });

    this.usuarioLogeado();
  }

  usuarioLogeado() {
    datosUser = usuarioRol;
    token = this.servicioConUser.getToken();
    const cookieN64 = window.atob(unescape(encodeURIComponent(token)));
    datosUser = JSON.parse(cookieN64);
    if (datosUser.rol === 'Admin') {
      datosUsuario = idUsuario;
      // token = this.servicioConUser.getToken();
      if (token.length === 0) {
        console.log('error en el acceso');
        this.router.navigate(['Login']);
      } else {
        console.log('acceso correcto');
        this.getRoles();
      }
    } else if (datosUser.rol !== 'Admin') {
      this.router.navigate(['Principal']);
    }
  }
  getRoles() {
    this.servicioConUser.getRoles(token).subscribe(
      response => {
        if (response.status === 200) {
          this.roles = response.body;
        } else {
          this.mensajeErrorConsulta();
        }
      },
      error => {
        if (error.status === 500 ) {
          this.mensaje500();
        } else {
          this.mensajeErrorConsulta();
        }
      }
    );
  }
  tipoRol(rol: string, ) {
    console.log('rol', rol);
    const rolesFiltro = this.roles.filter(item => item.rol === rol);
    this.rolUser = rolesFiltro;
  }
  guardarDatos() {
    //console.log(this.rolUser[0].id_rol)
    const fecha = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    const regExp    =  /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    const nombreU = this.datosUsuario.controls.nombre.value;
    const apellido1 = this.datosUsuario.controls.apellidoP.value;
    const apellido2 =  this.datosUsuario.controls.apellidoM.value;
    const correoU = this.datosUsuario.controls.correo.value;
    const contraseñaU = this.datosUsuario.controls.contraseña.value;
    const rol = this.datosUsuario.controls.rol.value;
    if (nombreU !== '' && apellido2 !== '' && apellido1 !== '' && correoU !== '' && contraseñaU !== '' && rol !== '') {
      if (regExp.test(correoU) === true) {
        usuario = {
          nombres: nombreU,
          id_usuario: 0,
          apellido_p: apellido1,
          apellido_m: apellido2,
          correo: correoU,
          contraseña: contraseñaU,
          fecha_creacion: fecha,
          id_rol: 0,
        };
        this.servicioConUser.crearUsuario(this.rolUser[0].id_rol, usuario, token).subscribe(
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
    this.mensajeCancelar();
    setTimeout( () => {this.router.navigate(['IndexUsuario']); }, 2000 );
  }
  mensaje200() {
    this.toastr.success('Se registro el nuevo usuario', 'Registro Correcto');
  }
  mensajeErrorConsulta() {
    this.toastr.error('Intentar más tarde', 'Error en el servicio');
  }
  mensaje500() {
    this.toastr.error('Intentar más tarde', 'Error del Servidor ');
  }
  mensajesDatosIncompletos() {
    this.toastr.error('Llene los datos que tienen un (*)', 'Datos incompletos');
  }
  mensajeCorreoInvalido() {
    this.toastr.error('El correo ingresano no tiene un formato valido', 'Correo Electrónico');
  }
  mensajeError() {
    this.toastr.error('No se registro al nuevo usuario', 'Error en el registro');
  }
  mensajeCancelar() {
    this.toastr.warning('Se canceló el registro de un nuevo usuario');
  }
}
