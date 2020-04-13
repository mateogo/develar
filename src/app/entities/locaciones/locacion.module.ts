import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }          from '@angular/forms';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

import { LocacionHospitalariaRoutingModule } from './locacion-routing.module';

import { DevelarCommonsModule }    from '../../develar-commons/develar-commons.module';

import { LocacionService }         from './locacion.service';
import { LocacionCreateComponent } from './locacion-data/locacion-create/locacion-create.component';
import { LocacionDashboardComponent } from './locacion-page/locacion-dashboard/locacion-dashboard.component';
import { LocacionBrowseComponent } from './locacion-data/locacion-browse/locacion-browse.component';
import { LocacionPanelComponent } from './locacion-data/locacion-panel/locacion-panel.component';
import { LocacionViewComponent } from './locacion-data/locacion-view/locacion-view.component';
import { LocacionEditComponent } from './locacion-data/locacion-edit/locacion-edit.component';
import { LocacionBaseComponent } from './locacion-data/locacion-base/locacion-base.component';
import { LocacionListComponent } from './locacion-data/locacion-list/locacion-list.component';
import { LocacionTableComponent } from './locacion-data/locacion-table/locacion-table.component';

//InMemoryWebApiModule.forRoot(InMemoryDataService),

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LocacionHospitalariaRoutingModule,
    DevelarCommonsModule
  ],
  declarations: [
      LocacionCreateComponent,
      LocacionDashboardComponent,
      LocacionBrowseComponent,
      LocacionPanelComponent,
      LocacionViewComponent,
      LocacionEditComponent,
      LocacionBaseComponent,
      LocacionListComponent,
      LocacionTableComponent
  ],
  entryComponents: [LocacionCreateComponent],
  exports:[
  ],
  providers: []
})
export class LocacionHospitalariaModule { }
