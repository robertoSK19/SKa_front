import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiciosService } from '../../Servicios/servicios.service';
import { Md5 } from 'md5-typescript';
import { Router} from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';

export interface  RolesUser {
  rol: string;
  nombre: string;
  id: number;
}

export let usuarioRol: RolesUser = {
  rol: '',
  nombre: '',
  id: 0
};

export let token: string;
export let rol: string;
let respuestaUser: any[];
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

   loginForm: FormGroup;
   public NavBar = NavbarComponent;
/*
  correoUser = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  contraseña = new FormControl('', [
    Validators.required,
  ]); */

  constructor(
    private formBuilder: FormBuilder,
    protected servicioConUser: ServiciosService,
    private router: Router,
    private toastr: ToastrService

  ) { }
 /*  loginForm = new FormGroup({
    correoUser: new FormControl(''),
    contraseña: new FormControl(''),
  }); */
  ngOnInit() {
     this.loginForm = this.formBuilder.group({
      correoUser: ['', Validators.required, Validators.email],
      contraseña: ['', Validators.required]
    });
  }

  ifRol: boolean = false;

  onSubmit() {
    // console.log( 'soy el submit' );
    // console.log(this.loginForm.controls.correoUser.value);
    // console.log(this.loginForm.controls.contraseña.value);
    const auxPass = Md5.init(this.loginForm.controls.contraseña.value);
    if (this.loginForm.controls.correoUser.value === '' && this.loginForm.controls.contraseña.value === '') {
      this.mensajeDatosVacios();
      this.loginForm.controls.correoUser.reset('');
      this.loginForm.controls.contraseña.reset('');
    } else if (this.loginForm.controls.correoUser.value !== '' && this.loginForm.controls.contraseña.value === '') {
      this.mensajeDatosVacios();
      this.loginForm.controls.correoUser.reset('');
      this.loginForm.controls.contraseña.reset('');
    } else if (this.loginForm.controls.correoUser.value === '' && this.loginForm.controls.contraseña.value !== '') {
      this.mensajeDatosVacios();
      this.loginForm.controls.correoUser.reset('');
      this.loginForm.controls.contraseña.reset('');
    } else if (this.loginForm.controls.correoUser.value !== '' && this.loginForm.controls.contraseña.value !== '') {
      this.consultaUser(this.loginForm.controls.correoUser.value, auxPass);
    }
  }

  consultaUser(correo: string, contraseña: string) {
    this.servicioConUser.consultaUsuario(correo, contraseña)
    .subscribe(
       response => {
        if (response.status === 200) {
          console.log('codigo 200', response.body);
          respuestaUser = response.body;
          console.log(respuestaUser);
          usuarioRol = {rol : respuestaUser["rol"], nombre: respuestaUser["nombre"], id: respuestaUser["id"]};
          const cookie64 = window.btoa(unescape(encodeURIComponent( JSON.stringify(usuarioRol) )));
          this.servicioConUser.setToken(cookie64);
          console.log(cookie64);
          // console.log(this.servicioConUser.getToken());
          // token = this.servicioConUser.getToken();
          this.router.navigate(['Principal']);
          // this.NavBar.prototype.otraFuncion('si');
          this.ifRol = true;
        } else if (response.status === 202) {
          console.log('codigo 200', response.body);
          usuarioRol = {rol: 'N/A', nombre: 'N/A', id: 0};
          this.ifRol = false;
          this.mensaje204();
          this.loginForm.controls.correoUser.reset('');
          this.loginForm.controls.contraseña.reset('');
        } else if (response.status === 204) {
          console.log('busqueda sin resultados 204');
          usuarioRol = {rol: 'N/A', nombre: 'N/A', id: 0};
          this.ifRol = false;
          this.mensaje204();
          this.loginForm.controls.correoUser.reset('');
          this.loginForm.controls.contraseña.reset('');
        }
      },
      error => {
        console.log(error)
        if (error.status === 500) {
          console.log('codigo 500', error.body);
          usuarioRol = {rol: 'N/A', nombre: 'N/A', id: 0};
          this.ifRol = false;
          this.loginForm.controls.correoUser.reset('');
          this.loginForm.controls.contraseña.reset(''); 
          this.mensaje500();
        }
        if (error.status === 504) {
          console.log('codigo 504', error.body);
          usuarioRol = {rol: 'N/A', nombre: 'N/A', id: 0};
          this.ifRol = false;
          this.loginForm.controls.correoUser.reset('');
          this.loginForm.controls.contraseña.reset('');
          this.mensaje504();
        }
        if (error.status === 0) {
          console.log('codigo 0', error.body);
          usuarioRol = {rol: 'N/A', nombre: 'N/A', id: 0};
          this.ifRol = false;
          this.loginForm.controls.correoUser.reset('');
          this.loginForm.controls.contraseña.reset('');
          this.mensaje0();
        }
      }
    );
  }
  mensaje200() {
    this.toastr.success('Datos Correctos', 'Acceso Concedido');
  }
  mensaje204() {
    this.toastr.error('Datos incorrectos', 'Acceso Denegado');
  }
  mensaje500() {
    this.toastr.error('Intentar más tarde', 'Error del Servidor ');
  }
  mensaje504() {
    this.toastr.error('Intentar más tarde', 'Tiempo de espera agotado');
  }
  mensaje0() {
    this.toastr.error('Error de conexión con el Servidor', 'Error de Conexión');
  }
  mensajeDatosVacios() {
    this.toastr.warning('Ingrese correo y contraseña', 'Faltan datos');
  }

}


