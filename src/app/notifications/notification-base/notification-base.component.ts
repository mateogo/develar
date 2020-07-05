import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

import { BehaviorSubject,  Observable, merge }       from 'rxjs';
import { map }   from 'rxjs/operators';

import { GenericDialogComponent } from '../../develar-commons/generic-dialog/generic-dialog.component';

import { NotificationController } from '../notification.controller';

import { ConversationTable, MessageToken }  from '../notification.model';

const importanceMarker = "*****";

@Component({
  selector: 'notification-base',
  templateUrl: './notification-base.component.html',
  styleUrls: ['./notification-base.component.scss']
})
export class NotificationBaseComponent implements OnInit {
	@Input() conversationToken: ConversationTable;
  @Output() actionTriggered: EventEmitter<string> = new EventEmitter();


  private slugFld = 0;

  public openView = false;
  public showConversation = false;
  public openEditor = false;
  public showEditor = false;
  public _openEditor = true;


  public actionList: Array<any> = [];
  public conversationId: string;
  public context;
  public importanceLabel = "***";

  private conversationEmitter = new BehaviorSubject<string>("");



    // [context]="context"
    // [openeditor]='_openEditor'
    // (messageUpdated)='messageUpdated($event)'></notification-create>


  //public selection = new SelectionModel<ConversationTable>(true, []);

  constructor(
  		private notifCtrl: NotificationController,
			public dialogService: MatDialog
    ){
  }

  ngOnInit(){
  	if(this.conversationToken){
  		this.initTokenData();
  	}


    this.notifCtrl.messageListener.subscribe(model => {

    })



  }

  initTokenData(){
  	//TODO
    let index = this.conversationToken.importance;

    this.conversationId = this.conversationToken.conversationId;
    this.context = this.conversationToken.context;
    this.importanceLabel = importanceMarker.substr(0, this.conversationToken.importance);


  }

  verDetalle(){
  	this.openView = !this.openView;
  	if(this.openView){

	    this.conversationEmitter.next(this.conversationId);
      this.notifCtrl.initUserConversation(null, this.conversationToken._id);

      this.updateUserconversationHasRead(this.conversationToken);

	    this.showConversation = true;
      this.showEditor = true;

      // this.notifCtrl.saveMessageToken(this.message, this.actors, this.context);


  	}else{
	    this.showConversation = false;
      this.showEditor = false;

  	}

  }

  updateUserconversationHasRead(convToken: ConversationTable){
    if(!convToken.hasRead){
      convToken.hasRead = true;
      this.notifCtrl.updateUserConversationById(convToken._id, {hasRead: true});      
    }
  }


  displayMessage(){
  	if(this.conversationToken.hasRead){
  		return this.conversationToken.slug

  	}else{
  		return "<strong>" + this.conversationToken.slug + "</strong>"

  	}

  }

  messageUpdated(message: MessageToken){
    this.triggerAction('update');

  }

  ngOnChanges(){
    //console.log('********** ngOnChanges;')
  }

  triggerAction(action: string){
    this.showConversation = false;
    this.showEditor = false;
    this.openView = false;

    this.actionTriggered.next(action);
    //this.selection.clear();
  }

  openDialog(config) {
    let dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed()
  }


  getLabel(item:string, arr:Array<any>, prefix: string):string{
    let label =  arr.find(x => x.val === item).label
    if(item === 'no_definido') label = "";
    return prefix ? prefix + label : label;
  }

}


//http://develar-local.co:4200/dsocial/gestion/seguimiento/59701fab9c481d0391eb39b9

