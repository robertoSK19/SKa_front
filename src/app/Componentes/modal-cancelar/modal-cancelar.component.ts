import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../list/data.service';

export interface RespuestaModalC {
  comentario: string;
  valores: any;
}
@Component({
  selector: 'app-modal-cancelar',
  templateUrl: './modal-cancelar.component.html',
  styleUrls: ['./modal-cancelar.component.scss']
})
export class ModalCancelarComponent implements OnInit {
  comentario = new FormControl('');
  constructor(
    public dialogRef: MatDialogRef<ModalCancelarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RespuestaModalC,
    private dataSvc: DataService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    
  }
  cancelarAccion(){
    console.log('NO');
    this.dialogRef.close();
  //  this.mensajeCancelar();
  }

  confirmarAccion(){
    console.log('si');
  }
  mensajeCancelar() {
    this.toastr.error('No se cancelo la responsiva', 'Accion Cancelada');
  }

  mensajeCancelarResponsiva() {
    this.toastr.success('Se canceló la responsiva', 'Cancelación Correcta');
  }
}
