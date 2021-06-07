import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { CensoIndustrialService } from '../censo-industrial.service';

import { UpdateCensoEvent } from '../../../empresas/censo.model';

import { ActividadEmpresa, CensoEmpresarialHelper} from '../censo-empresarial-helper';

import { CensoEmpActividadesModalComponent } from '../zmodals/censo-emp-actividades-modal/censo-emp-actividades-modal.component';
 
const ROLE_ADMIN =    'vigilancia:admin';
const ROLE_OPERATOR = 'vigilancia:operator';

const UPDATE =   'update';
const CANCEL =   'cancel';
const ERROR =    'error';

@Injectable()
export class CensoEmpresarialModalService {
	private dialogResult$ = new Subject<UpdateCensoEvent>();

  private actividadesEmpresa: ActividadEmpresa[];

  constructor(
    public dialog: MatDialog,
    private dsCtrl: CensoIndustrialService,

  	) {}


  openActividadEmpresa( actividadesEmpresa: ActividadEmpresa[],  target?: string ): Subject<UpdateCensoEvent>{
  	this.actividadesEmpresa = actividadesEmpresa;
    this.actividadesEmpresaDialog(this.actividadesEmpresa);

  	return this.dialogResult$;
  }


  /** 
   * DISPATCHER
  */
   //private openModalDialog(censo: CensoIndustrias, target?: string){
    //if(target === 'followhistory')   this.followHistoryDialog(censo);
  //}

  /** 
   * ACTIVIDADES EMPRESA
  */
   private actividadesEmpresaDialog(actividades: ActividadEmpresa[]){
    const dialogRef = this.dialog.open(
      CensoEmpActividadesModalComponent,
      {
        width: '800px',
        height: '70vh',
        data: {
          actividades: actividades,
        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateCensoEvent) => {
        if(res) this.dialogResult$.next(res);
        else this._fireCancel();
    });    

  }

      
  /** 
   * CIERRE DE LA VENTANA MODAL CON ERROR O CANCEL
  */
  private _fireError(msj: string, action: string){
    this.dsCtrl.openSnackBar(msj, action);

    this.dialogResult$.next({
  		action: ERROR,
  		type: msj,
  		token: null
  	} as UpdateCensoEvent)
  }

  private _fireCancel(){
  	this.dialogResult$.next({
  		action: CANCEL,
  		type: 'operación cancelada',
  		token: null
  	} as UpdateCensoEvent)
  }

}
