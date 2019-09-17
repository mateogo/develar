import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecepcionPageComponent } from './recepcion-page/recepcion-page.component';
import { TurnosPageComponent } from './turnos/turnos-page/turnos-page.component';
import { TsocialPageComponent } from './tsocial/tsocial-page/tsocial-page.component';
import { SegumientoPageComponent } from './seguimiento/segumiento-page/segumiento-page.component';

import { AlimentosPageComponent } from './alimentos/alimentos-page/alimentos-page.component';
import { RemitoalmacenBrowseComponent } from './alimentos/remitoalmacen/remitoalmacen-browse/remitoalmacen-browse.component';
import { SolDashboardPageComponent } from './asistencia/sol-dashboard/sol-dashboard-page/sol-dashboard-page.component';

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
		path:'almacen',
		component: RemitoalmacenBrowseComponent
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
		path:'seguimiento/:id',
		component: SegumientoPageComponent
	},
	{
		path:'seguimiento',
		component: SegumientoPageComponent
	},
	{
		path:'solicitudes',
		component: SolDashboardPageComponent
	},




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DsocialRoutingModule { }
