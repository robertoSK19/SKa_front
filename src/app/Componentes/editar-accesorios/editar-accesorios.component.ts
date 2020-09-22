import { Component, OnInit } from '@angular/core';
import { DatosAccesorio, AccesorioAA } from '../index-accesorios/index-accesorios.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Accesorios } from 'src/app/Models/accesorios/accesorios.interface';
import { Router } from '@angular/router';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { DataService } from '../list/data.service';
import { ToastrService } from 'ngx-toastr';

const estatusId = 2;

let datosAccesorios: DatosAccesorio = {
  idAccesorio: '',
  operacion: ''
};

@Component({
  selector: 'app-editar-accesorios',
  templateUrl: './editar-accesorios.component.html',
  styleUrls: ['./editar-accesorios.component.scss']
})
export class EditarAccesoriosComponent implements OnInit {

  datosAccesoriosForm: FormGroup;

  public accesorio: Accesorios = {
    id_accesorio: '',
    nombre_accesorio: '',
    marca: '',
    modelo: '',
    producto: '',
    hecho_en: '',
    serie: '',
    id_estatus: 0
  };

  public accesorioReq: Accesorios = {
    id_accesorio: '',
    nombre_accesorio: '',
    marca: '',
    modelo: '',
    producto: '',
    hecho_en: '',
    serie: '',
    id_estatus: 0
  };

  ifMostrar;
  ifEditar;

  constructor(
    private router: Router,
    protected servicioConUser: ServiciosService,
    private consultaAccesorios: DataService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.usuarioLogeado();
    this.datosAccesoriosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      producto: ['', Validators.required],
      hechoEn: ['', Validators.required],
      serie: ['', Validators.required]
    });
  }

  usuarioLogeado() {
    // datosUser = usuarioRol;
    datosAccesorios = AccesorioAA;
    const token = this.servicioConUser.getToken();
    if ( token.length !== 0 && datosAccesorios.idAccesorio !== '') {
      console.log('acceso correcto');
      this.operacionesAccesorio();
    } else {
      console.log('error en el acceso');
      this.router.navigate(['IndexAccesorio']);
    }
  }

  operacionesAccesorio(idEquipo?: string) {
    if (datosAccesorios.operacion === 'editar') {
      this.ifMostrar = true;
      this.ifEditar = false;
      console.log('soy editar');
      this.consultaAccesorios.getAccesorio(datosAccesorios.idAccesorio).subscribe(
        response => {
          if (response.status === 200) {
            this.accesorio = response.body;
            this.datosAccesoriosForm.controls.nombre.setValue(this.accesorio.nombre_accesorio);
            this.datosAccesoriosForm.controls.marca.setValue(this.accesorio.marca);
            this.datosAccesoriosForm.controls.modelo.setValue(this.accesorio.modelo);
            this.datosAccesoriosForm.controls.producto.setValue(this.accesorio.producto);
            this.datosAccesoriosForm.controls.hechoEn.setValue(this.accesorio.hecho_en);
            this.datosAccesoriosForm.controls.serie.setValue(this.accesorio.serie);
          } else if (response.status === 204) {
            console.log( 'Equipo no encontrado');
          }
        },
        error => {
          console.log(error);
          if (error.status === 500) {
            console.log('Error de Servicos');
          }
        }
      );
    } else if (datosAccesorios.operacion === 'mostrar') {
      console.log('soy mostrar');
      this.ifMostrar = false;
      this.ifEditar = true;
      this.consultaAccesorios.getAccesorio(datosAccesorios.idAccesorio).subscribe(
        response => {
          if (response.status === 200) {
            this.accesorio = response.body;
            this.datosAccesoriosForm.controls.nombre.setValue(this.accesorio.nombre_accesorio);
            this.datosAccesoriosForm.controls.marca.setValue(this.accesorio.marca);
            this.datosAccesoriosForm.controls.modelo.setValue(this.accesorio.modelo);
            this.datosAccesoriosForm.controls.producto.setValue(this.accesorio.producto);
            this.datosAccesoriosForm.controls.hechoEn.setValue(this.accesorio.hecho_en);
            this.datosAccesoriosForm.controls.serie.setValue(this.accesorio.serie);
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
    }
  }

  guardarDatos() {
    const nombreForm = this.datosAccesoriosForm.controls.nombre.value;
    const marcaForm = this.datosAccesoriosForm.controls.marca.value;
    const modeloForm = this.datosAccesoriosForm.controls.modelo.value;
    const productoForm = this.datosAccesoriosForm.controls.producto.value;
    const hechoEnForm = this.datosAccesoriosForm.controls.hechoEn.value;
    const serieForm = this.datosAccesoriosForm.controls.serie.value;

    if (nombreForm !== null && marcaForm !== null && modeloForm !== null && productoForm !== null && hechoEnForm !== null &&
      serieForm !== null && nombreForm !== '' && marcaForm !== '' && modeloForm !== '' && productoForm !== '' && hechoEnForm !== '' &&
      serieForm !== '') {
        console.log('datos correctos');
        this.accesorioReq = {
          id_accesorio: this.accesorio.id_accesorio,
          nombre_accesorio: nombreForm,
          marca: marcaForm,
          modelo: modeloForm,
          producto: productoForm,
          hecho_en: hechoEnForm,
          serie: serieForm,
          id_estatus: this.accesorio.id_estatus
        };
        console.log(this.accesorioReq);
        this.consultaAccesorios.updateAccesorio(this.accesorioReq, estatusId).subscribe(
          response => {
            if (response.status === 200 ) {
              console.log('Actualizacion correcta');
              this.mensaje200Actulizacion();
              setTimeout( () => {this.router.navigate(['IndexAccesorio']); }, 3000 );
            } else {
              console.log('Error en la actualizacion');
              this.mensaje204Actualizacion();
            }
          },
          error => {
            if (error.status === 500) {
              console.log('Error de Servidor');
              this.mensaje500();
            }
          }
        );
      } else {
        console.log('Datos incompletos');
        this.mensajeDatosVacios();
      }
  }

  cancelar() {
    this.consultaAccesorios.getAccesorio(datosAccesorios.idAccesorio).subscribe(
      response => {
        if (response.status === 200) {
          this.accesorio = response.body;
          this.datosAccesoriosForm.controls.nombre.setValue(this.accesorio.nombre_accesorio);
          this.datosAccesoriosForm.controls.marca.setValue(this.accesorio.marca);
          this.datosAccesoriosForm.controls.modelo.setValue(this.accesorio.modelo);
          this.datosAccesoriosForm.controls.producto.setValue(this.accesorio.producto);
          this.datosAccesoriosForm.controls.hechoEn.setValue(this.accesorio.hecho_en);
          this.datosAccesoriosForm.controls.serie.setValue(this.accesorio.serie);
          this.router.navigate(['IndexAccesorio']);
        } else if (response.status === 204) {
          console.log( 'Accesorio no encontrado');
        }
      },
      error => {
        console.log(error);
        if (error.status === 500) {
          console.log('Error del Servidor');
        }
      }
    );
  }
  opcionesVistaVer(opcion: string) {
    if (opcion === 'editar') {
      this.ifMostrar = true;
      this.ifEditar = false;
      this.datosAccesoriosForm.controls.nombre.enable();
      this.datosAccesoriosForm.controls.marca.enable();
      this.datosAccesoriosForm.controls.modelo.enable();
      this.datosAccesoriosForm.controls.producto.enable();
      this.datosAccesoriosForm.controls.hechoEn.enable();
      this.datosAccesoriosForm.controls.serie.enable();
    } else if (opcion === 'aceptar') {
      this.router.navigate(['IndexAccesorio']);
    }
  }
  deshabilitaForm() {
    this.datosAccesoriosForm.controls.nombre.disable();
    this.datosAccesoriosForm.controls.marca.disable();
    this.datosAccesoriosForm.controls.modelo.disable();
    this.datosAccesoriosForm.controls.producto.disable();
    this.datosAccesoriosForm.controls.hechoEn.disable();
    this.datosAccesoriosForm.controls.serie.disable();
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
    this.toastr.warning('Llene los campos con (*)', 'Faltan datos');
  }
  mensajeCancelar() {
    this.toastr.warning('Se cancelo la edición');
  }
}
