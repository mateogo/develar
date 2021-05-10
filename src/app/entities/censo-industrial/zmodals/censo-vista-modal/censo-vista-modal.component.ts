import { Component, OnInit, Inject } from '@angular/core';


import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


import {  CensoIndustrias,
          UpdateCensoEvent } from '../../../../empresas/censo.model';


const UPDATE = 'update';
const CANCEL = 'cancel';
const EVENT_TYPE = 'seguimiento:vista';

@Component({
  selector: 'censo-vista-modal',
  templateUrl: './censo-vista-modal.component.html',
  styleUrls: ['./censo-vista-modal.component.scss']
})
export class CensoVistaModalComponent implements OnInit {

  // template helpers
  public displayAs = '';

  private result: UpdateCensoEvent;

  public censo: CensoIndustrias;


  constructor(
    public dialogRef: MatDialogRef<CensoVistaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit(): void {
    this.censo = this.data.censo;
    console.log('modal opened')
    this.initOnce();
  }

  onSubmit(){
    this.result.action = CANCEL;
		this.dialogRef.close();
  }

  onCancel(){
    this.result.action = CANCEL;
		this.dialogRef.close();
  }



  private initOnce(){

    this.displayAs = this.censo.empresa ? this.censo.empresa.slug  : '';
    this.result = {
        action: UPDATE,
        type: EVENT_TYPE,
        token: this.censo
      } as  UpdateCensoEvent;

  }

  private closeDialogSuccess(resultEnd? ){

    if(resultEnd)this.dialogRef.close(resultEnd);
    else this.dialogRef.close(this.result);
    
  }


}
