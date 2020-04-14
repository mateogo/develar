import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

import { BehaviorSubject ,  Subject ,  Observable, of } from 'rxjs';
import { filter, tap, map } from 'rxjs/operators';

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

import { LocacionHospitalaria, Servicio, LocacionEvent} from '../../entities/locaciones/locacion.model';

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


  private hasActiveUrlPath = false;
  private actualUrl = "";
  private actualUrlSegments: UrlSegment[] = [];
  private navigationUrl = "";

  /******* LOCATION STATE *******/
  private pacientes$ = new BehaviorSubject<any[]>(null);

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

    }else if(transition === 'pool:admision'){ //'Alocar en Admisión'},
      solint.queue =        'alocado';
      solint.avance =       'esperacama';
      internacion.estado =  'admision';
      transito.estado =     'cumplido';

    }else if(transition === 'transito:admision'){ //'Traslado SAME a Admisión' },
      solint.queue =        'alocado';
      solint.avance =       'esperacama';
      internacion.estado =  'admision';
      transito.estado =     'cumplido';

    }else if(transition === 'transito:servicio'){ //'Traslado SAME a Servicio'  },
      solint.queue =        'alocado';
      solint.avance =       'entratamiento';
      internacion.estado =  'servicio';
      transito.estado =     'cumplido';

    }else if(transition === 'servicio:traslado'){ //'Traslado intra-locación'   },
      solint.queue =        'alocado';
      solint.avance =       'esperatraslado';
      internacion.estado =  'traslado';
      transito.estado =     'enejecucion';

    }else if(transition === 'traslado:servicio'){ //'Traslado intra-locación'   },
      solint.queue =        'alocado';
      solint.avance =       'entratamiento';
      internacion.estado =  'servicio';
      transito.estado =     'cumplido';

    }else if(transition === 'servicio:externacion'){ //'Salida del servicio. queda en Externación'},
      solint.queue =        'alocado';
      solint.avance =       'esperasalida';
      internacion.estado =  'externacion';
      transito.estado =     'enejecucion';

    }else if(transition === 'externacion:transito'){ //'Tránsito inter-locación. Disponer traslado'},
      solint.queue =        'transito';
      solint.avance =       'esperatraslado';
      internacion.estado =  'transito';
      transito.estado =     'enejecucion';

    }else if(transition === 'externacion:salida'){ //'Tránsito inter-locación. Disponer traslado'},
      solint.queue =        'salida';
      solint.avance =       'salida';
      internacion.estado =  'salida';
      transito.estado =     'cumplido';

    }else if(transition === 'externacion:pool'){ //'Externa y espera reasignación de locación' },
      solint.queue =        'pool';
      solint.avance =       'esperacama';
      internacion.estado =  'pool';
      transito.estado =     'programado';

    }else if(transition === 'transito:pool'){ // 'Traslada y espera reasignación de locación' },
      solint.queue =        'pool';
      solint.avance =       'esperacama';
      internacion.estado =  'pool';
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

  fetchInternacionesByLocationId(locId: string): Observable<SolicitudInternacion[]>{
    let query = {
      locationId: locId
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

  buildServiciosList(locacion: LocacionHospitalaria): Servicio[]{
    let servicios: Servicio[] = [];
    let losServicios = locacion.servicios;
    if(losServicios && losServicios.length){
      servicios = losServicios.filter(srv => srv.srvIsActive ).map(srv => {
        srv.srvCapacidad = InternacionHelper.getCapacidadFromServicio(srv.srvtype)
        return srv;
      })

    }


    return servicios;
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

  /***************************/
  /******* Navigation *******/
  /***************************/
  actualRoute(snap: string, mRoute: UrlSegment[]){
    this.hasActiveUrlPath = false;
    this.actualUrl = snap;
    this.actualUrlSegments = mRoute;
    this.navigationUrl = this.fetchNavigationUrl(snap, mRoute.toString())
    if(this.navigationUrl) this.hasActiveUrlPath = true;
    this.dumpActualRoute();
  }

  private fetchNavigationUrl(snap, urlmodule){
    let urlpath: string = "";
    if(urlmodule){
      urlpath = snap.substr(1, (snap.length - urlmodule.length -2));

    }else{
      urlpath = snap.substr(1);
    }

    if(urlpath){
      let split = urlpath.split('/') 
      urlpath = split[0];
    }
    return urlpath 
  }

  private dumpActualRoute(){
    console.log('actualUrl:         (router.routerState.snapshot.url) [%s]', this.actualUrl)
    console.log('navigationUrl      (method):                         [%s]', this.navigationUrl)
    console.log('actualUrlSegments: (route.snapshot.url)              [%s]', this.actualUrlSegments)
    console.log('hasActiveUrlPath:  (this.navigationUrl==true)        [%s]', this.hasActiveUrlPath)
   }

  /********************************/
  /******* pacientes STATE *******/
  /******************************/
  buildEstadoInternacion(internaciones: SolicitudInternacion[]){
    let master = {};
    internaciones.forEach(solicitud => {
      console.log('sol: [%s] [%s][%s]', solicitud.requeridox.slug, solicitud.internacion.estado, solicitud.internacion.servicio)
      if(solicitud.internacion.estado === 'servicio'){
        if(!master[solicitud.internacion.servicio]){
          master[solicitud.internacion.servicio] = [ solicitud ]

        }else {
          master[solicitud.internacion.servicio].push(solicitud);

        }

      }
    })
    return master;
  }

  /********************************/
  /******* pacientes API *******/
  /******************************/
  loadPacientesEnTransito$(){
      return this.getPacientesFromLocacion$('').pipe(
          tap(pacientes => this.setPacientes(pacientes)),
          map(pacientes => pacientes.filter(
              paciente => paciente.internacion.estado === 'transito'
          ))
      );
  }

  loadPacientesEnAdmision$() {
      return this.getPacientesFromLocacion$('').pipe(
          tap(pacientes => this.setPacientes(pacientes)),
          map(pacientes => pacientes.filter(
              paciente =>paciente.internacion.estado === 'admision'
          ))
      );
  }

  loadPacientesEnTraslado$() {
      return this.getPacientesFromLocacion$('').pipe(
          tap(pacientes => this.setPacientes(pacientes)),
          map(pacientes => pacientes.filter(
              paciente => paciente.internacion.estado === 'traslado'
          ))
      );
  }

  loadPacientesEnSalida$(){
      return this.getPacientesFromLocacion$('').pipe(
          tap(pacientes => this.setPacientes(pacientes)),
          map(pacientes => pacientes.filter(
              paciente => paciente.internacion.estado === 'salida'
          ))
      );
  }

  loadPacientesEnExternacion$(){
      return this.getPacientesFromLocacion$('').pipe(
          tap(pacientes => this.setPacientes(pacientes)),
          map(pacientes => pacientes.filter(
              paciente => paciente.internacion.estado === 'externacion'
          ))
      );
  }

  /********************************/
  /******* pacientes API *******/
  /******************************/
  getPacientesFromLocacion$(locacion){
      //TODO: llamar a la API
      return (
          new BehaviorSubject<SolicitudInternacion[]>(this.internaciones)
      ).asObservable();
  }

  /********************************/
  /******* LOCATION STATE *******/
  /******************************/
  getPacientes$(){
    return this.pacientes$.asObservable();
  }

  setPacientes(pacientes){
    this.pacientes$.next(pacientes);
  }

  /********************************/
  /******* PACIENTES STATE *******/
  /*****************************/
  // las solicitudes de Internación devienen pacientes de cierto hospital
  private _internaciones: SolicitudInternacion[];

  get internaciones():SolicitudInternacion[]{
    return this._internaciones;
  }

  set internaciones(int: SolicitudInternacion[]) {
    this._internaciones = int;
  }



  /********************************/
  /******* LOCACIÓN STATE *******/
  /*****************************/
  private _currentLocation: LocacionHospitalaria = null;
  private _currentLocation$ = new BehaviorSubject<LocacionHospitalaria>(this._currentLocation);
  private _errorLocation$ = new BehaviorSubject<ErrorEvent>(null);

  get locacion$(): Observable<LocacionHospitalaria>{
    return this._currentLocation$.asObservable();
  }

  emitLocacion(){
    this._currentLocation$.next(this.locacion);    
  }

  emitLocationErrorEvent(error: ErrorEvent){
    this._errorLocation$.next(error);
  }

  updateLocacionState(loc: LocacionHospitalaria){
    this.locacion = loc;
    this.emitLocacion();
  }

  updateLocacionStateFromId(locId: string){
    this.fetchLocacionById(locId).then(location => {
      if(location){
        this.updateLocacionState(location);

      }else{
        this.emitLocationErrorEvent({
          error: 'Locación no encontrada ' + locId,
          action: 'updateLocacionStateFromID'
        })

      }
    })
    this.emitLocacion();
  }

  get locacion(): LocacionHospitalaria{
    return this._currentLocation;
  }

  set locacion(loc: LocacionHospitalaria){
    this._currentLocation = loc;
  }


}
//http://develar-local.co:4200/salud/internacion/locacion/5e90b3b0b001680e2b5ba6c0
class ErrorEvent {
  error: string = 'Error event fired';
  action: string = 'ACTION';
}

const PACIENTES = [
    {
        dni: '11222333',
        name: 'Jorge López',
        diagnostico: 'GHI',
        pool: 'transito'
    },
    {
        dni: '22334455',
        name: 'Juan Pérez',
        diagnostico: 'DEF',
        pool: 'transito'
    },
    {
        dni: '33445566',
        name: 'Rosa Martínez',
        diagnostico: 'ABC',
        pool: 'admision'
    },
    {
        dni: '44556677',
        name: 'Eduardo Sánchez',
        diagnostico: 'UVW',
        pool: 'admision'
    },
    {
        dni: '92334455',
        name: 'Ana Romero',
        diagnostico: 'RST',
        pool: 'admision'
    },
    {
        dni: '93334455',
        name: 'Ricardo Fernández',
        diagnostico: 'OPQ',
        pool: 'traslado'
    },
    {
        dni: '91223344',
        name: 'Juana Rodríguez',
        diagnostico: 'XYZ',
        pool: 'salida'
    },
];
