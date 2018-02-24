import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { MatDialog, MatDialogRef, MatSelectChange } from '@angular/material';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject }         from 'rxjs/Subject';
import { Observable }      from 'rxjs/Observable';

import { SharedService } from '../develar-commons/shared-service';
import { DaoService } from '../develar-commons/dao.service';
import { UserService } from '../entities/user/user.service';
import { GenericDialogComponent } from '../develar-commons/generic-dialog/generic-dialog.component';

import { Person } from '../entities/person/person';
import { User } from '../entities/user/user';
import { Community } from '../develar-commons/community/community.model';

import { MessageToken } from '../notifications/notification.model';

import { RecordCard } from './recordcard.model';

import { SelectData, GraphUtils } from './recordcard-helper';


@Injectable()
export class SiteMinimalController {

  private readonly recordtype = 'notification'

  //Site state properties
  private user: User;
  private userLoggedIn = false;

  private hasActiveCommunity = false;
  private isLoading = false;
  private communityId = "";
  private communityUrl = "";
  private communityRecord: Community;
  private communityChange: BehaviorSubject<Community> = new BehaviorSubject(new Community());

  private hasActiveUrlPath = false;
  private actualUrl = "";
  private actualUrlSegments: UrlSegment[] = [];
  private navigationUrl = "";

  private emitRecordCard = new Subject<RecordCard>();
  private recordCard: RecordCard;
  private recordCardId: string;
  private milestone: string;
  private _milestoneList: Array<SelectData>;


  private userListener: BehaviorSubject<User>;
  


  //table browse


	constructor(
		private daoService: DaoService,
    private dialogService: MatDialog,
    private sharedSrv:   SharedService,
    private snackBar:    MatSnackBar,
		private userService: UserService,
		) {

    this.userListener = this.userService.userEmitter;
    this.userListener.subscribe(user =>{
      this.initUserStatus(user);
    })
  }


  ////************* API ************////
  ////              API             ////
  ////************* API ************////
  fetchHomeResources(): Subject<RecordCard[]>{
    let emitter =new Subject<RecordCard[]>();
    this.fetchCurrentCommunity()

    this.communityChange.subscribe(community => {
      if(this.hasActiveCommunity){
        this.fetchRecords('home').subscribe(tokens => {
          if(tokens && tokens.length){
            console.log('fetchHomeRecords cb  =====>[%s]',tokens.length);
            emitter.next(tokens)
          }else{
            emitter.next([]);
          }
        })

      }
    })

    return emitter;
  }

  fetchRenderResources(topic: string): Subject<RecordCard[]>{
    let emitter =new Subject<RecordCard[]>();
    this.fetchCurrentCommunity()

    this.communityChange.subscribe(community => {
      if(this.hasActiveCommunity){
        this.fetchRecords(topic).subscribe(tokens => {
          if(tokens && tokens.length){
            console.log('fetchRenderRecords cb  =====>[%s]',tokens.length);
            emitter.next(tokens)
          }else{
            emitter.next([]);
          }
        })

      }
    })

    return emitter;
  }



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


  ////************* API-END ************////

  


  ////************* RecordCard ************////
  initNewRecordCard(){
    console.log('initNewRecordard')
    //this.model = recordcardModel.initNew('','',null,null);
    this.initRecordCard();
  }

  initRecordCard(){
    if(!this.recordCardId || (this.recordCardId !== this.recordCard._id)){
      this.recordCardId = this.recordCard._id;
      this.milestone = this.recordCard._id;

    }else{
      this.milestone = this.milestone || this.recordCard._id;

    }

    this.sharedSrv.emitChange(this.recordCard.slug);
    
    //this.loadRelatedPersons(this.recordCard.persons);
    //this.loadRelatedProducts(this.recordCard.products);

    this._milestoneList = GraphUtils.buildMilestonesList(this.recordCard);

    this.emitRecordCard.next(this.recordCard);
  }


  ////************* create new notification ************////
  private emitNewNotification(data: NotificationToken){
    this.daoService.emitnotification<NotificationToken>('notification', data).then(p => {
      return p;
    });

  }


  ////************* Person upsert with contact data  ************////
  private upsertContact(data: SolicitudDeContacto){
    let query = {email: data.email};
    let msj = this.buildNotificationData(data);
    let person = new Person(data.name, data.email,msj) 

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
  private fetchRecords(topic){
    let query = {
      communityId: this.communityId,
      publish: true,
      'publish.tag': topic,

    }
    return this.daoService.search<RecordCard>('recordcard', query);
  }

  ////************* Contact person by email  ************////


  ////************* Community ************////
  private fetchCurrentCommunity(){
    if(this.hasActiveCommunity){
      this.communityChange.next(this.communityRecord)
    }
    if(this.userLoggedIn){
      this.loadCommunityFromDb(this.user.communityId, null)

    }else{
      this.loadCommunityFromDb(null, this.navigationUrl);
    }

  }
 
  loadCommunityFromDb(id:string, url:string){
    this.hasActiveCommunity = false;
    if(this.isLoading) return;
    if(id){
      this.isLoading = true;
      return this.daoService.findById<Community>('community', id).then(entity => {
        this.isLoading = false;
        if(entity){
         this.setCurrentCommunityData(entity);
        }
      })

    }else if(url){      
      this.isLoading = true;
      return this.daoService.search<Community>('community', {urlpath: url}).subscribe(records => {
        this.isLoading = false;
        if(records && records.length){
          this.setCurrentCommunityData(records[0]);
        }
      })
    }
  }

  setCurrentCommunityData(entity: Community){

    console.log('setCurrentCommunityData:[%s] [%s]', entity.urlpath, entity.displayAs);
    this.communityId = entity._id;
    this.communityUrl = entity.urlpath;
    this.communityRecord = entity;
    this.hasActiveCommunity = true;
    this.communityChange.next(this.communityRecord);
    this.isLoading = false;

  }

 // INIT USER STATUS
  initUserStatus(user:User){
    this.user = user;
    this.userLoggedIn = this.userService.userlogged;
    if((this.communityId === this.user.communityId) && this.hasActiveCommunity) return;
    else {
      this.hasActiveCommunity = false;
      this.fetchCurrentCommunity()
    }

  }


  ////************* Navigation url-token  ************////
  private fetchNavigationUrl(snap, urlmodule){
    let urlpath: string = "";

    if(urlmodule){
      urlpath = snap.substr(1, (snap.length - urlmodule.length -2));
      console.log('url path [%s] [%s]', urlpath ,(snap.length - urlmodule.length -1));
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
