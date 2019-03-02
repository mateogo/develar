import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }          from '@angular/forms';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

import { DevelarCommonsModule }    from '../../../develar-commons/develar-commons.module';

import { UserSignIn1Component,DialogUserComponent } from './sign-in-1/sign-in-1.component';

import { PageConfirmComponent } from './confirm/confirm.component';
import { PageForgotComponent }  from './forgot/forgot.component';
import { RegistrarUsuario }     from './sign-up-external/sign-up.component';


import { LoginRoutingModule }     from './login-routing.module';
import { CredentialsComponent } from './credentials/credentials.component';
//import { UserService }            from '../user.service';

//InMemoryWebApiModule.forRoot(InMemoryDataService),

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    DevelarCommonsModule
  ],
  declarations: [
    PageConfirmComponent,
    PageForgotComponent,
    UserSignIn1Component,
    RegistrarUsuario,
    DialogUserComponent,
    CredentialsComponent
  ],
  exports:[
    UserSignIn1Component,
    RegistrarUsuario,  
  ],
  providers: [],
  entryComponents: [DialogUserComponent]

})
export class LoginModule { }
