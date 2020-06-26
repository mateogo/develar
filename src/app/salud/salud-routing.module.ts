import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecepcionPageComponent } from './recepcion-page/recepcion-page.component';
import { TurnosPageComponent } from './turnos/turnos-page/turnos-page.component';
import { TsocialPageComponent } from './gestion/spersona-page/tsocial-page.component';
import { SegumientoPageComponent } from './seguimiento/segumiento-page/segumiento-page.component';
import { SolcovidPageComponent } from './covid/sol-covid-page/solcovid-page/solcovid-page.component';
import { SolcovidDashboardComponent } from './covid/sol-covid-page/solcovid-dashboard/solcovid-dashboard.component';
import { TestUnoComponent } from './internacion/tests/test-uno/test-uno.component'

import { SolDashboardPageComponent } from './asistencia/sol-dashboard/sol-dashboard-page/sol-dashboard-page.component';
import { AltarapidaPageComponent } from './internacion/alta-rapida/altarapida-page/altarapida-page.component';
import { VigilanciaPageComponent } from './vigilancia/vigilancia-page/vigilancia-page.component';
import { VigilanciaDashboardPageComponent } from './vigilancia/vigilancia-zdashboard/vigilancia-dashboard-page/vigilancia-dashboard-page.component';
import { VigilanciaReportesPageComponent } from './vigilancia/vigilancia-reportes/vigilancia-reportes-page/vigilancia-reportes-page.component';
import { SolcovidOfflinePageComponent } from './covid/sol-covid-page/solcovid-offline-page/solcovid-offline-page.component';
import { VigilSeguimientoPageComponent } from './vigilancia/vigilancia-zeguimiento/vigil-seguimiento-page/vigil-seguimiento-page.component';
import { InternacionDashboardPageComponent } from './vigilancia/vigilancia-zdashboard/internacion-dashboard-page/internacion-dashboard-page.component';

const routes: Routes = [
	{
		path:'recepcion',
		component: RecepcionPageComponent
	},
	{
		path:'altarapida',
		component: AltarapidaPageComponent
	},
	{
		path:'vigilancia',
		component: VigilanciaPageComponent
	},
	{
		path:'seguimiento',
		component: VigilSeguimientoPageComponent
	},
	{
		path:'reportesvigilancia',
		component: VigilanciaReportesPageComponent
	},
	{
		path:'detectar',
		component: SolcovidOfflinePageComponent
	},
	{
		path:'tableroepidemio',
		component: VigilanciaDashboardPageComponent
	},
	{
		path: 'tablerointernacion',
		component: InternacionDashboardPageComponent
	},
	{
		path:'ayudadirecta',
		component: TurnosPageComponent
	},
	{
		path:'testuno',
		component: TestUnoComponent
	},
	{
		path:'tablerocovid',
		component: SolcovidDashboardComponent
	},
	{
		path:'covid',
		component: SolcovidPageComponent
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
