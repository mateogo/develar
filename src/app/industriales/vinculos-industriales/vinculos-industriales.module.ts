import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VinculosBrowseComponent } from './vinculos-browse/vinculos-browse.component';
import { DevelarCommonsModule } from '../../develar-commons/develar-commons.module';
import { VinculosIndustrialesRoutingModule } from './vinculos-industriales-routing.module';
import { VinculosBrowseTableComponent } from './vinculos-browse-table/vinculos-browse-table.component';
import { VinculosAgregarDialogComponent } from './vinculos-agregar-dialog/vinculos-agregar-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VinculosAgregarFormComponent } from './vinculos-agregar-form/vinculos-agregar-form.component';
import { PersonBuscarComponent } from '../helpers/person-buscar/person-buscar.component';
import { EmpresasModule } from '../../empresas/empresas.module';

@NgModule({
  declarations: [
    VinculosBrowseComponent,
    VinculosBrowseTableComponent,
    VinculosAgregarDialogComponent,
    VinculosAgregarFormComponent,
    PersonBuscarComponent
  ],
  imports: [
    CommonModule,
    DevelarCommonsModule,
    ReactiveFormsModule,
    FormsModule,
    VinculosIndustrialesRoutingModule,
    EmpresasModule
  ],
})
export class VinculosIndustrialesModule {}
