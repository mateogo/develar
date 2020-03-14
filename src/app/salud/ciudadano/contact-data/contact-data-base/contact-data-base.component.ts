import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person, PersonContactData, UpdateContactEvent } from '../../../../entities/person/person';

const CORE = 'core';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

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

    if(!this.token.data && !this.token.type){
      this.editToken();
    }

  }

  updateContact(event: UpdateContactEvent){
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event:UpdateContactEvent){
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
