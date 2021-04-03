import { Injectable } from '@angular/core';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { DataSource, SelectionModel }               from '@angular/cdk/collections';

import { BehaviorSubject ,  Subject ,  Observable, of } from 'rxjs';
import { devutils } from '../../develar-commons/utils';

import { catchError }     from 'rxjs/operators';

import { DaoService }    from '../../develar-commons/dao.service';

import { LocacionHelper } from './locacion.helper';

import { LocacionHospitalaria, LocacionHospTable, OcupacionHospitalaria, OcupacionHospitalariaTable, LocacionHospBrowse, OcupacionHospitalariaBrowse, LocacionEvent} from './locacion.model';

const LOCACION_RECORD = 'locacionhospitalaria';
const OCUPACION_RECORD = 'ocupacionhospitalaria'


@Injectable({
  providedIn: 'root'
})
export class LocacionService {

  private _locacionesSelector: LocacionHospBrowse;
  private _selectionModel: SelectionModel<LocacionHospTable>
  private emitLocHospDataSource = new BehaviorSubject<LocacionHospTable[]>([]);
  private locacionesList: Array<LocacionHospitalaria> = [];

  private ocupacionHospList: Array<OcupacionHospitalaria> = [];
  private _ocupacionHospitalariaSelector: OcupacionHospitalariaBrowse;
  private _ocupacionSelectionModel: SelectionModel<OcupacionHospitalariaTable>
  private emitOcupacionHospitalariaDataSource = new BehaviorSubject<OcupacionHospitalariaTable[]>([]);


	constructor(
		private daoService: DaoService,
    private snackBar:    MatSnackBar,
		) {}

    ocupacionhospitalaria

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
    return token._id ? false : true;
  }


  /******* UPDATE LOCACION HOSP ********/
  private updateLocacionHospitalaria(listener:Subject<LocacionHospitalaria>,  locacionhosp:LocacionHospitalaria){
    let today = new Date()
    locacionhosp.ts_umodif = today.getTime();
 
    this.daoService.update<LocacionHospitalaria>(LOCACION_RECORD, locacionhosp._id, locacionhosp).then(t =>{
      listener.next(t);
    })
  }

  /******* CREATE LOCACION HOSP ********/
  private createLocacionHospitalaria(listener:Subject<LocacionHospitalaria>, locacionhosp: LocacionHospitalaria){
    let today = new Date()

    locacionhosp.fecha_tx = devutils.txFromDate(today);

    locacionhosp.ts_alta =   devutils.dateFromTx(locacionhosp.fecha_tx).getTime()
    locacionhosp.ts_umodif = today.getTime();

    this.daoService.create<LocacionHospitalaria>(LOCACION_RECORD, locacionhosp).then(token =>{
      listener.next(token);
    });
  }


  /******************************************/
  /******* Ocupación Hospitalaria   ********/
  /****************************************/
  manageOcupacionRecord(ocupacionhosp:OcupacionHospitalaria ): Subject<OcupacionHospitalaria>{
    let listener = new Subject<OcupacionHospitalaria>();

    if(this._isNewOcupacion(ocupacionhosp)){
      this._createOcupacionHospitalaria(listener, ocupacionhosp);

    }else{
      this._updateOcupacionHospitalaria(listener, ocupacionhosp);
    }
    return listener;
  }

  private _isNewOcupacion(token:OcupacionHospitalaria): boolean{
    return token._id ? false : true;
  }

  /******* UPDATE OCUPACIÓN ********/
  private _updateOcupacionHospitalaria(listener:Subject<OcupacionHospitalaria>,  ocupacionhosp:OcupacionHospitalaria){
    let today = new Date()
    ocupacionhosp.ts_umodif = today.getTime();
 
    this.daoService.update<OcupacionHospitalaria>(OCUPACION_RECORD, ocupacionhosp._id, ocupacionhosp).then(t =>{
      listener.next(t);
    })
  }
 

  /******* CREATE OCUPACIÓN ********/
  private _createOcupacionHospitalaria(listener:Subject<OcupacionHospitalaria>, ocupacionhosp: OcupacionHospitalaria){
    let today = new Date()
    ocupacionhosp.ts_alta =   today.getTime();
    ocupacionhosp.ts_umodif = today.getTime();

    this.daoService.create<OcupacionHospitalaria>(OCUPACION_RECORD, ocupacionhosp).then(token =>{
      listener.next(token);
    });
  }



  /******************************************/
  /******* OCUPACIÓN Hosp Search   ********/
  /****************************************/

  fetchOcupacionById(id: string):Promise<OcupacionHospitalaria>{
    let listener = new Subject<OcupacionHospitalaria[]>();
    return this.daoService.findById(OCUPACION_RECORD, id);
  }

  fetchOcupacionesByQuery(query:any):Subject<OcupacionHospitalaria[]>{
    let listener = new Subject<OcupacionHospitalaria[]>();
    this._loadOcupacionHospitalariaByQuery(listener, query);
    return listener;
  }

  private _loadOcupacionHospitalariaByQuery(listener: Subject<OcupacionHospitalaria[]>, query){
    this.daoService.search<OcupacionHospitalaria>(OCUPACION_RECORD, query).subscribe(list =>{
      if(list && list.length){
        this.ocupacionHospList = list;

      }else{
        this.ocupacionHospList = [];

      }
      listener.next(this.ocupacionHospList);
    })
  }




  /******************************************/
  /******* Locaciones Hosp Search   ********/
  /****************************************/

  fetchLocacionById(id: string):Promise<LocacionHospitalaria>{
    let listener = new Subject<LocacionHospitalaria[]>();
    return this.daoService.findById(LOCACION_RECORD, id);
  }

  fetchLocacionesByQuery(query:any):Subject<LocacionHospitalaria[]>{
    let listener = new Subject<LocacionHospitalaria[]>();
    this.loadLocHospitalariaByQuery(listener, query);
    return listener;
  }

  private loadLocHospitalariaByQuery(listener: Subject<LocacionHospitalaria[]>, query){
    this.daoService.search<LocacionHospitalaria>(LOCACION_RECORD, query).subscribe(list =>{
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

  
  /******************************************/
  /******* Ocupación Hosp Browsing ********/
  /****************************************/
  get ocupacionHospitalariaSelector(): OcupacionHospitalariaBrowse{
    if(!this._ocupacionHospitalariaSelector) this._ocupacionHospitalariaSelector = new OcupacionHospitalariaBrowse();
    return this._ocupacionHospitalariaSelector;
  }
  
  set ocupacionHospitalariaSelector(e: OcupacionHospitalariaBrowse){
    this._ocupacionHospitalariaSelector = e;
  }

  /*****  SLocacionHospitalaria TABLE table Table    ****/
  get ocupacionHospitalariaDataSource(): BehaviorSubject<OcupacionHospitalariaTable[]>{
    return this.emitOcupacionHospitalariaDataSource;
  }

  get ocupacionSelectionModel(): SelectionModel<OcupacionHospitalariaTable>{
    return this._ocupacionSelectionModel;
  }

  set ocupacionSelectionModel(selection: SelectionModel<OcupacionHospitalariaTable>){
    this._ocupacionSelectionModel = selection;
  }

  get ocupacionTableActions(){
    return LocacionHelper.getOptionlist('tableactions');
  }

  updateOcupacionTableData(){
    let tableData = LocacionHelper.buildOcupacionDataTable(this.ocupacionHospList);
    this.emitOcupacionHospitalariaDataSource.next(tableData);
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
