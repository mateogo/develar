import { Injectable } from '@angular/core';

import { MatSnackBar, MatSnackBarConfig }           from '@angular/material';
import { MatDialog, MatDialogRef, MatSelectChange } from '@angular/material';
import { DataSource, SelectionModel }               from '@angular/cdk/collections';

import { BehaviorSubject ,  Subject ,  Observable, of } from 'rxjs';
import { devutils } from '../../develar-commons/utils';

import { catchError }     from 'rxjs/operators';

import { DaoService }    from '../../develar-commons/dao.service';

import { LocacionHelper } from './locacion.helper';

import { LocacionHospitalaria, LocacionHospTable, LocacionHospBrowse, LocacionEvent} from './locacion.model';

const RECORD = 'locacionhospitalaria'


@Injectable({
  providedIn: 'root'
})
export class LocacionService {

  private _locacionesSelector: LocacionHospBrowse;
  private _selectionModel: SelectionModel<LocacionHospTable>
  private emitLocHospDataSource = new BehaviorSubject<LocacionHospTable[]>([]);
  private locacionesList: Array<LocacionHospitalaria> = [];


	constructor(
		private daoService: DaoService,
    private snackBar:    MatSnackBar,
		) {}



  /******************************************/
  /******* Locaciones Hospitalarias ********/
  /****************************************/
  manageLocacionesRecord(locacionhosp:LocacionHospitalaria ): Subject<LocacionHospitalaria>{

    let listener = new Subject<LocacionHospitalaria>();

    if(this.isNewLocacion(locacionhosp)){
      this.createLocacionHospitalaria(listener, locacionhosp);

    }else{
      this.updateLocacionHospitalaria(listener, locacionhosp);

    }

    return listener;
  }

  private isNewLocacion(token:LocacionHospitalaria): boolean{
    let isNew = true;

    if(token._id){
      isNew = false;
    }

    return isNew;
  }


  /******* UPDATE REMITO ********/
  private updateLocacionHospitalaria(listener:Subject<LocacionHospitalaria>,  locacionhosp:LocacionHospitalaria){
 
    this.initLocacionHospitalariaForUpdate(locacionhosp);

    this.daoService.update<LocacionHospitalaria>(RECORD, locacionhosp._id, locacionhosp).then(t =>{
      listener.next(t);
    })
  }
 
  private initLocacionHospitalariaForUpdate(locacionhosp: LocacionHospitalaria){
    let today = new Date()

    locacionhosp.ts_umodif = today.getTime();

  }

  /******* CREATE REMITO ********/
  private createLocacionHospitalaria(listener:Subject<LocacionHospitalaria>, locacionhosp: LocacionHospitalaria){
    let today = new Date()

    locacionhosp.fecha_tx = devutils.txFromDate(today);

    locacionhosp.ts_alta =   devutils.dateFromTx(locacionhosp.fecha_tx).getTime()
    locacionhosp.ts_umodif = today.getTime();

    this.daoService.create<LocacionHospitalaria>(RECORD, locacionhosp).then(token =>{
      listener.next(token);
    });
  }

  /******************************************/
  /******* Locaciones Hosp Search   ********/
  /****************************************/

  fetchLocacionById(id: string):Promise<LocacionHospitalaria>{
    let listener = new Subject<LocacionHospitalaria[]>();
    return this.daoService.findById(RECORD, id);
  }

  fetchLocacionesByQuery(query:any):Subject<LocacionHospitalaria[]>{
    let listener = new Subject<LocacionHospitalaria[]>();
    this.loadLocHospitalariaByQuery(listener, query);
    return listener;
  }

  private loadLocHospitalariaByQuery(listener: Subject<LocacionHospitalaria[]>, query){
    this.daoService.search<LocacionHospitalaria>(RECORD, query).subscribe(list =>{
      if(list && list.length){
        this.locacionesList = list;

      }else{
        this.locacionesList = [];

      }
      listener.next(this.locacionesList);
    })
  }


  /******************************************/
  /******* Locaciones Hosp Browsing ********/
  /****************************************/

  // Browse Solicitud de LocacionHospitalaria Form Data 
  get locacionesSelector():LocacionHospBrowse{
    if(!this._locacionesSelector) this._locacionesSelector = new LocacionHospBrowse();
    return this._locacionesSelector;
  }
  
  set locacionesSelector(e: LocacionHospBrowse){
    this._locacionesSelector = e;
  }

  /*****  SLocacionHospitalaria TABLE table Table    ****/
  get locacionesDataSource(): BehaviorSubject<LocacionHospTable[]>{
    return this.emitLocHospDataSource;
  }

  get selectionModel(): SelectionModel<LocacionHospTable>{
    return this._selectionModel;
  }

  set selectionModel(selection: SelectionModel<LocacionHospTable>){
    this._selectionModel = selection;
  }

  get tableActions(){
    return LocacionHelper.getOptionlist('tableactions');
  }


  updateTableData(){
    let tableData = LocacionHelper.buildDataTable(this.locacionesList);
    this.emitLocHospDataSource.next(tableData);
  }


  /***************************/
  /** Notification HELPER ****/
  /***************************/
  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {duration: 3000});

    snck.onAction().subscribe((e)=> {
      //console.log('action???? [%s]', e);
    })
  }



}
