import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EpidemioInvestigPageComponent }  from './pages/epidemio-investig-page/epidemio-investig-page.component';
import { VigilSeguimientoPageComponent }  from './vigilancia-zeguimiento/vigil-seguimiento-page/vigil-seguimiento-page.component';

const routes: Routes = [

	{
		path:'epidemio',
		component: EpidemioInvestigPageComponent
	},
	{
		path:'seguimiento',
		component: VigilSeguimientoPageComponent
	},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaludFormsRoutingModule { }
