import { Injectable }    from '@angular/core';
import { Observable ,  Subject ,  BehaviorSubject, of }    from 'rxjs';

import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

import { SharedService } from '../develar-commons/shared-service';
import { devutils } from '../develar-commons/utils';
import { Serial }   from '../develar-commons/develar-entities';

import { DaoService }  from '../develar-commons/dao.service';
import { UserService } from '../entities/user/user.service';
import { User }        from '../entities/user/user';
import { Person }      from '../entities/person/person';

import { EmpresasController } from './empresas.controller';

import { Audit, ParentEntity } from '../develar-commons/observaciones/observaciones.model';

import { CensoIndustrias, CensoIndustriasTable } from './censo.model';
import { CensoIndustriasService } from './censo-service';

const CENSO_TYPE = 'censoindustrias'
const ACTUAL_CENSO = "censo:industrias:2020:00";



@Injectable({
  providedIn: 'root'
})
export class CensoIndustriasController {

  private _currentCenso: CensoIndustrias;
  private _censosList: CensoIndustrias[] = [];

  private _consultasDataSource: BehaviorSubject<CensoIndustriasTable[]> = new BehaviorSubject<CensoIndustriasTable[]>([]);

  private _censoListener: BehaviorSubject<CensoIndustrias>;

  constructor(
      private daoService:    DaoService,
      private userService:   UserService,
      private sharedSrv:     SharedService,
      private dialogService: MatDialog,
      private snackBar:      MatSnackBar,
      private empCtrl:       EmpresasController,

  	) { 

  }


  manageCensoIndustriasRecord(censoRecord:CensoIndustrias ): Subject<CensoIndustrias>{    // 
    let listener = new Subject<CensoIndustrias>();

    if(this.isNewToken(censoRecord)){
      this.initNewCensoIndustrias(listener, censoRecord);

    }else{
      this.updateCensoIndustrias(listener, censoRecord);

    }
    return listener;
  }

  private isNewToken(token:CensoIndustrias): boolean{
    return token._id ? false : true;
  }


  /******* UPDATE CENSO INDUSTRIAL ********/
  private updateCensoIndustrias(censoindustria$:Subject<CensoIndustrias>, censoRecord:CensoIndustrias){
 
    this.initCensoIndustriasForUpdate(censoRecord);

    this.upsertCensoIndustrias(censoindustria$, censoRecord);

  }
 
  private initCensoIndustriasForUpdate(entity: CensoIndustrias){
    // todo
  }

  private upsertCensoIndustrias(listener: Subject<CensoIndustrias>,  censoRecord: CensoIndustrias){
    this.daoService.update<CensoIndustrias>(CENSO_TYPE, censoRecord._id, censoRecord).then(t =>{
      listener.next(t);
    })
  }

  /******* CREATE  ********/
  private initNewCensoIndustrias(censoIndustria$:Subject<CensoIndustrias>, censoRecord:CensoIndustrias){
    let sector = censoRecord.sector || 'produccion';

    let fecomp_date = devutils.dateFromTx(censoRecord.fecomp_txa) ||  new Date();

    censoRecord.fecomp_tsa = fecomp_date.getTime();
    censoRecord.fecomp_txa = devutils.txFromDate(fecomp_date);

    this.fetchSerialCensoIndustrias().subscribe(serial =>{
      censoRecord.compPrefix = serial.compPrefix ;
      censoRecord.compName = serial.compName;
      censoRecord.compNum = (serial.pnumero + serial.offset) + "";
     
      this.insertCensoIndustrias(censoIndustria$, censoRecord);
    });
  }

  private insertCensoIndustrias(listener: Subject<CensoIndustrias>, token: CensoIndustrias){
      //token.ts_umodif = Date.now();

      this.daoService.create<CensoIndustrias>(CENSO_TYPE, token).then(t =>{
        listener.next(t);
      });
  }
  /*********************************/
  /*  PARTIAL UPDATE */
  /*******************************/
  partialUpdateCenso(censoRecord:CensoIndustrias ): Subject<CensoIndustrias>{
		let listener = new Subject<CensoIndustrias>();

		this.refreshCensoState(censoRecord);

		this.partialUpdateToDB(listener, censoRecord);

		return listener; 	
  }

  private refreshCensoState(censo:CensoIndustrias){
  	let today = new Date();

  	if(censo.estado){
  		censo.estado.ts_umodif = today.getTime();
  	}

  }

  private partialUpdateToDB(listener: Subject<CensoIndustrias>,  censoRecord: CensoIndustrias){
    this.daoService.update<CensoIndustrias>(CENSO_TYPE, censoRecord._id, censoRecord).then(t =>{
      listener.next(t);
    })
  }



  /*********************************/
  /*  Censo Retrieve, fetch, load */
  /*******************************/
  fetchCensoByQuery(query: any){
    const subject = new BehaviorSubject<CensoIndustrias[]>([]);
    this.loadCensoByQuery(subject, query);
    return subject;
  }

  private loadCensoByQuery(subject: BehaviorSubject<CensoIndustrias[]>, query: any):void {
  	this.daoService.search<CensoIndustrias>(CENSO_TYPE, query).subscribe(censos => {
  		if(censos && censos.length){
        this._censosList = censos;
  			this._currentCenso = censos[0];

      } else {
        this._censosList = [];
  			this._currentCenso = null;
      }
      subject.next(this._censosList)
      this.censoListener.next(this._currentCenso);

  	})
  }


  fetchActiveCensoFromOrganisation(organisationId){
  	let query = {
  		search: 'actual:censo',
  		empresaId: organisationId,
  		codigo: ACTUAL_CENSO
  	}

  	this.daoService.search<CensoIndustrias>(CENSO_TYPE, query).subscribe(censos => {
  		if(censos && censos.length){
        this._censosList = censos;
  			this._currentCenso = censos[0];

      } else {
  			this._currentCenso = null;
        this._censosList = [];
      }
      this.censoListener.next(this._currentCenso);


  	})

  }

  fetchActiveCensos$(organisationId): Observable<CensoIndustrias[]>{
  	let query = {
  		search: 'actual:censo',
  		empresaId: organisationId,
  		codigo: ACTUAL_CENSO
  	}
  	return this.daoService.search<CensoIndustrias>(CENSO_TYPE, query);
  }

  get censoListener(): Subject<CensoIndustrias>{
  	if(!this._censoListener || !this._currentCenso){
  		if(!this._currentCenso){
  			this._currentCenso = new CensoIndustrias();

  		}
  		this._censoListener = new BehaviorSubject<CensoIndustrias>(this._currentCenso);
  	}
  	return this._censoListener;
  }



  /*****************
    Person
  *****************/
  get currentPerson(): Person{
  	return this.empCtrl.activePerson;
  }

  get personListener(): Subject<Person>{
  	return this.empCtrl.personListener;
  }

  loadPerson(id?){
  	this.empCtrl.loadPerson(id);
	}



  /*****************
    Seriales
  *****************/
 /**
  * obtener serial para Asistencias
  */
  fetchSerialCensoIndustrias(): Observable<Serial> {
    let serial: Serial = CensoIndustriasService.censoIndustriasSerial();
    let fecha = new Date();
    serial.anio = fecha.getFullYear();
    serial.mes = fecha.getMonth();
    serial.dia = fecha.getDate();
    return this.daoService.nextSerial<Serial>('serial', serial);
  }

  /*****************
    PassThrú
  *****************/
  get onReady():BehaviorSubject<boolean>{
  	return this.empCtrl.onReady;
  }

  /*****************
    User / Audit
  *****************/
 /**
  * obtener serial para Asistencias
  */
  getUserData(): Audit{
  	let user = this.userService.currentUser;
  	console.log('audit: [%s]', user && user.displayName);

    if(!user) return null;

    return {
        userId: user.id,
        username: user.username,
        ts_alta: Date.now()
    } as Audit
  }

  parentEntity(censo: CensoIndustrias): ParentEntity {
  	if(!censo) return null;
  	let pentity = {
  		entityType: 'censo',
  		entityId: censo._id,
  		entitySlug: censo.empresa.slug,

  	} as ParentEntity
  	return pentity;
  }


  /***************************/
  /** Notification HELPER ****/
  /***************************/
  openSnackBar(message: string, action: string, config?: any) {
    config = config || {}
    config = Object.assign({duration: 3000}, config)

    let snck = this.snackBar.open(message, action, config);

    snck.onAction().subscribe((e)=> {
      //c onsole.log('action???? [%s]', e);
    })
  }


  /************************/
  /** table TABLE     ****/
  /**********************/
  get dataRecordsSource(): BehaviorSubject<CensoIndustriasTable[]> {
    return this._consultasDataSource;
  }

  public updateTableData(): void {
    console.log('udateTable Data [%s]', this._censosList && this._censosList.length)
    const consultaTableData = CensoIndustriasService.buildCensoTableData(this._censosList);
    this._consultasDataSource.next(consultaTableData);
  }


} // endService


