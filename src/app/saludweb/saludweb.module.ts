import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DevelarCommonsModule} from '../develar-commons/develar-commons.module'

import { SaludwebRoutingModule } from './saludweb-routing.module';
import { SaludwebService } from './saludweb.service';

import { SaludwebDashboardComponent } from './dashboard/saludweb-dashboard/saludweb-dashboard.component';
import { AutenticateFormComponent } from './autenticate/autenticate-form/autenticate-form.component';


@NgModule({
  declarations: [
    SaludwebDashboardComponent,
    AutenticateFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DevelarCommonsModule,

    SaludwebRoutingModule
  ],

  providers: [
    SaludwebService
  ]
  
})
export class SaludwebModule { }
