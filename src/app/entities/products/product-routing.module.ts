import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductComponent }       from './product/product.component';
import { ProductitComponent }     from './productit/productit.component';
import { ProductsnComponent }     from './productsn/productsn.component';
import { ProductBrowseComponent } from './product-browse/product-browse.component';

const routes: Routes = [
  {
    path: '',
    component: ProductBrowseComponent,
    pathMatch: 'full'
  },
  {
    path: 'alta',
    component: ProductComponent,
  },
  {
    path: 'items',
    component: ProductitComponent,
  },
  {
    path: 'seriales',
    component: ProductsnComponent,
  },
  {
    path: ':id',
    component: ProductComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
