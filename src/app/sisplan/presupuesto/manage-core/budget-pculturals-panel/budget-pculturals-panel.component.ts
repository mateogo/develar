import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SisplanController } from '../../../sisplan.controller';

import { SisplanService, BudgetService, UpdateListEvent, UpdateEvent } from '../../../sisplan.service';

import { Budget, BudgetItem, PculturalItem, BudgetHelper   } from '../../presupuesto.model';



const TOKEN_TYPE = 'budget_pculturals';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';
const CLONE =  'clone';


@Component({
  selector: 'budget-pculturals-panel',
  templateUrl: './budget-pculturals-panel.component.html',
  styleUrls: ['./budget-pculturals-panel.component.scss']
})
export class BudgetPculturalsPanelComponent implements OnInit {
	@Input() items: Array<PculturalItem>;
	@Output() updateItems = new EventEmitter<UpdateListEvent>();

  public title = 'Eventos culturales presupuestados';
	public showList = false;
  public showAddresses = false;
  public openEditor = true;

  constructor() { }

  ngOnInit() {
  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updatePculturalItem(event: UpdateEvent){
    if(event.action === DELETE){
      this.deleteItem(event.payload as PculturalItem);
    }

    if(event.action === CLONE){
      this.cloneItem(event.payload as PculturalItem);
    }

  	this.emitEvent(event);
  }

  private cloneItem(t: PculturalItem){
    let cloneItem = { ...t };
    
    delete cloneItem._id;

    if(this.items){
      this.items.push(cloneItem);

    }else{
      this.items = [cloneItem]

    }

    this.showList = true;

  }


  private deleteItem(t:PculturalItem){
    let index = this.items.indexOf(t);

    if(index !== -1){
      this.items.splice(index, 1)
    }
    
  }

  addItem(){
    let item = new PculturalItem();
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
