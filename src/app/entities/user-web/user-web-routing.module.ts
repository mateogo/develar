import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserWebFormRegistroEditComponent } from './user-web-form-registro-edit/user-web-form-registro-edit.component';
import { UserWebIngresarComponent } from './user-web-ingresar/user-web-ingresar.component';
import { UserWebRecuperarPasswordComponent } from './user-web-recuperar-password/user-web-recuperar-password.component';

const routes: Routes = [
    {
      path: '',
      pathMatch: 'full',
      component: UserWebIngresarComponent,
    },
    {
      path: 'registrarse',
      pathMatch : 'full',
      component: UserWebFormRegistroEditComponent,
    },
    {
        path: 'recuperar-password',
        pathMatch : 'full',
        component : UserWebRecuperarPasswordComponent
    }
  
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class UserWebRoutingModule { }
  