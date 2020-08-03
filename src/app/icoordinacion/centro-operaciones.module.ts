import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DevelarCommonsModule }    from '../develar-commons/develar-commons.module';
import { SaludModule } from '../salud/salud.module';

import { CentroOperacionesRoutingModule } from './centro-operaciones-routing.module';
import { CentroOperacionesComponent } from './containers/centro-operaciones/centro-operaciones.component';

import { SolicitudesInternacionModalComponent } from './components/solicitudes-internacion-modal/solicitudes-internacion-modal.component';
import { LocacionDisponibleComponent } from './components/locacion-disponible/locacion-disponible.component';
import { LocacionPeriferiaComponent } from './components/locacion-periferia/locacion-periferia.component';
import { LocacionServiciosComponent } from './components/locacion-servicios/locacion-servicios.component';
import { InternacionAltaComponent } from './components/internacion-alta/internacion-alta.component';
import { InternacionViewComponent } from './components/internacion-view/internacion-view.component';
import { InternacionDashboardPageComponent } from './dashboard/internacion-dashboard-page/internacion-dashboard-page.component';
import { InternacionDashboardBrowseComponent } from './dashboard/internacion-dashboard-browse/internacion-dashboard-browse.component';
import { InternacionDashboardListComponent } from './dashboard/internacion-dashboard-list/internacion-dashboard-list.component';
import { InternacionDashboardCardComponent } from './dashboard/internacion-dashboard-card/internacion-dashboard-card';

@NgModule({
  declarations: [
    CentroOperacionesComponent,
    SolicitudesInternacionModalComponent,
    LocacionDisponibleComponent,
    LocacionPeriferiaComponent,
    LocacionServiciosComponent,
    InternacionAltaComponent,
    InternacionViewComponent,
    InternacionDashboardPageComponent,
    InternacionDashboardBrowseComponent,
    InternacionDashboardListComponent,
    InternacionDashboardCardComponent
  ],
  imports: [
    CommonModule,
    DevelarCommonsModule,
    CentroOperacionesRoutingModule,
    ReactiveFormsModule,
    SaludModule,
  ],
  entryComponents : [SolicitudesInternacionModalComponent, InternacionAltaComponent],
})
export class CentroOperacionesInternacionModule { }
