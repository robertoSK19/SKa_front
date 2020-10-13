import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

let facturaBase = null;

@Component({
  selector: 'app-agregar-software',
  templateUrl: './agregar-software.component.html',
  styleUrls: ['./agregar-software.component.scss']
})
export class AgregarSoftwareComponent implements OnInit {
  datosSoftwareForm: FormGroup;
  public datosSoftware: Software = {
    id_software: '',
    no_serie: '',
    version: '',
    vigencia_inicial: '',
    vigencia_final: '',
    tipo_licencia: '',
    nombre_software: '',
    factura: null,
    tipo_software: ''
  };

  tipoLicenciaE: any[] = [
    { nombre: 'Original' },
    { nombre: 'Generico' },
  ];

  tipoSoftwareE: any[] = [
    { nombre: 'Sistema Operativo' },
    { nombre: 'Ofimatica' },
    { nombre: 'Antivirus' },
    { nombre: 'Otros' }
  ];

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
      no_serie: [''],
      vigencia_final: [''],
      vigencia_inicial: [''],
      version: [''],
      tipo_licencia: [''],
      factura: [''],
      tipo_software: ['']
    });
  }

  handleUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      facturaBase = reader.result;
    };
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

  guardarDatos() {    
    const nombreForm = this.datosSoftwareForm.controls.nombre_software.value;
    const noSerieForm = this.datosSoftwareForm.controls.no_serie.value;
    const versionForm = this.datosSoftwareForm.controls.version.value;
    const inicialForm = "";
    const finalForm = "";
    const tipoSoftForm = this.datosSoftwareForm.controls.tipo_software.value;
    const tipoLicenciaForm = this.datosSoftwareForm.controls.tipo_licencia.value;
    const facturaForm = btoa(facturaBase);
    console.log(nombreForm, noSerieForm, versionForm, inicialForm, finalForm, tipoSoftForm, tipoLicenciaForm, facturaForm);

    if (nombreForm !== '' && noSerieForm !== '') {
      console.log('datos correctos');
      facturaBase = btoa(facturaBase);
      this.datosSoftware = {
        id_software: '',
        nombre_software: nombreForm,
        no_serie: noSerieForm,
        version: versionForm,
        vigencia_inicial: inicialForm,
        vigencia_final: finalForm,
        tipo_software: tipoSoftForm,
        tipo_licencia: tipoLicenciaForm,
        factura: facturaBase,
      };
      console.log(this.datosSoftware);
      this.servicioSoftware.crearSoftware(this.datosSoftware).subscribe(
        response => {
          if (response.status === 200) {
            this.mensaje200Nuevo();
            console.log('ok');
            setTimeout(() => { this.router.navigate(['IndexSoftware']); }, 2000);
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

  tipoSoftwareSelect(tipo: string) {
    console.log(tipo);
    console.log("Si entre");

    let a = document.getElementById('select');
    let b = document.getElementById('original');
    let c = document.getElementById('generico');

    if (tipo === "Original") {
      a.className = 'visible';
      b.className = 'visible';
      c.className = 'invisible';
    } else if (tipo === "Generico") {
      a.className = 'visible';
      b.className = 'invisible';
      c.className = 'visible';
    }
  }

  cancelar() {
    this.mensajeCancelar();
    setTimeout(() => { this.router.navigate(['IndexSoftware']); }, 1000);

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
