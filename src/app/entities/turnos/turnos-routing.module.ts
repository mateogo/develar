import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TurnoComponent } from './turno/turno.component';
import { TurnoCreateComponent } from './turno-create/turno-create.component';
import { TurnoEditComponent } from './turno-edit/turno-edit.component';

const routes: Routes = [{
  path: '',
  component: TurnoComponent,
  pathMatch: 'full'
},
  {
    path: 'alta',
    component: TurnoCreateComponent,
    pathMatch: 'full'
  },
  {
    path: 'editar/:id',
    component: TurnoEditComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnosRoutingModule { }
