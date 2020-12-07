import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pase } from '../consulta.model';
import { ConsultaHelper } from '../consulta.helper';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'pases-from-consulta-modal',
  templateUrl: './pases-from-consulta-modal.component.html',
  styleUrls: ['./pases-from-consulta-modal.component.scss']
})
export class PasesFromConsultaModalComponent implements OnInit {

  public pase : Pase;
  public ejecucion : string;
  public sector : string;
  public isUserWeb : boolean = false;

  constructor(public dialogRef : MatDialogRef<PasesFromConsultaModalComponent>,
    private _userService : UserService,
    @Inject(MAT_DIALOG_DATA) public data : Pase) {
        this.pase = this.data;
     }

  ngOnInit(): void {
    this._userService.userEmitter.subscribe(user => {
      this.isUserWeb = user.isUsuarioWeb ? true : false;
    })
    this.ejecucion = ConsultaHelper.getOptionList('ejecucion').find( e => e.val === this.pase.ejecucion).label;
    this.sector = this.pase.sector ? ConsultaHelper.getOptionList('sectores').find( s => s.val === this.pase.sector).label : '';
  }

  close() : void {
    this.dialogRef.close();
  }

}
