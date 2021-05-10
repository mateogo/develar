import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DevelarCommonsModule } from '../../develar-commons/develar-commons.module';
import { CentroIndustrialRoutingModule } from './censo-industrial-routing.module';

import { CensoIndustrialComponent } from './censo-industrial/censo-industrial.component';
import { CensoIndustrialBrowseComponent } from './censo-industrial-browse/censo-industrial-browse.component';
import { CensoIndustrialTableComponent } from './censo-industrial-table/censo-industrial-table.component';
import { CensoPersonaBuscarComponent } from './censo-industrial-persona-buscar/censo-industrial-persona-buscar.component';
import { CensoIndustrialGridComponent } from './censo-industrial-grid/censo-industrial-grid.component';
import { CensoIndustrialBaseComponent } from './censo-industrial-base/censo-industrial-base.component';
import { CensoIndustrialManageComponent } from './censo-industrial-manage/censo-industrial-manage.component';
import { CensoFollowupComponent } from './zmodals/censo-followup/censo-followup.component';
import { CensoVistaModalComponent } from './zmodals/censo-vista-modal/censo-vista-modal.component';
import { CensoIndustrialViewComponent } from './censo-industrial-view/censo-industrial-view.component';

@NgModule({
  declarations: [
    CensoIndustrialComponent,
    CensoIndustrialBrowseComponent,
    CensoIndustrialTableComponent,
    CensoPersonaBuscarComponent,
    CensoIndustrialGridComponent,
    CensoIndustrialBaseComponent,
    CensoIndustrialManageComponent,
    CensoFollowupComponent,
    CensoVistaModalComponent,
    CensoIndustrialViewComponent
  ],
  imports: [
    CommonModule,
    DevelarCommonsModule,
    ReactiveFormsModule,
    CentroIndustrialRoutingModule
  ],
})
export class CensoIndustrialModule {}
