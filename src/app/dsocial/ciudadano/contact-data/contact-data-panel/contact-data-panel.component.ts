import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  Person,
          personModel,
          UpdateContactEvent,
          UpdateItemListEvent,
          PersonContactData 
        } from '../../../../entities/person/person';

const CORE = 'core';
const TOKEN_TYPE = 'contact';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';


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
    if(event.action === DELETE){
      this.deleteItem(event.token);
    }

  	this.emitEvent(event);
  }

  deleteItem(t:PersonContactData){
    let index = this.items.indexOf(t);

    if(index !== -1){
      this.items.splice(index, 1)
    }
    
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
  
  	if(event.action !== CANCEL){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items
  	});
  	}
  }


}
