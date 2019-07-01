import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { 	MatDialog, 
					MatDialogRef } from '@angular/material';

import { BehaviorSubject,  Observable, merge }       from 'rxjs';
import { map }   from 'rxjs/operators';

import { GenericDialogComponent } from '../../develar-commons/generic-dialog/generic-dialog.component';

import { NotificationController } from '../notification.controller';
import { ConversationTable, ConversationContext }  from '../notification.model';

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

  public toggleImportant = false;
  public toggleSent = false;
  public toggleInbox = false;


  //public selection = new SelectionModel<ConversationTable>(true, []);

  constructor(
  		private notifCtrl: NotificationController,
			public dialogService: MatDialog
    ){
  }

  ngOnInit(){
    this.dataRecordsSource = this.notifCtrl.tableDataSource;

    this.dataRecordsSource.subscribe(items =>{
    	console.log('NOTIFICATION data Source: [%s]', items && items.length);
    	this.initListData(items);

    })


  }

  verDetalle(token: ConversationTable){
  	this.openView = !this.openView;
  	if(this.openView){
	  	console.log('OpenDetali Dialog')
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
    console.log('********** ngOnChanges;')
  }

  triggerAction(action: string){
    let restrict = {};
    restrict[action] = true;
    this.updateTableList(restrict);
    //this.actionTriggered.next(action);
    //this.selection.clear();
  }

  updateTableList(restrict?){
    console.log('fetch Userconversations!!!!')
    this.notifCtrl.fetchUserConversations(this.context, restrict);

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

  justInbox($event){
    console.log('+++++justInbox +++++++')
    this.toggleInbox = !this.toggleInbox;
    this.triggerAction(this.toggleInbox ? 'inbox': 'clean');
  }

  justSent($event){
    console.log('+++++justSent +++++++')
    this.toggleSent = !this.toggleSent;
    this.triggerAction(this.toggleSent ? 'sent': 'clean');
  }

  justImportant($event){
    console.log('+++++justImportant +++++++')
    this.toggleImportant = !this.toggleImportant;
    this.triggerAction(this.toggleImportant ? 'important': 'clean');
  }

}


