import { NgModule } from '@angular/core';
import { RouterModule, Routes }         from '@angular/router';

// site routed components
import { HomeComponent }             from './home/home.component';
import { HomePbaComponent }             from './home-pba/home-pba.component';

import { MinimalistLayoutComponent } from './layouts/minimalist/minimalist.component';
import { PbaLayoutComponent }        from './layouts/pba-layout/pba-layout.component';

import { PapersComponent }     from './papers/papers.component';
import { DetailCardComponent } from './detail/detail-card/detail-card.component';

import { Page404Component }          from '../develar-commons/errorpages/page-404.component';

const routes: Routes = [
  {
    path: 'ingresar',
    redirectTo: '/ingresar/login',
  },
  {
    path: 'antecedentes',
    component: PbaLayoutComponent,
    children: [

      {
        path: '',
        component: HomePbaComponent,
        pathMatch: 'full'
      },

    ]  
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
