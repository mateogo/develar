import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }          from '@angular/forms';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

//import { InMemoryWebApiModule }    from 'angular-in-memory-web-api';
//import { InMemoryDataService }     from '../../devel/in-memory-data.service';


import { NgxDatatableModule }      from '@swimlane/ngx-datatable';

import { DevelarCommonsModule }    from '../../develar-commons/develar-commons.module';
import { PersonModule }  from '../person/person.module';


import { ProductRoutingModule }     from './product-routing.module';

import { ProductComponent }         from './product/product.component';
import { ProductsnAssignComponent }         from './productsn-asign/productsn-assign.component';

import { ProductitComponent }       from './productit/productit.component';
import { ProductsnComponent }       from './productsn/productsn.component';
import { ProductBrowseComponent }   from './product-browse/product-browse.component';
import { ProductController }        from './product.controller';
import { ProductBaseComponent }     from './product-base/product-base.component';
import { ProductitTableComponent }  from './productit-table/productit-table.component';
import { ProductsnTableComponent }  from './productsn-table/productsn-table.component';
import { ProductsnCreateComponent } from './productsn-create/productsn-create.component';
import { MyproductsPageComponent } from './myproducts-page/myproducts-page.component';

//InMemoryWebApiModule.forRoot(InMemoryDataService),

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    ProductRoutingModule,
    PersonModule,
    DevelarCommonsModule
  ],
  declarations: [
      ProductComponent,
      ProductsnAssignComponent,
      ProductitComponent,
      ProductsnComponent,
      ProductBaseComponent,
      ProductBrowseComponent,
      ProductitTableComponent,
      ProductsnTableComponent,
      ProductsnCreateComponent,
      MyproductsPageComponent
  ],
  exports: [ProductBaseComponent, MyproductsPageComponent],
  providers: [ProductController]
})
export class ProductModule { }
