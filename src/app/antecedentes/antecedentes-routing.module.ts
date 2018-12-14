import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AntDashboardComponent } from './ant-dashboard/ant-dashboard.component';
import { AntEditComponent } from './ant-edit/ant-edit.component';
import { AntCollectionPageComponent } from './ant-collection-page/ant-collection-page.component';

const routes: Routes = [

	{
		path:'',
		component: AntDashboardComponent,
		pathMatch: 'full'
	},
	{
		path:'alta',
		component: AntEditComponent,
		pathMatch: 'full'
	},
	{
		path:'lista',
		component: AntCollectionPageComponent,
		pathMatch: 'full'
	}



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AntecedentesRoutingModule { }
