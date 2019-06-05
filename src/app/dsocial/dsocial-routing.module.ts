import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecepcionPageComponent } from './recepcion-page/recepcion-page.component';
import { TurnosPageComponent } from './turnos/turnos-page/turnos-page.component';
import { TsocialPageComponent } from './tsocial/tsocial-page/tsocial-page.component';
import {AlimentosPageComponent } from './alimentos/alimentos-page/alimentos-page.component';
import {SolListPageComponent } from './asistencia/sol-list/sol-list-page/sol-list-page.component';

const routes: Routes = [
	{
		path:'recepcion',
		component: RecepcionPageComponent
	},
	{
		path:'ayudadirecta',
		component: TurnosPageComponent
	},
	{
		path:'alimentos/:id',
		component: AlimentosPageComponent
	},
	{
		path:'alimentos',
		component: AlimentosPageComponent
	},
	{
		path:'atencionsocial/:id',
		component: TsocialPageComponent
	},
	{
		path:'atencionsocial',
		component: TsocialPageComponent
	},
	{
		path:'solicitudes',
		component: SolListPageComponent
	},




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DsocialRoutingModule { }
