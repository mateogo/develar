import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserWebFormRegistroEditComponent } from '../entities/user-web/user-web-form-registro-edit/user-web-form-registro-edit.component';
import { DashboardMainComponent } from './dashboard/dashboard-main/dashboard-main.component';
import { DashboardPageComponent } from './dashboard/dashboard-page/dashboard-page.component';


const routes: Routes = [
  {
    path: '',
    component : DashboardPageComponent,
    children : [
    {
      path: 'usuario/:id',
      component : UserWebFormRegistroEditComponent
    },
    {
      path : '',
      component : DashboardMainComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustrialesRoutingModule { }
