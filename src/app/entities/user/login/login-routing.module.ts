import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageConfirmComponent } from './confirm/confirm.component';
import { PageForgotComponent }  from './forgot/forgot.component';
import { UserSignIn1Component } from './sign-in-1/sign-in-1.component';
import { RegistrarUsuario }     from './sign-up-external/sign-up.component';
import { CredentialsComponent } from './credentials/credentials.component';


const routes: Routes = [
  {
    path: 'login',
    component: UserSignIn1Component,
  },
  {
    path: 'registrarse',
    component: RegistrarUsuario,
  },
  { 
    path: 'nuevaclave',
    component: PageForgotComponent 
  },
  {
    path: 'confirmar/:id',
    component: PageConfirmComponent,
  },
  {
    path: 'confirmar',
    component: PageConfirmComponent,
  },
  {
    path: 'clave/:id',
    component: CredentialsComponent,
  },
  {
    path: '',
    redirectTo: '/ingresar/login',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
