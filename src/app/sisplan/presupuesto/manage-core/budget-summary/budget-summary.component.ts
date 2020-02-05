import { Component, OnInit, Input } from '@angular/core';

import { SisplanController } from '../../../sisplan.controller';

import { SisplanService, BudgetService, BudgetCostService, UpdateListEvent, UpdateEvent } from '../../../sisplan.service';

import { Budget, BudgetCost, BudgetCostSummary, BudgetItem, BudgetHelper   } from '../../presupuesto.model';



@Component({
  selector: 'budget-summary',
  templateUrl: './budget-summary.component.html',
  styleUrls: ['./budget-summary.component.scss']
})
export class BudgetSummaryComponent implements OnInit {
	@Input() budget: Budget;
	@Input() budgetList: Budget[];
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
  public  globals: BudgetCost[] = [];
  public  items: BudgetCost[] = [];

  public exchangeMap = SisplanService.getOptionlist('exchange');

  private  budgetCost: BudgetCost;
  private  budgetCostService: BudgetCostService;
  public   budgetSummary: BudgetCostSummary;

  constructor(

    ) { }

  ngOnInit() {
  	if(this.budget){
	    this.budgetCostService = new BudgetCostService(this.budget, this.exchangeMap);
	    this.budgetCost = this.budgetCostService.budgetCost;

	    this.budgetSummary = this.budgetCostService.summary;
	    this.globals = this.budgetSummary.globals;
	    this.items = this.budgetSummary.items;

	  	this.compPrefix = this.budget.compPrefix;
	  	this.compName = this.budget.compName;
	  	this.compNum = this.budget.compNum;
	  	this.slug = this.budget.slug;

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
  	if(this.budgetList && this.budgetList.length){
  		this.budgetCostService = new BudgetCostService(new Budget(), this.exchangeMap);
  		this.budgetCostService.budgetlist = this.budgetList;

	    this.budgetSummary = this.budgetCostService.evaluateBugetListCost();

	    this.globals = this.budgetSummary.globals;
	    this.items = this.budgetSummary.items;

  	}

  }


}
