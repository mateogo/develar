import { Component, OnInit, Input } from '@angular/core';

import { SisplanController } from '../../../sisplan.controller';

import { SisplanService, BudgetService, UpdateListEvent, UpdateEvent } from '../../../sisplan.service';

import { Budget, BudgetItem, BudgetHelper   } from '../../presupuesto.model';


@Component({
  selector: 'budget-items-view',
  templateUrl: './budget-items-view.component.html',
  styleUrls: ['./budget-items-view.component.scss']
})
export class BudgetItemsViewComponent implements OnInit {
	@Input() token: BudgetItem;

	public arsCosto = 0;
	public slug;
	public freq = 1;
	public qty = 1;
	public importe = 0;
	public moneda = "ARS";
	public costo = 0;
	public changeRate = 1;
	public feRate = '';
	public productSlug = '';
	public fume = '';
	public qume = '';


  constructor() { }

  ngOnInit() {
		this.arsCosto = this.token.itemARSCost;
		this.slug = this.token.slug
		this.freq = this.token.freq;
		this.qty = this.token.qty;
		this.importe = this.token.importe;
		this.moneda = this.token.currency;
		this.costo = this.token.itemCost;
		this.changeRate = this.token.changeRate;
		this.feRate = this.token.feRate;
		this.productSlug = this.token.productSlug;
		this.fume = SisplanService.getOptionLabel('fume', this.token.fume);
		this.qume = SisplanService.getOptionLabel('qume', this.token.qume);

  }

}
