import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevelarCommonsModule } from '../../develar-commons/develar-commons.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ConsultaComponent } from './consulta/consulta.component';
import { ConsultasRoutingModule } from './consultas-routing.module';
import { ConsultaBrowseComponent } from './consulta-browse/consulta-browse.component';
import { ConsultaCreateComponent } from './consulta-create/consulta-create.component';
import { ConsultaEditComponent } from './consulta-edit/consulta-edit.component';
import { ConsultaToTurnoComponent } from './consulta-to-turno/consulta-to-turno.component';
import { PasesFromConsultaComponent } from './pases-from-consulta/pases-from-consulta.component';
import { PasesFromConsultaModalComponent } from './pases-from-consulta-modal/pases-from-consulta-modal.component';
import { DevelarMaterialModule } from '../../develar-commons/develar-materials.module';
import { ConsultaBrowseTableComponent } from './consulta-browse-table/consulta-browse-table.component';


@NgModule({
  declarations: [ConsultaComponent, ConsultaBrowseComponent, ConsultaCreateComponent, ConsultaEditComponent, ConsultaToTurnoComponent, PasesFromConsultaComponent, PasesFromConsultaModalComponent, ConsultaBrowseTableComponent],
  imports: [
    CommonModule,
    ConsultasRoutingModule,
    DevelarCommonsModule,
    DevelarMaterialModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ConsultasModule { }
