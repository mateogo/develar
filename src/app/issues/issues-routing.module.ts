import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssuesCreateComponent } from './issues-create/issues-create.component';

const routes: Routes = [
	{
		path:'alta',
		component: IssuesCreateComponent
	}
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssuesRoutingModule { }
