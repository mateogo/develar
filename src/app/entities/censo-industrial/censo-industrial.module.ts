import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DevelarCommonsModule } from '../../develar-commons/develar-commons.module';
import { CentroIndustrialRoutingModule } from './censo-industrial-routing.module';

import { CensoIndustrialComponent } from './censo-industrial/censo-industrial.component';
import { CensoIndustrialBrowseComponent } from './censo-industrial-browse/censo-industrial-browse.component';
import { CensoIndustrialTableComponent } from './censo-industrial-table/censo-industrial-table.component';
import { CensoPersonaBuscarComponent } from './censo-industrial-persona-buscar/censo-industrial-persona-buscar.component';

@NgModule({
  declarations: [
    CensoIndustrialComponent,
    CensoIndustrialBrowseComponent,
    CensoIndustrialTableComponent,
    CensoPersonaBuscarComponent
  ],
  imports: [
    CommonModule,
    DevelarCommonsModule,
    ReactiveFormsModule,
    CentroIndustrialRoutingModule
  ],
})
export class CensoIndustrialModule {}
