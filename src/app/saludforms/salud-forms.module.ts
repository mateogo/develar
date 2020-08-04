import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule }          from '@angular/forms';

import { DevelarCommonsModule }    from '../develar-commons/develar-commons.module';


import { SaludModule } from '../salud/salud.module';
import { SaludFormsRoutingModule } from './salud-forms-routing.module';
import { EpidemioInvestigPageComponent } from './pages/epidemio-investig-page/epidemio-investig-page.component';
import { InvestigEpidemioEditComponent } from './components/investig-epidemio-edit/investig-epidemio-edit.component';


@NgModule({
  declarations: [EpidemioInvestigPageComponent, InvestigEpidemioEditComponent],
  imports: [
    CommonModule,
    SaludFormsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DevelarCommonsModule,
    SaludModule,
  ]
})
export class SaludFormsModule { }
