import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EpidemioInvestigPageComponent } from './pages/epidemio-investig-page/epidemio-investig-page.component';

const routes: Routes = [

	{
		path:'epidemio',
		component: EpidemioInvestigPageComponent
	},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaludFormsRoutingModule { }
