import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaExcelPageComponent } from './carga-excel-page/carga-excel-page.component';

const routes: Routes = [
	{
		path:'',
		component: CargaExcelPageComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaExcelRoutingModule { }
