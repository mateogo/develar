import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocacionCreateComponent } from './locacion-data/locacion-create/locacion-create.component';
import { LocacionDashboardComponent } from './locacion-page/locacion-dashboard/locacion-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: LocacionCreateComponent,
    pathMatch: 'full'
  },
  {
    path: 'alta',
    component: LocacionCreateComponent,
  },
  {
    path: 'navegar',
    component: LocacionDashboardComponent,
  },
  {
    path: ':id',
    component: LocacionCreateComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocacionHospitalariaRoutingModule { }
