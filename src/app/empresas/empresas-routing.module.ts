import { NgModule } from '@angular/core';
import { RouterModule, Routes }         from '@angular/router';

// site routed components
import { EmpresasLayoutComponent }       from './layouts/empresas-layout/empresas-layout.component';
import { DashboardComercioPageComponent } from './dashboard/dashboard-comercio-page/dashboard-comercio-page.component';
import { CensoPageComponent } from './censo/censo-page/censo-page.component';

import { RegistroEmpresaPageComponent } from './master-data/empresa-page/registro-empresa-page.component';
import { Page404Component }          from '../develar-commons/errorpages/page-404.component';

import { CensoCoreEditComponent } from './censo/censo-data/censo-core/censo-core-edit/censo-core-edit.component';


const routes: Routes = [
  {
    path: 'gestion',
    component: EmpresasLayoutComponent,
    children: [
      {
        path: 'censo2020/core',
        component: CensoCoreEditComponent,
      },
      {
        path: 'censo2020',
        component: CensoPageComponent,
      },
      {
        path: 'censo2020/:id',
        component: CensoPageComponent,
      },
    ]  
  },
  {
    path: '',
    component: EmpresasLayoutComponent,
    children: [
      {
        path: 'inicio',
        component: DashboardComercioPageComponent,
      },
      {
        path: 'inicio/:id',
        component: DashboardComercioPageComponent,
      },
      {
        path: 'perfil',
        component: RegistroEmpresaPageComponent,
      },
      {
        path: 'perfil/:id',
        component: RegistroEmpresaPageComponent,
      },
    ]  
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
  	RouterModule
  ],
  declarations: []
})
export class EmpresasRoutingModule {}
