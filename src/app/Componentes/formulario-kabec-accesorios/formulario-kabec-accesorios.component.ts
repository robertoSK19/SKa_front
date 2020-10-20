import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Accesorios } from 'src/app/Models/accesorios/accesorios.interface';
import { Asignacion } from 'src/app/Models/asignacion/asignacion.interface';
import { Asignacion_accesorios } from 'src/app/Models/asignacion/asignacion_accesorios.interface';
import { ServiciosService } from 'src/app/Servicios/servicios.service';
import { accesoriosID } from '../agregar-responsivas/agregar-responsivas.component';
import { letra, PdfKabecAccesoriosComponent } from '../formatos_pdf/pdf-kabec-accesorios/pdf-kabec-accesorios.component';
import { DataService } from '../list/data.service';

const idEestatusAsignada = 1;
const idEstatusNoAsignada = 2;
let total = 0;

let datosAsignacion: Asignacion_accesorios = {
  nombre_consultor: '',
  fecha_asignacion: '',
  costo: 0,
  letra: '',
  usuario: ''
};

let accesorio: Accesorios = {
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
  ram_ranura: '',
}

let datosAccesorioG: Accesorios;

@Component({
  selector: 'app-formulario-kabec-accesorios',
  templateUrl: './formulario-kabec-accesorios.component.html',
  styleUrls: ['./formulario-kabec-accesorios.component.scss']
})
export class FormularioKabecAccesoriosComponent implements OnInit {

  @ViewChild(PdfKabecAccesoriosComponent, { static: false }) pdf: PdfKabecAccesoriosComponent;
  public uno = PdfKabecAccesoriosComponent;

  idAccesorios: any[];
  datosRespForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    protected servicioConUser: ServiciosService,
    private router: Router,
    private ServiceConsulta: DataService,
    public datepipe: DatePipe,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.idAccesorios = accesoriosID;
    this.datosRespForm = this.formBuilder.group({
      responsable: ['', Validators.required],
      comentarios: [''],
      costoTotal: ['', Validators.required]
    });
    total = 0;
    accesoriosID.map(x => {
      total = x.costo + total;
    })
    document.getElementById("total").value = total;
  }

  usuarioLogeado() {
    const token = this.servicioConUser.getToken();
    if (token.length !== 0 && accesoriosID.length !== 0) {
      console.log('acceso correcto');
    } else {
      console.log('error en el acceso');
      this.router.navigate(['Login']);
    }
  }


  generarResponsiva(opcion: string) {
    const date = new Date();
    const accion = opcion;
    const nombre = this.datosRespForm.controls.responsable.value;
    const comentarios = this.datosRespForm.controls.comentarios.value;
    const fecha = this.datepipe.transform(date, 'yyyy-MM-dd');
    const nombreDia = this.datepipe.transform(date, 'EEEE');
    const costoTotal = this.datosRespForm.controls.costoTotal.value;
    if (nombre === '') {
      this.mensajeDatosVacios();
    } else {
      let datosAsignacionC = [];
      accesoriosID.map(accesorio => {
        const costoAccesorio = accesorio.costo
        datosAsignacion = {
          nombre_consultor: nombre,
          costo: Number(costoTotal),
          letra: costoTotal,
          fecha_asignacion: fecha,
          usuario: '',
        }
        datosAsignacionC.push(datosAsignacion)
      })
      if (accion === 'vista') {
        this.uno.prototype.generarPDF(accion, accesoriosID, nombreDia, datosAsignacionC, costoTotal);
      } else if (accion === 'crear') {
        this.idAccesorios.map(obj => {
          let id = obj.idAccesorios;
          this.ServiceConsulta.getAccesorio(id).subscribe(
            response => {
              console.log(response.body);              
              datosAccesorioG = response.body;
              datosAccesorioG.descripcion = comentarios;
              this.ServiceConsulta.updateAccesorio(datosAccesorioG, idEestatusAsignada).subscribe(
                responseDE => {
                  let accesorioId = responseDE.body.id_accesorio;
                  console.log(responseDE.status);                  
                  if (responseDE.status === 200) {
                    this.ServiceConsulta.crearAsignacionAcc(idEestatusAsignada, datosAsignacion).subscribe(
                      responseA => {
                        let asignacionId = responseA.body.id_asignacion;
                        console.log(responseA.status);
                        if (responseA.status === 200) {
                          this.ServiceConsulta.crearAccesorioN(asignacionId, accesorioId).subscribe(
                            responseAA => {
                                console.log("Asignación Correcta");
                            }
                          )
                        } else {
                          this.ServiceConsulta.updateAccesorio(datosAccesorioG, idEstatusNoAsignada).subscribe();
                        }
                      }
                    )
                  }
                }
              );
            }
          );
        })
        this.uno.prototype.generarPDF(accion, accesoriosID, nombreDia, datosAsignacionC, costoTotal);
        this.mensajeResponsivaGenerada();
        setTimeout(() => { this.router.navigate(['IndexResponsiva']); }, 3000);
      }
    }
  }


  cancelar() {
    this.mensajeCancelar();
    setTimeout(() => { this.router.navigate(['AgregarResponsiva']); }, 1000);

  }
  mensaje200() {
    this.toastr.success('Se actualizaron los datos', 'Registro Actualizado');
  }
  mensaje204() {
    this.toastr.error('No se actualizaron los datos', 'Error en el registro');
  }
  mensaje500() {
    this.toastr.error('Intentar más tarde', 'Error del Servidor ');
  }
  mensaje400() {
    this.toastr.error('Datos de consulta incorrectos', 'Error en el servicio');
  }
  mensajeDatosVacios() {
    this.toastr.warning('Llene los campos que tienen un (*)', 'Faltan datos');
  }
  mensajeCancelar() {
    this.toastr.warning('Se canceló el formulario');
  }
  mensajeErrorVistaPrevia() {
    this.toastr.warning('Se presento un error para mostrar el archivo PDF', 'Error en Vista Previa');
  }
  mensajeErrorObtencionDatos() {
    this.toastr.warning('Se presento un error para obtener los datos del equipo', 'Error en los datos');
  }
  mensajeResponsivaGenerada() {
    this.toastr.success('Se descargará el archivo', 'Responsiva Generada');
  }
  mensajeErrorResponsiva() {
    this.toastr.error('La responsiva no pudo generarse', 'Fallo Generacion');
  }
}
