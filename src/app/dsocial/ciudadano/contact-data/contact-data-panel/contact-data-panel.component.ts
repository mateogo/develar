import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  Person,
          personModel,
          UpdateContactEvent,
          UpdateItemListEvent,
          PersonContactData 
        } from '../../../../entities/person/person';

const UPDATE = 'update';
const CORE = 'core';
const TOKEN_TYPE = 'contact';


@Component({
  selector: 'contact-panel',
  templateUrl: './contact-data-panel.component.html',
  styleUrls: ['./contact-data-panel.component.scss']
})
export class ContactDataPanelComponent implements OnInit {
	@Input() items: Array<PersonContactData>;
	@Output() updateItems = new EventEmitter<UpdateItemListEvent>();

  public title = 'Datos de Contacto';
	public showList = false;
  public showAddresses = false;
  public openEditor = true;

  constructor() { }

  ngOnInit() {
  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updateItem(event: UpdateContactEvent){
  	this.emitEvent(event);
  }

  addItem(){
    let item = new PersonContactData();
    if(this.items){
      this.items.push(item);

    }else{
      this.items = [item]

    }

    this.showList = true;

  }

  emitEvent(event:UpdateContactEvent){
  
  	if(event.action === UPDATE){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items
  	});
  	}
  }


}
