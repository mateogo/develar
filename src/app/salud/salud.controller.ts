import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

import { MatSnackBar, MatSnackBarConfig }           from '@angular/material';
import { MatDialog, MatDialogRef, MatSelectChange } from '@angular/material';

import { DataSource, SelectionModel } from '@angular/cdk/collections';

import { BehaviorSubject ,  Subject ,  Observable, of } from 'rxjs';

import * as io from 'socket.io-client';

import { SharedService } from '../develar-commons/shared-service';
import { DaoService }    from '../develar-commons/dao.service';
import { devutils } from '../develar-commons/utils';

import { GenericDialogComponent } from '../develar-commons/generic-dialog/generic-dialog.component';

import { UserService }   from '../entities/user/user.service';
import { Product, KitProduct } from '../entities/products/product.model';

import { Person, PersonContactData,Address, FamilyData, BeneficiarioAlimentar, UpdatePersonEvent }        from '../entities/person/person';
import { User }          from '../entities/user/user';
import { Community }     from '../develar-commons/community/community.model';
import { SaludModel, Serial, Ciudadano } from './salud.model';
import { Turno, TurnoAction, Atendido, TurnosModel }         from './turnos/turnos.model';

import { Asistencia, Alimento, AsistenciaBrowse, VigilanciaBrowse, Requirente, Locacion, CasoIndice,
          AsistenciaTable, AsistenciaHelper, AsistenciaSig, InfectionFollowUp, SisaEvent, MuestraLaboratorio,
          UpdateAsistenciaEvent, UpdateAlimentoEvent } from './asistencia/asistencia.model';

import {   SolicitudInternacion } from './internacion/internacion.model';

const ATTENTION_ROUTE = "atencionsocial";
const ALIMENTAR_ROUTE = "tarjetaalimentar";
const RECEPTION_ROUTE = "recepcion";
const ALIMENTOS_ROUTE = "alimentos";
const AUDITENTREGAS_ROUTE = "validacionentregas";
const SEGUIMIENTO_ROUTE = "seguimiento";
const CORE = 'core';
const CONTACT = 'contact';
const ADDRESS = 'address';
const FAMILY = 'family';
const OFICIOS = 'oficios';
const SALUD = 'salud';
const COBERTURA = 'cobertura';
const ENCUESTA = 'ambiental';
const ASSETS = 'assets';

const ASIS_PREVENCION_RECORD = 'asisprevencion'

const SISA_ESTADO = 'sisa:estado';
const SISA_FWUP =   'sisa:followup';

const SEGUIMIENTO_ESTADO = 'seguimiento:estado';
const SEGUIMIENTO_FWUP =   'seguimiento:fwup';

const INFECTION_ESTADO = 'infection:estado';

const LABORATORIO_ESTADO = 'laboratorio:estado';


@Injectable({
	providedIn: 'root'
})
export class SaludController {

  private hasActiveUrlPath = false;
  private actualUrl = "";
  private actualUrlSegments: UrlSegment[] = [];
  private navigationUrl = "";

  private _asistenciasSelector: AsistenciaBrowse;
  private _vigilanciaSelector: VigilanciaBrowse;

  private _encuestadores: User[];

  private currentTurno: Turno;
  private currentPerson: Person;
  private _turnoEvent: Subject<TurnoAction> = new Subject();
  public personListener = new BehaviorSubject<Person>(this.currentPerson);

  private userListener: BehaviorSubject<User>;
  private userLoading = false;
  private userx: UserToken = new UserToken();
  public  isUserAdmin = false;

  private userCmty: CommunityToken = new CommunityToken();
  private naviCmty: CommunityToken = new CommunityToken();

  public  onReady = new BehaviorSubject<boolean>(false);

  private _asistenciaListener = new BehaviorSubject<Asistencia[]>([]);

  private emitAsistenciaDataSource = new BehaviorSubject<AsistenciaTable[]>([]);
  private _selectionModel: SelectionModel<AsistenciaTable>
  private solicitudesList: Array<Asistencia> = [];




	constructor(
		private daoService: DaoService,
		private userService: UserService,
    private sharedSrv:   SharedService,
    private dialogService: MatDialog,
    private snackBar:    MatSnackBar,
		) {
    this.userListener = this.userService.userEmitter;

    this.fetchUserByRole('encuestador:operator').subscribe(tokens => {
      this._encuestadores = tokens || [];
    })

    this.userListener.subscribe(user =>{

      this.userLoading = true;
      this.updateUserStatus(user);
    })


    setTimeout(() => {
    	if(!this.userLoading) this.onReady.next(true)
    }, 1000);
  }


  /***************************/
  /****** Person EVENTS ******/
  /***************************/
  updatePerson(event: UpdatePersonEvent){

    if(event.token === CORE){
      this.upsertPersonCore(event.person._id, event.person);
    }
    
    if(event.token === CONTACT){
      this.upsertPersonCore(event.person._id, event.person);
    }

    if(event.token === ADDRESS){
      this.upsertPersonCore(event.person._id, event.person);
    }
    
    if(event.token === FAMILY){
      this.upsertPersonCore(event.person._id, event.person);
    }

    if(event.token === OFICIOS){
      this.upsertPersonCore(event.person._id, event.person);
    }

    if(event.token === SALUD){
      this.upsertPersonCore(event.person._id, event.person);
    }

    if(event.token === COBERTURA){
      this.upsertPersonCore(event.person._id, event.person);
    }

    if(event.token === ENCUESTA){
      this.upsertPersonCore(event.person._id, event.person);
    }

    if(event.token === ASSETS){
      this.upsertPersonCore(event.person._id, event.person);
    }


  }

  upsertPersonCore(id:string, p:any){
    this.daoService.partialUpdate<Person>('person', id, p).then(person =>{
      this.updateCurrentPerson(person);
    })

  }


  /***************************/
  /******* Seriales *******/
  /***************************/
  /**
  * obtener serial para Documento Provisorio
  */
  fetchSerialDocumProvisorio(): Observable<Serial> {
    let serial: Serial = SaludModel.documSerial();
    return this.daoService.nextSerial<Serial>('serial', serial);
  }

 /**
  * obtener serial para Turnos
  */
  fetchSerialTurnos(type, name, sector, peso): Observable<Serial> {
    let serial: Serial = SaludModel.turnoSerial(type, name, sector, peso);
    let fecha = new Date();
    serial.anio = fecha.getFullYear();
    serial.mes = fecha.getMonth();
    serial.dia = fecha.getDate();
    return this.daoService.nextSerial<Serial>('serial', serial);
  }

 /**
  * obtener serial para Asistencias
  */
  private fetchSerialAsistencias(type, name, sector): Observable<Serial> {
    //c onsole.log('t[%s] n[%s] s[%s]', type, name, sector);
    let serial: Serial = SaludModel.asistenciaSerial(type, name, sector);
    let fecha = new Date();
    serial.anio = fecha.getFullYear();
    serial.mes = fecha.getMonth();
    serial.dia = fecha.getDate();
    return this.daoService.nextSerial<Serial>('serial', serial);
  }

 /**
  * obtener serial para Asistencias
  */
  private fetchSerialAsistenciasCovid(type, name, sector): Observable<Serial> {
    //c onsole.log('t[%s] n[%s] s[%s]', type, name, sector);
    let serial: Serial = SaludModel.asistenciaSerial(type, name, sector);
    let fecha = new Date();
    serial.anio = fecha.getFullYear();
    serial.mes = fecha.getMonth();
    serial.dia = fecha.getDate();
    return this.daoService.nextSerial<Serial>('serial', serial);
  }


 /**
  * obtener serial para Asistencias
  */
  fetchSerialRemitoalmacen(type, name, sector): Observable<Serial> {
    let serial: Serial = SaludModel.remitoalmacenSerial(type, name, sector);
    let fecha = new Date();
    serial.anio = fecha.getFullYear();
    serial.mes = fecha.getMonth();
    serial.dia = fecha.getDate();
    return this.daoService.nextSerial<Serial>('serial', serial);
  }


  /****************************************/
  /******* Asistencias INTERNACION ********/
  /**************************************/
  fetchInternacionesByPersonId(id: string): Observable<SolicitudInternacion[]>{
    const RECORD = 'internacion'

    let query = {
      requirenteId: id
    }

    return this.daoService.search<SolicitudInternacion>(RECORD, query)
  }



  /****************************************/
  /******* Asistencias EPIDEMIO   ********/
  /**************************************/

  manageEpidemioState(event: UpdateAsistenciaEvent): Subject<Asistencia>{
    let listener = new Subject<Asistencia>();
    let asistencia = event.token;

    this.transitionOrchestration(event.type, asistencia)
    this.updateAsistencia(listener, asistencia)

    return listener;
  }

  private initCovidData(sisaevent: SisaEvent, asistencia: Asistencia){
    let muestralab: MuestraLaboratorio;
    let infeccion = asistencia.infeccion;
    let muestraslab = asistencia.muestraslab || [];

    if(!infeccion){
      infeccion = new InfectionFollowUp();
      infeccion.isActive = true;

      if(sisaevent.avance === 'sospecha'){
        infeccion.avance = 'sindato';
        infeccion.sintoma = 'sindato';
        infeccion.hasCovid = false;
        infeccion.actualState = 0;

      }else if(sisaevent.avance === 'confirmado'){
        infeccion.avance = 'sindato';
        infeccion.sintoma = 'sindato';
        infeccion.hasCovid = true;
        infeccion.actualState = 1;

      }else if(sisaevent.avance === 'descartado'){
        infeccion.avance = 'sindato';
        infeccion.sintoma = 'sindato';
        infeccion.hasCovid = false;
        infeccion.actualState = 2;

      }else if(sisaevent.avance === 'fallecido'){
        infeccion.avance = 'sindato';
        infeccion.sintoma = 'fallecido';
        infeccion.hasCovid = false;
        infeccion.actualState = 4;
      }
      asistencia.infeccion = infeccion;
    }

    if(!(muestraslab && muestraslab.length)){
       muestralab = new MuestraLaboratorio();
       muestralab.fe_notificacion = sisaevent.fe_reportado;
       muestralab.estado = 'presentada';
       muestralab.resultado = 'pendiente';
       asistencia.muestraslab = [ muestralab ]
    }

  }

  private transitionOrchestration(transition: string, asistencia: Asistencia){
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth();
    let year = today.getFullYear();

    let fecha_caso_notificado = asistencia && asistencia.sisaevent && asistencia.sisaevent.fe_reportado;
    if(fecha_caso_notificado){
      let fecha = devutils.dateFromTx(fecha_caso_notificado);
      asistencia.fenotif_txa = devutils.txFromDate(fecha);
      asistencia.fenotif_tsa = fecha.getTime();
    }

    if(transition === SISA_ESTADO){
      let sisaevent = asistencia && asistencia.sisaevent;

      if(sisaevent){
        if(sisaevent.isActive){
          asistencia.isVigilado = true;
          sisaevent.fe_consulta  = sisaevent.fe_consulta  ? devutils.txFromDate(devutils.dateFromTx(sisaevent.fe_consulta))  : devutils.txFromDate(today);
          sisaevent.fe_reportado = sisaevent.fe_reportado ? devutils.txFromDate(devutils.dateFromTx(sisaevent.fe_reportado)) : devutils.txFromDate(today);
          this.initCovidData(sisaevent, asistencia)



        }else {
          sisaevent.fe_baja  ? devutils.txFromDate(devutils.dateFromTx(sisaevent.fe_baja))  : devutils.txFromDate(today);
        }
      }


    }else if(transition === SISA_FWUP ){
      

    }else if(transition === SEGUIMIENTO_ESTADO ){
      

    }else if(transition === SEGUIMIENTO_FWUP ){
      let infection = asistencia.infeccion || new InfectionFollowUp();
      infection.sintoma = asistencia.followUp.sintoma || infection.sintoma;     
      asistencia.infeccion = infection;

    }else if(transition === INFECTION_ESTADO ){


    }else if(transition === LABORATORIO_ESTADO ){
      let laboratorios = asistencia.muestraslab || [] ;
      let infection = asistencia.infeccion || new InfectionFollowUp(); 

      if(laboratorios && laboratorios.length){
        let laboratorio = laboratorios[laboratorios.length - 1];
        if(laboratorio.estado === 'presentada'){
          if (laboratorio.resultado === 'confirmada'){
            infection.hasCovid = true;
            infection.isActive = true;
            infection.actualState = 1;
            infection.fe_confirma = laboratorio.fe_resestudio;
            infection.fets_confirma = devutils.dateFromTx(infection.fe_confirma).getTime()

          }else if (laboratorio.resultado === 'descartada'){
            //infection.hasCovid = false;
            infection.actualState = infection.actualState === 0 ? 2 : infection.actualState;
          }
        }
      }
      asistencia.infeccion = infection;

    }


  }


  /****************************************/
  /******* Asistencias PREVENCIÓN ********/
  /**************************************/
  buildTableroCovid(fecharef: Date): Observable<any> {

    return this.daoService.buildTableroCovid<any>(ASIS_PREVENCION_RECORD, 0);


  }


  /*******************************************************/
  /******* INICIALIZAR ASIS COVID C/ CASO INDICE ********/
  /*****************************************************/
  manageCovidRelation(person: Person, casoIndice?: Asistencia, vinculo?: FamilyData){
    let listener = new Subject<Asistencia>();
    let asistencia: Asistencia;

    this.fetchAsistenciaByPerson(person).subscribe(list => {
      if(list && list.length){
        asistencia = list[0];
        this.updateCovidRelation(asistencia, person, listener, casoIndice, vinculo);

      }else {
        this.nuevaCovidRelation(person, listener, casoIndice, vinculo);
      }

    })

    return listener;
  }

  private updateCovidRelation(asistencia: Asistencia, person: Person, listener: Subject<Asistencia>, casoIndice?: Asistencia, vinculo?: FamilyData){
    this.addCasoIndice(asistencia, person, casoIndice, vinculo)
    
    let edad = AsistenciaHelper.getEdadFromPerson(person)
    asistencia.edad = edad + '';

    this.manageCovidRecord(asistencia).subscribe(sol => {
      if(sol){
        listener.next(sol);

      }else {
        listener.next(null);

      }
    })
    //

  }

  private nuevaCovidRelation(person: Person, listener: Subject<Asistencia>, casoIndice?: Asistencia, vinculo?: FamilyData){
    let asistencia = AsistenciaHelper.initNewAsistenciaEpidemio('epidemio', 'epidemiologia', person);
    this.addCasoIndice(asistencia, person, casoIndice, vinculo)

    this.manageCovidRecord(asistencia).subscribe(sol => {
      if(sol){
        listener.next(sol);

      }else {
        listener.next(null);

      }
    })

  }

  private addCasoIndice(base: Asistencia, person: Person, parent: Asistencia, vinculo?: FamilyData){
    if(!(parent && parent._id)) return;


    base.hasParent = true;
    base.casoIndice = {
      parentId: parent._id,
      slug: parent.requeridox && parent.requeridox.slug,
      actualState: parent.infeccion && parent.infeccion.actualState,
      nucleo: (vinculo && vinculo.nucleo) || ''
    } as CasoIndice;

  }







  /****************************************/
  /******* ASISTENCIA COVID ********/
  /**************************************/
  manageCovidRecord(asistencia:Asistencia ): Subject<Asistencia>{
    let listener = new Subject<Asistencia>();
    if(this.isNewToken(asistencia)){
      this.initNewCovidAsistencia(listener,  asistencia);

    }else{
      this.updateAsistencia(listener, asistencia);

    }
    return listener;
  }

  /******* CREATE ASISTENCIA ********/
  private initNewCovidAsistencia(asistencia$:Subject<Asistencia>,  asistencia:Asistencia){
    let sector = asistencia.sector || 'salud';
    let name = 'solicitud';
    let novedades = asistencia.novedades;

    if(!this.currentPerson){
      this.currentPerson = new Person('Anónimo');
      this.currentPerson.ndoc = asistencia.ndoc;

    }

    asistencia.idPerson = this.currentPerson._id;
    asistencia.requeridox = AsistenciaHelper.buildCovidRequirente(this.currentPerson);

    if(!asistencia.fecomp_txa){
      asistencia.fecomp_txa = devutils.txFromDate(new Date());
    }

    let fecomp_date = devutils.dateFromTx(asistencia.fecomp_txa)
    asistencia.fecomp_tsa = fecomp_date.getTime();
    asistencia.fecomp_txa = devutils.txFromDate(fecomp_date);

    asistencia.atendidox = this.atendidoPor(sector);
    asistencia.ts_prog = Date.now();

    if(novedades && novedades.length){
      novedades.forEach(nov =>{
        if(!nov.atendidox){
          nov.atendidox = this.atendidoPor(sector);
        }
      })
    }
    this.fetchSerialAsistencias('asistencia', name, sector).subscribe(serial =>{

      asistencia.compPrefix = serial.compPrefix ;
      asistencia.compName = serial.compName;
      asistencia.compNum = (serial.pnumero + serial.offset) + "";
     
      this.insertAsistencia(asistencia$, asistencia);
    });



  }


  manageAsistenciaDeleteRecord(asistencia:Asistencia ): Subject<Asistencia>{
    let listener = new Subject<Asistencia>();

    return listener;
  }


  manageAsistenciaRecord(asistencia:Asistencia ): Subject<Asistencia>{
    let listener = new Subject<Asistencia>();
    if(this.isNewToken(asistencia)){
      this.initNewAsistencia(listener, asistencia);

    }else{
      this.updateAsistencia(listener, asistencia);

    }
    return listener;
  }

  private isNewToken(token:Asistencia): boolean{
    let isNew = true;
    if(token._id){
      isNew = false;
    }

    return isNew;
  }


  /******* UPDATE ASISTENCIA ********/
  private updateAsistencia(asistencia$: Subject<Asistencia>,  asistencia: Asistencia){
 
    this.initAsistenciaForUpdate(asistencia);

    this.upsertAsistencia(asistencia$, asistencia);

  }
 
  private initAsistenciaForUpdate(entity: Asistencia){
    let novedades = entity.novedades;
    let sector = entity.sector;

    entity.atendidox = this.atendidoPor(entity.sector);
    entity.ts_prog = Date.now();

    if(novedades && novedades.length){
      novedades.forEach(nov =>{
        if(!nov.atendidox){
          nov.atendidox = this.atendidoPor(sector);
        }
      })

    }

  }

  private upsertAsistencia(listener: Subject<Asistencia>,  asistencia: Asistencia){
    this.daoService.update<Asistencia>(ASIS_PREVENCION_RECORD, asistencia._id, asistencia).then(t =>{
      listener.next(t);
    })
  }

  /******* CREATE ASISTENCIA ********/
  private initNewAsistencia(asistencia$:Subject<Asistencia>, asistencia:Asistencia){
    let sector = asistencia.sector || 'salud';
    let name = 'solicitud';
    let novedades = asistencia.novedades;

    asistencia.idPerson = this.currentPerson._id;
    asistencia.requeridox = AsistenciaHelper.buildRequirente(this.currentPerson);

    if(!asistencia.fecomp_txa){
      asistencia.fecomp_txa = devutils.txFromDate(new Date());
    }

    let fecomp_date = devutils.dateFromTx(asistencia.fecomp_txa)
    asistencia.fecomp_tsa = fecomp_date.getTime();
    asistencia.fecomp_txa = devutils.txFromDate(fecomp_date);

    asistencia.atendidox = this.atendidoPor(sector);
    asistencia.ts_prog = Date.now();

    if(novedades && novedades.length){
      novedades.forEach(nov =>{
        if(!nov.atendidox){
          nov.atendidox = this.atendidoPor(sector);
        }
      })
    }



    this.fetchSerialAsistencias('asistencia', name, sector).subscribe(serial =>{

      asistencia.compPrefix = serial.compPrefix ;
      asistencia.compName = serial.compName;
      asistencia.compNum = (serial.pnumero + serial.offset) + "";
     
      this.insertAsistencia(asistencia$, asistencia);
    });
  }

  private insertAsistencia(listener: Subject<Asistencia>,  token: Asistencia){
      this.daoService.create<Asistencia>(ASIS_PREVENCION_RECORD, token).then(token =>{
        listener.next(token);
      });
  }

  /****************************************/
  /******* Asistencias INTERNACION ********/
  /**************************************/
  fetchAsistenciasByPersonId(id: string): Observable<SolicitudInternacion[]>{
    const RECORD = 'internacion'

    let query = {
      requirenteId: id
    }

    return this.daoService.search<SolicitudInternacion>(RECORD, query)
  }



  fetchAsistenciaByPerson(person:Person){
    let query = {
      idPerson: person._id
    }
    return this.daoService.search<Asistencia>(ASIS_PREVENCION_RECORD, query);
  }

  fetchAsistenciaByDNI(tdoc, ndoc){
    let query = {
      tdoc: tdoc,
      ndoc: ndoc
    }
    return this.daoService.search<Asistencia>(ASIS_PREVENCION_RECORD, query);
  }


  fetchAsistenciaById(id){
    return this.daoService.findById<Asistencia>(ASIS_PREVENCION_RECORD, id);
  }


  fetchAsistenciaByQuery(query:any){
    let listener = new Subject<Asistencia[]>();
    this.loadAsistenciasByQuery(listener, query);
    return listener;
  }

  private loadAsistenciasByQuery(listener: Subject<Asistencia[]>, query){

    this.daoService.search<Asistencia>(ASIS_PREVENCION_RECORD, query).subscribe(list =>{
      if(list && list.length){
        this.solicitudesList = list;

      }else{
        this.solicitudesList = [];

      }

      listener.next(this.solicitudesList);

    })
  }


  public fetchAsistenciasDashboard(fecharef: Date): Observable<any>{

    return this.daoService.fetchAsistenciaDashboard<any>(ASIS_PREVENCION_RECORD, fecharef.getTime());

  }

  public fetchEpidemioDashboard(fecharef: Date): Observable<any>{

    return this.daoService.fetchEpidemioDashboard<any>(ASIS_PREVENCION_RECORD, fecharef.getTime());

  }


  /*****  AsistenciaListener    ****/
  get asistenciaListener(): BehaviorSubject<Asistencia[]>{
    return this._asistenciaListener;
  }


  /*****  SAsistencia TABLE table Table    ****/
  get asistenciasDataSource(): BehaviorSubject<AsistenciaTable[]>{
    return this.emitAsistenciaDataSource;
  }

  get selectionModel(): SelectionModel<AsistenciaTable>{
    return this._selectionModel;
  }

  set selectionModel(selection: SelectionModel<AsistenciaTable>){
    this._selectionModel = selection;
  }

  get tableActions(){
    return AsistenciaHelper.getOptionlist('tableactions');
  }


  updateTableData(){
    let tableData = AsistenciaHelper.buildDataTable(this.solicitudesList);
    this.emitAsistenciaDataSource.next(tableData);
  }

  triggerAsistenciaEmitter(list: Asistencia[]){
    this.asistenciaListener.next(list);
  }

  updateAvanceAsistencia(avance,   asistenciaId:string){
    let token = {
      avance: avance
    }
    this.daoService.update(ASIS_PREVENCION_RECORD, asistenciaId, token).then(t =>{

    })
  }

  updateAsistenciaListItem(item ):void{
    // let pr: Asistencia = this.asistencia.find((product:any) => product._id === item._id);
    // if(pr){
    //   pr.pu = item.pu;
    //   pr.slug = item.slug;
    // }
  }



  exportAsisprevencionByQuery(query:any){

    let params = this.daoService.buildParams(query);
    const Url = 'api/asisprevencion/exportarmovimientos?' + params.toString();

    const windw = window.open(Url, 'about:blank')

  }




  /***************************/
  /******* Turnos *******/
  /***************************/
  get activeTurno(): Turno{
    return this.currentTurno;
  }

  get turnoEventListener(): Subject<TurnoAction> {
    return this._turnoEvent;
  }

  get socket(): SocketIOClient.Socket{
    return this.userService.socket;
  }

  private atendidoPor(sector): Atendido{
    if(! this.userx) return null;
    return {
        id: this.userx.id,
        slug: this.userx.username,
        sector: sector
    }
  }

  /**
  * obtener serial para Documento Provisorio
  */
  updateTurno(taction: TurnoAction): Subject<Turno>{
    let listener = new Subject<Turno>();
    let turno = this.initTurnoForUpdate(taction);
    this.currentTurno = turno;
    this.setCurrentPersonFromTurno(turno);
    this.upsertTurno(listener, turno);
    //this._turnoEvent.next(taction);

    return listener;
  }
  

  upsertTurno(listener: Subject<Turno>, turno: Turno){
    this.daoService.update<Turno>('turno', turno._id, turno).then(t =>{
      listener.next(t);
    })
  }


  private initTurnoForUpdate(taction: TurnoAction){
    let turno = taction.turno;
    if(taction.action === 'atender'){
      turno.estado = 'atendido';
      turno.resultado = 'cumplido';
      turno.observacion = taction.observación;

      if(taction.payload){
        turno.payload = taction.payload;
      }

      turno.atendidox = this.atendidoPor(turno.sector);
      turno.ts_fin = Date.now();

    }else if(taction.action === 'baja'){
      turno.estado = 'baja';
      turno.resultado = 'ausente';
      turno.observacion = taction.observación;
    }

    return turno;
  }


  /**
  * obtener serial para Documento Provisorio
  */
  turnoCreate(type:string, name,  sector:string, peso: number, person:Person ): Subject<Turno>{
    let listener = new Subject<Turno>();

    this.initNuevoTurno(listener, type, name, sector, peso, person);
    return listener;
  }

  private initNuevoTurno(turno$:Subject<Turno>, type, name, sector, peso, person:Person){

    this.fetchSerialTurnos(type, name, sector, peso).subscribe(serial =>{
      
      let turno = TurnosModel.initNewTurno(type, name, sector, serial, peso, person);

      this.fetchNuevoTurno(turno$, turno);
    });
  }

  private fetchNuevoTurno(listener: Subject<Turno>, turno: Turno){
      this.daoService.create<Turno>('turno', turno).then(turno =>{
        listener.next(turno);
      });
  }

  /**
  * cola de turnos en un sector
  */
  public turnosPorSector$(type, name, sector){
    let query = TurnosModel.turnosPorSectorQuery(type, name, sector);
    return this.daoService.search<Turno>('turno', query);
  }

  public turnosPendientes$():Observable<Turno[]>{
    let query = TurnosModel.turnosPendientesQuery('turnos', 'ayudadirecta');
    return this.daoService.search<Turno>('turno', query);
  }

  /**
  * cola de turnos en un sector
  */
  public turnosPorDiaSector$(sector){
    let query = TurnosModel.turnosPorDiaSectorQuery('turnos', 'ayudadirecta', sector);
    return this.daoService.search<Turno>('turno', query);
  }

  /***************************/
  /******* PERSON *******/
  /***************************/
  /**
  * Crea una nueva persona
  */
  createPerson(person: Person) : Promise<Person> {
    return this.daoService.create<Person>('person', person)
  }

  createPersonFromAsistencia(asistencia: Asistencia){
    let hasDatosMinimos = false;
    let person: Person;
    let requerido: Requirente;
    let hasPerson = this.verificaPersonaEnAsistencia(asistencia);

    if(!hasPerson) {
      hasDatosMinimos = this.verificaDatosMinimos(asistencia);
      if(hasDatosMinimos){
        requerido = asistencia.requeridox;

        person = new Person(requerido.slug);
        this.buildDatosBasicosPerson(person, asistencia)
        this.buildCoberturaPerson(person, asistencia)
        this.buildLocacionPerson(person, asistencia)
        this.daoService.create<Person>('person', person).then(p => {
          if(p){
            this.updatePersonInAsistencia(p, asistencia);
          }
        })

      }
    }

  }

  private updatePersonInAsistencia(p:Person, asistencia: Asistencia){
    asistencia.idPerson = p._id
    asistencia.requeridox.id = p._id
    this.daoService.update<Asistencia>(ASIS_PREVENCION_RECORD, asistencia._id, asistencia).then(t =>{
    })

  }

  private buildDatosBasicosPerson(p:Person, asis: Asistencia){
    p.nombre = asis.requeridox.nombre;
    p.apellido = asis.requeridox.apellido;
    p.displayName = asis.requeridox.slug;


    p.tdoc = asis.tdoc;
    p.ndoc = asis.ndoc;
    p.contactdata = [ {
      tdato: 'CEL',
      data:  asis.telefono,
      type: 'PER',
      slug: 'Informado en asistencia',
      isPrincipal: true

    } as PersonContactData]


  }

  private buildCoberturaPerson(p:Person, asis: Asistencia){
    if(asis.osocial){
      p.cobertura = [{
        type: 'cobertura',
        tingreso: 'osocial',
        slug: asis.osocial + ': ' + asis.osocialTxt,
        monto: 0,
        observacion: '',
        fecha: '',
        fe_ts: 0,
        estado: 'activo'
      }]
    }

  }

  private buildLocacionPerson(p:Person, asis: Asistencia){
    let locacion = asis.locacion;
    if(locacion){
      let add = new Address();
      add.slug = 'Informado en asistencia'
      add.street1 = locacion.street1;
      add.streetIn = locacion.streetIn;
      add.streetOut = locacion.streetOut;
      add.city = locacion.city;
      add.barrio = locacion.barrio;

      p.locaciones = [ add ]

    }
  }

  private verificaPersonaEnAsistencia(asistencia: Asistencia): boolean {
    let hasPerson = false;
    let requerido = asistencia.requeridox;
    if(requerido){
      if(requerido.id){
        return true;
      }
    }
    return hasPerson;
  }

  private verificaDatosMinimos(asistencia: Asistencia): boolean {
    let hasMinimos = true;

    if(! (asistencia.ndoc && asistencia.tdoc && asistencia.requeridox && asistencia.requeridox.nombre && asistencia.requeridox.apellido && asistencia.requeridox.slug)){
      hasMinimos = false;
    }

    return hasMinimos;
  }



  /******* Search PERSON Person person by Name *******/

  searchPerson(tdoc: string, term: string): Observable<Person[]> {
      let query = {};
      let test = Number(term);

      if(!(term && term.trim())){
        return of([] as Person[]);
      }

      if(isNaN(test)){
        query['displayName'] = term.trim();
      }else{
        query['tdoc'] = tdoc;
        query['ndoc'] = term;
      }
      
      return this.daoService.search<Person>('person', query);
  }

  fetchPersonById(id: string): Promise<Person>{
    return this.daoService.findById<Person>('person', id);
  }

  fetchPersonByQuery(query: any): Observable<Person[]>{
    return this.daoService.search<Person>('person', query);
  }

  setCurrentPersonFromId(id: string){
    if(!id) return;
    let fetch$ = this.fetchPersonById(id);

    fetch$.then(p => {
      this.updateCurrentPerson(p);
    });

    return fetch$
 
  }

  setCurrentPersonFromTurno(turno: Turno){
    if(turno && turno.requeridox && turno.requeridox.id){

      this.fetchPersonById(turno.requeridox.id).then(p => {
        this.updateCurrentPerson(p);
      });
    }

  }

  updateCurrentPerson(person: Person){
    this.currentPerson = person;
    this.personListener.next(this.currentPerson);
  }

  resetCurrentPerson(){
    this.currentPerson = new Person('Anónimo')
  }

  get activePerson(): Person{
    return this.currentPerson;
  }

  /******* Fetch PERSON Person person *******/
  fetchPersonByDNI(tdoc:string, ndoc:string ): Subject<Person[]>{
    let listener = new Subject<Person[]>();

    this.loadPersonByDNI(listener, tdoc,ndoc);
    return listener;
  }  

  private loadPersonByDNI(recordEmitter:Subject<Person[]>, tdoc, ndoc){
    let query = {
      tdoc: tdoc,
      ndoc: ndoc
    }

    this.daoService.search<Person>('person', query).subscribe(tokens =>{
      if(tokens){
        recordEmitter.next(tokens)

      }else{
        recordEmitter.next([]);
      }

    });
  }

  loadPersonAddresses(personId): Observable<Address[]>{
    const addresses$ = new Subject<Address[]>();

    this.fetchPersonById(personId).then(p =>{
      if(p && p.locaciones && p.locaciones.length){
        addresses$.next(p.locaciones);
      }else {
        addresses$.next([]);
      }
    })

    return addresses$;

  }


  loadPersonAddressesOptList(personId): Observable<OptionList[]>{
    const token$ = new Subject<OptionList[]>();
    const optList: Array<OptionList> = [];


    this.fetchPersonById(personId).then(p =>{
      if(p && p.locaciones && p.locaciones.length){
        p.locaciones.forEach(t=> {
          optList.push({
            val: t._id,
            label: t.street1 + ' ' + t.barrio + ' ' + t.city,
            barrio: t.barrio,
            city: t.city
          })
        })
        token$.next(optList);

      }else {
        token$.next(optList);
      }
    })

    return token$;

  }


  testPersonByDNI(tdoc:string, ndoc:string ): Observable<Person[]>{
    let query = {
      tdoc: tdoc,
      ndoc: ndoc
    }
    return this.daoService.search<Person>('person', query)

  }  

  addressLookUp(address: Address|Locacion): Promise<any>{
    return this.daoService.geocodeForward(address);
  }

/**
  id_turno: string;
  turno: Asistencia;
  action: string;
  estado: string;
  resultado?: string;
  atendidox?: Atendido;
  modalidad?: Alimento;
  observación?: string;

    asistencia: Asistencia;
  locacion: any;
  lat: number;
  lng: number;


*/

  fetchMapDataFromAsis(list: Asistencia[]){
    let sigList$ = new Subject<AsistenciaSig[]>();
    let personList: Array<string> = [];
    let asistenciaList: Array<Asistencia> = [];

    //let collectList$
    let sigList: AsistenciaSig[] = []

    list.forEach(asis => {
      if(asis.requeridox && asis.requeridox.id){ 
        personList.push(asis.requeridox.id);
        asistenciaList.push(asis);
      }
    })

    if(personList.length){
      this.daoService.search<Person>('person', {list: personList}).subscribe(list => {
        if(list && list.length) {
          list.forEach((person, index) => {
            let locaciones = person.locaciones;
            if(locaciones && locaciones.length){
              locaciones.forEach(l => {
                if(l.lat && l.lng){
                  sigList.push({
                    asistencia: asistenciaList[index],
                    locacion: l,
                    lat: l.lat,
                    lng: l.lng
                  })
                }
              })
            }
          })
        }
        sigList$.next(sigList);
      })

    }else{      
        sigList$.next(sigList);
    }


    //ToDo
    return sigList$

  }

  /***************************/
  /******* Navigation *******/
  /***************************/

  // navigation ROUTER
  atencionRoute(sector): string{
    if(this.activePerson){
      if(sector === 'alimentos'){
        return ALIMENTOS_ROUTE;

      }else if (sector === 'tsocial'){
        return ATTENTION_ROUTE;

      }else if (sector === 'talimentar'){
        return ALIMENTAR_ROUTE;

      }else if (sector === 'regionvi'){
        return ATTENTION_ROUTE;

      }else if (sector === 'habitat'){
        return ATTENTION_ROUTE;

      }else if (sector === 'nutricion'){
        return ATTENTION_ROUTE;

      }else if (sector === 'terceraedad'){
        return ATTENTION_ROUTE;

      }else if (sector === 'discapacidad'){
        return ATTENTION_ROUTE;

      }else if (sector === 'masvida'){
        return ATTENTION_ROUTE;

      }else if (sector === 'inhumacion'){
        return ATTENTION_ROUTE;

      }else if (sector === 'pensiones'){
        return ATTENTION_ROUTE;

      }else if (sector === 'familia'){
        return ATTENTION_ROUTE;

      }else if (sector === 'referentebarrial'){
        return ATTENTION_ROUTE;

      }else if (sector === 'cimientos'){
        return ATTENTION_ROUTE;

      }else if (sector === 'subsidios'){
        return ATTENTION_ROUTE;

      }else if (sector === 'direccion'){
        return ATTENTION_ROUTE;

      }else if (sector === 'seguimiento'){
        return SEGUIMIENTO_ROUTE;

      }else if (sector === 'recepcion'){
        return RECEPTION_ROUTE;
 
      }else if (sector === 'auditoria'){
        return AUDITENTREGAS_ROUTE;

      }else {
        return RECEPTION_ROUTE;
      }

    }else {
      if (sector === 'recepcion'){
        return RECEPTION_ROUTE;

      }else {
        return ATTENTION_ROUTE;
      }

    }

  }

  actualRoute(snap: string, mRoute: UrlSegment[]){
    this.hasActiveUrlPath = false;
    this.actualUrl = snap;
    this.actualUrlSegments = mRoute;
    this.navigationUrl = this.fetchNavigationUrl(snap, mRoute.toString())
    if(this.navigationUrl) this.hasActiveUrlPath = true;
  }

  private fetchNavigationUrl(snap, urlmodule){
    let urlpath: string = "";

    if(urlmodule){
      urlpath = snap.substr(1, (snap.length - urlmodule.length -2));
      //c onsole.log('url path [%s] [%s]', urlpath ,(snap.length - urlmodule.length -1));
    }else{
      urlpath = snap.substr(1);
    }

    if(urlpath){
      let split = urlpath.split('/') 
      urlpath = split[0];
    }
    return urlpath 
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


  /***************************/
  /******* USER HELPER *******/
  /***************************/
  loadUserCommunity(){
    if(this.userx.communityId === 'develar') {
      this.userHasNoCommunity();

    }else{
        this.daoService.findById<Community>('community', this.userx.communityId).then(entity => {

          if(entity){
            this.userx.userCommunity = entity;
            this.userx.hasCommunity = true;
            //
            this.userCmty.data = entity;
            this.userCmty.id = entity._id;
            this.userCmty.isActive = true;
            this.userCmty.isLoading = false;
            this.userCmty.userOwned = true;
            this.userCmty.url = entity.urlpath;
    
            this.pushCommunityFromUser()

          }else{
            this.userHasNoCommunity();
          }

          this.userLoading = false;
          this.onReady.next (true);
        });
      }
  }

  userHasNoCommunity(){
      this.userx.userCommunity = null;
      this.userx.hasCommunity = false;

      this.userCmty.data = null;
      this.userCmty.id = '';
      this.userCmty.isActive = false;
      this.userCmty.isLoading = false;
      this.userCmty.userOwned = false;
      this.userCmty.url = '';

      this.userLoading = false;
      this.onReady.next (true);
  }

  pushCommunityFromUser(){

      Object.assign(this.naviCmty, this.userCmty);
  }

  updateUserStatus(user:User){
    this.userx.id = user._id;
    this.userx.data = user;
    this.userx.isLogged = true;
    this.userx.username = user.username;
    this.userx.email = user.email;
    this.userx.hasCommunity = false;
    this.isUserAdmin = this.userService.isAdminUser();

    if(user.communityId){
      this.userx.communityId = user.communityId
      this.loadUserCommunity()
    }else{
      this.userLoading = false;
      this.onReady.next (true);
    }
  }

  fetchUserByRole(role: string){
    let query = {
      moduleroles: role
    }
    return this.daoService.search<User>('user', query);

  }

  get encuestadores(): User[]{
    return this._encuestadores;
  }

  buildEncuestadoresOptList(){
    let arr = []
    if(!this._encuestadores) return arr;
    
    this._encuestadores.forEach(x => {
      let t = {
        val: x._id,
        label: x.displayName
      }
      arr.push(t);

    })
    return arr;
  }

  // Browse Solicitud de Asistencia Form Data 
  get asistenciasSelector():AsistenciaBrowse{
    if(!this._asistenciasSelector) this._asistenciasSelector = new AsistenciaBrowse();
    return this._asistenciasSelector;
  }
  
  set asistenciasSelector(e: AsistenciaBrowse){
    this._asistenciasSelector = e;
  }

  // Browse Solicitud que están bajo vigilancia epidemiológica
  get vigilanciaSelector():VigilanciaBrowse{
    if(!this._vigilanciaSelector) this._vigilanciaSelector = new VigilanciaBrowse();
    return this._vigilanciaSelector;
  }
  
  set vigilanciaSelector(e: VigilanciaBrowse){
    this._vigilanciaSelector = e;
  }



  getAuditData(){
    if(! this.userx) return null;

    return {
        userId: this.userx.id,
        username: this.userx.username,
        ts_alta: Date.now()
    }
  }
 



}//END controller

interface OptionList {
  val: string;
  label: string;
  barrio?: string;
  city?: string;
}


class CommunityToken {
  isActive: boolean = false;
  isLoading: boolean = false;
  userOwned: boolean = false;
  renderTopic: string = "";
  id: string = "";
  url: string = "";
  data: Community;
}

class UserToken {
  isLogged: boolean = false;
  hasCommunity: boolean = false;
  username: string = "";
  email:string = "";
  id: string = "";
  communityId: string = "";
  userCommunity: Community;
  data: User;
}
