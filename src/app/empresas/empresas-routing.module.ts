import { NgModule } from '@angular/core';
import { RouterModule, Routes }         from '@angular/router';

// site routed components
import { EmpresasLayoutComponent }       from './layouts/empresas-layout/empresas-layout.component';
import { DashboardComercioPageComponent } from './dashboard/dashboard-comercio-page/dashboard-comercio-page.component';
import { CensoPageComponent } from './censo/censo-page/censo-page.component';

import { RegistroEmpresaPageComponent } from './master-data/empresa-page/registro-empresa-page.component';
import { Page404Component }          from '../develar-commons/errorpages/page-404.component';

import { CensoCoreEditComponent } from './censo/censo-data/censo-core/censo-core-edit/censo-core-edit.component';
import { CensoNavigateComponent } from './censo-crud/censo-navigate/censo-navigate.component';

import { CompanyBrowseComponent } from './company-page/company-browse/company-browse.component';

const routes: Routes = [
  {path: 'panel',
    component: CensoNavigateComponent,

  },

  {path: 'recepcion',
    component: CompanyBrowseComponent,

  },

  {path: 'editar/:id',
    component: RegistroEmpresaPageComponent,

  },

  {
    path: 'censo2020',
    children: [
      {
        path: 'core',
        component: CensoCoreEditComponent,
      },
      {
        path: 'core/:id',
        component: CensoCoreEditComponent,
      },

      {
        path: '',
        pathMatch: 'full',
        component: CensoPageComponent,
      },
      {
        path: ':id',
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
