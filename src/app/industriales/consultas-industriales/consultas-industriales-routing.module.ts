import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultasBrowseComponent } from './consultas-browse/consultas-browse.component';
import { ConsultasEditComponent } from './consultas-edit/consultas-edit.component';


const routes: Routes = [
  {
    path: 'alta',
    component : ConsultasEditComponent
  },
  {
    path: 'editar/:id',
    component: ConsultasEditComponent
  },
  {
    path: '',
    pathMatch: 'full',
    component: ConsultasBrowseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultasIndustrialesRoutingModule { }
