import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { devutils }from '../../../../develar-commons/utils';

import { SaludController } from '../../../salud.controller';

import {   Asistencia, AfectadoFollowUp, AfectadoUpdate, UpdateAsistenciaEvent,
          AsistenciaHelper } from '../../../asistencia/asistencia.model';


const UPDATE = 'update';
const BROWSE = 'browse';
const CANCEL = 'cancel';
const SISA_VIEW = 'sisa:view';



@Component({
  selector: 'vigilancia-seguimientohistory',
  templateUrl: './vigilancia-seguimientohistory.component.html',
  styleUrls: ['./vigilancia-seguimientohistory.component.scss']
})
export class VigilanciaSeguimientohistoryComponent implements OnInit {

  public asistencia: Asistencia;
  public token: AfectadoUpdate; // from DB
  public tokenData: TokenData; // template usage

	public tokenList: AfectadoUpdate[] = [];

  private result: UpdateAsistenciaEvent;

  public displayAs = '';

  public showAfectadoFollowUp = false;
 
  constructor(
        public dialogRef: MatDialogRef<VigilanciaSeguimientohistoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any ) {
  }

  ngOnInit(): void {
  	this.asistencia = this.data.asistencia
  	this.buildAfectadoFollowUp(this.asistencia);

  	this.token = new AfectadoUpdate();

  	this.result = {
							  		action: BROWSE,
							  		type: SISA_VIEW,
							  		token: this.asistencia
  								} as  UpdateAsistenciaEvent;
  }

  private buildAfectadoFollowUp(entity: Asistencia){
    this.displayAs = this.asistencia.requeridox ? this.asistencia.requeridox.slug + ' ' + (this.asistencia.telefono || '') : '';

    if(!entity.followUp){
      this.showAfectadoFollowUp = false;
      return;
    }
    this.tokenData = new TokenData(entity.followUp);

    this.tokenList = entity.seguimEvolucion || [];
    this.sortProperly(this.tokenList);

    this.showAfectadoFollowUp = true;
  }

  private sortProperly(records: AfectadoUpdate[]){
    records.sort((fel: AfectadoUpdate, sel: AfectadoUpdate)=> {
        if(fel.fets_llamado < sel.fets_llamado ) return 1;

        else if(fel.fets_llamado > sel.fets_llamado) return -1;

        else return 0;
    });
  }

  private closeDialogSuccess(){
    this.dialogRef.close(this.result);
  }

}

class TokenData {
  token: AfectadoFollowUp
	vector: string; 
	tipo: string; 
	lastCall: string; 

  constructor(token:AfectadoFollowUp){
    this.token = token;

		this.vector = AsistenciaHelper.getOptionLabel('vectorSeguim', token.vector);
		this.tipo = AsistenciaHelper.getOptionLabel('tipoFollowUp', token.tipo);
		this.lastCall = AsistenciaHelper.getOptionLabel('resultadoSeguim', token.lastCall);
  }
}

