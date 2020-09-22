import { Component, OnInit } from '@angular/core';
import { usuarioRol, RolesUser } from '../login/login.component';
import { Router} from '@angular/router';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Accesorios } from 'src/app/Models/accesorios/accesorios.interface';
import { DataService } from '../list/data.service';
import { ToastrService } from 'ngx-toastr';

const estatusId = 2;
let datosUser: RolesUser = {
  rol: '',
  nombre: '',
  id_user: '',
};


@Component({
  selector: 'app-agregar-accesorios',
  templateUrl: './agregar-accesorios.component.html',
  styleUrls: ['./agregar-accesorios.component.scss']
})
export class AgregarAccesoriosComponent implements OnInit {

  datosAccesorioForm: FormGroup;

  public accesorio: Accesorios = {
    id_accesorio: '',
    nombre_accesorio: '',
    marca: '',
    modelo: '',
    producto: '',
    hecho_en: '',
    serie: '',
    id_estatus: 0,
  };

  constructor(
    private router: Router,
    protected servicioConUser: ServiciosService,
    private formBuilder: FormBuilder,
    private servicioAccesorio: DataService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.usuarioLogeado();
    this.datosAccesorioForm = this.formBuilder.group({
      nombre_accesorio: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      producto: ['', Validators.required],
      hecho_en: ['', Validators.required],
      serie: ['', Validators.required]
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
    const nombreForm = this.datosAccesorioForm.controls.nombre_accesorio.value;
    const marcaForm = this.datosAccesorioForm.controls.marca.value;
    const modeloForm = this.datosAccesorioForm.controls.modelo.value;
    const productoForm = this.datosAccesorioForm.controls.producto.value;
    const hechoEnForm = this.datosAccesorioForm.controls.hecho_en.value;
    const serieForm = this.datosAccesorioForm.controls.serie.value;

    if (nombreForm !== '' && marcaForm !== '' && modeloForm !== '' && productoForm !== '' && hechoEnForm !== '' && serieForm !== '') {
      console.log('Datos completos');
      this.accesorio = {
        id_accesorio: '',
        nombre_accesorio: nombreForm,
        marca: marcaForm,
        modelo: modeloForm,
        producto: productoForm,
        hecho_en: hechoEnForm,
        serie: serieForm,
        id_estatus: estatusId
      };
      console.log(this.accesorio);
      this.servicioAccesorio.crearAccesorio(this.accesorio, estatusId).subscribe(
        response => {
          console.log(response);
          if (response.status === 200 ) {
            console.log('Registro Correcto');
            this.mensaje200Nuevo();
            setTimeout( () => {this.router.navigate(['IndexAccesorio']); }, 3000 );
          } else {
            console.log('Error en el registro');
            this.mensaje204Nuevo();
          }
        },
        error => {
          if (error.status === 500) {
            console.log('Error del Servidor');
            this.mensaje500();
          }
        }
      );
    } else {
      console.log('Datos imcompletos');
      this.mensajeDatosVacios();
    }
  }

  cancelar() {
    this.datosAccesorioForm.controls.nombre_accesorio.reset();
    this.datosAccesorioForm.controls.marca.reset();
    this.datosAccesorioForm.controls.modelo.reset();
    this.datosAccesorioForm.controls.producto.reset();
    this.datosAccesorioForm.controls.hecho_en.reset();
    this.datosAccesorioForm.controls.serie.reset();
    this.router.navigate(['IndexAccesorio']);
  }
  mensaje200Nuevo() {
    this.toastr.success('Se registro el nuevo accesorio', 'Registro Correcto');
  }
  mensaje204Nuevo() {
    this.toastr.error('No se registro el nuevo accesorio', 'Error en el registro');
  }
  mensaje500() {
    this.toastr.error('Intentar más tarde', 'Error del Servidor ');
  }
  mensajeDatosVacios() {
    this.toastr.warning('Llene los campos con (*)', 'Faltan datos');
  }
}
