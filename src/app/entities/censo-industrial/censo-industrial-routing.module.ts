import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CensoIndustrialComponent } from './censo-industrial/censo-industrial.component';
import { CensoEmpresarialDashboardComponent } from './censo-empresarial-dashboard/censo-empresarial-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: CensoIndustrialComponent,
    pathMatch: 'full'
  },
  {
    path: 'censoempresarial',
    component: CensoEmpresarialDashboardComponent,
    pathMatch: 'full'
  },
  {
    path: 'vista',
    loadChildren: () =>
      import('../../empresas/empresas.module').then(
        (m) => m.EmpresasModule
      ),
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentroIndustrialRoutingModule { }
