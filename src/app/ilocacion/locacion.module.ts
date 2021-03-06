import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DevelarCommonsModule }    from '../develar-commons/develar-commons.module';
import { SaludModule } from '../salud/salud.module';
import { LocacionContainerComponent } from       './containers/locacion-container/locacion-container.component';
import { LocacionInternacionRoutingModule } from './locacion-routing.module';

import { CamaEstadoComponent } from './components/camas-mosaicos-component/cama-estado.component';
import { CamaEstadoModalComponent } from './components/camas-mosaicos-component/cama-estado-modal/cama-estado-modal.component';
import { LocacionFacade } from './locacion.facade';
import { LocacionState } from './state/locacion.state';
import { RecursosComponent } from './components/recursos/recursos.component';

import { RecursosModalComponent } from './components/recursos/recursos-modal/recursos-modal.component';

import { PacienteComponent } from './components/paciente/paciente.component';
import { BufferModalComponent } from './components/buffer-modal/buffer-modal.component';
import { PacientesApi } from './api/pacientes.api';
import { CamaComponent } from './components/cama/cama.component';
import { IlocacionAltaComponent } from './components/ilocacion-alta/ilocacion-alta.component';
import { IlocacionViewComponent } from './components/ilocacion-view/ilocacion-view.component';


@NgModule({
    declarations: [
      LocacionContainerComponent,
      CamaEstadoComponent,
      CamaEstadoModalComponent,
      RecursosComponent,
      RecursosModalComponent,
      PacienteComponent,
      BufferModalComponent,
      CamaComponent,
      IlocacionAltaComponent,
      IlocacionViewComponent,
    ],
    entryComponents : [CamaEstadoModalComponent, RecursosModalComponent, BufferModalComponent, IlocacionAltaComponent],
    imports: [
        LocacionInternacionRoutingModule,
        CommonModule,
        DevelarCommonsModule,
        ReactiveFormsModule,
        SaludModule
    ],        
    providers: [
      LocacionFacade,
      LocacionState,
      PacientesApi,
    ]
  })
  export class LocacionInternacionModule { }