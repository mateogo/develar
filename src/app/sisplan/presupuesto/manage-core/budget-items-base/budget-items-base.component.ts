import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SisplanController } from '../../../sisplan.controller';

import { SisplanService, BudgetService, UpdateListEvent, UpdateEvent } from '../../../sisplan.service';

import { Budget, BudgetItem, BudgetHelper   } from '../../presupuesto.model';



const TOKEN_TYPE = 'budget_items';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';


@Component({
  selector: 'budget-items-base',
  templateUrl: './budget-items-base.component.html',
  styleUrls: ['./budget-items-base.component.scss']
})
export class BudgetItemsBaseComponent implements OnInit {
	@Input() token: BudgetItem;
	@Output() updateToken = new EventEmitter<UpdateEvent>();

	public showView = true;
	public showEdit = false;
	public openEditor = false;

  constructor() { }

  ngOnInit() {

    if(!this.token._id){
      this.editToken();
    }

  }

  updateBudgetItem(event: UpdateEvent){
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event:UpdateEvent){
  	if(event.action !== CANCEL){
  		this.updateToken.next(event);
  	}
  }

	editToken(){
		this.openEditor = !this.openEditor;
		this.showView = !this.showView;
		this.showEdit = !this.showEdit;
	}

	removeToken(){
	}

}

