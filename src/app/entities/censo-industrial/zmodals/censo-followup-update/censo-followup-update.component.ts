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
          CensoFollowUpUpdate,
          UpdateCensoEvent,
          CensoComercializacion } from '../../../../empresas/censo.model';

import { CensoIndustriasHelper, TipoEmpresa } from '../../censo-industrial.helper';
import { CensoIndustrialService } from '../../censo-industrial.service';
import { devutils } from '../../../../develar-commons/utils';
import { CensoIndustriasController } from '../../../../empresas/censo.controller';

const UPDATE = 'update';
const CANCEL = 'cancel';
const SEGUIMIENTO_ESTADO = 'seguimiento:update';
const ASIGNAR_MSJ =    'APLICAR esta asignación a los contactos';
const DESASIGNAR_MSJ = 'QUITAR asignación a los contactos';
const LLAMADO_LOGRADO = 'logrado'

@Component({
  selector: 'censo-followup-update',
  templateUrl: './censo-followup-update.component.html',
  styleUrls: ['./censo-followup-update.component.scss']
})
export class CensoFollowupUpdateComponent implements OnInit {
  public form: FormGroup;
  public formClosed = false;

  // template helpers
  public displayAs = '';

  private result: UpdateCensoEvent;


  public censo: CensoIndustrias;
  public followUpdate: CensoFollowUpUpdate;
  private isNewRecord = false;

  public avanceFwUp = CensoIndustriasHelper.getOptionlist('avanceFwUp');
  public resultadoFwUp = CensoIndustriasHelper.getOptionlist('resultadoFwUp');
  public offsetFwUp = CensoIndustriasHelper.getOptionlist('offsetFwUp');

  CensoIndustriasHelper

  constructor(
    private censoService: CensoIndustrialService,
    private censoController: CensoIndustriasController,
    public dialogRef: MatDialogRef<CensoFollowupUpdateComponent>,
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

  }

  finalizarFollowUp(){

  }



  private initOnce(){
    this.isNewRecord = true;
    this.followUpdate = new CensoFollowUpUpdate();
    if(!this.censo.followUp) this.censo.followUp = new CensoFollowUp();

    this.displayAs = this.censo.empresa ? this.censo.empresa.slug  : '';
    this.result = {
        action: UPDATE,
        type: SEGUIMIENTO_ESTADO,
        token: this.censo
      } as  UpdateCensoEvent;

  }


  private initForEdit(){
    this.formClosed = false;
    this.followUpdate.fe_llamado = devutils.txFromDate(new Date());
    this.followUpdate.fets_llamado = devutils.dateNumFromTx(this.followUpdate.fe_llamado);
  
    this.followUpdate.isActive = this.censo.followUp.isActive;
    this.followUpdate.endingFollowUp = this.censo.followUp.endingFollowUp || false;
    this.form = this.fb.group(this.followUpdate);
  }

  private initForSave(){
  	let today = new Date();

    //this.followUpdate = {...this.followUpdate, ...this.form.value}
    Object.assign(this.followUpdate, this.form.value);

    this.followUpdate.fets_llamado = this.followUpdate.fe_llamado ? devutils.dateNumFromTx(this.followUpdate.fe_llamado) :  today.getTime();
    this.followUpdate.fe_llamado = devutils.txFromDateTime(this.followUpdate.fets_llamado);

    this.followUpdate.audit = this.censoController.buildAuditData();

    if(!(this.censo.followUpdates && this.censo.followUpdates.length) ) this.censo.followUpdates = [];
    this.censo.followUpdates.push(this.followUpdate);
    this.updateFollowUp(this.followUpdate, this.censo.followUp, today );

    this.result.token = this.censo;
    this.result.type = SEGUIMIENTO_ESTADO;
  }

  private updateFollowUp(token: CensoFollowUpUpdate, afectado: CensoFollowUp, today: Date){
		afectado.isActive = token.isActive;
    afectado.endingFollowUp = token.endingFollowUp;

    afectado.nuevollamadoOffset = token.nuevollamadoOffset;
    afectado.fets_nextLlamado = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (token.nuevollamadoOffset || 1)).getTime();

    afectado.fe_ullamado = token.fe_llamado;
  	afectado.fets_ullamado = today.getTime();
  	afectado.qllamados = afectado.qllamados ? afectado.qllamados += 1 : 1;

		afectado.slug = token.slug;

		if(token.resultado === LLAMADO_LOGRADO){
			afectado.fe_ucontacto = token.fe_llamado;
      afectado.avance = token.avance;

			afectado.fets_ucontacto = today.getTime();
			afectado.qcontactos = afectado.qcontactos ? afectado.qcontactos += 1 : 1;
		
			afectado.lastCall = token.resultado;
			afectado.qIntents = 0;


  	}else {
  			if(afectado.lastCall === LLAMADO_LOGRADO){
  				afectado.qIntents = 0;
  			}

				afectado.lastCall = token.resultado;
  			afectado.qIntents += 1;
  	}

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
