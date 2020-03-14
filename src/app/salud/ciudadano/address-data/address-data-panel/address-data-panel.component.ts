import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  Person,
          personModel,
          UpdateAddressEvent,
          UpdateItemListEvent,
          Address 
        } from '../../../../entities/person/person';

const TOKEN_TYPE = 'address';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'address-panel',
  templateUrl: './address-data-panel.component.html',
  styleUrls: ['./address-data-panel.component.scss']
})
export class AddressDataPanelComponent implements OnInit {
	@Input() items: Array<Address>;
	@Output() updateItems = new EventEmitter<UpdateItemListEvent>();

  public title = 'Direcciones postales';
	public showList = false;
  public openEditor = true;

  constructor() { }

  ngOnInit() {
  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updateItem(event: UpdateAddressEvent){
    
    if(event.action === DELETE){
      this.deleteItem(event.token);
    }

  	this.emitEvent(event);
  }

  deleteItem(t:Address){
    let index = this.items.indexOf(t);

    if(index !== -1){
      this.items.splice(index, 1)
    }
    
  }

  addItem(){
    let item = new Address();
    if(this.items){
      this.items.push(item);

    }else{
      this.items = [item]

    }
    this.showList = true;

  }

  emitEvent(event:UpdateAddressEvent){
  
  	if(event.action !== CANCEL){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items
  	});
  	}
  }

}

