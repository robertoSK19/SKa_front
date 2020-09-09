import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ServiciosService } from '../../Servicios/servicios.service';
import { Md5 } from 'md5-typescript';
import { Router} from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

export interface  RolesUser {
  rol: string;
  nombre: string;
  id_user: string;
}

export let usuarioRol: RolesUser = {
  rol: '',
  nombre: '',
  id_user: ''
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
    console.log( 'soy el submit' );
    console.log(this.loginForm.controls.correoUser.value);
    console.log(this.loginForm.controls.contraseña.value);
    const auxPass = Md5.init(this.loginForm.controls.contraseña.value);
    this.consultaUser(this.loginForm.controls.correoUser.value, auxPass);
  }

  consultaUser(correo: string, contraseña: string) {
    this.servicioConUser.consultaUsuario(correo, contraseña)
    .subscribe(
       response => {
        if (response.status === 200) {
          console.log('codigo 200', response.body);
          respuestaUser = response.body;
          console.log(respuestaUser);
          usuarioRol = {rol : respuestaUser["rol"], nombre: respuestaUser["nombre"], id_user: respuestaUser["id"]};
          this.servicioConUser.setToken('miToken');
          // console.log(this.servicioConUser.getToken());
          token = this.servicioConUser.getToken();
          this.router.navigate(['Principal']);
          this.NavBar.prototype.otraFuncion('si');
          this.ifRol = true;
        } else if (response.status === 202) {
          console.log('codigo 200', response.body);
          usuarioRol = {rol: 'N/A', nombre: 'N/A', id_user: 'N/A'};
          this.ifRol = false;
        } else if (response.status === 204) {
          console.log('busqueda sin resultados 204');
          usuarioRol = {rol: 'N/A', nombre: 'N/A', id_user: 'N/A'};
          this.ifRol = false;
        }
      },
      error => {
        if (error.status === 500) {
          console.log('codigo 500', error.body);
          usuarioRol = {rol: 'N/A', nombre: 'N/A', id_user: 'N/A'};
          this.ifRol = false;
        }
        if (error.status === 504) {
          console.log('codigo 504', error.body);
          usuarioRol = {rol: 'N/A', nombre: 'N/A', id_user: 'N/A'};
          this.ifRol = false;
        }
      }
    );
  }

}


