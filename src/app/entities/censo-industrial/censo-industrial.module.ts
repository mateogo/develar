import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CensoIndustrialComponent } from './censo-industrial/censo-industrial.component';
import { CensoIndustrialBrowseComponent } from './censo-industrial-browse/censo-industrial-browse.component';
import { CensoIndustrialTableComponent } from './censo-industrial-table/censo-industrial-table.component';
import { CensoIndustrialCreateComponent } from './censo-industrial-create/censo-industrial-create.component';
import { CensoIndustrialEditComponent } from './censo-industrial-edit/censo-industrial-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CentroIndustrialRoutingModule } from './censo-industrial-routing.module';
import { DevelarCommonsModule } from '../../develar-commons/develar-commons.module';

@NgModule({
  declarations: [
    CensoIndustrialComponent,
    CensoIndustrialBrowseComponent,
    CensoIndustrialTableComponent,
    CensoIndustrialCreateComponent,
    CensoIndustrialEditComponent,
  ],
  imports: [
    CommonModule,
    DevelarCommonsModule,
    ReactiveFormsModule,
    CentroIndustrialRoutingModule
  ],
})
export class CensoIndustrialModule {}
