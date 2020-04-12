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

import { LocacionService } from '../../entities/locaciones/locacion.service';

import { LocacionHospitalaria, LocacionEvent} from '../../entities/locaciones/locacion.model';

import { 	SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, MotivoInternacion,
					Internacion, SolInternacionBrowse, InternacionSpec, SolInternacionTable,
					MasterAllocation } from './internacion.model';

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
		private locSrv: LocacionService,
		private userSrv: UserService,
    private snackBar:    MatSnackBar,
		) {

	}



  /******************************************/
  /******* Internaciones Hospitalarias ********/
  /****************************************/
  createNewSolicitudInternacion(spec: InternacionSpec, person: Person, triage?: MotivoInternacion): Subject<SolicitudInternacion>{
    let listener = new Subject<SolicitudInternacion>();
    let internacion = InternacionHelper.buildNewInternacion(this.user, person, spec, triage);
    
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
  /**** ALOCACION                 *********/
  /****************************************/
  manageInternacionTransition(solinternacion: SolicitudInternacion, internacion: Internacion, transition: string){
    let listener = new Subject<SolicitudInternacion>();

    this.transitionOrchestration(listener, solinternacion,internacion,transition)
    return listener;
  }


// {val: 'pool:transito',           label: 'Locación de internación asignada',  actionLabel: 'Alocar y disponer traslado'},
// {val: 'pool:internacion',        label: 'Locación de internación asignada',  actionLabel: 'Alocar en Admisión'},
// {val: 'transito:internacion',    label: 'Internación efectivizada',          actionLabel: 'Traslado SAME a Admisión' },
// {val: 'transito:servicio',       label: 'Internación efectivizada',          actionLabel: 'Traslado SAME a Servicio'  },
// {val: 'internacion:internacion', label: 'Traslado intra-locación',           actionLabel: 'Traslado intra-locación'   },
// {val: 'internacion:transito',    label: 'Tránsito inter-locación',           actionLabel: 'Tránsito inter-locación. Disponer traslado'},
// {val: 'internacion:pool',        label: 'Espera asignación de locación',     actionLabel: 'Externa y espera reasignación de locación' },
// {val: 'transito:pool',           label: 'Espera asignación de locación',     actionLabel: 'Traslada y espera reasignación de locación' },
  transitionOrchestration(listener: Subject<SolicitudInternacion>, solint: SolicitudInternacion, internacion: Internacion, transition: string){
    let oldInternacion = solint.internacion;
    let triage = solint.triage;
    let transito = new Transito()
    let atendidoPor = InternacionHelper.atendidoPor(this.user, {sector: solint.sector})
    let today = new Date()

    triage.transitType = transition;
    transito.transitType = transition;
    transito.target = internacion;
    transito.from = oldInternacion;
    transito.atendidox = atendidoPor;

    transito.fe_prog = devutils.txFromDate(today);
    transito.fe_cumplido = transito.fe_prog;
    transito.fe_ts = today.getTime();
    transito.slug = internacion.slug;

    solint.estado = 'activo';

    if(transition ===       'pool:transito'){ //'Alocar y disponer traslado'},
      solint.queue =        'transito';
      solint.avance =       'esperatraslado';
      internacion.estado =  'transito';
      transito.estado =     'enejecucion';

    }else if(transition === 'pool:internacion'){ //'Alocar en Admisión'},
      solint.queue =        'alocado';
      solint.avance =       'esperacama';
      internacion.estado =  'admision';
      transito.estado =     'cumplido';

    }else if(transition === 'transito:internacion'){ //'Traslado SAME a Admisión' },
      solint.queue =        'alocado';
      solint.avance =       'esperacama';
      internacion.estado =  'admision';
      transito.estado =     'cumplido';

    }else if(transition === 'transito:servicio'){ //'Traslado SAME a Servicio'  },
      solint.queue =        'alocado';
      solint.avance =       'entratamiento';
      internacion.estado =  'alocado';
      transito.estado =     'cumplido';

    }else if(transition === 'internacion:internacion'){ //'Traslado intra-locación'   },
      solint.queue =        'traslado';
      solint.avance =       'entratamiento';
      internacion.estado =  'traslado';
      transito.estado =     'enejecucion';

    }else if(transition === 'internacion:transito'){ //'Tránsito inter-locación. Disponer traslado'},
      solint.queue =        'transito';
      solint.avance =       'esperacama';
      internacion.estado =  'transito';
      transito.estado =     'enejecucion';

    }else if(transition === 'internacion:pool'){ //'Externa y espera reasignación de locación' },
      solint.queue =        'pool';
      solint.avance =       'esperatraslado';
      internacion.estado =  'externacion';
      transito.estado =     'programado';

    }else if(transition === 'transito:pool'){ // 'Traslada y espera reasignación de locación' },
      solint.queue =        'pool';
      solint.avance =       'esperatraslado';
      internacion.estado =  'externacion';
      transito.estado =     'enejecucion';

    }

    if(solint.transitos && solint.transitos.length){
      solint.transitos.push(transito);

    }else{
      solint.transitos = [ transito ];
    }

    solint.internacion = internacion;
    solint.atendidox = atendidoPor;

  /******************************************/

    this.updateSolicitudInternacion(listener, solint);

  /******************************************/


  }

  /******************************************/
  /******* Internaciones Search   ********/
  /****************************************/
  fetchInternacionesByPersonId(id: string): Observable<SolicitudInternacion[]>{
  	let query = {
  		requirenteId: id
  	}

		return this.daoService.search<SolicitudInternacion>(RECORD, query)
  }

  fetchInternacionesByQuery(query:any): Subject<SolicitudInternacion[]>{
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
  /**** DISPONIBLE                 *********/
	/****************************************/
	fetchCapacidadDisponible(query?: any): Subject<MasterAllocation[]>{
    let listener = new Subject<MasterAllocation[]>();
    this.fetchProcess(listener, query);

    return listener;
	}

  private fetchProcess(listener: Subject<MasterAllocation[]>, query?: any){
    query = query || {} 
    query['process'] =  'fetch:disponible'

    this.daoService.fetchMasterAllocator<MasterAllocation>(RECORD, query).subscribe(list =>{
      if(list && list.length){
      	listener.next(list);

      }else{
      	listener.next(null);

      }
    })
  }


  /******************************************/
  /**** ALOCACION                 *********/
	/****************************************/
	allocateInServicio(internacion: SolicitudInternacion, servicio: string, spec: any): Subject<SolicitudInternacion>{
    let listener = new Subject<SolicitudInternacion>();
    this.allocateSolInServicio(listener, internacion, servicio, spec);

    return listener;
	}

	private allocateSolInServicio(listener: Subject<SolicitudInternacion>, solicitud: SolicitudInternacion, servicio: string, spec: any){
  	let query = {
  		process: 'enter:facility',
  		waction: 'transito:servicio',
  		solinternacionId: solicitud._id,
  		servicio: servicio,
  		estado: 'alocado'
  	}

  	query = Object.assign(query, spec);

  	console.dir(query)

    this.daoService.processCovidWorkflow<SolicitudInternacion>(RECORD, query).subscribe(internacion =>{
      if(internacion){
      	listener.next(internacion);

      }else{
      	listener.next(null);

      }
    })

	}

	allocateInTransit(internacion: SolicitudInternacion, hospId: string, servicio: string): Subject<SolicitudInternacion>{
    let listener = new Subject<SolicitudInternacion>();
    this.allocateSolInTransit(listener, internacion._id, hospId, servicio, 'SeCtOr', 'PiSo', 'HAB', '101');

    return listener;
	}

  private allocateSolInTransit(listener: Subject<SolicitudInternacion>, solicitudId, hospId, servicio, sector?, piso?, hab?, cama?){
  	let query = {
  		process: 'allocate:solicitud',
  		waction: 'pool:transito',
  		solinternacionId: solicitudId,
  		estado: 'programado',

  		hospitalId:  hospId,
  		servicio: servicio,
  		sector: sector,
  		piso: piso,
  		hab: hab,
  		camaCode: cama,
  		camaSlug: cama,
  		recursoId: null,
  	}

    this.daoService.processCovidWorkflow<SolicitudInternacion>(RECORD, query).subscribe(internacion =>{
      if(internacion){
      	listener.next(internacion);

      }else{
      	listener.next(null);

      }
    })

  }


  /******************************************/
  /******* Locaciones Hospitalarias ********/
  /****************************************/
  fetchLocacionesHospitalarias(query:any){
  	return this.locSrv.fetchLocacionesByQuery(query);
  }

  fetchLocacionById(id: string): Promise<LocacionHospitalaria>{
    return this.locSrv.fetchLocacionById(id);
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

  /***************************/
  /******* Seriales *******/
  /***************************/
  /**
  * obtener serial para Documento Provisorio
  */
  fetchSerialDocumProvisorio(): Observable<Serial> {
    let serial: Serial = InternacionHelper.buildSerialDocumProvisorio();
    return this.daoService.nextSerial<Serial>('serial', serial);
  }


}
