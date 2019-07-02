import { Component, OnInit, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Subject ,  Observable ,  BehaviorSubject } from 'rxjs';


import { DaoService } from '../../develar-commons/dao.service';
import { UserService } from '../../entities/user/user.service';

import { devutils } from '../../develar-commons/utils';
import { User } from '../../entities/user/user';
import { UserConversation, ConversationContext, MessageToken, Actor, notificationModel } from '../notification.model';

import { NotificationController } from '../notification.controller';

@Component({
  selector: 'notification-edit',
  templateUrl: './notification-edit.component.html',
  styleUrls: ['./notification-edit.component.scss']
})
export class NotificationEditComponent implements OnInit {
  @Input()
  set messageToken(entity: MessageToken){
    this._messageToken = entity;
  }
  get messageToken(){
    return this._messageToken;
  }

  @Input()
    get openeditor(){ return this._openEditor;}
    set openeditor(val){ this._openEditor = val;}

  @Input() context:ConversationContext;

  @Output() messageUpdated = new EventEmitter<MessageToken>();

  private _messageToken: MessageToken
  private actors: Array<Actor> = []

	private userList: Array<User> = [];
  public userEmitter = new BehaviorSubject<string[]>([]);

	public form: FormGroup;

  private message: MessageToken;
  private messageId;
  public messageContent = "";
  private messageEditList: UserConversation[];

  public _openEditor: boolean = false;
  public messageActionLabel = "nuevo mensaje";

  private showConversation = false;
  private conversationId: string = "";
  private conversationEmitter = new BehaviorSubject<string>("");

  public meContent = "";
  public mePlaceholder = "Ingrese su mensaje...";

  public importanceOpttList = notificationModel.importanceOptions;



  @HostListener('mouseleave') onMouseLeave() {
      this.promoteData();
  }

  @HostListener('blur') onBlur() {
      this.promoteData();
  }


  constructor(
  	private fb: FormBuilder,
    public notifCtrl: NotificationController
  	) { 

    this.form = this.fb.group({
      content:    [null,  Validators.compose([Validators.required])],
      importance: [null],
    });

  }

  ngOnInit() {

  	this.notifCtrl.messageListener.subscribe(model => {
  		this.initEditorData(model);
  		this.formReset(model);

  	})

    this.notifCtrl.initMessageEdit(this.messageToken);
  }

  formReset(model:MessageToken){
  	this.form.reset({
  		content: model.content,
      importance: (model.importance || 1)
  	})
  }

  formSubmit(){
		let fvalue = this.form.value;
		this.message.content = fvalue.content;
    this.message.importance = fvalue.importance
		return this.message;
  }

  editCancel(){
    this.notifCtrl.cancelMessageEditing()
    this._openEditor = false;
    this.messageUpdated.next(this.message);

  }

  initEditorData(entity: MessageToken){
  	this.message = entity;
  	this.messageId = entity._id;
    this.meContent = "";

    if(!this.message.isNewConversation){
      this.messageActionLabel =  '<strong>'+ 'Emitir nuevo mensaje/ notificación: ' + ' </strong> ' + this.message.content;

      this.conversationId = this.message.conversationId;
      this.conversationEmitter.next(this.conversationId);
      this.showConversation = true;
    }else{
      this.messageActionLabel = 'nuevo mensaje'
      this.showConversation = false;
    }
    
    this.message.content = "";
    this.message.importance = 1;
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

  changeSelectionValue(type, value){

  }

	onSubmit(){
		this.message = this.formSubmit();
		this.actors = this.notifCtrl.buildActorList(this.userList);
		this.notifCtrl.saveMessageToken(this.message, this.actors, this.context);

    setTimeout(()=>{
      this.messageUpdated.next(this.message);
    },1000);
    
	}


  // ****** PROMOTE ******************
  promoteData(){
    this.message = this.formSubmit();
  }

}
