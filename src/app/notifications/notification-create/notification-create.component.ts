import { Component, OnInit, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute }            from '@angular/router';

import { Subject ,  Observable ,  BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap }   from 'rxjs/operators';


import { DaoService } from '../../develar-commons/dao.service';
import { UserService } from '../../entities/user/user.service';

import { devutils } from '../../develar-commons/utils';
import { User } from '../../entities/user/user';
import { UserConversation, ConversationContext, MessageToken, Actor, notificationModel } from '../notification.model';

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

  @Input() context:ConversationContext;

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

    this.fetchedEntities = this.searchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(t => t && t.length >2 && !(/[^a-z0-9,ñ\s]+/ig.test(t))),
        switchMap(term => this.notifCtrl.searchByContent(term))
      )

  	this.notifCtrl.messageListener.subscribe(model => {
  		this.initEditorData(model);
  		this.formReset(model);

  	})

    this.notifCtrl.initMessageEdit(this._model);
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
      this.messageActionLabel =  '<strong>'+ entity.fetxt + ' </strong> ' + this.message.content;

      this.conversationId = this.message.conversationId;
      this.conversationEmitter.next(this.conversationId);
      this.showConversation = true;
    }else{
      this.messageActionLabel = 'nuevo mensaje'
      this.showConversation = false;
    }
    
    this.message.content = "";
    this._openEditor = true;

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
  }
  

  // medium editor content Update
	contentUpdateContent(data){
		//console.log('updateContent')
	}

	onSubmit(){
		this.message = this.formSubmit();
		this.actors = this.notifCtrl.buildActorList(this.userList);
		this.notifCtrl.saveMessageToken(this.message, this.actors, this.context);
    this.messageUpdated.next(this.message);

	}

  // ****** SEARCH ******************
  search(term){
    this.searchTerms.next(term)
  }

  selectEntity(token){
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

}
