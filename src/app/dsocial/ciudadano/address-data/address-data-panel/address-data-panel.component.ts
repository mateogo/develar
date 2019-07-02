import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  Person,
          personModel,
          UpdateAddressEvent,
          UpdateItemListEvent,
          Address 
        } from '../../../../entities/person/person';

const UPDATE = 'update';
const TOKEN_TYPE = 'address';

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
  	this.emitEvent(event);
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
  
  	if(event.action === UPDATE){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items
  	});
  	}
  }

}

