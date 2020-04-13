import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DevelarCommonsModule }    from '../develar-commons/develar-commons.module';

import { CentroOperacionesRoutingModule } from './centro-operaciones-routing.module';

import { CentroOperacionesComponent } from './containers/centro-operaciones/centro-operaciones.component';
import { CentroOperacionesFacade }    from './centro-operaciones.facade';
import { ServicioComponent }          from './components/servicio/servicio.component';
import { TransitoComponent }          from './components/transito/transito.component';
import { CentroOperacionesState }     from './state/centro-operaciones.state';
import { TransitoModalComponent }     from './components/servicio/transito-modal/transito-modal.component';
import { SolicitudesInternacionModalComponent } from './components/solicitudes-internacion-modal/solicitudes-internacion-modal.component';
import { SolicitudesApi }     from './api/solicitudes.api';
import { LocacionesApi }      from './api/locaciones.api';
import { BotonesApi }         from './api/botones.api';
import { CapacidadComponent } from './components/capacidad/capacidad.component';


@NgModule({
  declarations: [
    CentroOperacionesComponent,
    ServicioComponent,
    TransitoComponent,
    TransitoModalComponent,
    SolicitudesInternacionModalComponent,
    CapacidadComponent,
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
