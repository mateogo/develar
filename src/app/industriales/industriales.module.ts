import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustrialesRoutingModule } from './industriales-routing.module';
import { DashboardMainComponent } from './dashboard/dashboard-main/dashboard-main.component';
import { DashboardPageComponent } from './dashboard/dashboard-page/dashboard-page.component';
import { DevelarCommonsModule } from '../develar-commons/develar-commons.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserDatosDashboardComponent } from './dashboard/user-datos-dashboard/user-datos-dashboard.component';
import { UserWebModule } from '../entities/user-web/user-web.module';
import { PersonasDashboardComponent } from './dashboard/personas-dashboard/personas-dashboard.component';
import { PersonasPageComponent } from './personas-industriales/personas-page/personas-page.component';
import { PersonasCoreBaseComponent } from './personas-industriales/personas-core/personas-core-base/personas-core-base.component';
import { PersonasCoreViewComponent } from './personas-industriales/personas-core/personas-core-view/personas-core-view.component';
import { PersonasCoreEditComponent } from './personas-industriales/personas-core/personas-core-edit/personas-core-edit.component';
import { PersonasAddressEditComponent } from './personas-industriales/personas-address/personas-address-edit/personas-address-edit.component';
import { PersonasAddressBaseComponent } from './personas-industriales/personas-address/personas-address-base/personas-address-base.component';
import { PersonasAddressPanelComponent } from './personas-industriales/personas-address/personas-address-panel/personas-address-panel.component';
import { PersonasAddressViewComponent } from './personas-industriales/personas-address/personas-address-view/personas-address-view.component';
import { PersonasContactdataBaseComponent } from './personas-industriales/personas-contactdata/personas-contactdata-base/personas-contactdata-base.component';
import { PersonasContactdataEditComponent } from './personas-industriales/personas-contactdata/personas-contactdata-edit/personas-contactdata-edit.component';
import { PersonasContactdataPanelComponent } from './personas-industriales/personas-contactdata/personas-contactdata-panel/personas-contactdata-panel.component';
import { PersonasContactdataViewComponent } from './personas-industriales/personas-contactdata/personas-contactdata-view/personas-contactdata-view.component';
import { PersonasVinculosBaseComponent } from './personas-industriales/personas-vinculos/personas-vinculos-base/personas-vinculos-base.component';
import { PersonasVinculosEditComponent } from './personas-industriales/personas-vinculos/personas-vinculos-edit/personas-vinculos-edit.component';
import { PersonasVinculosPanelComponent } from './personas-industriales/personas-vinculos/personas-vinculos-panel/personas-vinculos-panel.component';
import { PersonasVinculosViewComponent } from './personas-industriales/personas-vinculos/personas-vinculos-view/personas-vinculos-view.component';
import { DashboardConsultasComponent } from './dashboard/dashboard-consultas/dashboard-consultas.component';
import { DashboardTurnosComponent } from './dashboard/dashboard-turnos/dashboard-turnos.component';
import { DashboardDocumentacionComponent } from './dashboard/dashboard-documentacion/dashboard-documentacion.component';
import { DashboardIndustriasComponent } from './dashboard/dashboard-industrias/dashboard-industrias.component';
@NgModule({
  declarations: [DashboardMainComponent, DashboardPageComponent,
     UserDatosDashboardComponent, PersonasDashboardComponent,
      PersonasPageComponent,
      PersonasCoreBaseComponent,
      PersonasCoreEditComponent,
      PersonasCoreViewComponent,
      PersonasAddressBaseComponent,
      PersonasAddressEditComponent,
      PersonasAddressPanelComponent,
      PersonasAddressViewComponent,
      PersonasContactdataBaseComponent,
      PersonasContactdataEditComponent,
      PersonasContactdataPanelComponent,
      PersonasContactdataViewComponent,
      PersonasVinculosBaseComponent,
      PersonasVinculosEditComponent,
      PersonasVinculosPanelComponent,
      PersonasVinculosViewComponent,
      DashboardConsultasComponent,
      DashboardTurnosComponent,
      DashboardDocumentacionComponent,
      DashboardIndustriasComponent
    ],
  imports: [
    CommonModule,
    DevelarCommonsModule,
    ReactiveFormsModule,
    FormsModule,
    IndustrialesRoutingModule,
    UserWebModule,
  ]
})
export class IndustrialesModule { }
