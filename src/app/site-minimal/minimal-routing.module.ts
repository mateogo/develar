import { NgModule } from '@angular/core';
import { RouterModule, Routes }         from '@angular/router';

// site routed components
import { HomeComponent }             from './home/home.component';

import { MinimalistLayoutComponent } from './layouts/minimalist/minimalist.component';

import { PapersComponent }          from './papers/papers.component';
import { DetailCardComponent }      from './detail/detail-card/detail-card.component';
import { PortfolioPageComponent }   from './portfolio/portfolio-page/portfolio-page.component';
import { PortfolioDetailComponent } from './portfolio/portfolio-detail/portfolio-detail.component';
import { PostDetailContainerComponent } from './foros/post-detail-container/post-detail-container.component';

import { RegistroEmpresaPageComponent } from './comercio/registro-empresa-page/registro-empresa-page.component';
import { ComerciosLayoutComponent }       from './layouts/comercios-layout/comercios-layout.component';
import { DashboardComercioPageComponent } from './comercio/dashboard-comercio-page/dashboard-comercio-page.component';

import { Page404Component }          from '../develar-commons/errorpages/page-404.component';

const routes: Routes = [
  {
    path: 'ingresar',
    redirectTo: '/ingresar/login',
  },
  {
    path: 'red',
    component: MinimalistLayoutComponent,
    children: [

      {
        path: '',
        component: PortfolioPageComponent,
        pathMatch: 'full'
      },
      {
        path: 'info/:id',
        component: PortfolioPageComponent,
        pathMatch: 'full'
      },
      {
        path: ':id',
        component: PortfolioDetailComponent,
      },

    ]  
  },
  {
    path: 'navegar',
    component: MinimalistLayoutComponent,
    children: [
      {
        path: ':id',
        component: PostDetailContainerComponent,
      },
    ]  
  },
  {
    path: 'comercios',
    component: ComerciosLayoutComponent,
    children: [
      {
        path: 'registro/:id',
        component: DashboardComercioPageComponent,
      },
      {
        path: 'empresa/:id',
        component: RegistroEmpresaPageComponent,
      },
      {
        path: '',
        component: HomeComponent,
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
        path: 'info/:id',
        component: PortfolioPageComponent,
        pathMatch: 'full'
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
