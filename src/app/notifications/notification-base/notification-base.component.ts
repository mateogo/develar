import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { 	MatDialog, 
					MatDialogRef, 
					MatSelectChange,
					MatCheckboxChange } from '@angular/material';

import { BehaviorSubject,  Observable, merge }       from 'rxjs';
import { map }   from 'rxjs/operators';

import { GenericDialogComponent } from '../../develar-commons/generic-dialog/generic-dialog.component';

import { NotificationController } from '../notification.controller';

import { ConversationTable, MessageToken }  from '../notification.model';


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

  }

  initTokenData(){
  	//TODO
    this.conversationId = this.conversationToken.conversationId;
    this.context = this.conversationToken.context;


  }

  verDetalle(){
  	this.openView = !this.openView;
  	if(this.openView){
	  	console.log('OpenDetali Dialog')

	    this.conversationEmitter.next(this.conversationId);
      this.notifCtrl.initUserConversation(null, this.conversationToken._id);

	    this.showConversation = true;
      this.showEditor = true;

  	}else{
	    this.showConversation = false;
      this.showEditor = false;

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
    console.log('messageUpdate EMITTED +*******');
    this.triggerAction('update');

  }

  ngOnChanges(){
    console.log('********** ngOnChanges;')
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

