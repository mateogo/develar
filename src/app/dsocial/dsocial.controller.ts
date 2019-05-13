import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

import { MatSnackBar, MatSnackBarConfig }           from '@angular/material';
import { MatDialog, MatDialogRef, MatSelectChange } from '@angular/material';

import { BehaviorSubject ,  Subject ,  Observable, of } from 'rxjs';

import { SharedService } from '../develar-commons/shared-service';
import { DaoService }    from '../develar-commons/dao.service';

import { GenericDialogComponent } from '../develar-commons/generic-dialog/generic-dialog.component';

import { UserService }   from '../entities/user/user.service';
import { Person, UpdatePersonEvent }        from '../entities/person/person';
import { User }          from '../entities/user/user';
import { Community }     from '../develar-commons/community/community.model';
import { DsocialModel, Serial, Ciudadano } from './dsocial.model';
import { Turno, TurnoAction, TurnoslModel }         from './turnos/turnos.model';

const ATTENTION_ROUTE = "atencionsocial";
const CORE = 'core';
const CONTACT = 'contact';
const ADDRESS = 'address';
const FAMILY = 'family';
const OFICIOS = 'oficios';

@Injectable({
	providedIn: 'root'
})
export class DsocialController {
  
  private hasActiveUrlPath = false;
  private actualUrl = "";
  private actualUrlSegments: UrlSegment[] = [];
  private navigationUrl = "";

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

	constructor(
		private daoService: DaoService,
		private userService: UserService,
    private sharedSrv:   SharedService,
    private dialogService: MatDialog,
    private snackBar:    MatSnackBar,
		) {
    this.userListener = this.userService.userEmitter;

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
    console.log('CONTROLLER event BUBBLED');

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
  fetchSerialTurnos(type, name, sector): Observable<Serial> {
    let serial: Serial = DsocialModel.turnoSerial(type, name, sector);
    let fecha = new Date();
    serial.anio = fecha.getFullYear();
    serial.mes = fecha.getMonth();
    serial.dia = fecha.getDate();
    return this.daoService.nextSerial<Serial>('serial', serial);
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
  turnoCreate(type:string, name,  sector:string, person:Person ): Subject<Turno>{
    let listener = new Subject<Turno>();

    this.initNuevoTurno(listener, type, name, sector, person);
    return listener;
  }

  private initNuevoTurno(turno$:Subject<Turno>, type, name, sector, person:Person){
    let serial: Serial = DsocialModel.documSerial();

    this.fetchSerialTurnos(type, name, sector).subscribe(serial =>{
      
      let turno = TurnoslModel.initNewTurno(type, name, sector,serial, person);

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
    let query = TurnoslModel.turnosPorSectorQuery(type, name, sector);
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
      if(!(term && term.trim())){
        return of([] as Person[]);
      }
      return this.daoService.search<Person>('person', {displayName: term});
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



  /***************************/
  /******* Navigation *******/
  /***************************/

  // navigation ROUTER
  atencionRoute(): string{
    if(this.activePerson){
      return ATTENTION_ROUTE;

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

    console.log('actualRoute: navigationUrl[%s]', this.navigationUrl );
    console.log('actualRoute: actualUrl[%s]', this.actualUrl );
    console.log('actualRoute: actualUrlSegments[%s]', this.actualUrlSegments );

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


}//END controller


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
