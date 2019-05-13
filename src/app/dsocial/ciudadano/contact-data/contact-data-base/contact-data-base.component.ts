import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person, PersonContactData, UpdateContactEvent } from '../../../../entities/person/person';

const UPDATE = 'update';
const CORE = 'core';

@Component({
  selector: 'contact-base',
  templateUrl: './contact-data-base.component.html',
  styleUrls: ['./contact-data-base.component.scss']
})
export class ContactDataBaseComponent implements OnInit {
	@Input() token: PersonContactData;
	@Output() updateToken = new EventEmitter<UpdateContactEvent>();

	public showView = true;
	public showEdit = false;
	public openEditor = false;

  constructor() { }

  ngOnInit() {
  }

  updateContact(event: UpdateContactEvent){
  	console.log('update Contact-Base: [%s]', event.action);
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event:UpdateContactEvent){
  	if(event.action === UPDATE){
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
