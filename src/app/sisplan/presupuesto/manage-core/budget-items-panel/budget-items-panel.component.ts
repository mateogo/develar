import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SisplanController } from '../../../sisplan.controller';

import { SisplanService, BudgetService, UpdateListEvent, UpdateEvent } from '../../../sisplan.service';

import { Budget, BudgetItem, BudgetHelper   } from '../../presupuesto.model';



const TOKEN_TYPE = 'budget_items';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';



@Component({
  selector: 'budget-items-panel',
  templateUrl: './budget-items-panel.component.html',
  styleUrls: ['./budget-items-panel.component.scss']
})
export class BudgetItemsPanelComponent implements OnInit {
	@Input() items: Array<BudgetItem>;
	@Output() updateItems = new EventEmitter<UpdateListEvent>();

  public title = 'Detalle de Presupuesto';
	public showList = false;
  public showAddresses = false;
  public openEditor = true;

  constructor() { }

  ngOnInit() {
  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updateBudgetItem(event: UpdateEvent){
    if(event.action === DELETE){
      this.deleteItem(event.payload as BudgetItem);
    }

  	this.emitEvent(event);
  }

  deleteItem(t:BudgetItem){
    let index = this.items.indexOf(t);

    if(index !== -1){
      this.items.splice(index, 1)
    }
    
  }

  addItem(){
    let item = new BudgetItem();
    if(this.items){
      this.items.push(item);

    }else{
      this.items = [item]

    }

    this.showList = true;

  }

  emitEvent(event:UpdateEvent){
  
  	if(event.action !== CANCEL){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items
  	});
  	}
  }


}
