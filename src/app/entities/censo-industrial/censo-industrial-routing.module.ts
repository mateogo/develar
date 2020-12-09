import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CensoIndustrialComponent } from './censo-industrial/censo-industrial.component';

const routes: Routes = [
  {
    path: '',
    component: CensoIndustrialComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentroIndustrialRoutingModule { }
