import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { BehaviorSubject,  Observable, merge }       from 'rxjs';
import { map }   from 'rxjs/operators';

import { GenericDialogComponent } from '../../develar-commons/generic-dialog/generic-dialog.component';

import { NotificationController } from '../notification.controller';
import { ConversationTable, ConversationContext, MessageToken }  from '../notification.model';

/**
 * @displayedColumns
 *  _id: string;
 *  predicate: string;
 *  displayAs: string;
 *  slug: string;
 *  entityId: string;
 *  qt: number;
 *  ume: string;
 *  pu: number;
 *  moneda: string;
 *  total: number;
 */

const removeRelation = {
  width:  '330px',
  height: '700px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    itemplate: '',
    caption:'Seleccione columnas...',
    title: 'Confirme la acción',
    body: 'Se dará de baja la relación seleccionada en esta ficha',
    accept:{
      action: 'accept',
      label: 'Aceptar'
    },
    cancel:{
      action: 'cancel',
      label: 'Cancelar'
    }
  }
};


@Component({
  selector: 'notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  @Input() context: ConversationContext;

  @Output() actionTriggered: EventEmitter<string> = new EventEmitter();

  private dataRecordsSource: BehaviorSubject<ConversationTable[]>;
  public selectedAction: string = 'no_definido';

  private slugFld = 0;

  public openView = false;
  public showConversation = false;

  public actionList: Array<any> = [];
  public conversationId: string;
  public conversationList: ConversationTable[] = [];
  private conversationEmitter = new BehaviorSubject<string>("");

  public toggleImportant = true;
  public toggleSent = true;
  public toggleInbox = true;
  public importantIndex = 0;
  public restrict = {};

  public showEdit = false;
  private showEditToggle = false;

  public newMessage: MessageToken;


  //public selection = new SelectionModel<ConversationTable>(true, []);

  constructor(
  		private notifCtrl: NotificationController,
			public dialogService: MatDialog
    ){
  }

  ngOnInit(){
    this.dataRecordsSource = this.notifCtrl.tableDataSource;

    this.dataRecordsSource.subscribe(items =>{
    	this.initListData(items);

    })


  }

  verDetalle(token: ConversationTable){
  	this.openView = !this.openView;
  	if(this.openView){
	  	this.conversationId = token.conversationId;
	    this.conversationEmitter.next(this.conversationId);
	    this.showConversation = true;
  	}else{
	    this.showConversation = false;

  	}

  }

  initListData(items: ConversationTable[]){

  	this.conversationList = items;
  }

  ngOnChanges(){
    //console.log('********** ngOnChanges;')
  }

  triggerAction(action: string){
    this.restrict = {};

    if(action === 'important'){
      this.restrict[action] = this.importantIndex;

    }else{
      this.restrict[action] = true;
    }
    this.updateTableList(this.restrict);

    //this.actionTriggered.next(action);
    //this.selection.clear();
  }

  baseAction($event){
    this.updateTableList(this.restrict);
  }

  createAction($event){
    this.updateTableList(this.restrict);
  }



  updateTableList(restrict?){
    this.notifCtrl.fetchUserConversations(this.context, restrict);

  }

  openDialog(config) {
    let dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed()
  }

  addNewConversation($event){
    this.showEditToggle = !this.showEditToggle;

    if(this.showEditToggle){
      this.newMessage = new MessageToken();
      this.showEdit = true;

    }else{
      this.showEdit = false;

    }
  }


  getLabel(item:string, arr:Array<any>, prefix: string):string{
    let label =  arr.find(x => x.val === item).label
    if(item === 'no_definido') label = "";
    return prefix ? prefix + label : label;
  }

  justInbox($event){
    this.triggerAction(this.toggleInbox ? 'inbox': 'clean');
  }

  justSent($event){
    this.triggerAction(this.toggleSent ? 'sent': 'clean');
  }

  justImportant($event){
    this.importantIndex = this.importantIndex > 2 ? 1 : this.importantIndex + 1;
    this.triggerAction(this.toggleImportant ? 'important': 'clean');
  }

}


