import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargaExcelRoutingModule } from './carga-excel.routing.module';
import { CargaExcelPageComponent } from './carga-excel-page/carga-excel-page.component';

@NgModule({
  declarations: [CargaExcelPageComponent],
  imports: [
    CommonModule,
    CargaExcelRoutingModule
  ]
})
export class CargaExcelModule { }
