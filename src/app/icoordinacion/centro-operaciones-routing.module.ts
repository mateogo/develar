import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CentroOperacionesComponent } from './containers/centro-operaciones/centro-operaciones.component';
import { InternacionDashboardPageComponent } from './dashboard/internacion-dashboard-page/internacion-dashboard-page.component';

const routes: Routes = [
  {
    path: 'navegar',
    component: InternacionDashboardPageComponent
  },
  {
    path: '',
    component: CentroOperacionesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentroOperacionesRoutingModule { }
