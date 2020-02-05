import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { SisplanController } from '../../../sisplan.controller';

import { SisplanService, BudgetService, UpdateListEvent, UpdateEvent } from '../../../sisplan.service';

import { Budget, BudgetItem,PculturalItem, BudgetHelper   } from '../../presupuesto.model';


@Component({
  selector: 'budget-pculturals-view',
  templateUrl: './budget-pculturals-view.component.html',
  styleUrls: ['./budget-pculturals-view.component.scss']
})
export class BudgetPculturalsViewComponent implements OnInit {
	@Input() token: PculturalItem;

	public slug;
	public target;


  constructor(
      private router: Router,

  	) { }

  ngOnInit() {
		this.slug = this.token.slug
		this.target = this.token.pculturalId;

  }

  navigate(target: string){
    this.router.navigate(['/cck/gestion/proyectos', target] );
  }

}
