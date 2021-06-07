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
import { CensoFollowupUpdateComponent } from './zmodals/censo-followup-update/censo-followup-update.component';
import { CensoFollowupHistoryComponent } from './zmodals/censo-followup-history/censo-followup-history.component';
import { CensoEmpresarialDashboardComponent } from './censo-empresarial-dashboard/censo-empresarial-dashboard.component';
import { CensoEmpresarialBrowseComponent } from './censo-empresarial-zcomponents/censo-empresarial-browse/censo-empresarial-browse.component';
import { CensoCuadroEstadoComponent } from './censo-empresarial-zcomponents/censo-cuadro-estado/censo-cuadro-estado.component';
import { CensoCuadroActividadComponent } from './censo-empresarial-zcomponents/censo-cuadro-actividad/censo-cuadro-actividad.component';
import { CensoEmpActividadesModalComponent } from './zmodals/censo-emp-actividades-modal/censo-emp-actividades-modal.component';

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
    CensoIndustrialViewComponent,
    CensoFollowupUpdateComponent,
    CensoFollowupHistoryComponent,
    CensoEmpresarialDashboardComponent,
    CensoEmpresarialBrowseComponent,
    CensoCuadroEstadoComponent,
    CensoCuadroActividadComponent,
    CensoEmpActividadesModalComponent
  ],
  imports: [
    CommonModule,
    DevelarCommonsModule,
    ReactiveFormsModule,
    CentroIndustrialRoutingModule
  ],
})
export class CensoIndustrialModule {}
