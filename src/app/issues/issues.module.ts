import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IssuesRoutingModule }   from './issues-routing.module';

import { IssuesController } from './issues-controller.service';

import { DevelarCommonsModule }  from '../develar-commons/develar-commons.module';




import { IssuesCreateComponent } from './issues-create/issues-create.component';

@NgModule({
  imports: [
    CommonModule,
    IssuesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DevelarCommonsModule,

  ],
  declarations: [
  	IssuesCreateComponent
	],
	providers:[
		IssuesController
	]
})
export class IssuesModule { }

