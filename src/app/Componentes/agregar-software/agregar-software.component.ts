import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Software } from 'src/app/Models/Software/software.interface';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { DataService } from '../list/data.service';
import { RolesUser, usuarioRol } from '../login/login.component';

let datosUser: RolesUser = {
  rol: '',
  nombre: '',
  id: 0,
};

@Component({
  selector: 'app-agregar-software',
  templateUrl: './agregar-software.component.html',
  styleUrls: ['./agregar-software.component.scss']
})
export class AgregarSoftwareComponent implements OnInit {
  datosSoftwareForm: FormGroup;
  public datosSoftware: Software = {
    id_software: '',
    fecha_licencia: '',
    no_serie: '',
    nombre_software: '',
  };

  constructor(
    private router: Router,
    protected servicioConUser: ServiciosService,
    private formBuilder: FormBuilder,
    private servicioSoftware: DataService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
  ) { }

  ngOnInit() {
    this.usuarioLogeado();
    this.datosSoftwareForm = this.formBuilder.group({
      nombre_software: ['', Validators.required],
      no_serie: ['', Validators.required],
      fecha_vigencia: ['']
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

  guardarDatos() {
    const nombreForm = this.datosSoftwareForm.controls.nombre_software.value;
    const noSerieForm = this.datosSoftwareForm.controls.no_serie.value;
    const fechaVigenciaForm = this.datepipe.transform(this.datosSoftwareForm.controls.fecha_vigencia.value, 'yyyy-MM-dd');
    const fechaVigenciaForm2 = this.datosSoftwareForm.controls.fecha_vigencia.value;
    console.log(nombreForm, noSerieForm, '_', fechaVigenciaForm, '_',fechaVigenciaForm);

    if (nombreForm !== '' && noSerieForm !== '') {
      console.log(nombreForm, noSerieForm, fechaVigenciaForm);
      console.log('datos correctos');
      this.datosSoftware = {
        id_software: '',
        fecha_licencia: fechaVigenciaForm,
        no_serie: noSerieForm,
        nombre_software: nombreForm,
      };
      console.log(this.datosSoftware);
      this.servicioSoftware.crearSoftware(this.datosSoftware).subscribe(
        response => {
          if (response.status === 200) {
            this.mensaje200Nuevo();
            console.log('ok');
            setTimeout( () => {this.router.navigate(['IndexSoftware']); }, 2000 );
          } else {
            this.mensaje204Nuevo();
            console.log('error registro');
          }
        },
        error => {
          if (error.status === 500) {
            this.mensaje500();
            console.log('error 500');
          } else {
            this.mensaje204Nuevo();
            console.log('otro error');
          }
        }
      );
    } else {
      this.mensajeDatosVacios();
    }
  }
  cancelar() {
    this.mensajeCancelar();
    setTimeout( () => {this.router.navigate(['IndexSoftware']); }, 1000 );

  }
  mensaje200Nuevo() {
    this.toastr.success('Se registro el nuevo software', 'Registro Correcto');
  }
  mensaje204Nuevo() {
    this.toastr.error('No se registro el nuevo Software', 'Error en el registro');
  }
  mensaje500() {
    this.toastr.error('Intentar más tarde', 'Error del Servidor ');
  }
  mensajeDatosVacios() {
    this.toastr.warning('Llene los campos que tienen un (*)', 'Datos incompletos');
  }
  mensajeCancelar() {
    this.toastr.warning('Se canceló el registro');
  }
}
