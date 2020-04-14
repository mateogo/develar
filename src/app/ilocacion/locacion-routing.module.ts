import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocacionContainerComponent } from './containers/locacion-container/locacion-container.component';

const routes: Routes = [
  {
    path: 'locacion/:id',
    component: LocacionContainerComponent
  },
  {
    path: '',
    component: LocacionContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocacionInternacionRoutingModule { }