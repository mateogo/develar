import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DevelarCommonsModule }    from '../develar-commons/develar-commons.module';

import { CentroOperacionesRoutingModule } from './centro-operaciones-routing.module';
import { CentroOperacionesComponent } from './containers/centro-operaciones/centro-operaciones.component';

import { CentroOperacionesFacade }    from './centro-operaciones.facade';
import { CentroOperacionesState }     from './state/centro-operaciones.state';
import { TransitoModalComponent }     from './components/transito-modal/transito-modal.component';
import { SolicitudesInternacionModalComponent } from './components/solicitudes-internacion-modal/solicitudes-internacion-modal.component';
import { SolicitudesApi }     from './api/solicitudes.api';
import { LocacionesApi }      from './api/locaciones.api';
import { BotonesApi }         from './api/botones.api';
import { LocacionDisponibleComponent } from './components/locacion-disponible/locacion-disponible.component';
import { LocacionPeriferiaComponent } from './components/locacion-periferia/locacion-periferia.component';
import { LocacionServiciosComponent } from './components/locacion-servicios/locacion-servicios.component';


@NgModule({
  declarations: [
    CentroOperacionesComponent,
    TransitoModalComponent,
    SolicitudesInternacionModalComponent,
    LocacionDisponibleComponent,
    LocacionPeriferiaComponent,
    LocacionServiciosComponent,
  ],
  imports: [
    CommonModule,
    DevelarCommonsModule,
    CentroOperacionesRoutingModule,
    ReactiveFormsModule,
  ],
  entryComponents : [TransitoModalComponent, SolicitudesInternacionModalComponent],
  providers: [
    CentroOperacionesFacade,
    CentroOperacionesState,
    SolicitudesApi,
    LocacionesApi,
    BotonesApi,
  ]
})
export class CentroOperacionesInternacionModule { }
