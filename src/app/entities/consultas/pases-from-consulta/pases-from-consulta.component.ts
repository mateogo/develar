import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsultasService } from '../consultas.service';
import { PasesList } from '../consulta.model';
import { ConsultaHelper } from '../consulta.helper';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PasesFromConsultaModalComponent } from '../pases-from-consulta-modal/pases-from-consulta-modal.component';

@Component({
  selector: 'app-pases-from-consulta',
  templateUrl: './pases-from-consulta.component.html',
  styleUrls: ['./pases-from-consulta.component.scss']
})
export class PasesFromConsultaComponent implements OnInit {

  public idConsulta : string;
  public pases : Array<PasesList>;
  constructor(private _route : ActivatedRoute,
    private _consultaService : ConsultasService,
    public _dialog : MatDialog,
    public dialogRef : MatDialogRef<PasesFromConsultaComponent>,
    @Inject(MAT_DIALOG_DATA) public data : string) {
    //this.idConsulta = this._route.snapshot.params.id;
   }

  ngOnInit(): void {

    
    this.idConsulta = this.data;
    this._consultaService.fetchById(this.idConsulta).then(consulta => {
      if(consulta){
        if(consulta.pases && consulta.pases.length){
          this.pases = ConsultaHelper.buildPasesList(consulta.pases);
          
        }
      }
    })
  }

  openModal(pase : PasesList){
    const dialogRef = this._dialog.open(PasesFromConsultaModalComponent, {
      data : pase.pase
    })
  }

  volver() : void {
    this.dialogRef.close();
  }

}
