import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DevelarCommonsModule }  from '../develar-commons/develar-commons.module';

import { AntecedentesRoutingModule } from './antecedentes-routing.module';

import { AntDashboardComponent } from './ant-dashboard/ant-dashboard.component';
import { AntEditComponent } from './ant-edit/ant-edit.component';
import { AntDetailPageComponent } from './ant-detail-page/ant-detail-page.component';
import { StoreModule } from '@ngrx/store';
import * as fromAntecedentes from './reducers';
import { AntCollectionPageComponent } from './ant-collection-page/ant-collection-page.component';
import { AntCollectionListComponent } from './ant-collection-list/ant-collection-list.component';



@NgModule({
  declarations: [
  	AntDashboardComponent,
  	AntEditComponent,
  	AntDetailPageComponent,
  	AntCollectionPageComponent,
  	AntCollectionListComponent
  ],
  imports: [
    CommonModule,
    AntecedentesRoutingModule,
    DevelarCommonsModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('antecedentes', fromAntecedentes.reducers, { metaReducers: fromAntecedentes.metaReducers }),
  ],
  exports: []
})
export class AntecedentesModule { }