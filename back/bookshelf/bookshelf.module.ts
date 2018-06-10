import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }          from '@angular/forms';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { NgxDatatableModule }      from '@swimlane/ngx-datatable';

// Develar Modules
import { DevelarCommonsModule }    from '../develar-commons/develar-commons.module';

import { BookshelfRoutingModule } from './bookshelf-routing.module';
import { PersonModule }  from '../entities/person/person.module';
import { ProductModule } from '../entities/products/product.module';

import { BookshelfComponent }    from './bookshelf/bookshelf.component';
import { UnitcardComponent }     from './unitcard/unitcard.component';

import { RecordCardService }     from './bookshelf.service';
import { WorkGroupController }   from './workgroup/workgroup.controller';

import { CardsviewlistComponent } from './cardsviewlist/cardsviewlist.component';
import { CardsviewgridComponent } from './cardsviewgrid/cardsviewgrid.component';
import { UnitcardviewComponent }  from './unitcardview/unitcardview.component';
import { UnitcardeditComponent }  from './unitcardedit/unitcardedit.component';
import { ShowviewComponent }      from './showview/showview.component';
import { SubcardeditComponent }   from './subcardedit/subcardedit.component';
import { SubcardviewComponent }   from './subcardview/subcardview.component';
import { CardSearchComponent }    from './bookshelf-search/bookshelf-search.component';

import { CardgraphComponent }    from './cardgraph/cardgraph.component';
import { ProductgraphComponent } from './workgroup/productgraph/productgraph.component';
import { ProductTableComponent } from './workgroup/product-table/product-table.component';

import { GraphcontrollerComponent } from './cardgraphcontroller/graphcontroller.component';

import { ProjectDashboardComponent  } from './workgroup/project-dashboard/project-dashboard.component';
import { ProjectSelectorComponent }   from './workgroup/project-selector/project-selector.component';
import { ProjectProductComponent }    from './workgroup/project-product/project-product.component';
import { CardnoteeditorComponent }    from './cardnoteeditor/cardnoteeditor.component';
import { PublishComponent } from './publish/publish.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BookshelfRoutingModule,
    DevelarCommonsModule,
    NgxDatatableModule,
    PersonModule,
    ProductModule,
  ],

  declarations: [
  	BookshelfComponent, 
    ProjectDashboardComponent,
    ProjectSelectorComponent,
    ProjectProductComponent,
  	UnitcardComponent,
    CardsviewlistComponent,
    CardsviewgridComponent,
    UnitcardviewComponent,
    UnitcardeditComponent,
    ShowviewComponent, 
    SubcardeditComponent,
    SubcardviewComponent,
    CardSearchComponent,
    CardgraphComponent,
    CardnoteeditorComponent,
    ProductgraphComponent,
    ProductTableComponent,
    GraphcontrollerComponent,
    PublishComponent
  ],

  providers: [
  	RecordCardService, WorkGroupController
  ],

  exports: [
    CardsviewgridComponent,
    UnitcardviewComponent
  ],

  entryComponents: [
    SubcardeditComponent 
  ],

})
export class BookshelfModule { }
