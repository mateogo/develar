import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person, BusinessMembersData, UpdateBusinessMemberEvent } from '../../../../entities/person/person';

const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'comercio-members-base',
  templateUrl: './comercio-members-base.component.html',
  styleUrls: ['./comercio-members-base.component.scss']
})
export class ComercioMembersBaseComponent implements OnInit {
	@Input() token: BusinessMembersData;
	@Output() updateToken = new EventEmitter<UpdateBusinessMemberEvent>();

	public showView = true;
	public showEdit = false;
	public openEditor = false;

  constructor() { }

  ngOnInit() {
    if(!this.token.apellido && !this.token.nombre){
      this.editToken();
    }
  }

  manageToken(event: UpdateBusinessMemberEvent){
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event:UpdateBusinessMemberEvent){
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
