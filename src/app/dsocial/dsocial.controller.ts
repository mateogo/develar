import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

import { DataSource, SelectionModel } from '@angular/cdk/collections';

import { BehaviorSubject ,  Subject ,  Observable, of } from 'rxjs';

import * as io from 'socket.io-client';

import { SharedService } from '../develar-commons/shared-service';
import { DaoService }    from '../develar-commons/dao.service';
import { devutils } from '../develar-commons/utils';

import { GenericDialogComponent } from '../develar-commons/generic-dialog/generic-dialog.component';

import { UserService }   from '../entities/user/user.service';
import { Product, KitProduct } from '../entities/products/product.model';

import { Person, Address, BeneficiarioAlimentar, UpdatePersonEvent }        from '../entities/person/person';
import { User }          from '../entities/user/user';
import { UserWeb } from '../entities/user-web/user-web.model';

//import { SharedService } from '../../develar-commons/shared-service';

import { Community }     from '../develar-commons/community/community.model';
import { DsocialModel, Serial, Ciudadano } from './dsocial.model';
import { Turno, TurnoAction, Atendido, TurnosModel }         from './turnos/turnos.model';
import { Observacion, ObservacionBrowse, ObservacionTable } from '../develar-commons/observaciones/observaciones.model';

import { Asistencia, Alimento, AsistenciaBrowse,Requirente,TurnosAsignados,
          AsistenciaTable, AsistenciaHelper, AsistenciaSig,
          UpdateAsistenciaEvent, UpdateAlimentoEvent } from './asistencia/asistencia.model';

import { RemitoAlmacen, RemitoAlmacenModel, RemitoAlmacenTable, KitOptionList, AlimentosHelper } from './alimentos/alimentos.model';
import { ObservacionesHelper } from '../develar-commons/observaciones/observaciones.helper';
import { HttpParams } from '@angular/common/http';

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
const OBSERVACION = 'observacion';
@Injectable({
	providedIn: 'root'
})
export class DsocialController {

  private hasActiveUrlPath = false;
  private actualUrl = "";
  private actualUrlSegments: UrlSegment[] = [];
  private navigationUrl = "";

  private _asistenciasSelector: AsistenciaBrowse;
  private _observacionesSelector: ObservacionBrowse;

  private _encuestadores: User[];

  private currentTurno: Turno;
  private currentPerson: Person;
  private _turnoEvent: Subject<TurnoAction> = new Subject();
  public personListener = new BehaviorSubject<Person>(null);

  private userListener: BehaviorSubject<User|UserWeb>;
  private userLoading = false;
  private userx: UserToken = new UserToken();
  public  isUserAdmin = false;

  private userCmty: CommunityToken = new CommunityToken();
  private naviCmty: CommunityToken = new CommunityToken();

  public  onReady = new BehaviorSubject<boolean>(false);

  private emitAsistenciaDataSource = new BehaviorSubject<AsistenciaTable[]>([]);
  private emitObservacionesDataSource = new BehaviorSubject<ObservacionTable[]>([]);
  private _selectionModel: SelectionModel<AsistenciaTable>
  private solicitudesList: Array<Asistencia> = [];


  private emitRemitosDataSource = new BehaviorSubject<RemitoAlmacenTable[]>([]);
  private _remitosSelectionModel: SelectionModel<RemitoAlmacenTable>
  private remitosList: Array<RemitoAlmacen> = [];

  private _kitAlimentosOptList: KitOptionList[];


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

    this.userListener.subscribe((user: User )=>{

      this.userLoading = true;
      this.updateUserStatus(user);
    })

    this.loadKitAlimentosOptList()


    setTimeout(() => {
    	if(!this.userLoading) this.onReady.next(true)
    }, 1000);
  }



  /***************************/
  /******* Seriales *******/
  /***************************/
  /**
  * obtener serial para Documento Provisorio
  */
  fetchSerialDocumProvisorio(): Observable<Serial> {
    let serial: Serial = DsocialModel.documSerial();
    return this.daoService.nextSerial<Serial>('serial', serial);
  }

 /**
  * obtener serial para Turnos
  */
  fetchSerialTurnos(type, name, sector, peso): Observable<Serial> {
    let serial: Serial = DsocialModel.turnoSerial(type, name, sector, peso);
    let fecha = new Date();
    serial.anio = fecha.getFullYear();
    serial.mes = fecha.getMonth();
    serial.dia = fecha.getDate();
    return this.daoService.nextSerial<Serial>('serial', serial);
  }

 /**
  * obtener serial para Asistencias
  */
  fetchSerialAsistencias(type, name, sector): Observable<Serial> {
    //c onsole.log('t[%s] n[%s] s[%s]', type, name, sector);
    let serial: Serial = DsocialModel.asistenciaSerial(type, name, sector);
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
    let serial: Serial = DsocialModel.remitoalmacenSerial(type, name, sector);
    let fecha = new Date();
    serial.anio = fecha.getFullYear();
    serial.mes = fecha.getMonth();
    serial.dia = fecha.getDate();
    return this.daoService.nextSerial<Serial>('serial', serial);
  }


  /*********************************/
  /******* Gturnos ********/
  /*******************************/
  fetchTurnoForDelegaciones(gturno: GTurno, person: Person): Observable<TurnosAsignados[]>{
    let requirente = new Requirente();
    requirente.slug = person.displayName;
    requirente.tdoc = person.tdoc;
    requirente.ndoc = person.ndoc;
    requirente.id   = person._id;

    gturno.requeridox = requirente;
    return this.daoService.processGTurno<TurnosAsignados>('gturno', gturno);

  }

  fetchGTurnosByPerson(person: Person): Observable<TurnosAsignados[]>{
    let query = {
      personId: person._id
    }
    return this.daoService.search<TurnosAsignados>('gturno', query);

  }


  /*********************************/
  /******* Remitos Almacén ********/
  /*******************************/
  manageRemitosAlmacenRecord(type:string, remitoalmacen:RemitoAlmacen ): Subject<RemitoAlmacen>{
    //type: remitoalmacen
    let listener = new Subject<RemitoAlmacen>();

    if(this.isNewRemito(remitoalmacen)){
      this.createRemitoAlmacen(listener, type, remitoalmacen);

    }else{
      this.updateRemitoAlmacen(listener, type, remitoalmacen);

    }

    return listener;
  }

  private isNewRemito(token:RemitoAlmacen): boolean{
    let isNew = true;

    if(token._id){
      isNew = false;
    }

    return isNew;
  }


  /******* UPDATE REMITO ********/
  updateRemitoAlmacen(listener:Subject<RemitoAlmacen>, type, remitoalmacen:RemitoAlmacen){

    this.initRemitoAlmacenForUpdate(remitoalmacen);

    this.upsertRemitoAlmacen(listener, type, remitoalmacen);

  }

  private initRemitoAlmacenForUpdate(entity: RemitoAlmacen){
    entity.atendidox = this.atendidoPor(entity.sector);
    entity.ts_prog = Date.now();

  }

  upsertRemitoAlmacen(listener: Subject<RemitoAlmacen>, type,  remitoalmacen: RemitoAlmacen){
    this.daoService.update<RemitoAlmacen>(type, remitoalmacen._id, remitoalmacen).then(t =>{
      listener.next(t);
    })
  }

  /******* CREATE REMITO ********/
  private createRemitoAlmacen(listener:Subject<RemitoAlmacen>, type, remitoalmacen: RemitoAlmacen){
    let sector = remitoalmacen.sector || 'alimentos';
    let name = 'ayudadirecta';

    remitoalmacen.personId = this.currentPerson._id;
    remitoalmacen.requeridox = AlimentosHelper.buildRequirente(this.currentPerson);

    if(!remitoalmacen.fecomp_txa){
      remitoalmacen.fecomp_txa = devutils.txFromDate(new Date());

    }else{
      remitoalmacen.fecomp_txa = devutils.txNormalize(remitoalmacen.fecomp_txa);
    }

    let dateD = devutils.dateFromTx(remitoalmacen.fecomp_txa);
    remitoalmacen.fecomp_tsa = dateD ? dateD.getTime() : 0;

    remitoalmacen.atendidox = this.atendidoPor(sector);
    remitoalmacen.ts_prog = Date.now();

    this.fetchSerialRemitoalmacen(type, name, sector).subscribe(serial =>{
      remitoalmacen.compPrefix = serial.compPrefix ;
      remitoalmacen.compName = serial.compName;
      remitoalmacen.compNum = (serial.pnumero + serial.offset) + "";

      this.insertRemitoAlmacen(listener, type, remitoalmacen);
    });
  }

  private insertRemitoAlmacen(listener: Subject<RemitoAlmacen>,type,  token: RemitoAlmacen){
      this.daoService.create<RemitoAlmacen>(type, token).then(token =>{
        listener.next(token);
      });
  }


  /******* Remito By Person ********/
  fetchRemitoAlmacenByPerson(person:Person){
    let query = {
      personId: person._id,
      estado: 'activo'
    }
    return this.daoService.search<RemitoAlmacen>('remitoalmacen', query);
  }

  fetchRemitoAlmacenByQuery(query:any){
    let listener = new Subject<RemitoAlmacen[]>();
    this.loadRemitoAlmacensByQuery(listener, query);
    return listener;
  }

  exportAlmacenByQuery(query:any){
    Object.keys(query).forEach(key =>{
      if(query[key] == null || query[key] == 'no_definido' ) delete query[key];
      //if(key === 'fecomp_h' || key === 'fecomp_d') delete query[key];
    })

    let params = this.daoService.buildParams(query);

    const Url = 'api/remitosalmacen/exportarmovimientos?' + params.toString();

    const windw = window.open(Url, 'about:blank')


  }



  private loadRemitoAlmacensByQuery(listener: Subject<RemitoAlmacen[]>, query){

    Object.keys(query).forEach(key =>{
      if(query[key] == null || query[key] == 'no_definido' ) delete query[key];
      //if(key === 'fecomp_h' || key === 'fecomp_d') delete query[key];
    })


    this.daoService.search<RemitoAlmacen>('remitoalmacen', query).subscribe(list =>{
      if(list && list.length){
        this.remitosList = list;

      }else{
        this.remitosList = [];

      }

      listener.next(this.remitosList);

    })

  }


  public fetchRemitoalmacenDashboard(fecharef: Date): Observable<any>{

    return this.daoService.fetchAsistenciaDashboard<any>('remitoalmacen', fecharef.getTime());

  }


  /*****  SAsistencia TABLE table Table    ****/
  get remitosDataSource(): BehaviorSubject<RemitoAlmacenTable[]>{
    return this.emitRemitosDataSource;
  }

  get remitosSelectionModel(): SelectionModel<RemitoAlmacenTable>{
    return this._remitosSelectionModel;
  }
  set remitosSelectionModel(selection: SelectionModel<RemitoAlmacenTable>){
    this._remitosSelectionModel = selection;
  }

  get remitoTableActions(){
    return AlimentosHelper.getOptionlist('tableactions');
  }

  lookUpRemitoAlmacen(token: RemitoAlmacenTable): RemitoAlmacen{
    let remito: RemitoAlmacen;
    remito = this.remitosList.find(t => t._id === token._id);

    if(!remito) remito = new RemitoAlmacen();
    return remito;
  }


  updateRemitosTableData(){

    let tableData = AlimentosHelper.buildDataTable(this.remitosList);
    this.emitRemitosDataSource.next(tableData);
  }

  updateAvanceRemito(type, avance, remitoId: string){

    let token = {
      estado : avance === 'anulado' ? 'baja' : 'activo',
      avance: avance
    }
    let promise = this.daoService.update(type, remitoId, token);

    promise.then(t =>{
      //todo
    })

    return promise;
  }


  // updateAsistenciaListItem(item ):void{
  //   // let pr: Asistencia = this.asistencia.find((product:any) => product._id === item._id);
  //   // if(pr){
  //   //   pr.pu = item.pu;
  //   //   pr.slug = item.slug;
  //   // }
  // }



  /*****************************/
  /****** Audit Entregas ******/
  /***************************/
  auditEntregasByPerson(personId: string): Observable<any>{
    return this.daoService.fetchAuditEntregas('auditentrega', personId);
  }

  /************************************^***/
  /******* alimentar Beneficiario ********/
  /**************************************/
  fetchBeneficiario(ndoc: string){

    return this.daoService.fetchTarjetaAlimentar<BeneficiarioAlimentar>('beneficiarioalimentar', ndoc);

  }

  updateBeneficiario(beneficiario: BeneficiarioAlimentar){
    let hoy = new Date();
    //let hoy_tx = devutils.txDayFormatFromDate(Date.now()).toLowerCase();
    let hoy_tx = devutils.txFromDate(hoy);



    beneficiario.dia = hoy_tx;
    beneficiario.estado = 'entregada';
    beneficiario.fecha = devutils.txFromDate(hoy);
    beneficiario.fe_ts = hoy.getTime();

    this.daoService.update<BeneficiarioAlimentar>('beneficiarioalimentar', beneficiario._id, beneficiario).then(t =>{
      //c onsole.log('BENEFICIARIO UPDATE OK')

    })

  }

  anularEntregaBeneficiario(beneficiario: BeneficiarioAlimentar){
    let hoy = new Date();
    beneficiario.estado = 'pendiente';
    beneficiario.fecha = devutils.txFromDate(hoy);
    beneficiario.fe_ts = hoy.getTime();

    this.daoService.update<BeneficiarioAlimentar>('beneficiarioalimentar', beneficiario._id, beneficiario).then(t =>{
      //c onsole.log('BENEFICIARIO ANULACIÓN ENTREGA OK')

    })

  }

  fetchTarjetasPorDiaDashboard(fecharef: Date): Observable<any>{

    return this.daoService.fetchTarjetasPorDiaAlimentarDashboard<any>('beneficiarioalimentar', 0);

  }

  fetchTarjetas(query: any): Observable<BeneficiarioAlimentar[]>{

    return this.daoService.search<BeneficiarioAlimentar>('beneficiarioalimentar', query);

  }



  /*****************************/
  /******* Asistencias ********/
  /***************************/

  createExpressAsistencia(action: string, person: Person, slug: string, count: number){
    let listener = new Subject<Asistencia>();

    if(action === "alimentos") {
      this.createExpressAlimento(listener, action, person, slug, count);
    }
    return listener;

  }

  private createExpressAlimento(listener: Subject<Asistencia>, action:string, person: Person, slug: string, count: number){
    let sector = "alimentos"
    let serial_name = 'solicitud';
    let serial_type = 'asistencia';
    let kit = this._kitAlimentosOptList.find(t => t.val.indexOf('ESTANDAR')!== -1);
    if(!kit) kit = this._kitAlimentosOptList[0];


    const asistencia = AsistenciaHelper.initNewAsistencia(action, sector, person, null, slug);

    let alimento = AsistenciaHelper.initNewAlimento(asistencia.fecomp_txa, asistencia.fecomp_tsa, count);
    alimento.type = kit.val;

    asistencia.modalidad = alimento;

    asistencia.atendidox = this.atendidoPor(sector);
    asistencia.ts_prog = Date.now();

    this.fetchSerialAsistencias(serial_type, serial_name, sector).subscribe(serial =>{
      asistencia.compPrefix = serial.compPrefix ;
      asistencia.compName = serial.compName;
      asistencia.compNum = (serial.pnumero + serial.offset) + "";
      this.daoService.create<Asistencia>('asistencia', asistencia).then(token =>{
        // c onsole.log('Update Asistencia OK [%s]', token._id);
        if(token){
          listener.next(token)
        }

      });

    });
  }

  manageAsistenciaDeleteRecord(type:string, asistencia:Asistencia ): Subject<Asistencia>{
    let listener = new Subject<Asistencia>();

    return listener;
  }


  manageAsistenciaRecord(type:string, asistencia:Asistencia ): Subject<Asistencia>{
    let listener = new Subject<Asistencia>();
    if(this.isNewToken(asistencia)){
      this.initNewAsistencia(listener, type, asistencia);

    }else{
      this.updateAsistencia(listener, type, asistencia);

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
  updateAsistencia(asistencia$:Subject<Asistencia>, type, asistencia:Asistencia){

    this.initAsistenciaForUpdate(asistencia);

    this.upsertAsistencia(asistencia$, type, asistencia);

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

  upsertAsistencia(listener: Subject<Asistencia>, type,  asistencia: Asistencia){
    this.daoService.update<Asistencia>(type, asistencia._id, asistencia).then(t =>{
      listener.next(t);
    })
  }

  /******* CREATE ASISTENCIA ********/
  private initNewAsistencia(asistencia$:Subject<Asistencia>, type, asistencia:Asistencia){
    let sector = asistencia.sector || 'dsocial';
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



    this.fetchSerialAsistencias(type, name, sector).subscribe(serial =>{

      asistencia.compPrefix = serial.compPrefix ;
      asistencia.compName = serial.compName;
      asistencia.compNum = (serial.pnumero + serial.offset) + "";

      this.insertAsistencia(asistencia$, type, asistencia);
    });
  }

  private insertAsistencia(listener: Subject<Asistencia>,type,  token: Asistencia){
      this.daoService.create<Asistencia>(type, token).then(token =>{
        listener.next(token);
      });
  }

  fetchAsistenciaByPerson(person:Person){
    let query = {
      idPerson: person._id
    }
    return this.daoService.search<Asistencia>('asistencia', query);
  }


  fetchAsistenciaByQuery(query:any){
    let listener = new Subject<Asistencia[]>();
    this.loadAsistenciasByQuery(listener, query);
    return listener;
  }

  private loadAsistenciasByQuery(listener: Subject<Asistencia[]>, query){

    this.daoService.search<Asistencia>('asistencia', query).subscribe(list =>{
      if(list && list.length){
        this.solicitudesList = list;

      }else{
        this.solicitudesList = [];

      }

      listener.next(this.solicitudesList);

    })
  }


  public fetchAsistenciasDashboard(fecharef: Date): Observable<any>{

    return this.daoService.fetchAsistenciaDashboard<any>('asistencia', fecharef.getTime());

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


  updateAvanceAsistencia(type, avance,   asistenciaId:string){
    let token = {
      avance: avance
    }
    this.daoService.update(type, asistenciaId, token).then(t =>{

    })
  }

  updateAsistenciaListItem(item ):void{
    // let pr: Asistencia = this.asistencia.find((product:any) => product._id === item._id);
    // if(pr){
    //   pr.pu = item.pu;
    //   pr.slug = item.slug;
    // }
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

  get socket(): any{
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

  public turnosByPersonId$(p: Person, sector?: string):Observable<Turno[]>{
    let query = TurnosModel.turnosPorPersonId('turnos', 'ayudadirecta', sector, p._id);
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

  updatePersonPromise(id:string, p:Person): Promise<Person>{
    return this.daoService.partialUpdate<Person>('person', id, p)
  }


  /***************************/
  /******* Person *******/
  /***************************/
  /**
  * Crea una nueva persona
  */
  createPerson(person: Person) : Promise<Person> {
    return this.daoService.create<Person>('person', person)
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

  addressLookUp(address: Address): Promise<any>{
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

      }else if (sector === 'altaweb'){
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
  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {duration: 3000});

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

  getAuditData(){
    if(! this.userx) return null;

    return {
        userId: this.userx.id,
        username: this.userx.username,
        ts_alta: Date.now()
    }
  }


  /***************************/
  /******* Observaciones *******/
  /***************************/

  fetchObservacionesByQuery(query: any): Observable<Observacion[]> {
    return this.daoService.search<Observacion>(OBSERVACION, query);
  }

  exportObservacionesByQuery(query: any) {

    let params = this.daoService.buildParams(query);

    const url = `api/observaciones/export?${params.toString()}`;
    //const Url = 'api/remitosalmacen/exportarmovimientos?' + params.toString();
  
    window.open(url, 'about:blank')
  
  }

  updateObservacionesTableData(list: Observacion[]){
    const tableData = ObservacionesHelper.buildDataTable(list);
    this.emitObservacionesDataSource.next(tableData);
  }

  get observacionesDataSource(): BehaviorSubject<ObservacionTable[]>{
    return this.emitObservacionesDataSource;
  }

   manageObservacionRecord(text, audit, parent ): Subject<Observacion>{
    let listener = new Subject<Observacion>();
    let record = 'observacion';
    let observacion = this.initNewObservacion(text, audit, parent);

    this.insertObservacion(listener, record, observacion);

    return listener;
  }

  private initNewObservacion(text, audit, parent){
    // ToDo
    let fe = new Date();
    let obs = new Observacion();
    obs.type = 'informe';

    obs.fe_tx = devutils.txFromDate(fe);
    obs.fe_ts = fe.getTime();
    obs.ts_umod = obs.fe_ts;
    obs.parent = parent;
    obs.audit = audit;
    obs.observacion = text;
    return obs;

  }

  private insertObservacion(listener: Subject<Observacion>,type,  observacion: Observacion){
      this.daoService.create<Observacion>(type, observacion).then(obs =>{
        listener.next(obs);
      });
  }

 // Browse Solicitud de Asistencia Form Data
 get observacionesSelector():ObservacionBrowse{
  if(!this._observacionesSelector) this._observacionesSelector = new ObservacionBrowse();
  return this._observacionesSelector;
}

set observacionesSelector(e: ObservacionBrowse){
  this._observacionesSelector = e;
}


  /***************************/
  /******* KitProduct *******/
  /***************************/
  fetchKitAlimentosOptList(){
    let listener$ = new Subject<KitOptionList[]>();
    let type = 'productkit';
    let query = {
      estado: 'activo',
      type: 'alimentos'
    }
    this.daoService.search<KitProduct>(type, query).subscribe(list =>{
      if(list && list.length){
        let optList = list.map(t => {
                        return {
                          val : t.code,
                          label: t.name,
                          kit: t
                        } as KitOptionList
                      })
        listener$.next(optList);
      }

    })

    return listener$;

  }

  get kitAlimentosOptList():KitOptionList[]{
    //c onsole.log('getKitAlimentosOptList [%s]', this._kitAlimentosOptList && this._kitAlimentosOptList.length )
    if(!this._kitAlimentosOptList){
      this.loadKitAlimentosOptList();
      return [];
    }

    return this._kitAlimentosOptList;
  }


  loadKitAlimentosOptList(){
    this.fetchKitAlimentosOptList().subscribe(list => {
      if(list && list.length) this._kitAlimentosOptList = list;
    })

  }

  fetchKits(type:string, query: any): Observable<KitProduct[]>{
    return this.daoService.search<KitProduct>('productkit', query);
  }

  searchBySlug(slug): Observable<Product[]>{
    if(!(slug && slug.trim())){
      return of([] as Product[]);
    }
    return this.daoService.search<Product>('product', {slug: slug})
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

class GTurno {
  agenda ='ALIM:DEL';
  lugar =  'MUNI';
  lugarId: string;
  fecha: string;
  qty = 1;
  dry = true;
  requeridox: Requirente;
}

