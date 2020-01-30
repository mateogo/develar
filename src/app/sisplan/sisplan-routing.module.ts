import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PculturalCreateComponent }    from './pcultural/pcultural-create/pcultural-create.component';
import { PculturalPageComponent }      from './pcultural/pcultural-page/pcultural-page.component';
import { PculturalDashboardComponent } from './pcultural/pcultural-dashboard/pcultural-dashboard.component';

import { BudgetCreateComponent }    from './presupuesto/manage-core/budget-create/budget-create.component';
import { BudgetPageComponent }      from './presupuesto/budget-page/budget-page.component';
import { BudgetDashboardComponent } from './presupuesto/budget-dashboard/budget-dashboard.component';

const routes: Routes = [
	{
		path: 'proyectos/nuevo',
		component: PculturalCreateComponent
	},
	{
		path: 'proyectos/navegar',
		component: PculturalDashboardComponent
	},
	{
		path: 'proyectos/:id',
		component: PculturalPageComponent
	},
	{
		path: 'proyectos',
		component: PculturalPageComponent
	},

	{
		path: 'presupuesto/nuevo',
		component: BudgetCreateComponent
	},
	{
		path: 'presupuesto/navegar',
		component: BudgetDashboardComponent
	},
	{
		path: 'presupuesto/:id',
		component: BudgetPageComponent
	},
	{
		path: 'presupuesto',
		component: BudgetPageComponent
	}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SisplanRoutingModule { }
