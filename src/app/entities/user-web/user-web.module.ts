import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }          from '@angular/forms';

import { NgxDatatableModule }      from '@swimlane/ngx-datatable';
import { UserWebRoutingModule } from './user-web-routing.module';
import { DevelarCommonsModule } from '../../develar-commons/develar-commons.module';
import { UserWebRecuperarPasswordComponent } from './user-web-recuperar-password/user-web-recuperar-password.component';
import { UserWebFormRegistroEditComponent } from './user-web-form-registro-edit/user-web-form-registro-edit.component';
import { UserWebIngresarComponent } from './user-web-ingresar/user-web-ingresar.component';
import { PersonModule } from '../person/person.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    UserWebRoutingModule,
    DevelarCommonsModule,
    PersonModule
  ],
  declarations: [
      UserWebRecuperarPasswordComponent,
      UserWebFormRegistroEditComponent,
      UserWebIngresarComponent
  ],
  exports:[
    UserWebFormRegistroEditComponent
  ],
  providers: [],
  entryComponents: []

})
export class UserWebModule { }
