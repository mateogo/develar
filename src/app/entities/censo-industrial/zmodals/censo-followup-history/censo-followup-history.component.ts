import { Component, OnInit, Inject } from '@angular/core';

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
const BROWSE = 'browse';
const CANCEL = 'cancel';
const SISA_VIEW = 'sisa:view';



@Component({
  selector: 'censo-followup-history',
  templateUrl: './censo-followup-history.component.html',
  styleUrls: ['./censo-followup-history.component.scss']
})
export class CensoFollowupHistoryComponent implements OnInit {

  public censo: CensoIndustrias;
  public token: CensoFollowUpUpdate; // from DB
  public tokenData: TokenData; // template usage

	public tokenList: CensoFollowUpUpdate[] = [];

  private result: UpdateCensoEvent;

  public displayAs = '';

  public showCensoFollowUp = false;
 
  constructor(
        public dialogRef: MatDialogRef<CensoFollowupHistoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any ) {
  }

  ngOnInit(): void {
  	this.censo = this.data.censo
  	this.buildCensoFollowUp(this.censo);

  	this.token = new CensoFollowUpUpdate();

  	this.result = {
							  		action: BROWSE,
							  		type: SISA_VIEW,
							  		token: this.censo
  								} as  UpdateCensoEvent;
  }

  getLabel(type: string, val: string){
    return CensoIndustriasHelper.getOptionLabel(type, val)
  }


  // auditData(token:CensoFollowUpUpdate ){
  //   return token.audit ? token.audit.username : ''

  // }

  private buildCensoFollowUp(entity: CensoIndustrias){
    this.displayAs = entity.empresa ? entity.empresa.slug  : '';

    if(!entity.followUp){
      this.showCensoFollowUp = false;
      return;
    }
    this.tokenData = new TokenData(entity.followUp);

    this.tokenList = entity.followUpdates || [];
    this.sortProperly(this.tokenList);

    this.showCensoFollowUp = true;
  }

  private sortProperly(records: CensoFollowUpUpdate[]){
    records.sort((fel: CensoFollowUpUpdate, sel: CensoFollowUpUpdate)=> {
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
  token: CensoFollowUp
	vector: string; 
	tipo: string; 
	lastCall: string; 
  nextCall: string;

  constructor(token:CensoFollowUp){
    this.token = token;
    this.nextCall = token.fets_nextLlamado ? devutils.txFromDateTime(token.fets_nextLlamado) : 'no programado';


		this.lastCall = CensoIndustriasHelper.getOptionLabel('resultadoFwUp', token.lastCall);
  }

}
