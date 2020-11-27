import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TurnosIndustrialesBrowseComponent } from './turnos-industriales-browse/turnos-industriales-browse.component';
import { TurnosIndustrialesEditComponent } from './turnos-industriales-edit/turnos-industriales-edit.component';


const routes: Routes = [
  {
    path: 'alta',
    component : TurnosIndustrialesEditComponent
  },
  {
    path : 'editar/:id',
    component : TurnosIndustrialesEditComponent
  },  
  {
  path: '',
  component : TurnosIndustrialesBrowseComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnosIndustrialesRoutingModule { }
