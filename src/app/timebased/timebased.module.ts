import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }          from '@angular/forms';

import { DevelarCommonsModule }    from '../develar-commons/develar-commons.module';

import { TimebasedRoutingModule } from './timebased-routing.module';

import { RolNocheEditComponent } from './rol-nocturnidad/rol-noche-edit/rol-noche-edit.component';
import { RolNocheViewComponent } from './rol-nocturnidad/rol-noche-view/rol-noche-view.component';
import { RolNocheBaseComponent } from './rol-nocturnidad/rol-noche-base/rol-noche-base.component';
import { RolNochePanelComponent } from './rol-nocturnidad/rol-noche-panel/rol-noche-panel.component';
import { RolNochePageComponent } from './time-pages/rol-noche-page/rol-noche-page.component';
import { RolNocheListComponent } from './rol-nocturnidad/rol-noche-list/rol-noche-list.component';

@NgModule({
  imports: [
      CommonModule,
      TimebasedRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      DevelarCommonsModule
  ],
  declarations: [	
      RolNocheEditComponent,
  		RolNocheViewComponent,
  		RolNocheBaseComponent,
  		RolNochePanelComponent,
  		RolNochePageComponent,
  		RolNocheListComponent
  	],
  exports: [  
      RolNocheEditComponent,
      RolNocheViewComponent,
      RolNocheBaseComponent,
      RolNochePanelComponent,
    ],
})
export class TimebasedModule { }
