import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CensoIndustrialComponent } from './censo-industrial/censo-industrial.component';
import { CensoPageComponent } from '../../empresas/censo/censo-page/censo-page.component';

const routes: Routes = [
  {
    path: '',
    component: CensoIndustrialComponent,
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
