import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { CensoFollowupComponent } from '../zmodals/censo-followup/censo-followup.component';

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
  CensoComercializacion } from '../../../empresas/censo.model';

  import { CensoIndustriasQuery } from '../censo.model';

  import { CensoIndustrialService } from '../censo-industrial.service';

 
const ROLE_ADMIN =    'vigilancia:admin';
const ROLE_OPERATOR = 'vigilancia:operator';

const UPDATE =   'update';
const CANCEL =   'cancel';
const ERROR =    'error';

@Injectable()
export class FollowUpEsquemaModalService {
	private censo: CensoIndustrias;
	private dialogResult$ = new Subject<UpdateCensoEvent>();

  constructor(
    public dialog: MatDialog,
    private dsCtrl: CensoIndustrialService,

  	) {}


  openDialog(censo: CensoIndustrias ): Subject<UpdateCensoEvent>{
  	this.censo = censo;

    if(this.validateCredentials(censo)){
      this.loadCenso(censo._id)
    }

  	return this.dialogResult$;
  }

  private validateCredentials(censo: CensoIndustrias): boolean{
    if( !(this.checkUserPermission(ROLE_ADMIN) || this.checkUserPermission(ROLE_OPERATOR)) ){
      this.fireError('Acceso restringido', 'ATENCIÓN')
      return false;
    }
      
    return true;
  }

  private loadCenso(censoId){
    this.dsCtrl.fetchCensoById(censoId).subscribe(censo_record=> {
    	if(censo_record){

    		this.censo = censo_record;

        this.openModalDialog(this.censo);

    	}else {
    		this.fireError('Error: No se pudo recuperar la información del Censo', 'ATENCIÓN')
    		return;
    	}

    })

  }

  private checkIfHasFollowUpConfigured(censo): boolean{
    let valid = false;

    if(!censo.followUp) return valid;
    if(!(censo.followUp.isActive && censo.followUp.fe_inicio && censo.followUp.tipo) ) return valid;

    valid = true;
    return valid;
  }

  private checkUserPermission(role: string):boolean{
    //return this.dsCtrl.isUserMemberOf(role);
    return true;

  }


  private openModalDialog(censo: CensoIndustrias){
    const dialogRef = this.dialog.open(
      CensoFollowupComponent,
      {
        width: '800px',
        data: {
          censo: censo,
        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateCensoEvent) => {
        if(res) this.dialogResult$.next(res);
        else this.fireCancel();
    });    

  }

  private fireError(msj: string, action: string){
    this.dsCtrl.openSnackBar(msj, action);

  	this.dialogResult$.next({
  		action: ERROR,
  		type: msj,
  		token: this.censo
  	} as UpdateCensoEvent)
  }

  private fireCancel(){
  	this.dialogResult$.next({
  		action: CANCEL,
  		type: 'operación cancelada',
  		token: null
  	} as UpdateCensoEvent)
  }

}
