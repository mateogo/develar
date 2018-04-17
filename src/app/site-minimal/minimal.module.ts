import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//modules

import { DevelarCommonsModule }    from '../develar-commons/develar-commons.module';
import { BookshelfModule } from '../bookshelf/bookshelf.module';
import { MinimalRoutingModule } from './minimal-routing.module';


//site component
import { HomeComponent } from './home/home.component';

import { MinimalistLayoutComponent } from './layouts/minimalist/minimalist.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { TopBrandingComponent } from './top-branding/top-branding.component';
import { TopAboutComponent } from './top-about/top-about.component';
import { SiteMinimalController } from './minimal.controller';
import { HighlightService } from './minimal-highlighter.service';
import { DestacadoComponent } from './destacado/destacado.component';
import { TopServiciosComponent } from './top-servicios/top-servicios.component';
import { TopContactoComponent } from './top-contacto/top-contacto.component';
import { PapersComponent } from './papers/papers.component';
import { DetailCardComponent } from './detail/detail-card/detail-card.component';
import { ShowAssetsComponent } from './detail/show-assets/show-assets.component';
import { ShowResourcesComponent } from './detail/show-resources/show-resources.component';

HighlightService
@NgModule({
  imports: [
    MinimalRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DevelarCommonsModule,
    BookshelfModule,
  ],
  declarations: [
  	MinimalistLayoutComponent,
  	HomeComponent,
  	NavbarComponent,
  	TopBrandingComponent,
  	TopAboutComponent,
  	DestacadoComponent,
  	TopServiciosComponent,
  	TopContactoComponent,
  	PapersComponent,
  	DetailCardComponent,
  	ShowAssetsComponent,
  	ShowResourcesComponent
  ],
  providers:[
    SiteMinimalController, HighlightService
  ]
})
export class MinimalModule { }
