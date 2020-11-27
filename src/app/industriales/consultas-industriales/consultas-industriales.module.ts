import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultasIndustrialesRoutingModule } from './consultas-industriales-routing.module';
import { ConsultasBrowseComponent } from './consultas-browse/consultas-browse.component';
import { ConsultasTableComponent } from './consultas-table/consultas-table.component';
import { ConsultasEditComponent } from './consultas-edit/consultas-edit.component';
import { DevelarCommonsModule } from '../../develar-commons/develar-commons.module';
import { ConsultasModule } from '../../entities/consultas/consultas.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ConsultasBrowseComponent, ConsultasTableComponent, ConsultasEditComponent],
  imports: [
    ConsultasIndustrialesRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    DevelarCommonsModule,
    ConsultasModule
  ]
})
export class ConsultasIndustrialesModule { }
