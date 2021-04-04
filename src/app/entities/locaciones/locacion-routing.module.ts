import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocacionCreateComponent } from './locacion-data/locacion-create/locacion-create.component';
import { LocacionDashboardComponent } from './locacion-page/locacion-dashboard/locacion-dashboard.component';
import { OcupacionPageComponent } from './locacion-ocupacion/ocupacion-page/ocupacion-page.component';
import { OcupacionEditComponent } from './locacion-ocupacion/ocupacion-edit/ocupacion-edit.component';
import { LocacionReportComponent } from './locacion-page/locacion-report/locacion-report.component';

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
    path: 'ocupacion',
    component: OcupacionPageComponent,
  },
  {
    path: 'reporteocupacion',
    component: LocacionReportComponent,
  },
  {
    path: 'parteocupacion/:id',
    component: OcupacionEditComponent,
  },
  {
    path: 'parteocupacion',
    component: OcupacionEditComponent,
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
