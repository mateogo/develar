import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { PersonCreateComponent } from './person-create/person-create.component';
// import { PersonComponent }       from './person/person.component';
// import { PersonEditComponent }       from './person-edit/person-edit.component';
// import { PersonManageComponent } from './person-manage/person-manage.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { ConsultaCreateComponent } from './consulta-create/consulta-create.component';
import { ConsultaEditComponent } from './consulta-edit/consulta-edit.component';
import { PasesFromConsultaComponent } from './pases-from-consulta/pases-from-consulta.component';

const routes: Routes = [{
  path: '',
  component: ConsultaComponent,
  pathMatch: 'full'
},
  {
    path: 'alta',
    component: ConsultaCreateComponent,
    pathMatch: 'full'
  },
  {
    path: 'editar/:id',
    component: ConsultaEditComponent,
    pathMatch: 'full'
  },
  {
    path : 'pases/:id',
    component : PasesFromConsultaComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultasRoutingModule { }
