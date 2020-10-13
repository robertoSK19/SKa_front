import { Component, OnInit } from '@angular/core';
import { usuarioRol, RolesUser } from '../login/login.component';
import { Router } from '@angular/router';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Accesorios } from 'src/app/Models/accesorios/accesorios.interface';
import { DataService } from '../list/data.service';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';

const estatusId = 2;
let datosUser: RolesUser = {
  rol: '',
  nombre: '',
  id: 0,
};
let discoDuro = "";
let accesorioTipo = "";
let nombreForm = "";

@Component({
  selector: 'app-agregar-accesorios',
  templateUrl: './agregar-accesorios.component.html',
  styleUrls: ['./agregar-accesorios.component.scss']
})
export class AgregarAccesoriosComponent implements OnInit {

  datosAccesorioForm: FormGroup;
  tipoAccesorio: FormControl;

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
    tipo_disco_duro:'',
    ram_bus:'',
    ram_ranura:'',
  };

  tipoAccesorioE: any[] = [
    { nombre: 'RAM' },
    { nombre: 'Disco Duro' },
    { nombre: 'Otro' }
  ];

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
      nombre_accesorio: [''],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      hecho_en: ['', Validators.required],
      serie: ['', Validators.required],
      costo: ['', Validators.required],
      descripcion: [''],
      capacidad: ['', Validators.required],
      tipo_disco_duro: [''],
      ram_ranura: [''],
      ram_bus: [''],
    });
    this.tipoAccesorio = new FormControl('')
  }

  usuarioLogeado() {
    datosUser = usuarioRol;
    const token = this.servicioConUser.getToken();
    if (token.length === 0) {
      console.log('error en el acceso');
      this.router.navigate(['Login']);
    } else {
      console.log('acceso correcto');
    }
  }

  tipoAccesorioSelect(tipo: string) {
    let a = document.getElementById('discos');
    let b = document.getElementById('ram');
    let c = document.getElementById('otros');
    let d = document.getElementById('nombre');
    let e = document.getElementById('capacidad')
    accesorioTipo = tipo;
    console.log(accesorioTipo);
    
    if (tipo === this.tipoAccesorioE[0].nombre) {
      console.log(this.tipoAccesorioE[0]);
      a.className = 'invisible';
      b.className = 'visible';
      c.className = 'visible card-body';
      d.className = 'invisible col-sm';
      e.className = 'visible col-sm';
    } else if (tipo === this.tipoAccesorioE[1].nombre) {
      console.log(this.tipoAccesorioE[1]);
      a.className = 'visible';
      b.className = 'invisible';
      c.className = 'visible card-body';
      d.className = 'invisible col-sm';
      e.className = 'visible col-sm';
    } else if (tipo === this.tipoAccesorioE[2].nombre) {
      console.log(this.tipoAccesorioE[2]);
      a.className = 'invisible';
      b.className = 'invisible';
      c.className = 'visible card-body';
      d.className = 'visible col-sm';
      e.className = 'invisible col-sm';
    }
  }

  tipoDiscoDuro (tipo: string){
    discoDuro = tipo;
    console.log(discoDuro);
  }

  guardarDatos() {
    if (this.datosAccesorioForm.controls.nombre_accesorio.value === ""){
      nombreForm = accesorioTipo;
    } else{
      nombreForm = this.datosAccesorioForm.controls.nombre_accesorio.value;
    }   
    const marcaForm = this.datosAccesorioForm.controls.marca.value;
    const modeloForm = this.datosAccesorioForm.controls.modelo.value;
    const hechoEnForm = this.datosAccesorioForm.controls.hecho_en.value;
    const serieForm = this.datosAccesorioForm.controls.serie.value;
    const costoForm = this.datosAccesorioForm.controls.costo.value;
    const descripcionForm = this.datosAccesorioForm.controls.descripcion.value;
    const capacidadForm = this.datosAccesorioForm.controls.capacidad.value;
    const ranuraForm = this.datosAccesorioForm.controls.ram_ranura.value;
    const busForm = this.datosAccesorioForm.controls.ram_bus.value;
    
    if (marcaForm !== '' && modeloForm !== '' && hechoEnForm !== '' &&
      costoForm !== '') {
      console.log('Datos completos');
      this.accesorio = {
        id_accesorio: '',
        nombre_accesorio: nombreForm,
        marca: marcaForm,
        modelo: modeloForm,
        producto: nombreForm,
        hecho_en: hechoEnForm,
        serie: serieForm,
        costo: costoForm,
        descripcion: descripcionForm,
        capacidad: capacidadForm,
        tipo_disco_duro: discoDuro,
        ram_ranura:ranuraForm,
        ram_bus: busForm,
        id_estatus: null
      };
      console.log(this.accesorio);
      this.servicioAccesorio.crearAccesorio(this.accesorio, estatusId).subscribe(
        response => {
          console.log(response);
          if (response.status === 200) {
            console.log('Registro Correcto');
            this.mensaje200Nuevo();
            setTimeout(() => { this.router.navigate(['IndexAccesorio']); }, 3000);
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

  soyCheck(accesorios: string) {
    let accesorio = accesorios;
  }


  cancelar() {
    this.router.navigate(['IndexAccesorio']);
    this.datosAccesorioForm.controls.nombre_accesorio.reset();
    this.datosAccesorioForm.controls.marca.reset();
    this.datosAccesorioForm.controls.modelo.reset();
    //this.datosAccesorioForm.controls.producto.reset();
    this.datosAccesorioForm.controls.hecho_en.reset();
    this.datosAccesorioForm.controls.serie.reset();
    this.datosAccesorioForm.controls.costo.reset();
    this.datosAccesorioForm.controls.descripcion.reset();
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
    this.toastr.warning('Llene los campos que tienen un (*)', 'Faltan datos');
  }
}
