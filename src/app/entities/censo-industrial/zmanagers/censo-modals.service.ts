import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { CensoIndustrialService } from '../censo-industrial.service';

import { UpdateCensoEvent } from '../../../empresas/censo.model';

import { ActividadEmpresa, TamanioEmpresa, CensoEmpresarialHelper} from '../censo-empresarial-helper';

import { CensoEmpActividadesModalComponent } from '../zmodals/censo-emp-actividades-modal/censo-emp-actividades-modal.component';
import { CensoEmpTamanioModalComponent } from '../zmodals/censo-emp-tamanio-modal/censo-emp-tamanio-modal.component';

const ROLE_ADMIN =    'vigilancia:admin';
const ROLE_OPERATOR = 'vigilancia:operator';

const UPDATE =   'update';
const CANCEL =   'cancel';
const ERROR =    'error';

@Injectable()
export class CensoEmpresarialModalService {
	private dialogResult$ = new Subject<UpdateCensoEvent>();

  private actividadesEmpresa: ActividadEmpresa[];
  private rubrosEmpresa: TamanioEmpresa[];

  constructor(
    public dialog: MatDialog,
    private dsCtrl: CensoIndustrialService,

  	) {}


  openActividadEmpresa( actividadesEmpresa: ActividadEmpresa[],  target?: string ): Subject<UpdateCensoEvent>{
  	this.actividadesEmpresa = actividadesEmpresa;
    this.actividadesEmpresaDialog(this.actividadesEmpresa);

  	return this.dialogResult$;
  }

  openTamanioEmpresa( rubroEmpresas: TamanioEmpresa[],  target?: string ): Subject<UpdateCensoEvent>{
  	this.rubrosEmpresa = rubroEmpresas;
    this.tamanioEmpresaDialog(this.rubrosEmpresa);

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
   * TAMAÑO CATEGORIA / RUBRO EMPRESA
  */
   private tamanioEmpresaDialog(tamanios: TamanioEmpresa[]){
    const dialogRef = this.dialog.open(
      CensoEmpTamanioModalComponent,
      {
        width: '800px',
        height: '70vh',
        data: {
          tamanios: tamanios,
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
