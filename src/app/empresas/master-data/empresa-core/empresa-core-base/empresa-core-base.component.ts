import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person, UpdatePersonEvent } from '../../../../entities/person/person';

const UPDATE = 'update';
const NAVIGATE = 'navigate';
const CORE = 'core';


@Component({
  selector: 'empresa-core-base',
  templateUrl: './empresa-core-base.component.html',
  styleUrls: ['./empresa-core-base.component.scss']
})
export class EmpresaCoreBaseComponent implements OnInit {
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
  		this.updatePerson.next(event);
  }


	editToken(){
		this.openEditor = !this.openEditor;
		this.showView = !this.showView;
		this.showEdit = !this.showEdit;
	}

  navigateTo(){
    // this.openEditor = !this.openEditor;
    // this.showView = !this.showView;
    // this.showEdit = !this.showEdit;
    this.emitEvent({
      action: NAVIGATE,
      token: 'core',
      person: this.person
      
    })
  }

	removeToken(){
	}

}
