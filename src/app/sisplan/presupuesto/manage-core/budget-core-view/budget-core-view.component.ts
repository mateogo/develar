import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { devutils }from '../../../../develar-commons/utils'

import { SisplanController } from '../../../sisplan.controller';


//import { Pcultural, PculturalHelper } from '../../budget.model';

import { SisplanService, BudgetService, UpdateListEvent, UpdateEvent } from '../../../sisplan.service';

import { Budget, BudgetHelper       } from '../../presupuesto.model';


@Component({
  selector: 'budget-core-view',
  templateUrl: './budget-core-view.component.html',
  styleUrls: ['./budget-core-view.component.scss']
})
export class BudgetCoreViewComponent implements OnInit {
	@Input() budget: Budget;
	public compPrefix ;
	public compName;
	public compNum ;
	public type ;
	public stype ;
	public sector;
	public programa ;
	public sede;
	public locacion ;
	public slug;
  public estado;


  constructor(
      private router: Router,

    ) { }

  ngOnInit() {
  	this.compPrefix = this.budget.compPrefix;
  	this.compName = this.budget.compName;
  	this.compNum = this.budget.compNum;
  	this.slug = this.budget.slug;

  	let stypeOptList = SisplanService.getSubTypeMap()[this.budget.type] || [];
  	let locacionOptList = SisplanService.getLocacionMap()[this.budget.sede] || [];
 

  	this.type = SisplanService.getOptionLabel('type', this.budget.type);
 		this.stype = SisplanService.getOptionLabelFromList(stypeOptList, this.budget.stype);

  	this.sector = SisplanService.getOptionLabel('sector', this.budget.sector);
  	this.programa = SisplanService.getOptionLabel('programa', this.budget.programa);

  	this.sede = SisplanService.getOptionLabel('sede', this.budget.sede);
  	this.locacion = SisplanService.getOptionLabelFromList(locacionOptList, this.budget.locacion);
    this.estado = this.budget.estado;


  }

  navigate(p:Budget){
    let id = p._id;
    console.log('ready To Navigate: [%s]', id);
    this.router.navigate(['/cck/gestion/presupuesto', id] );
  }

}
