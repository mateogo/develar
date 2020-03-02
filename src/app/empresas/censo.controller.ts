import { Injectable }    from '@angular/core';
import { Observable ,  Subject ,  BehaviorSubject, of }    from 'rxjs';

import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { MatDialog, MatDialogRef, MatSelectChange } from '@angular/material';

import { SharedService } from '../develar-commons/shared-service';
import { devutils } from '../develar-commons/utils';
import { Serial }   from '../develar-commons/develar-entities';

import { DaoService }  from '../develar-commons/dao.service';
import { UserService } from '../entities/user/user.service';
import { User }        from '../entities/user/user';
import { Person }      from '../entities/person/person';

import { EmpresasController } from './empresas.controller';

import { CensoIndustrias } from './censo.model';
import { CensoIndustriasService } from './censo-service';

const CENSO_TYPE = 'censoindustrias'
const ACTUAL_CENSO = "censo:industrias:2020:00";



@Injectable({
  providedIn: 'root'
})
export class CensoIndustriasController {

	private _currentCenso: CensoIndustrias;


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
  fetchActiveCensoFromOrganisation(organisationId){
  	let query = {
  		search: 'actual:censo',
  		empresaId: organisationId,
  		codigo: ACTUAL_CENSO
  	}

  	this.daoService.search<CensoIndustrias>('censoindustrias',query).subscribe(censos => {
  		if(censos && censos.length){
  			this._currentCenso = censos[0];
  			this._censoListener.next(this._currentCenso);
  		}

  	})

  }

  get censoListener(): Subject<CensoIndustrias>{
  	if(!this._censoListener){
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



} // endService


