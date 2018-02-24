import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }          from '@angular/forms';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

import { NgxDatatableModule }      from '@swimlane/ngx-datatable';

import { DevelarCommonsModule }    from '../../../develar-commons/develar-commons.module';

import { UsersComponent }    from './user-list/users.component';
import { UserEditComponent } from './user-edit/user-edit.component';

import { UserRoutingModule }     from './user-routing.module';
import { UserChipComponent } from './user-chip/user-chip.component';
//import { UserService }            from '../user.service';

//InMemoryWebApiModule.forRoot(InMemoryDataService),

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    UserRoutingModule,
    DevelarCommonsModule
  ],
  declarations: [
    UsersComponent,
    UserEditComponent,
    UserChipComponent
  ],
  exports:[
    UserChipComponent
  ],
  providers: [],
  entryComponents: []

})
export class UserModule { }
