import { Component, OnInit, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute }            from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


import { DaoService } from '../../develar-commons/dao.service';
import { UserService } from '../../entities/user/user.service';

import { devutils } from '../../develar-commons/utils';
import { User } from '../../entities/user/user';
import { UserConversation, MessageToken, Actor, notificationModel } from '../notification.model';

import { NotificationController } from '../notification.controller';



@Component({
  selector: 'notification-create',
  templateUrl: './notification-create.component.html',
  styleUrls: ['./notification-create.component.scss']
})
export class NotificationCreateComponent implements OnInit {
  @Input()
  set model(entity: MessageToken){
    this._model = entity;
  }
  get model(){
    return this._model;
  }

  @Input()
    get openeditor(){ return this._openEditor;}
    set openeditor(val){ this._openEditor = val;}

  @Output() messageUpdated = new EventEmitter<MessageToken>();

  private _model: MessageToken
  private actors: Array<Actor> = []

	private userList: Array<User> = [];
  private userEmitter = new BehaviorSubject<string[]>([]);

	public form: FormGroup;

  private message: MessageToken;
  private messageId;
  public messageContent = "";
  private messageEditList: UserConversation[];

  public _openEditor: boolean = false;
  private messageActionLabel = "nuevo mensaje";

  private searchTerms = new Subject<string>();
  public fetchedEntities: Observable<UserConversation[]>;

  private showConversation = false;
  private conversationId: string = "";
  private conversationEmitter = new BehaviorSubject<string>("");

  public meContent = "";
  public mePlaceholder = "Ingrese su mensaje...";



  @HostListener('mouseleave') onMouseLeave() {
      this.promoteData();
  }

  @HostListener('blur') onBlur() {
      this.promoteData();
  }


  constructor(
  	private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public notifCtrl: NotificationController
  	) { 

    this.form = this.fb.group({
      content:    [null,  Validators.compose([Validators.required])],
    });

  }

  ngOnInit() {

    this.fetchedEntities = this.searchTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(term => term
        ? this.notifCtrl.searchByContent(term)
        : Observable.of<UserConversation[]>([]))
      .catch(error => {
        return Observable.of<UserConversation[]>([]);
      });

  	this.notifCtrl.messageListener.subscribe(model => {
  		this.initEditorData(model);
  		this.formReset(model);

  	})

    this.notifCtrl.initMessageEdit(this._model, this.messageId);
  }

  formReset(model:MessageToken){
  	this.form.reset({
  		content: model.content,
  	})
  }

  formSubmit(){
		let fvalue = this.form.value;
		this.message.content = fvalue.content;
		return this.message;
  }

  editCancel(){
    this.notifCtrl.cancelMessageEditing()
    this._openEditor = false;

  }

  initEditorData(entity: MessageToken){
  	this.message = entity;
  	this.messageId = entity._id;
    this.meContent = "";

    if(!this.message.isNewConversation){
      this.messageActionLabel =  'El '+ entity.fetxt + ' escribió: ' + this.message.content;
      console.log('showConversation: [%s]', this.message.conversationId);
      this.conversationId = this.message.conversationId;
      this.conversationEmitter.next(this.conversationId);
      this.showConversation = true;
    }else{
      this.messageActionLabel = 'nuevo mensaje'
      this.showConversation = false;
    }
    
    this.message.content = "";
    this._openEditor = true;

    console.log('initEditorData actors?[%s]', (this.message && this.message.actors && this.message.actors.length))
    if(this.message && this.message.actors && this.message.actors.length){
      this.promoteUsers(this.message.actors);
    }
  }

  promoteUsers(actors: Actor[]){
    let users:Array<string> = actors.map(actor => actor.userId);
    let currentUser = this.notifCtrl.currentuser;
    users = users.filter(userid => userid !== currentUser._id);
    this.userEmitter.next(users);

  }

  updateUserList(users: Array<User>){
  	this.userList = users;
  	console.log('update Userlist [%s]', this.userList.length)
  }
  

  // medium editor content Update
	contentUpdateContent(data){
		console.log('updateContent')
	}

	onSubmit(){
		console.log('onSubmit');
		this.message = this.formSubmit();
		this.actors = this.notifCtrl.buildActorList(this.userList);
		this.notifCtrl.saveMessageToken(this.message, this.actors);
    this.messageUpdated.next(this.message);

	}

  // ****** SEARCH ******************
  search(term){
    this.searchTerms.next(term)
  }

  selectEntity(token){
    console.log('selectEntity: Token: [%s]', token.userId)
    if(token){
      this.notifCtrl.initUserConversation(token, token._id);
    }
  }

  // ****** PROMOTE ******************
  promoteData(){
    this.message = this.formSubmit();
  }

  editToken(){
    if(this._openEditor){
      this.promoteData();
    }
    this._openEditor = !this._openEditor;
  }

  mouseOverPrueba(){
    console.log('mouseover******************')
  }

}
