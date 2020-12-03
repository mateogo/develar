import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VinculosBrowseComponent } from './vinculos-browse/vinculos-browse.component';

const routes: Routes = [
  {
    path: 'alta',
    // component : TurnosIndustrialesEditComponent
  },
  {
    path: 'editar/:id',
    // component : TurnosIndustrialesEditComponent
  },
  {
    path: '',
    pathMatch: 'full',
  component: VinculosBrowseComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VinculosIndustrialesRoutingModule { }
