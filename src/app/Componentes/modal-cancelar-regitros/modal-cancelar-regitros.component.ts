import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { equipo, usuarioC, accesorio, responsiva, softwareC, edicion} from 'src/app/Constantes/constante';

export interface NombreFormulario {
  nombre: string;
  opcion: string;
}

@Component({
  selector: 'app-modal-cancelar-regitros',
  templateUrl: './modal-cancelar-regitros.component.html',
  styleUrls: ['./modal-cancelar-regitros.component.scss']
})
export class ModalCancelarRegitrosComponent implements OnInit {
  titulo = 'Cancelar ';
  TxtLbl1 = 'Esta por salir del formulario';
  TxtLbl2 = ', ¿Desea salir?';
  TxtLbl3 = 'Nota: se perdera la información ingresada';
  Espacio = ' ';
  constructor(
    public dialogRef: MatDialogRef<ModalCancelarRegitrosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NombreFormulario,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
  }

  confirmarAccion(nombre: string, opcion: string) {
    switch (nombre) {
      case equipo:
        this.router.navigate(['IndexEquipo']);
        break;
      case accesorio:
        this.router.navigate(['IndexAccesorio']);
        break;
      case usuarioC:
        this.router.navigate(['IndexUsuario']);
        break;
      case responsiva:
        this.router.navigate(['AgregarResponsiva']);
        break;
      case softwareC:
        this.router.navigate(['IndexSoftware']);
        break;
    }
    this.mensajecancelar();
    this.dialogRef.close();
  }

  cancelarAccion() {
    this.dialogRef.close();
  }
  mensajecancelar() {
    this.toastr.success('Se cancelo el registro', 'Registro cancelado');
  }
}
