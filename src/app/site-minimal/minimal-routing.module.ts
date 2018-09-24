import { NgModule } from '@angular/core';
import { RouterModule, Routes }         from '@angular/router';

// site routed components
import { HomeComponent }             from './home/home.component';

import { MinimalistLayoutComponent } from './layouts/minimalist/minimalist.component';
import { PapersComponent } from './papers/papers.component';
import { DetailCardComponent } from './detail/detail-card/detail-card.component';

import { Page404Component }          from '../develar-commons/errorpages/page-404.component';

const routes: Routes = [
  {
    path: 'ingresar',
    redirectTo: '/ingresar/login',
  },
  {
    path: '',
    component: MinimalistLayoutComponent,
    children: [
      {
        path: 'prueba',
        component: HomeComponent,
      },
      {
        path: 'view/:id',
        component: DetailCardComponent,
      },
      {
        path: 'publicaciones/:topic/:id',
        component: DetailCardComponent,
      },
      {
        path: 'publicaciones/:topic',
        component: PapersComponent,
      },

		  {
		    path: '',
  			component: HomeComponent,
		    pathMatch: 'full'
		  },

    ]
  }
];





@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
  	RouterModule
  ],
  declarations: []
})
export class MinimalRoutingModule {}
