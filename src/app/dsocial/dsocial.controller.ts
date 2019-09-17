import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

import { MatSnackBar, MatSnackBarConfig }           from '@angular/material';
import { MatDialog, MatDialogRef, MatSelectChange } from '@angular/material';

import { DataSource, SelectionModel } from '@angular/cdk/collections';

import { BehaviorSubject ,  Subject ,  Observable, of } from 'rxjs';

import { SharedService } from '../develar-commons/shared-service';
import { DaoService }    from '../develar-commons/dao.service';
import { devutils } from '../develar-commons/utils';

import { GenericDialogComponent } from '../develar-commons/generic-dialog/generic-dialog.component';

import { UserService }   from '../entities/user/user.service';
import { Person, Address, UpdatePersonEvent }        from '../entities/person/person';
import { User }          from '../entities/user/user';
import { Community }     from '../develar-commons/community/community.model';
import { DsocialModel, Serial, Ciudadano } from './dsocial.model';
import { Turno, TurnoAction, TurnosModel }         from './turnos/turnos.model';
import { Asistencia, AsistenciaTable, Alimento, UpdateAsistenciaEvent, UpdateAlimentoEvent, AsistenciaHelper } from './asistencia/asistencia.model';
import { RemitoAlmacen, RemitoAlmacenModel, RemitoAlmacenTable, AlimentosHelper } from './alimentos/alimentos.model';

const ATTENTION_ROUTE = "atencionsocial";
const ALIMENTOS_ROUTE = "alimentos";
const SEGUIMIENTO_ROUTE = "seguimiento";
const CORE = 'core';
const CONTACT = 'contact';
const ADDRESS = 'address';
const FAMILY = 'family';
const OFICIOS = 'oficios';
const SALUD = 'salud';
const COBERTURA = 'cobertura';
const ENCUESTA = 'ambiental';

@Injectable({
	providedIn: 'root'
})
export class DsocialController {
  
  private hasActiveUrlPath = false;
  private actualUrl = "";
  private actualUrlSegments: UrlSegment[] = [];
  private navigationUrl = "";

  private _encuestadores: User[];

  private currentTurno: Turno;
  private currentPerson: Person;
  public personListener = new BehaviorSubject<Person>(this.currentPerson);



  private userListener: BehaviorSubject<User>;
  private userLoading = false;
  private userx: UserToken = new UserToken();
  public  isUserAdmin = false;

  private userCmty: CommunityToken = new CommunityToken();
  private naviCmty: CommunityToken = new CommunityToken();

  public  onReady = new BehaviorSubject<boolean>(false);

  private emitAsistenciaDataSource = new BehaviorSubject<AsistenciaTable[]>([]);
  private _selectionModel: SelectionModel<AsistenciaTable>
  private solicitudesList: Array<Asistencia> = [];


  private emitRemitosDataSource = new BehaviorSubject<RemitoAlmacenTable[]>([]);
  private _remitosSelectionModel: SelectionModel<RemitoAlmacenTable>
  private remitosList: Array<RemitoAlmacen> = [];


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
    // todo
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

    remitoalmacen.fecomp_tsa = devutils.dateFromTx(remitoalmacen.fecomp_txa).getTime();

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

  private loadRemitoAlmacensByQuery(listener: Subject<RemitoAlmacen[]>, query){

    this.daoService.search<RemitoAlmacen>('remitoalmacen', query).subscribe(list =>{
      if(list && list.length){
        this.remitosList = list;

      }else{
        this.remitosList = [];

      }

      listener.next(this.remitosList);

    })
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
      avance: avance
    }
    this.daoService.update(type, remitoId, token).then(t =>{

    })
  }


  // updateAsistenciaListItem(item ):void{
  //   // let pr: Asistencia = this.asistencia.find((product:any) => product._id === item._id);
  //   // if(pr){
  //   //   pr.pu = item.pu;
  //   //   pr.slug = item.slug;
  //   // }
  // }






  /*****************************/
  /******* Asistencias ********/
  /***************************/
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
    // todo
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
    asistencia.idPerson = this.currentPerson._id;
    asistencia.requeridox = AsistenciaHelper.buildRequirente(this.currentPerson);

    if(!asistencia.fecomp_txa){
      asistencia.fecomp_txa = devutils.txFromDate(new Date());
    }

    let fecomp_date = devutils.dateFromTx(asistencia.fecomp_txa)
    asistencia.fecomp_tsa = fecomp_date.getTime();
    asistencia.fecomp_txa = devutils.txFromDate(fecomp_date);

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

  /**
  * obtener serial para Documento Provisorio
  */
  updateTurno(taction: TurnoAction): Subject<Turno>{
    let listener = new Subject<Turno>();
    let turno = this.initTurnoForUpdate(taction);
    this.currentTurno = turno;
    this.setCurrentPersonFromTurno(turno);
    this.upsertTurno(listener, turno);

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

      if(taction.atendidox){
        turno.atendidox = taction.atendidox;
      }

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

  searchPerson(term: string): Observable<Person[]> {
      let query = {};
      let test = Number(term);

      if(!(term && term.trim())){
        return of([] as Person[]);
      }
      if(isNaN(test)){
        query['displayName'] = term;
      }else{
        query['ndoc'] = term;

      }

      return this.daoService.search<Person>('person', query);
  }

  fetchPersonById(id: string): Promise<Person>{
    return this.daoService.findById<Person>('person', id);
  }

  setCurrentPersonFromId(id: string){
    if(!id) return;

    this.fetchPersonById(id).then(p => {
      this.updateCurrentPerson(p);
    });

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
            label: t.street1 + ' ' + t.barrio + ' ' + t.city
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

      }else if (sector === 'seguimiento'){
        return SEGUIMIENTO_ROUTE;

      }else if (sector === 'recepcion'){
        return ATTENTION_ROUTE;

      }else {
        return ATTENTION_ROUTE;
      }

    }else{
      return ATTENTION_ROUTE;

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
      //console.log('url path [%s] [%s]', urlpath ,(snap.length - urlmodule.length -1));
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
      //console.log('action???? [%s]', e);
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


}//END controller

interface OptionList {
  val: string;
  label: string;
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
