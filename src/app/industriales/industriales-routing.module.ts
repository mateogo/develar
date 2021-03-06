import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserWebFormRegistroEditComponent } from '../entities/user-web/user-web-form-registro-edit/user-web-form-registro-edit.component';
import { DashboardMainComponent } from './dashboard/dashboard-main/dashboard-main.component';
import { DashboardPageComponent } from './dashboard/dashboard-page/dashboard-page.component';
import { PersonasPageComponent } from './personas-industriales/personas-page/personas-page.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    children: [
      {
        path: 'usuario/:id',
        component: UserWebFormRegistroEditComponent,
      },
      {
        path: 'personas/:id',
        component: PersonasPageComponent,
      },
      {
        path: 'censos',
        loadChildren: () =>
          import('../empresas/empresas.module').then(
            (m) => m.EmpresasModule
          ),
      },
      {
        path: 'consultas',
        loadChildren: () =>
          import('./consultas-industriales/consultas-industriales.module').then(
            (m) => m.ConsultasIndustrialesModule
          ),
      },
      {
        path: 'turnospresenciales',
        loadChildren: () =>
          import('./turnos-industriales/turnos-industriales.module').then(
            (m) => m.TurnosIndustrialesModule
          ),
      },
      {
        path: 'documentacion',
        loadChildren: () =>
          import(
            './industriales-documentacion/industriales-documentacion.module'
          ).then((m) => m.IndustrialesDocumentacionModule),
      },
      {
        path: 'industrias',
        loadChildren: () =>
          import('./vinculos-industriales/vinculos-industriales.module').then(
            (m) => m.VinculosIndustrialesModule
          ),
      },
      {
        path: '',
        component: DashboardMainComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndustrialesRoutingModule {}
