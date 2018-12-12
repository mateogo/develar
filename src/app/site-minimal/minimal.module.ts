import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//modules
import { NgbModule }               from '@ng-bootstrap/ng-bootstrap';

import { DevelarCommonsModule }    from '../develar-commons/develar-commons.module';
import { BookshelfModule } from '../bookshelf/bookshelf.module';
import { MinimalRoutingModule } from './minimal-routing.module';


//site component
import { HomeComponent } from './home/home.component';

import { MinimalistLayoutComponent } from './layouts/minimalist/minimalist.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { TopBrandingComponent } from './top-branding/top-branding.component';
import { TopAboutComponent } from './top-about/top-about.component';
import { TopAboutlrComponent } from './top-about-lr/top-aboutlr.component';

import { SiteMinimalController } from './minimal.controller';
import { HighlightService } from './minimal-highlighter.service';
import { DestacadoComponent } from './destacado/destacado.component';
import { TopServiciosComponent } from './top-servicios/top-servicios.component';
import { TopContactoComponent } from './top-contacto/top-contacto.component';
import { PapersComponent } from './papers/papers.component';
import { DetailCardComponent } from './detail/detail-card/detail-card.component';
import { ShowAssetsComponent } from './detail/show-assets/show-assets.component';
import { ShowResourcesComponent } from './detail/show-resources/show-resources.component';
import { TopCarrouselComponent } from './top-carrousel/top-carrousel.component';
import { TopFooterComponent } from './top-footer/top-footer.component';
import { PbaLayoutComponent } from './layouts/pba-layout/pba-layout.component';
import { PbaNavbarComponent } from './layouts/pba-navbar/pba-navbar.component';
import { HomePbaComponent } from './home-pba/home-pba.component';
import { AntecedentesPageComponent } from './antecedentes/antecedentes-page/antecedentes-page.component';
import { SearchPersonComponent } from './antecedentes/search-person/search-person.component';
import { SearchAntecedentesComponent } from './antecedentes/search-antecedentes/search-antecedentes.component';
import { SearchScoringComponent } from './antecedentes/search-scoring/search-scoring.component';




@NgModule({
  imports: [
    MinimalRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DevelarCommonsModule,
    BookshelfModule,
  ],
  declarations: [
  	MinimalistLayoutComponent,
  	HomeComponent,
  	NavbarComponent,
  	TopBrandingComponent,
  	TopAboutComponent,
    TopAboutlrComponent,
  	DestacadoComponent,
    TopFooterComponent,
  	TopServiciosComponent,
  	TopContactoComponent,
  	PapersComponent,
  	DetailCardComponent,
  	ShowAssetsComponent,
  	ShowResourcesComponent,
  	TopCarrouselComponent,
  	PbaLayoutComponent,
  	PbaNavbarComponent,
  	HomePbaComponent,
  	AntecedentesPageComponent,
  	SearchPersonComponent,
  	SearchAntecedentesComponent,
  	SearchScoringComponent
  ],
  providers:[
    SiteMinimalController, HighlightService
  ]
})
export class MinimalModule { }
