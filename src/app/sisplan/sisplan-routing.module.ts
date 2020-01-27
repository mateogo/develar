import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PculturalPageComponent } from './pcultural/pcultural-page/pcultural-page.component';
import { PculturalCreateComponent } from './pcultural/pcultural-create/pcultural-create.component';
import { PculturalDashboardComponent } from './pcultural/pcultural-dashboard/pcultural-dashboard.component';


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
		path: '',
		component: PculturalPageComponent
	}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SisplanRoutingModule { }
