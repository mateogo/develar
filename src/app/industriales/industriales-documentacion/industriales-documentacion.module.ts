import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustrialesDocumentacionRoutingModule } from './industriales-documentacion-routing.module';
import { DocumentacionCardComponent } from './documentacion-card/documentacion-card.component';
import { DocumentacionCardModalComponent } from './documentacion-card-modal/documentacion-card-modal.component';
import { DocumentacionCardFilesComponent } from './documentacion-card-files/documentacion-card-files.component';
import { DocumentacionCardPanelComponent } from './documentacion-card-panel/documentacion-card-panel.component';
import { DocumentacionPageComponent } from './documentacion-page/documentacion-page.component';
import { DevelarCommonsModule } from '../../develar-commons/develar-commons.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DocumentacionCardComponent,
    DocumentacionCardFilesComponent,
    DocumentacionCardModalComponent,
    DocumentacionCardPanelComponent,
    DocumentacionPageComponent],
  imports: [
    CommonModule,
    DevelarCommonsModule,
    ReactiveFormsModule,
    IndustrialesDocumentacionRoutingModule
  ]
})
export class IndustrialesDocumentacionModule {}