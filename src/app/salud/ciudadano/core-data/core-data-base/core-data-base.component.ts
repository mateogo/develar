import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person, UpdatePersonEvent } from '../../../../entities/person/person';

const UPDATE = 'update';
const CORE = 'core';

@Component({
  selector: 'core-base',
  templateUrl: './core-data-base.component.html',
  styleUrls: ['./core-data-base.component.scss']
})
export class CoreDataBaseComponent implements OnInit {
	@Input() person: Person;
	@Output() updatePerson = new EventEmitter<UpdatePersonEvent>();

	public showView = true;
	public showEdit = false;
	public openEditor = false;

	public token = {
		description: 'token description'

	};

  constructor() { }

  ngOnInit() {
  }

  updateCore(event: UpdatePersonEvent){
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event:UpdatePersonEvent){
  	if(event.action === UPDATE){
  		this.updatePerson.next(event);
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
