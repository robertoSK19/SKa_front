import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Software } from 'src/app/Models/Software/software.interface';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { DatosSoftware, idSoftware } from '../index-software/index-software.component';
import { DataService } from '../list/data.service';
import { RolesUser, usuarioRol } from '../login/login.component';

let datosUser: RolesUser = {
  rol: '',
  nombre: '',
  id: 0,
};

let datosSoftware: DatosSoftware;

@Component({
  selector: 'app-editar-software',
  templateUrl: './editar-software.component.html',
  styleUrls: ['./editar-software.component.scss']
})
export class EditarSoftwareComponent implements OnInit {

  datosSoftwareForm: FormGroup;
  public datosSoftware: Software = {
    id_software: '',
    fecha_licencia: '',
    no_serie: '',
    nombre_software: '',
  };
  software: Software;

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
    datosSoftware = idSoftware;
    console.log(datosSoftware)
    const token = this.servicioConUser.getToken();
    if ( token.length !== 0 && datosSoftware.idSoft !== '') {
      console.log('acceso correcto');
      this.getDatosSoftware();
    } else {
      console.log('error en el acceso');
      this.router.navigate(['IndexSoftware']);
    }
  }

  guardarDatos() {

  }
  cancelar(){

  }
  getDatosSoftware() {
    this.servicioSoftware.getSoftware(Number(datosSoftware.idSoft)).subscribe(
      response => {
        if (response.status === 200 ) {
          this.software = response.body;
          this.datosSoftwareForm.controls.nombre_software.setValue(this.software.nombre_software);
          this.datosSoftwareForm.controls.fecha_vigencia.setValue(this.software.fecha_licencia);
          this.datosSoftwareForm.controls.no_serie.setValue(this.datepipe.transform(this.software.no_serie, 'MM-dd-yyyy'));
        }
      },
      error => {
        this.mensajeErrorSoftware();
      }
    );
  }
  mensajeErrorSoftware() {
    this.toastr.error('No se pudo obtener los datos', 'Error del Servidor');
  }
  cargaDatos() {
    this.datosSoftwareForm.controls.nombre_software.setValue(this.software.nombre_software);
    this.datosSoftwareForm.controls.fecha_vigencia.setValue(this.software.fecha_licencia);
    this.datosSoftwareForm.controls.no_serie.setValue(this.software.no_serie);
  }
}
