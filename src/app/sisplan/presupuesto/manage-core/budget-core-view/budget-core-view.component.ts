import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { devutils }from '../../../../develar-commons/utils'

import { SisplanController } from '../../../sisplan.controller';


//import { Pcultural, PculturalHelper } from '../../budget.model';

import { SisplanService, BudgetService, UpdateListEvent, UpdateEvent } from '../../../sisplan.service';

import { Budget, BudgetHelper } from '../../presupuesto.model';
import { Pcultural       }      from '../../../pcultural/pcultural.model';


@Component({
  selector: 'budget-core-view',
  templateUrl: './budget-core-view.component.html',
  styleUrls: ['./budget-core-view.component.scss']
})
export class BudgetCoreViewComponent implements OnInit {
	@Input() budget: Budget;
  @Input() pcultural: Pcultural;

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
  public arsCosto;
  public currency;


  constructor(
      private router: Router,

    ) { }

  ngOnInit() {
  	this.compPrefix = this.budget.compPrefix;
  	this.compName = this.budget.compName;
  	this.compNum = this.budget.compNum;
  	this.slug = this.budget.slug;
    this.arsCosto = this.budget.e_ARSCost;
    this.currency = this.budget.currency;

  	let stypeOptList = SisplanService.getSubTypeMap()[this.budget.type] || [];
  	let locacionOptList = SisplanService.getLocacionMap()[this.budget.sede] || [];
 

  	this.type = SisplanService.getOptionLabel('type', this.budget.type);
 		this.stype = SisplanService.getOptionLabelFromList(stypeOptList, this.budget.stype);

  	this.sector = SisplanService.getPrefixedOptionLabel('sector','Área: ', this.budget.sector);
  	this.programa = SisplanService.getOptionLabel('programa', this.budget.programa);

  	this.sede = SisplanService.getOptionLabel('sede', this.budget.sede);
  	this.locacion = SisplanService.getOptionLabelFromList(locacionOptList, this.budget.locacion);
    this.estado = SisplanService.getPrefixedOptionLabel('estado', "Estado: ",this.budget.estado);


  }

  navigate(p:Budget){
    let id = p._id;
    this.router.navigate(['/cck/gestion/presupuesto', id] );
  }

}
