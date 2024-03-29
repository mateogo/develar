import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Develar tests
import { GcseComponent } from './develar-commons/gcse/gcse.component';
import { CrawlerComponent } from './develar-commons/crawler/crawler.component';
import { UploadComponent } from './develar-commons/upload/upload.component';
import { AssetcreateComponent } from './develar-commons/assets/assetcreate/assetcreate.component';
import { FoldercreateComponent } from './develar-commons/folders/foldercreate/foldercreate.component';
import { FolderBrowseComponent } from './develar-commons/folders/folder-browse/folder-browse.component';
import { TagComponent } from './develar-commons/tags/tags/tags.component';
import { ChipsDemo } from './develar-commons/tags/tags/chip.demo';


//Layouts
import { DefaultLayoutComponent } from './develar-commons/layouts/default/default.component';
import { ExtraLayoutComponent } from './develar-commons/layouts/extra/extra.component';
import { PresentacionLayoutComponent } from './develar-commons/layouts/presentacion/presentacion.component';
import { WorkgroupLayoutComponent } from './develar-commons/layouts/workgroup/workgroup.component';
//import { MinimalistLayoutComponent }    from './site-minimal/layouts/minimalist/minimalist.component';

// Error pages
import { Page404Component } from './develar-commons/errorpages/page-404.component';
//import { Page500Component }             from './develar-commons/errorpages/page-500.component';


// Components
import { CommunityCreateComponent } from './develar-commons/community/community-create/community-create.component';
import { EnterSiteComponent } from './develar-commons/enter-site/enter-site.component';
import { AdminScriptsComponent } from './develar-commons/admin-scripts/admin-scripts.component';
import { MustNotBeAWebUserGuard } from './develar-commons/guards/mustnotbeawebuser-guard';
import { MustBeLoggedInGuard } from './develar-commons/guards/mustbeloggedin-guard';


const defaultAdminRoute: Routes = [
  {
    path: '',
    component: CommunityCreateComponent,
    pathMatch: 'full'
  },
];

const a2Routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./a2/a2.module').then(m => m.A2Module)
  }
];

const personRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./entities/person/person.module').then(m => m.PersonModule)
  },
];

const userRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./entities/user/user/user.module').then(m => m.UserModule)
  },
];

const userWebRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./entities/user-web/user-web.module').then(m => m.UserWebModule)
  },
];

const turnoModuleRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./entities/turnos/turnos.module').then(m => m.TurnosModule)
  }
];

const consultaModuleRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./entities/consultas/consultas.module').then(m => m.ConsultasModule)
}
];

const locacionRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./entities/locaciones/locacion.module').then(m => m.LocacionHospitalariaModule)
  },
];

const productRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./entities/products/product.module').then(m => m.ProductModule)
  },
];

const testRoutes: Routes = [
  { path: 'gcse', component: GcseComponent },
  { path: 'crawler', component: CrawlerComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'assets', component: AssetcreateComponent },
  { path: 'folder', component: FoldercreateComponent },
  { path: 'folders', component: FolderBrowseComponent },
  { path: 'folder/:id', component: FoldercreateComponent },
  { path: 'tags', component: TagComponent },
  { path: 'chips', component: ChipsDemo },
];


const communityRoutes: Routes = [
  { path: '', component: CommunityCreateComponent },
];


const bookshelfRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./bookshelf/bookshelf.module').then(m => m.BookshelfModule)
  },
];

const entityRoutes: Routes = [
  { path: 'personas', children: personRoutes },
  { path: 'productos', children: productRoutes },
  { path: 'usuarios', children: userRoutes },
  { path: 'locaciones', children: locacionRoutes },
  { path: 'usuariosweb', children: userWebRoutes }
];

const afterLogin: Routes = [
  { path: '', component: EnterSiteComponent },
];

const loginRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./entities/user/login/login.module').then(m => m.LoginModule)
  }
];

const notificationRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule)
  }
];

const dsocialModuleRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./dsocial/dsocial.module').then(m => m.DsocialModule)
  }
];

const saludModuleRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./salud/salud.module').then(m => m.SaludModule)
  }
];

const saludFormulariosModuleRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./saludforms/salud-forms.module').then(m => m.SaludFormsModule)
  }
];

const coordinacionModuleRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./icoordinacion/centro-operaciones.module').then(m => m.CentroOperacionesInternacionModule)
  }
];

const locacionInternacionModuleRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./ilocacion/locacion.module').then(m => m.LocacionInternacionModule)
  }
];

const cckGestionRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./sisplan/sisplan.module').then(m => m.SisplanModule)
  }
];

const dashboardRoutes : Routes = [
  {
    path : '',
    component : PresentacionLayoutComponent,
    loadChildren : () => import ('./industriales/industriales.module').then( m => m.IndustrialesModule)
  }
]

const saludwebRoutes: Routes = [
  {
    path : '',
    component : PresentacionLayoutComponent,
    loadChildren : () => import ('./saludweb/saludweb.module').then( m => m.SaludwebModule)
  },
];

const tramitesRoutes: Routes = [
  {
    path : 'misconsultas',
    component : DefaultLayoutComponent,
    loadChildren : () => import ('./saludweb/saludweb.module').then( m => m.SaludwebModule)
  },
];



const webRoutes: Routes = [
  {
    path: 'gestion',
    component: DefaultLayoutComponent,
    children: dsocialModuleRoutes
  },
  {
    path: 'tarjeta',
    component: PresentacionLayoutComponent,
    children: dsocialModuleRoutes
  },
  {
    path: 'internacion',
    component: PresentacionLayoutComponent,
    loadChildren: () => import('./entities/locaciones/locacion.module').then(m => m.LocacionHospitalariaModule)
  },
  {
    path: 'salud',
    component: PresentacionLayoutComponent,
    children: saludModuleRoutes
  },
];

const dsocialRoutes: Routes = [
  {
    path: 'gestion',
    component: DefaultLayoutComponent,
    children: dsocialModuleRoutes
  },
];

const saludRoutes: Routes = [
  {
    path: 'gestion',
    component: DefaultLayoutComponent,
    children: saludModuleRoutes
  },
  {
    path: 'coordinacion',
    component: DefaultLayoutComponent,
    children: coordinacionModuleRoutes
  },
  {
    path: 'formularios',
    component: DefaultLayoutComponent,
    children: saludFormulariosModuleRoutes
  },
  {
    path: 'internacion',
    component: DefaultLayoutComponent,
    children: locacionInternacionModuleRoutes
  },

  {
    path: 'entidades',
    component: DefaultLayoutComponent,
    children: entityRoutes
  },
];

const cckRoutes: Routes = [
  {
    path: 'gestion',
    component: DefaultLayoutComponent,
    children: cckGestionRoutes
  },
];

const alimentarRoutes: Routes = [
  {
    path: 'gestion',
    component: PresentacionLayoutComponent,
    children: dsocialModuleRoutes
  },
];

const adminScriptsRoutes : Routes = [
  {
    path: '',
    pathMatch : 'full',
    component : AdminScriptsComponent
  }
]


const censoRoutes: Routes = [
  {
    path: '',
    component: PresentacionLayoutComponent,
    loadChildren: () => import('./entities/censo-industrial/censo-industrial.module').then(m => m.CensoIndustrialModule)
  }
];

const adminRoutes: Routes = [
  {
    path: 'fichas',
    component: DefaultLayoutComponent,
    children: bookshelfRoutes
  },
  {
    path: 'presentacion',
    component: PresentacionLayoutComponent,
    children: bookshelfRoutes
  },
  {
    path: 'entidades',
    component: DefaultLayoutComponent,
    children: entityRoutes
  },
  {
    path: 'turnos',
    component: DefaultLayoutComponent,
    children: turnoModuleRoutes
  },
  {
    path: 'consultas',
    component: DefaultLayoutComponent,
    children: consultaModuleRoutes
  },
  {
    path : 'adminscripts',
    component : DefaultLayoutComponent,
    children : adminScriptsRoutes
  },
  {
    path: 'proyectos',
    component: WorkgroupLayoutComponent,
    children: bookshelfRoutes
  },
  {
    path: 'notificaciones',
    component: DefaultLayoutComponent,
    children: notificationRoutes
  },
  {
    path: 'censos',
    component: DefaultLayoutComponent,
    children: censoRoutes
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: defaultAdminRoute
  },
];



const mainRoutes: Routes = [
  {
    path: 'gestion',
    children: adminRoutes
  },
  {
    path: 'nocturnidad',
    loadChildren: () => import('./timebased/timebased.module').then(m => m.TimebasedModule)
  },
  {
    path: 'industrias',
    loadChildren: () => import('./empresas/empresas.module').then(m => m.EmpresasModule)
  },
  {
    path: '',
    loadChildren: () => import('./site-minimal/minimal.module').then(m => m.MinimalModule)
  },

];

const develarRoutes: Routes = [
  {
    path: 'a2',
    component: DefaultLayoutComponent,
    children: a2Routes
  },
  {
    path: 'comunidades',
    component: DefaultLayoutComponent,
    children: communityRoutes
  },
  {
    path: 'empresas',
    component: DefaultLayoutComponent,
    loadChildren: () => import('./empresas/empresas.module').then(m => m.EmpresasModule)
  },
  {
    path: '',
    children: adminRoutes
  },

];


const routes: Routes = [
  {
    path: 'test',
    component: DefaultLayoutComponent,
    children: testRoutes
  },
  {
    path: 'develar',
    canActivate : [MustNotBeAWebUserGuard],
    children: develarRoutes
  },
  {
    path: 'ingresar',
    component: ExtraLayoutComponent,
    children: loginRoutes
  },
  {
    path: 'dashboard',
    canActivate : [MustBeLoggedInGuard],
    children : dashboardRoutes
  },
  {
    path: 'usuariosweb',
    component: ExtraLayoutComponent,
    children: userWebRoutes
  },
  {
    path: 'ingresando',
    component: ExtraLayoutComponent,
    children: afterLogin
  },
  {
    path: 'seguridadvial',
    children: mainRoutes
  },
  {
    path: 'cck',
    children: cckRoutes
  },
  {
    path: 'dsocial',
    children: dsocialRoutes
  },
  {
    path: 'misconsultas',
    children: saludwebRoutes
  },
  {
    path: 'tramites',
    children: tramitesRoutes
  },
  {
    path: 'web',
    children: webRoutes
  },
  {
    path: 'salud',
    children: saludRoutes
  },
  {
    path: 'alimentar',
    children: alimentarRoutes
  },
  {
    path: 'notas',
    children: mainRoutes
  },
  {
    path: 'trabajan',
    children: mainRoutes
  },
  {
    path: 'mab',
    component: PresentacionLayoutComponent,
    children: mainRoutes
  },
  {
    path: 'rol',
    component: DefaultLayoutComponent,
    children: mainRoutes
  },
  {
    path: '',
    children: mainRoutes,
    pathMatch: 'full'
  },
  {
    path: ':community',
    children: mainRoutes
  },
  {
    path: '**',
    component: Page404Component,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false, enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
