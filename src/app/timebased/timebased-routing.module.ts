import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolNochePageComponent } from './time-pages/rol-noche-page/rol-noche-page.component';
import { RolNochePanelComponent } from './rol-nocturnidad/rol-noche-panel/rol-noche-panel.component';


const routes: Routes = [
	{
		path:'panel',
		component: RolNochePageComponent
	},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimebasedRoutingModule { }
