import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SisplanController } from '../../../sisplan.controller';

import { SisplanService, BudgetService, UpdateListEvent, UpdateEvent } from '../../../sisplan.service';

import { Budget, BudgetHelper } from '../../presupuesto.model';
import { Pcultural       }      from '../../../pcultural/pcultural.model';

const UPDATE = 'update';
const CORE = 'core';

@Component({
  selector: 'budget-core-base',
  templateUrl: './budget-core-base.component.html',
  styleUrls: ['./budget-core-base.component.scss']
})
export class BudgetCoreBaseComponent implements OnInit {
	@Input() budget: Budget;
  @Input() pcultural: Pcultural;
	@Output() updateBudget = new EventEmitter<UpdateEvent>();

	public showView = true;
	public showEdit = false;
	public openEditor = false;

	public token = {
		description: 'token description'

	};

  constructor() { }

  ngOnInit() {

    if(!this.budget._id){
      this.editToken();
    }

  }

  updateCore(event: UpdateEvent){
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event:UpdateEvent){
  	if(event.action === UPDATE){
  		this.updateBudget.next(event);
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
