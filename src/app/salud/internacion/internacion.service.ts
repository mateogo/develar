import { BehaviorSubject ,  Subject ,  Observable, of } from 'rxjs';
import { devutils } from '../../develar-commons/utils';
import { Serial }   from '../salud.model';

import { Person, Address }   from '../../entities/person/person';
import { sectores } from '../salud.model';

import { Injectable } from '@angular/core';

import { MatSnackBar, MatSnackBarConfig }           from '@angular/material';
import { MatDialog, MatDialogRef, MatSelectChange } from '@angular/material';
import { DataSource, SelectionModel }               from '@angular/cdk/collections';


import { catchError }     from 'rxjs/operators';

import { DaoService }    from '../../develar-commons/dao.service';

import { UserService }    from '../../entities/user/user.service';
import { User }           from '../../entities/user/user';

import { LocacionHospitalaria, LocacionEvent} from '../../entities/locaciones/locacion.model';

import { 	SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, 
					Internacion, SolInternacionBrowse, InternacionSpec, SolInternacionTable } from './internacion.model';

import { InternacionHelper } from './internacion.helper';

const RECORD = 'internacion'


@Injectable({
	providedIn: 'root'
})
export class InternacionService {

  private _internacionesSelector: SolInternacionBrowse;
  private _selectionModel: SelectionModel<SolInternacionTable>
  private emitLocHospDataSource = new BehaviorSubject<SolInternacionTable[]>([]);
  private solinternacionList: Array<SolicitudInternacion> = [];

	constructor(
		private daoService: DaoService,
		private userSrv: UserService,
    private snackBar:    MatSnackBar,
		) {

	}



  /******************************************/
  /******* Internaciones Hospitalarias ********/
  /****************************************/
  createNewSolicitudInternacion(spec: InternacionSpec, person: Person): Subject<SolicitudInternacion>{
    let listener = new Subject<SolicitudInternacion>();
    let internacion = InternacionHelper.buildNewInternacion(this.user, person, spec);
    
    this.fetchSerialAsistencias().subscribe(serial => {
      internacion.compPrefix = serial.compPrefix ;
      internacion.compName = serial.compName;
      internacion.compNum = (serial.pnumero + serial.offset) + "";
      this.createSolicitudInternacion(listener, internacion);
    })

    return listener;
  }


  manageInternacionRecord(solinternacion:SolicitudInternacion ): Subject<SolicitudInternacion>{

    let listener = new Subject<SolicitudInternacion>();

    if(this.isNewInternacion(solinternacion)){
      this.createSolicitudInternacion(listener, solinternacion);

    }else{
      this.updateSolicitudInternacion(listener, solinternacion);

    }
    return listener;
  }

  private isNewInternacion(token:SolicitudInternacion): boolean{
    let isNew = true;
    if(token._id){
      isNew = false;
    }
    return isNew;
  }

  private fetchSerialAsistencias(): Observable<Serial> {
    //console.log('t[%s] n[%s] s[%s]', type, name, sector);
    let serial: Serial = InternacionHelper.asistenciaSerial();
    let fecha = new Date();
    serial.anio = fecha.getFullYear();
    serial.mes = fecha.getMonth();
    serial.dia = fecha.getDate();
    return this.daoService.nextSerial<Serial>('serial', serial);
  }



  private updateSolicitudInternacion(listener:Subject<SolicitudInternacion>,  solinternacion:SolicitudInternacion){
 
    this.initSolicitudInternacionForUpdate(solinternacion);

    this.daoService.update<SolicitudInternacion>(RECORD, solinternacion._id, solinternacion).then(t =>{
      listener.next(t);
    })
  }
 
  private initSolicitudInternacionForUpdate(solinternacion: SolicitudInternacion){
    let today = new Date()

    solinternacion.ts_umodif = today.getTime();

  }

  private createSolicitudInternacion(listener:Subject<SolicitudInternacion>, solinternacion: SolicitudInternacion){
    let today = new Date()


    solinternacion.fecomp_txa = devutils.txFromDate(today);

    solinternacion.ts_alta =   today.getTime()
    solinternacion.ts_umodif = today.getTime();

    this.daoService.create<SolicitudInternacion>(RECORD, solinternacion).then(token =>{
      listener.next(token);
    });
  }

  /******************************************/
  /******* Internaciones Search   ********/
  /****************************************/

  fetchInternacionesByQuery(query:any){
    let listener = new Subject<SolicitudInternacion[]>();
    this.loadSolicitudesByQuery(listener, query);
    return listener;
  }

  private loadSolicitudesByQuery(listener: Subject<SolicitudInternacion[]>, query){
    this.daoService.search<SolicitudInternacion>(RECORD, query).subscribe(list =>{
      if(list && list.length){
        this.solinternacionList = list;

      }else{
        this.solinternacionList = [];

      }
      listener.next(this.solinternacionList);
    })
  }


  /******************************************/
  /******* Internaciones Hosp Browsing ********/
  /****************************************/

  // Browse Solicitud de SolicitudInternacion Form Data 
  get internacionesSelector():SolInternacionBrowse{
    if(!this._internacionesSelector) this._internacionesSelector = new SolInternacionBrowse();
    return this._internacionesSelector;
  }
  
  set internacionesSelector(e: SolInternacionBrowse){
    this._internacionesSelector = e;
  }

  /*****  SSolicitudInternacion TABLE table Table    ****/
  get internacionesDataSource(): BehaviorSubject<SolInternacionTable[]>{
    return this.emitLocHospDataSource;
  }

  get selectionModel(): SelectionModel<SolInternacionTable>{
    return this._selectionModel;
  }

  set selectionModel(selection: SelectionModel<SolInternacionTable>){
    this._selectionModel = selection;
  }

  get tableActions(){
    return InternacionHelper.getOptionlist('tableactions');
  }


  updateTableData(){
    let tableData = InternacionHelper.buildDataTable(this.solinternacionList);
    this.emitLocHospDataSource.next(tableData);
  }


  /**********************/
  /******* User ********/
  /********************/
  get user():User{
  	return this.userSrv.currentUser;
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
