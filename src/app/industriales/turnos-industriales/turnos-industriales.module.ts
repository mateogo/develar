import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurnosIndustrialesRoutingModule } from './turnos-industriales-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DevelarCommonsModule } from '../../develar-commons/develar-commons.module';
import { TurnosModule } from '../../entities/turnos/turnos.module';
import { TurnosIndustrialesBrowseComponent } from './turnos-industriales-browse/turnos-industriales-browse.component';
import { TurnosIndustrialesBrowseTableComponent } from './turnos-industriales-browse-table/turnos-industriales-browse-table.component';
import { TurnosIndustrialesDialogConfirmationComponent } from './turnos-industriales-dialog-confirmation/turnos-industriales-dialog-confirmation.component';
import { TurnosIndustrialesDialogConsultaComponent } from './turnos-industriales-dialog-consulta/turnos-industriales-dialog-consulta.component';
import { TurnosIndustrialesEditComponent } from './turnos-industriales-edit/turnos-industriales-edit.component';
import { TurnosIndustrialesEditFormComponent } from './turnos-industriales-edit-form/turnos-industriales-edit-form.component';


@NgModule({
  declarations: [TurnosIndustrialesBrowseComponent, TurnosIndustrialesBrowseTableComponent,
    TurnosIndustrialesDialogConfirmationComponent, TurnosIndustrialesDialogConsultaComponent,
    TurnosIndustrialesEditComponent,
    TurnosIndustrialesEditFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TurnosIndustrialesRoutingModule,
    DevelarCommonsModule,
    TurnosModule
  ]
})
export class TurnosIndustrialesModule { }
