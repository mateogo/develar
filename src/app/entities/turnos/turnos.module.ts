import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevelarCommonsModule } from '../../develar-commons/develar-commons.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { TurnoComponent } from './turno/turno.component';
import { TurnosRoutingModule } from './turnos-routing.module';
import { TurnoBrowseComponent } from './turno-browse/turno-browse.component';
import { TurnoCreateComponent } from './turno-create/turno-create.component';
import { TurnoEditComponent } from './turno-edit/turno-edit.component';
import { TurnoBrowseTableComponent } from './turno-browse-table/turno-browse-table.component';


@NgModule({
  declarations: [TurnoComponent, TurnoBrowseComponent, TurnoCreateComponent, TurnoEditComponent, TurnoBrowseTableComponent],
  imports: [
    CommonModule,
    TurnosRoutingModule,
    DevelarCommonsModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TurnosModule { }
