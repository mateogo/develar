import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person, FamilyData, UpdateFamilyEvent } from '../../../../entities/person/person';

const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'comercio-members-base',
  templateUrl: './comercio-members-base.component.html',
  styleUrls: ['./comercio-members-base.component.scss']
})
export class ComercioMembersBaseComponent implements OnInit {
	@Input() token: FamilyData;
	@Output() updateToken = new EventEmitter<UpdateFamilyEvent>();

	public showView = true;
	public showEdit = false;
	public openEditor = false;

  constructor() { }

  ngOnInit() {
    if(!this.token.apellido && !this.token.nombre){
      this.editToken();
    }
  }

  manageToken(event: UpdateFamilyEvent){
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event:UpdateFamilyEvent){
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
