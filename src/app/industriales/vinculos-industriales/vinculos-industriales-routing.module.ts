import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VinculosBrowseComponent } from './vinculos-browse/vinculos-browse.component';
import { RegistroEmpresaPageComponent } from '../../empresas/master-data/empresa-page/registro-empresa-page.component';

const routes: Routes = [
  {
    path: '',
    component: VinculosBrowseComponent
  },
  {
    path: 'editar/:id',
    component: RegistroEmpresaPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VinculosIndustrialesRoutingModule { }
