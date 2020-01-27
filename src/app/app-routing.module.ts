import { NgModule }                     from '@angular/core';
import { RouterModule, Routes }         from '@angular/router';

//Develar tests
import { GcseComponent }                from './develar-commons/gcse/gcse.component';
import { CrawlerComponent }             from './develar-commons/crawler/crawler.component';
import { UploadComponent }              from './develar-commons/upload/upload.component';
import { AssetcreateComponent }         from './develar-commons/assets/assetcreate/assetcreate.component';
import { FoldercreateComponent }        from './develar-commons/folders/foldercreate/foldercreate.component';
import { FolderBrowseComponent }        from './develar-commons/folders/folder-browse/folder-browse.component';
import { TagComponent }                 from './develar-commons/tags/tags/tags.component';
import { ChipsDemo }                    from './develar-commons/tags/tags/chip.demo';


//Layouts
import { DefaultLayoutComponent }       from './develar-commons/layouts/default/default.component';
import { ExtraLayoutComponent }         from './develar-commons/layouts/extra/extra.component';
import { PresentacionLayoutComponent }  from './develar-commons/layouts/presentacion/presentacion.component';
import { WorkgroupLayoutComponent }     from './develar-commons/layouts/workgroup/workgroup.component';
//import { MinimalistLayoutComponent }    from './site-minimal/layouts/minimalist/minimalist.component';

// Error pages
import { Page404Component }             from './develar-commons/errorpages/page-404.component';
//import { Page500Component }             from './develar-commons/errorpages/page-500.component';


// Components 
import { CommunityCreateComponent }     from './develar-commons/community/community-create/community-create.component';
import { EnterSiteComponent }            from './develar-commons/enter-site/enter-site.component';


const defaultAdminRoute: Routes = [
  {
    path: '',
    component: CommunityCreateComponent ,
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
  { path: 'personas',  children:  personRoutes },
  { path: 'productos', children:  productRoutes },
  { path: 'usuarios',  children:  userRoutes },
];

const afterLogin: Routes = [
  { path: '',          component:  EnterSiteComponent },
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

const ayudaSocialRoutes: Routes = [
  {
    path: '', 
    loadChildren: () => import('./dsocial/dsocial.module').then(m => m.DsocialModule)
  }
];

const cckGestionRoutes: Routes = [
  {
    path: '', 
    loadChildren: () => import('./sisplan/sisplan.module').then(m => m.SisplanModule)
  }
];

const dsocialRoutes: Routes = [
  {
    path: 'gestion',
    component: DefaultLayoutComponent,
    children: ayudaSocialRoutes
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
    children: ayudaSocialRoutes
  },
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
    path: '',
    component: DefaultLayoutComponent,
    children: defaultAdminRoute
  },
];


const mainRoutes:Routes = [
  {
    path: 'gestion',
    children: adminRoutes
  },
  { 
    path: 'nocturnidad', 
    loadChildren: () => import('./timebased/timebased.module').then(m => m.TimebasedModule)
  },
  { 
    path: '', 
    loadChildren: () => import('./site-minimal/minimal.module').then(m => m.MinimalModule)
  },

];

const develarRoutes:Routes = [
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
    children: develarRoutes
  },
  {
    path: 'ingresar',
    component: ExtraLayoutComponent,
    children: loginRoutes
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
  imports: [ RouterModule.forRoot(routes, {useHash: false , enableTracing: false}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
