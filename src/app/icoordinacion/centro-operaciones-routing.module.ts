import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CentroOperacionesComponent } from './containers/centro-operaciones/centro-operaciones.component';

const routes: Routes = [
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
