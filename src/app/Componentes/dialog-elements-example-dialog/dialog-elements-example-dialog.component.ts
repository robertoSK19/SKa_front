import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { idValor } from '../index-equipos/index-equipos.component';
import { DataService } from '../list/data.service';


@Component({
  selector: 'app-dialog-elements-example-dialog',
  templateUrl: './dialog-elements-example-dialog.component.html',
  styleUrls: ['./dialog-elements-example-dialog.component.scss']
})
export class DialogElementsExampleDialog implements OnInit{
  historico: any[];
  software: any[];


  constructor(
    private dataSvc: DataService,
    private toastr: ToastrService,
  ){}

  ngOnInit(){
    let recibeResp: Array<any> = [];
    let guarda: Array<any>;
    this.dataSvc.getEquipo(idValor).subscribe(
      response => {
        recibeResp[0] = response.body;

        recibeResp.map(guardo => {
           guarda = guardo.historico;        
        })
        this.historico = guarda;       
      },
      error => {
        console.log(error);
        this.mensaje500();
      }
    );
  }


  mostrarTabla(historicoId:string) {
    let a = document.getElementById('tabla');
    let recibeResp: Array<any> = [];
    let guarda: Array<any>;
    this.dataSvc.getHistorico(historicoId).subscribe(
      response => {
        recibeResp[0] = response.body;
        
        recibeResp.map(guardo => {
          guarda = guardo.software; 
          console.log(guarda);      
       })
       this.software = guarda;       
      },
      error => {
        console.log(error);
        this.mensaje500();
      }
    );

    if(a.className === 'invisible table'){
      a.className = 'visible table';
    }else{
      a.className = 'visible table';
    }
  }

  mensaje500() {
    this.toastr.error('Intentar más tarde', 'Error del Servidor ');
  }
}
