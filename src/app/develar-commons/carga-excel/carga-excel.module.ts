import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargaExcelRoutingModule } from './carga-excel.routing.module';
import { CargaExcelPageComponent } from './carga-excel-page/carga-excel-page.component';
import { DevelarCommonsModule } from '../develar-commons.module';

@NgModule({
  declarations: [CargaExcelPageComponent],
  imports: [
    CommonModule,
    CargaExcelRoutingModule,
    DevelarCommonsModule 
  ]
})
export class CargaExcelModule { }
