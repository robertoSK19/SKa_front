import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../list/data.service';


@Component({
  selector: 'app-dialog-elements-example-dialog',
  templateUrl: './dialog-elements-example-dialog.component.html',
  styleUrls: ['./dialog-elements-example-dialog.component.scss']
})
export class DialogElementsExampleDialog implements OnInit{
  historico: any[];
  historicoBack: any[];


  constructor(
    private dataSvc: DataService,
    private toastr: ToastrService,
  ){}

  ngOnInit(){
    this.dataSvc.getAllHistorico().subscribe(
      response => {
        console.log(response.body);
        
        this.historico = response.body;
        this.historicoBack = response.body;
      },
      error => {
        console.log(error);
        this.mensaje500();
      }
    );
  }
  

  mostrarTabla() {
  
    let a = document.getElementById('tabla');

    if(a.className === 'invisible'){
      a.className = 'visible';
    }else{
      a.className = 'visible';
    }
  }

  mensaje500() {
    this.toastr.error('Intentar más tarde', 'Error del Servidor ');
  }
}
