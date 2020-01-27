import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SisplanController } from '../../../sisplan.controller';

import { UpdateEvent } from '../../../sisplan.service';

import { Pcultural, PculturalHelper } from '../../pcultural.model';

const UPDATE = 'update';
const CORE = 'core';

@Component({
  selector: 'pcultural-core-base',
  templateUrl: './pcultural-core-base.component.html',
  styleUrls: ['./pcultural-core-base.component.scss']
})
export class PculturalCoreBaseComponent implements OnInit {
	@Input() pcultural: Pcultural;
	@Output() updatePcultural = new EventEmitter<UpdateEvent>();

	public showView = true;
	public showEdit = false;
	public openEditor = false;

	public token = {
		description: 'token description'

	};

  constructor() { }

  ngOnInit() {
  }

  updateCore(event: UpdateEvent){
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event:UpdateEvent){
  	if(event.action === UPDATE){
  		this.updatePcultural.next(event);
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
