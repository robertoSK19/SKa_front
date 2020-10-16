import { Component, OnInit } from '@angular/core';
import { DatosAccesorio, AccesorioAA } from '../index-accesorios/index-accesorios.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Accesorios } from 'src/app/Models/accesorios/accesorios.interface';
import { Router } from '@angular/router';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { DataService } from '../list/data.service';
import { ToastrService } from 'ngx-toastr';

const estatusId = 2;
const estatusAsignado = 1;
let estatusNom = "";
let idEstatus = 0;

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
  Estatus: any[];
  EstatusBack: any[];
  ifAsignado = false;

  public accesorio: Accesorios = {
    id_accesorio: '',
    nombre_accesorio: '',
    marca: '',
    modelo: '',
    producto: '',
    hecho_en: '',
    serie: '',
    costo: 0,
    descripcion: '',
    capacidad: '',
    tipo_disco_duro: '',
    ram_bus: '',
    ram_ranura: ''
  };

  public accesorioReq: Accesorios = {
    id_accesorio: '',
    nombre_accesorio: '',
    marca: '',
    modelo: '',
    producto: '',
    hecho_en: '',
    serie: '',
    costo: 0,
    descripcion: '',
    capacidad: '',
    tipo_disco_duro: '',
    ram_bus: '',
    ram_ranura: ''
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
      capacidad: [''],
      tipo_disco_duro: [''],
      ram_ranura: [''],
      ram_bus: [''],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      hechoEn: ['', Validators.required],
      serie: ['', Validators.required],
      costo: ['', Validators.required],
      estatus: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  usuarioLogeado() {
    // datosUser = usuarioRol;
    datosAccesorios = AccesorioAA;
    const token = this.servicioConUser.getToken();
    if (token.length !== 0 && datosAccesorios.idAccesorio !== '') {
      console.log('acceso correcto');
      this.operacionesAccesorio();
    } else {
      console.log('error en el acceso');
      this.router.navigate(['IndexAccesorio']);
    }
  }

  operacionesAccesorio(idEquipo?: string) {
    this.getEstatus(datosAccesorios.operacion);
    if (datosAccesorios.operacion === 'editar') {
      this.ifMostrar = true;
      this.ifEditar = false;
      console.log('soy editar');
      this.consultaAccesorios.getAccesorio(datosAccesorios.idAccesorio).subscribe(
        response => {
          if (response.status === 200) {
            estatusNom = response.body.id_estatus.nombre_estatus;
            let a = document.getElementById("ram");
            let b = document.getElementById("memoria");
            let c = document.getElementById("disco");
            let d = document.getElementById("bus");
            if (response.body.producto === "RAM") {
              a.className = "col-sm visible"
              b.className = "col-sm visible"
              c.className = "col-sm invisible"
              d.className = "col-sm visible"
            } else if (response.body.producto === "Disco Duro") {
              a.className = "col-sm invisible"
              b.className = "col-sm visible"
              c.className = "col-sm visible"
              d.className = "col-sm invisible"
            } else if (response.body.producto === "Otro") {
              a.className = "col-sm invisible"
              b.className = "col-sm invisible"
              c.className = "col-sm invisible"
              d.className = "col-sm invisible"
            }
            this.accesorio = response.body;
            this.accesorio.id_estatus = response.body.id_estatus.id_estatus;
            this.datosAccesoriosForm.controls.nombre.setValue(this.accesorio.producto);
            this.datosAccesoriosForm.controls.marca.setValue(this.accesorio.marca);
            this.datosAccesoriosForm.controls.modelo.setValue(this.accesorio.modelo);
            this.datosAccesoriosForm.controls.capacidad.setValue(this.accesorio.capacidad);
            this.datosAccesoriosForm.controls.tipo_disco_duro.setValue(this.accesorio.tipo_disco_duro);
            this.datosAccesoriosForm.controls.ram_ranura.setValue(this.accesorio.ram_ranura);
            this.datosAccesoriosForm.controls.ram_bus.setValue(this.accesorio.ram_bus);
            this.datosAccesoriosForm.controls.hechoEn.setValue(this.accesorio.hecho_en);
            this.datosAccesoriosForm.controls.serie.setValue(this.accesorio.serie);
            this.datosAccesoriosForm.controls.costo.setValue(this.accesorio.costo);
            this.datosAccesoriosForm.controls.estatus.setValue(estatusNom);
            this.datosAccesoriosForm.controls.descripcion.setValue(this.accesorio.descripcion);

            console.log(this.datosAccesoriosForm.value);

            if (response.body.id_estatus.id_estatus === estatusAsignado) {
              this.ifAsignado = true;
            } else {
              this.ifAsignado = false;
            }

          } else if (response.status === 204) {
            console.log('Equipo no encontrado');
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
      this.Estatus = this.EstatusBack;
      this.ifMostrar = false;
      this.ifEditar = true;
      this.consultaAccesorios.getAccesorio(datosAccesorios.idAccesorio).subscribe(
        response => {
          if (response.status === 200) {
            estatusNom = response.body.id_estatus.nombre_estatus;
            let a = document.getElementById("ram");
            let b = document.getElementById("memoria");
            let c = document.getElementById("disco");
            let d = document.getElementById("bus");
            if (response.body.producto === "RAM") {
              a.className = "col-sm visible"
              b.className = "col-sm visible"
              c.className = "col-sm invisible"
              d.className = "col-sm visible"
            } else if (response.body.producto === "Disco Duro") {
              a.className = "col-sm invisible"
              b.className = "col-sm visible"
              c.className = "col-sm visible"
              d.className = "col-sm invisible"
            } else if (response.body.producto === "Otro") {
              a.className = "col-sm invisible"
              b.className = "col-sm invisible"
              c.className = "col-sm invisible"
              d.className = "col-sm invisible"
            }

            this.accesorio = response.body;
            // this.accesorio.id_estatus = response.body.id_estatus.id_estatus;
            this.datosAccesoriosForm.controls.nombre.setValue(this.accesorio.producto);
            this.datosAccesoriosForm.controls.marca.setValue(this.accesorio.marca);
            this.datosAccesoriosForm.controls.modelo.setValue(this.accesorio.modelo);
            this.datosAccesoriosForm.controls.capacidad.setValue(this.accesorio.capacidad);
            this.datosAccesoriosForm.controls.tipo_disco_duro.setValue(this.accesorio.tipo_disco_duro);
            this.datosAccesoriosForm.controls.ram_ranura.setValue(this.accesorio.ram_ranura);
            this.datosAccesoriosForm.controls.ram_bus.setValue(this.accesorio.ram_bus);
            this.datosAccesoriosForm.controls.hechoEn.setValue(this.accesorio.hecho_en);
            this.datosAccesoriosForm.controls.serie.setValue(this.accesorio.serie);
            this.datosAccesoriosForm.controls.costo.setValue(this.accesorio.costo);
            this.datosAccesoriosForm.controls.estatus.setValue(estatusNom);
            this.datosAccesoriosForm.controls.descripcion.setValue(this.accesorio.descripcion);
            if (response.body.id_estatus.id_estatus === estatusAsignado) {
              this.ifAsignado = true;
            } else {
              this.ifAsignado = false;
            }
            this.deshabilitaForm();
          } else if (response.status === 204) {
            console.log('Equipo no encontrado');
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
    const capacidadForm = this.datosAccesoriosForm.controls.capacidad.value;
    const tipoDiscoForm = this.datosAccesoriosForm.controls.tipo_disco_duro.value;
    const ranuraForm = this.datosAccesoriosForm.controls.ram_ranura.value;
    const busForm = this.datosAccesoriosForm.controls.ram_bus.value;
    const hechoEnForm = this.datosAccesoriosForm.controls.hechoEn.value;
    const serieForm = this.datosAccesoriosForm.controls.serie.value;
    const costoForm = this.datosAccesoriosForm.controls.costo.value;
    const estatusForm = this.datosAccesoriosForm.controls.estatus.value;
    const descripcionForm = this.datosAccesoriosForm.controls.descripcion.value;
    if (estatusForm === "Disponible"){
      idEstatus = 2;
    }else if (estatusForm === "En Revisión"){
      idEstatus = 3;
    }else if (estatusForm === "Donado"){
      idEstatus = 4;
    }else if (estatusForm === "Vendido"){
      idEstatus = 5;
    }
    if (nombreForm !== null && marcaForm !== null && modeloForm !== null && /*productoForm !== null &&*/ hechoEnForm !== null &&
      nombreForm !== '' && marcaForm !== '' && modeloForm !== '' && /* productoForm !== '' &&*/ hechoEnForm !== '' &&
      costoForm !== null && costoForm !== '') {
      console.log('datos correctos');
      this.accesorioReq = {
        id_accesorio: this.accesorio.id_accesorio,
        nombre_accesorio: this.accesorio.nombre_accesorio,
        marca: marcaForm,
        modelo: modeloForm,
        producto: nombreForm,
        capacidad: capacidadForm,
        tipo_disco_duro: tipoDiscoForm,
        hecho_en: hechoEnForm,
        serie: serieForm,
        costo: costoForm,
        descripcion: descripcionForm,
        ram_bus: ranuraForm,
        ram_ranura: busForm
      };
      console.log(this.accesorioReq, idEstatus);
      this.consultaAccesorios.updateAccesorio(this.accesorioReq, idEstatus).subscribe(
        response => {
          if (response.status === 200) {
            console.log('Actualizacion correcta');
            this.mensaje200Actulizacion();
            setTimeout(() => { this.router.navigate(['IndexAccesorio']); }, 3000);
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
          console.log(response.body);

          this.accesorio = response.body;
          this.datosAccesoriosForm.controls.nombre.setValue(this.accesorio.producto);
          this.datosAccesoriosForm.controls.marca.setValue(this.accesorio.marca);
          this.datosAccesoriosForm.controls.modelo.setValue(this.accesorio.modelo);
          this.datosAccesoriosForm.controls.capacidad.setValue(this.accesorio.capacidad);
          this.datosAccesoriosForm.controls.ram_ranura.setValue(this.accesorio.ram_ranura);
          this.datosAccesoriosForm.controls.ram_bus.setValue(this.accesorio.ram_bus);
          this.datosAccesoriosForm.controls.hechoEn.setValue(this.accesorio.hecho_en);
          this.datosAccesoriosForm.controls.serie.setValue(this.accesorio.serie);
          this.datosAccesoriosForm.controls.costo.setValue(this.accesorio.costo);
          this.datosAccesoriosForm.controls.estatus.setValue(response.body.id_estatus.id_estatus);
          this.datosAccesoriosForm.controls.descripcion.setValue(this.accesorio.descripcion);
          this.router.navigate(['IndexAccesorio']);
        } else if (response.status === 204) {
          console.log('Accesorio no encontrado');
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
      this.datosAccesoriosForm.controls.marca.enable();
      this.datosAccesoriosForm.controls.modelo.enable();
      this.datosAccesoriosForm.controls.capacidad.enable();
      this.datosAccesoriosForm.controls.ram_ranura.enable();
      this.datosAccesoriosForm.controls.ram_bus.enable();
      this.datosAccesoriosForm.controls.tipo_disco_duro.enable();
      this.datosAccesoriosForm.controls.hechoEn.enable();
      this.datosAccesoriosForm.controls.serie.enable();
      this.datosAccesoriosForm.controls.costo.enable();
      this.datosAccesoriosForm.controls.estatus.enable();
      this.datosAccesoriosForm.controls.descripcion.enable();
      this.getEstatus('editar');
    } else if (opcion === 'aceptar') {
      this.router.navigate(['IndexAccesorio']);
    }
  }
  deshabilitaForm() {
    this.datosAccesoriosForm.controls.nombre.disable();
    this.datosAccesoriosForm.controls.marca.disable();
    this.datosAccesoriosForm.controls.modelo.disable();
    this.datosAccesoriosForm.controls.hechoEn.disable();
    this.datosAccesoriosForm.controls.serie.disable();
    this.datosAccesoriosForm.controls.costo.disable();
    this.datosAccesoriosForm.controls.estatus.disable();
    this.datosAccesoriosForm.controls.descripcion.disable();
  }
  getEstatus(opcion: string) {
    this.consultaAccesorios.getAllEstatus().subscribe(
      response => {
        if (response.status === 200) {
          this.Estatus = response.body;
          if (opcion === 'mostrar') {
            const estatusEquiposDisp = this.Estatus.filter(item => item.id_estatus !== 6);
            this.Estatus = estatusEquiposDisp;
          } else {
            const estatusfiltro = this.Estatus.filter(item => item.id_estatus !== 1 && item.id_estatus !== 6);
            this.Estatus = estatusfiltro;
          }
          this.EstatusBack = response.body;
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
  cambioEstatus(nuevoEstatus: string) {
    console.log(nuevoEstatus);
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
}
