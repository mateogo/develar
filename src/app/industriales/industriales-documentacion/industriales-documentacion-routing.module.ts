import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentacionPageComponent } from './documentacion-page/documentacion-page.component';


const routes: Routes = [
  {
    path: '',
    component : DocumentacionPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustrialesDocumentacionRoutingModule { }
