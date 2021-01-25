import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaludwebDashboardComponent } from './dashboard/saludweb-dashboard/saludweb-dashboard.component';


const routes: Routes = [
  {
    path:'',
    component: SaludwebDashboardComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaludwebRoutingModule { }
