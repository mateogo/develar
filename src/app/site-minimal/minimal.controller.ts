import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

import { BehaviorSubject ,  Subject ,  Observable } from 'rxjs';

import { SharedService } from '../develar-commons/shared-service';
import { DaoService } from '../develar-commons/dao.service';
import { UserService } from '../entities/user/user.service';
import { GenericDialogComponent } from '../develar-commons/generic-dialog/generic-dialog.component';

import { Person, Address, UpdatePersonEvent} from '../entities/person/person';
import { User } from '../entities/user/user';
import { Community } from '../develar-commons/community/community.model';

import { MessageToken } from '../notifications/notification.model';

import { RecordCard } from './recordcard.model';

import { SelectData, GraphUtils } from './recordcard-helper';

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
export class SiteMinimalController {

  private readonly recordtype = 'notification'

  //Site state properties
  private userLoading = false;
  public  onReady = new BehaviorSubject<boolean>(false);

  private homeResourcesEmitter =new Subject<RecordCard[]>();

  private recordLoaderListener = new Subject<CommunityToken>();

  private naviCmty: CommunityToken = new CommunityToken();
  private userCmty: CommunityToken = new CommunityToken();
  private userx: UserToken = new UserToken();
  public  isUserAdmin = false;

  private communityEmitter: BehaviorSubject<CommunityToken> = new BehaviorSubject(new CommunityToken());

  private hasActiveUrlPath = false;
  private _route: ActivatedRoute;
  private actualUrl = "";
  private actualUrlSegments: UrlSegment[] = [];
  private navigationUrl = "";

  private emitRecordCard = new Subject<RecordCard>();
  private recordCard: RecordCard;
  private recordCardId: string;
  private milestone: string;
  private _milestoneList: Array<SelectData>;

  private currentPerson: Person;

  private userListener: BehaviorSubject<User>;
  public timestamp;
  
  public personListener = new BehaviorSubject<Person>(this.currentPerson);


  //table browse


	constructor(
		private daoService: DaoService,
    private dialogService: MatDialog,
    private sharedSrv:   SharedService,
    private snackBar:    MatSnackBar,
		private userService: UserService,
		) {
    this.timestamp = Date.now();

    this.userListener = this.userService.userEmitter;

    this.userListener.subscribe(user =>{

      this.userLoading = true;
      this.updateUserStatus(user);
    })
    setTimeout(() => {
      if(!this.userLoading) this.onReady.next(true)
    }, 1000);
  }


  ////************* API ************////
  ////              API             ////
  ////************* API ************////
  

  get homeResources(): Subject<RecordCard[]>{
    return this.homeResourcesEmitter
  }

  highlightCode(query: any): Promise<any>{
    return this.daoService.highlight('parser', query);
  }

  get defaultEmailSubject(){
    return this.sharedSrv.gldef.emailsubject;
  }

  get defaultEmailBody(){
    return this.sharedSrv.gldef.emailbody;
  }


  // initMinimalPage(){
  //   let ready = new Subject<boolean>();
  //   let user = this.userService.currentUser;
  //   if(user._id === this.userx.id && this.userx.isLogged === this.userService.userlogged){
  //     ready.next(true);
  //   }else{
      
  //   }


  //   return ready
  // }


  saveContactPerson(contact: SolicitudDeContacto){
    this.upsertContact(contact);
  }

  notifyUsers(contact: SolicitudDeContacto){
    let notif = new NotificationToken({
      content: this.notifContent(contact), 
      importance: 3,
      email: contact.email,
      name: contact.name,
      slug: contact.slug,
      description: contact.description,
    });

    this.emitNewNotification(notif);
  }

  setHomeView(isHome){
    this.sharedSrv.homeView(isHome);    
  }

  get route():ActivatedRoute{
    return this._route;
  }

  set route(actualRoute: ActivatedRoute){
    this._route = actualRoute;
  }

  actualRoute(snap: string, mRoute: UrlSegment[]){
    this.hasActiveUrlPath = false;

    this.actualUrl = snap ? snap.split('?')[0] : snap;

    this.actualUrlSegments = mRoute;
    this.navigationUrl = this.fetchNavigationUrl(this.actualUrl, this.actualUrlSegments.toString())
    if(this.navigationUrl) this.hasActiveUrlPath = true;


  }

  navigateToUserCommunity():boolean{
    if(!this.userx.isLogged) return false;
    if(!this.userx.hasCommunity) return false;

    // usuario loggeado
    if(this.hasActiveUrlPath){
      // la url actual es tipo /:community
      // if(this.userCmty.url === this.navigationUrl){
      //   return false;
      // }
      return false;
    }
    return true;
  }

  navigateToUserPublications():boolean{
    if(!this.userx.isLogged) return false;
    if(!this.userx.hasCommunity) return false;


    return true;
  }

  get userUrl (){
    return this.userCmty.url;
  }

  parseText(text: string){

  }

  fetchFooterRecords():Subject<RecordCard[]>{
    let listener = new Subject<RecordCard[]>();

    let query = {
      communityId: this.naviCmty.id,
      publish: true,
      'publish.template': 'footer',
    }

    this.daoService.search<RecordCard>('recordcard', query).subscribe(tokens =>{
      if(tokens){
        listener.next(tokens)

      }else{
        listener.next([]);
      }

    });

    return listener;
  }

  fetchRecordsByQuery(query): Observable<RecordCard[]> {
    return this.daoService.search<RecordCard>('recordcard', query);
  }

  fetchContextRecords(topic): Subject<RecordCard[]>{
    let listener = new Subject<RecordCard[]>();

    let communityFinder = new Subject<CommunityToken>();

    communityFinder.subscribe(commty =>{
      if(commty.isActive){
        this.fetchRecords(topic, listener);
      }
    });

    this.fetchCurrentCommunity(communityFinder);

    return listener;
  }

  fetchPortfolioRecords(topic): Subject<RecordCard[]>{
    let listener = new Subject<RecordCard[]>();


    this.fetchPortfolios(topic, listener);


    return listener;
  }

  fetchTopPostsRecords(topic): Subject<RecordCard[]>{
    let listener = new Subject<RecordCard[]>();


    this.fetchTopPosts(topic, listener);


    return listener;
  }

  fetchPublishingRecords(templ:string, stempl:string): Subject<RecordCard[]>{
    let listener = new Subject<RecordCard[]>();

    this.fetchTokenToPublish(templ, stempl, listener);

    return listener;
  }


  ////              recordcard             ////
  fetchRecordCard(model: RecordCard, modelId: string){
    if(model){
      this.recordCard = model;
      this.initRecordCard();

    }else if(modelId){
      this.daoService.findById<RecordCard>('recordcard', modelId)
        .then((response: RecordCard) => {
          if(response){
            this.recordCard = response;
            this.initRecordCard();
          }
          return response

        })
        .catch(err => {
          console.log(err);
          return err;
      });

    }else{
      this.initNewRecordCard()
    }
  }

  get recordCardListener():Subject<RecordCard>{
    return this.emitRecordCard;
  }

  get communityRoute(){
    return (this.navigationUrl ?  "/" + this.navigationUrl : "/");
  }

  get publicationRoute(){
    return "/" + this.navigationUrl +  "/" + this.actualUrlSegments[0] +  "/" + this.actualUrlSegments[1];
  }

  setPapersTitle(){
    //setTimeout(()=>{this.sharedSrv.emitChange('Portfolio');},300)
    
  }

  setHomeTitle(){
    //setTimeout(()=>{this.sharedSrv.emitChange(this.naviCmty.data.displayAs);},300)    
  }


  ////************* API-END ************////

  


  ////************* RecordCard ************////
  initNewRecordCard(){
    //this.model = recorddModel.initNew('','',null,null);
    this.initRecordCard();
  }


  initRecordCard(){
    if(!this.recordCardId || (this.recordCardId !== this.recordCard._id)){
      this.recordCardId = this.recordCard._id;
      this.milestone = this.recordCard._id;

    }else{
      this.milestone = this.milestone || this.recordCard._id;

    }

    //this.sharedSrv.emitChange(this.recordCard.slug);
    
    //this.loadRelatedPersons(this.recordCard.persons);
    //this.loadRelatedProducts(this.recordCard.products);

    this._milestoneList = GraphUtils.buildMilestonesList(this.recordCard);

    this.emitRecordCard.next(this.recordCard);
  }



  /***************************/
  /******* User *******/
  /***************************/
  /**
  * Crea una nueva persona
  */
  createUserAndPerson(user: User, person: Person): Subject<Person>{
    let person$ = new Subject<Person>();

    this.userService.create(user).then(u => {
      this.daoService.findById<Person>('person', u.personId).then(p => {
        p = this.buildPersonData(p, person);
        this.daoService.update<Person>('person', p._id, p).then(model => {
          person$.next(model);
        })
      })
    });

    return person$
  }

  getUserById(id: string): Promise<User>{
    return this.userService.getUser(id);
  }

  loginUser(user:User): Promise<User>{
    return this.userService.login(user);
  }

  setCurrentUser(user: User){
    this.userService.currentUser = user;
  }

  initLoginUser():Subject<User>{
    return this.userService.initLoginUser();
  }

  buildPersonData(s:Person, t:Person){
    Object.assign(s, t);

    return s;
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


  get activePerson(): Person{
    return this.currentPerson;
  }

  addressLookUp(address: Address): Promise<any>{
    return this.daoService.geocodeForward(address);
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

  updateCurrentPerson(person: Person){
    this.currentPerson = person;
    this.personListener.next(this.currentPerson);
    this.personListener.subscribe(p => {

    })
  }

  setCurrentPersonFromUser(){
    let user = this.userService.currentUser;
    if(!user) return;
    this.fetchPersonByUser(user).subscribe(persons => {
      if(persons && persons.length){
        this.updateCurrentPerson(persons[0]);
      }

    })

  }



  setCurrentPersonFromId(id: string){
    if(!id) return;

    this.fetchPersonById(id).then(p => {
      this.updateCurrentPerson(p);
    });

  }

  fetchPersonById(id: string): Promise<Person>{
    return this.daoService.findById<Person>('person', id);
  }

  fetchPersonByUser(user: User): Observable<Person[]>{
    let query = {
      userId: user._id
    }
    return this.daoService.search<Person>('person', query);
  }



  ////************* create new notification ************////
  private emitNewNotification(data: NotificationToken){
    this.daoService.emitnotification<NotificationToken>('notification', data).then(p => {
      return p;
    });

  }

  public testPersonByDNI(tdoc:string, ndoc:string ): Observable<Person[]>{
    let query = {
      tdoc: tdoc,
      ndoc: ndoc
    }
    return this.daoService.search<Person>('person', query)

  }  
  public testUserByEmail(email ): Observable<User[]>{
    let query = {
      email: email,
    }
    return this.daoService.search<User>('user', query)

  }  


  ////************* Person upsert with contact data  ************////
  private upsertContact(data: SolicitudDeContacto){
    let query = {email: data.email};
    let msj = this.buildNotificationData(data);
    let person = new Person(data.name, data.email, msj);
    person.locacion = data.locacion;

    this.daoService.upsert<Person>('person', query, person).subscribe(p => {
      return p;
    });

  }

  private buildNotificationData(data: SolicitudDeContacto){
    let msj = {
      content: this.notifContent(data),
      fe: Date.now(),
      type: 'webcontact',
      from: 'contact-form'
    }
    return new NotificationMessage(msj);
  }

  private notifContent(data:SolicitudDeContacto){
    return 'Web-contact: '  + data.slug + ' Mensaje: '  + data.description;
  }

  ////************* Recordcards  ************////
  private fetchRecords(topic:string, recordEmitter:Subject<RecordCard[]>){
    let query = {
      communityId: this.naviCmty.id,
      publish: true,
      'publish.tag': topic,
    }

    this.daoService.search<RecordCard>('recordcard', query).subscribe(tokens =>{
      if(tokens){
        recordEmitter.next(tokens)

      }else{
        recordEmitter.next([]);
      }

    });
  }

  ////************* Portfolios  ************////
  private fetchPortfolios(topic:string, recordEmitter:Subject<RecordCard[]>){
    let query = {
      publish: true,
      'publish.tag': topic,
    }

    this.daoService.search<RecordCard>('recordcard', query).subscribe(tokens =>{
      if(tokens){
        recordEmitter.next(tokens)

      }else{
        recordEmitter.next([]);
      }

    });
  }

  ////************* Portfolios  ************////
  private fetchTopPosts(topic:string, recordEmitter:Subject<RecordCard[]>){
    let query = {
      publish: true,
      'publish.template': 'post',
      'publish.destaque': topic,
    }

    this.daoService.search<RecordCard>('recordcard', query).subscribe(tokens =>{
      if(tokens){
        recordEmitter.next(tokens)

      }else{
        recordEmitter.next([]);
      }

    });
  }


  ////************* Recordcars con publish:true  ************////
  private fetchTokenToPublish(templ:string, stempl: string, recordEmitter:Subject<RecordCard[]>){
    let query = {
      publish: true,
    }

    if(templ) query['publish.template'] = templ;
    if(stempl) query['publish.destaque'] = stempl;

    this.daoService.search<RecordCard>('recordcard', query).subscribe(tokens =>{
      if(tokens){
        recordEmitter.next(tokens)

      }else{
        recordEmitter.next([]);
      }

    });
  }



  ////************* Contact person by email  ************////


  ////************* Community ************////
  private fetchCurrentCommunity(commtyListener: Subject<CommunityToken>){

    if(this.navigationUrl){
      this.loadCommunityFromDb(this.navigationUrl, commtyListener);

    }else if(this.naviCmty.isActive){
      commtyListener.next(this.naviCmty);

    }else{
      this.fetchDefaultCommunityFromDB(commtyListener);
    } 

  }

  fetchDefaultCommunityFromDB(commtyListener: Subject<CommunityToken>){
    this.naviCmty.isActive = false;
    this.naviCmty.isLoading = true;
    this.daoService.search<Community>('community', {eclass: 'home'}).subscribe(records => {
      this.naviCmty.isLoading = false;

      if(records && records.length){
        this.setCurrentCommunityData(records[0]);
      }
      commtyListener.next(this.naviCmty);
    });
  }
 
  loadCommunityFromDb(url:string, commtyListener: Subject<CommunityToken>){
    if(url){
      this.naviCmty.isActive = false;
      this.naviCmty.isLoading = true

      this.daoService.search<Community>('community', {urlpath: url}).subscribe(records => {
        this.naviCmty.isLoading = false;

        if(records && records.length){
          this.setCurrentCommunityData(records[0]);
        }

        commtyListener.next(this.naviCmty);

      })
    }
  }

  setCurrentCommunityData(entity: Community){

    this.naviCmty.data = entity;
    this.naviCmty.id = entity._id;
    this.naviCmty.isActive = true;
    this.naviCmty.isLoading = false;
    this.naviCmty.url = entity.urlpath;
    this.naviCmty.userOwned = false;

    if(this.naviCmty.id === this.userCmty.id){
      this.naviCmty.userOwned = true;

    }

    //this.communityEmitter.next(this.naviCmty);
  }

 // ********** USER MANAGEMENT *************

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

    // if(!this.naviCmty.isActive){
    //   // no hay una comunidad corriente activa
    //   Object.assign(this.naviCmty, this.userCmty);  

    // }else{

    //   if(this.naviCmty.id === this.userCmty.id){
    //     this.naviCmty.userOwned = true;

    //   }else{
    //     this.naviCmty.userOwned = false;
    //   }
    // }
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


  ////************* Navigation url-token  ************////
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


  /// ***********  utils Open Dialog ****************

  openModalDialog(config) {
    let dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed()
  }


}


export class  SolicitudDeContacto {
  name: string;
  email: string;
  slug: string;
  locacion: string;
  termsofuse: boolean = false;
  description: string;
  
}

class NotificationToken {
  content: string = "";
  slug: string = "Formulario de contacto enviado"
  fe: number = 0;
  type: string = 'web:contactform'
  from: string = 'webmaster:admin';
  to: Array<string> = ['marketing:admin'];
  topic:string = 'contact form submitted';
  importance: number = 2;
  fe_expir: number = 0;
  emitter_email: string;
  emitter_name: string;
  emitter_slug: string;
  emitter_description: string;

  constructor(data?){
    if(data){
      this.content = data.content || "";
      this.fe = Date.now();
      this.fe_expir = data.fe_expir || Date.now()
      this.importance = data.importance || 2;
      this.emitter_email = data.email;
      this.emitter_name = data.name;
      this.emitter_slug = data.slug;
      this.emitter_description = data.description;
    }
  }
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


class NotificationMessage {
  content: string = "";
  fe: number = 0;
  type: string;
  from: string;
  constructor(data?){
    if(data){
      this.content = data.content || "";
      this.fe = data.fe || 0;
      this.type = data.type || 'notification';
      this.from = data.from || 'sistema';
    }
  }
}
