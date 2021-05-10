import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';


import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


import {  CensoBienes,
          CensoIndustrias,
          CensoMaquinarias,
          CensoPatentes,
          CensoProductos,
          CensoExpectativas,
          CensoInversion,
          CensoRecursosHumanos,
          CensoFollowUp,
          UpdateCensoEvent,
          CensoComercializacion } from '../../../../empresas/censo.model';

import { CensoIndustriasHelper, TipoEmpresa } from '../../censo-industrial.helper';
import { CensoIndustrialService } from '../../censo-industrial.service';
import { devutils } from '../../../../develar-commons/utils';
import { CensoIndustriasController } from '../../../../empresas/censo.controller';

const UPDATE = 'update';
const CANCEL = 'cancel';
const SEGUIMIENTO_ESTADO = 'seguimiento:estado';
const ASIGNAR_MSJ =    'APLICAR esta asignación a los contactos';
const DESASIGNAR_MSJ = 'QUITAR asignación a los contactos';

@Component({
  selector: 'censo-followup-modal',
  templateUrl: './censo-followup.component.html',
  styleUrls: ['./censo-followup.component.scss']
})
export class CensoFollowupComponent implements OnInit {
  public form: FormGroup;
  public formClosed = false;

  // template helpers
  public displayAs = '';

  private result: UpdateCensoEvent;


  public censo: CensoIndustrias;
  public seguimientoEvent: CensoFollowUp;
  private isNewRecord = false;

  public usersOptList = [];

  private asignadoId: string; 
  public asignadoSlug: string;
  private asigneeMsj: string;


  constructor(
    private censoService: CensoIndustrialService,
    private censoController: CensoIndustriasController,
    public dialogRef: MatDialogRef<CensoFollowupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb : FormBuilder) { }

  ngOnInit(): void {
    this.censo = this.data.censo;
    this.initOnce();
    this.initForEdit();
  }

  onSubmit(){
    this.formClosed = true;
    this.result.action = UPDATE;
  	this.initForSave()
  	this.saveToken();
  }

  onCancel(){
    this.result.action = CANCEL;
		this.dialogRef.close();
  }

  changeSelectionValue(type, value){
    if(type === 'asignadoId'){
      this.asignUserToFollowUp(value)
    }

  }

  changeAsignado(e: MatCheckboxChange){

    if(e.checked){
      let userId = this.form.get('asignadoId').value;
      if(userId){
        this.asignUserToFollowUp(userId);

      }else {
        this.asignadoId = null
        this.asignadoSlug = ''
        this.form.get('isAsignado').setValue(false);
        this.asigneeMsj = DESASIGNAR_MSJ;
       
      }

    }else {
      this.asignadoId = null
      this.asignadoSlug = ''
      this.asigneeMsj = DESASIGNAR_MSJ;

    }
  }

  private asignUserToFollowUp(val){
    this.asignadoId = val;
    this.asignadoSlug = this.usersOptList.find(t => t.val === val).label;
    this.form.get('isAsignado').setValue(true);
 
  }

  private initOnce(){
    this.usersOptList = this.censoService.buildTuteladoresOptList();
    if(this.censo.followUp){
      this.isNewRecord = false;
      this.seguimientoEvent = this.censo.followUp;

    }else {
      this.isNewRecord = true;
      this.seguimientoEvent = new CensoFollowUp();
    }

    this.displayAs = this.censo.empresa ? this.censo.empresa.slug  : '';
    this.result = {
        action: UPDATE,
        type: SEGUIMIENTO_ESTADO,
        token: this.censo
      } as  UpdateCensoEvent;

  }


  private initForEdit(){
    this.formClosed = false;
    this.asignadoSlug = this.seguimientoEvent.asignadoSlug;
    this.asignadoId = this.seguimientoEvent.asignadoId;
    this.asigneeMsj = ''

    this.form = this.fb.group(this.seguimientoEvent);

  }

  private initForSave(){
  	let today = new Date();

    //this.seguimientoEvent = {...this.seguimientoEvent, ...this.form.value}
    Object.assign(this.seguimientoEvent, this.form.value);

    if(this.seguimientoEvent.isActive){
      this.seguimientoEvent.asignadoSlug = this.asignadoSlug
      this.seguimientoEvent.asignadoId = this.asignadoId

    }else{
      this.seguimientoEvent.asignadoSlug = ''
      this.seguimientoEvent.asignadoId = null
    }

    this.seguimientoEvent.fets_inicio = this.seguimientoEvent.fe_inicio ? devutils.dateNumFromTx(this.seguimientoEvent.fe_inicio) :  today.getTime();
    this.seguimientoEvent.fe_inicio = devutils.txFromDateTime(this.seguimientoEvent.fets_inicio);
    this.censo.followUp = this.seguimientoEvent;

    this.result.token = this.censo;
    this.result.type = SEGUIMIENTO_ESTADO;

  }


  private saveToken(){
    this.censoController.manageCensoIndustriasRecord(this.censo).subscribe(censo =>{
    	if(censo){
    		this.result.token = censo;
    		this.censoController.openSnackBar('Actualización exitosa', 'Cerrar');
    		this.closeDialogSuccess()
    	}else {
    		this.censoController.openSnackBar('Se produjo un error al intentar guardar sus datos', 'ATENCIÓN');
    	}
    })

  }

  private closeDialogSuccess(resultEnd? ){

    if(resultEnd)this.dialogRef.close(resultEnd);
    else this.dialogRef.close(this.result);
    
  }


}
