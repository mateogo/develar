import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecepcionPageComponent } from './recepcion-page/recepcion-page.component';
import { TurnosPageComponent } from './turnos/turnos-page/turnos-page.component';
import { TsocialPageComponent } from './tsocial/tsocial-page/tsocial-page.component';
import { TalimentarPageComponent } from './tsocial/talimentar-page/talimentar-page.component';
import { SegumientoPageComponent } from './seguimiento/segumiento-page/segumiento-page.component';

import { AlimentosPageComponent } from './alimentos/alimentos-page/alimentos-page.component';
import { RemitoalmacenEntregaComponent } from './alimentos/remitoalmacen/remitoalmacen-entrega/remitoalmacen-entrega.component';
import { SolDashboardPageComponent } from './asistencia/sol-dashboard/sol-dashboard-page/sol-dashboard-page.component';
import { AsistableroPageComponent } from './tableros/asistablero-page/asistablero-page.component';
import { AlimentostableroPageComponent } from './tableros/alimentostablero-page/alimentostablero-page.component';
import { AuditPageComponent } from './auditoria/audit-page/audit-page.component';
import { AlimentarDashboardComponent } from './tsocial/alimentar-dashboard/alimentar-dashboard.component';
import { EntregasExportComponent } from './tableros/entregas-export/entregas-export.component';
import { RegistroPageComponent } from './delegaciones/turnos/registro-page/registro-page.component';
import { AlimentarConsultaComponent } from './tsocial/alimentar-consulta/alimentar-consulta.component';

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
		path:'tableroasistencias',
		component: AsistableroPageComponent
	},
	{
		path:'tableroremitos',
		component: AlimentostableroPageComponent
	},
	{
		path:'tableroalimentar',
		component: AlimentarDashboardComponent
	},
	{
		path:'alimentar',
		component: AlimentarConsultaComponent
	},
	{
		path:'exportaralmacen',
		component: EntregasExportComponent
	},
	{
		path:'validacionentregas/:id',
		component: AuditPageComponent
	},
	{
		path:'validacionentregas',
		component: AuditPageComponent
	},
	{
		path:'registro',
		component: RegistroPageComponent
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
		component: RemitoalmacenEntregaComponent
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
		path:'tarjetaalimentar/:id',
		component: TalimentarPageComponent
	},
	{
		path:'tarjetaalimentar',
		component: TalimentarPageComponent
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
