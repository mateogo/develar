import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustrialesRoutingModule } from './industriales-routing.module';
import { DashboardMainComponent } from './dashboard/dashboard-main/dashboard-main.component';
import { DashboardPageComponent } from './dashboard/dashboard-page/dashboard-page.component';
import { DevelarCommonsModule } from '../develar-commons/develar-commons.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserDatosDashboardComponent } from './dashboard/user-datos-dashboard/user-datos-dashboard.component';
import { UserWebModule } from '../entities/user-web/user-web.module';


@NgModule({
  declarations: [DashboardMainComponent, DashboardPageComponent, UserDatosDashboardComponent],
  imports: [
    CommonModule,
    DevelarCommonsModule,
    ReactiveFormsModule,
    IndustrialesRoutingModule,
    UserWebModule,
  ]
})
export class IndustrialesModule { }
