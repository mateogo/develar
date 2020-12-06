import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CensoIndustrialComponent } from './censo-industrial/censo-industrial.component';
import { CensoIndustrialCreateComponent } from './censo-industrial-create/censo-industrial-create.component';
import { CensoIndustrialEditComponent } from './censo-industrial-edit/censo-industrial-edit.component';

const routes: Routes = [
  {
    path: '',
    component: CensoIndustrialComponent,
    pathMatch: 'full'
  },
  {
    path: 'alta',
    component: CensoIndustrialCreateComponent,
    pathMatch: 'full'
  },
  {
    path: 'editar/:id',
    component: CensoIndustrialEditComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentroIndustrialRoutingModule { }
