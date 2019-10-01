import { Component, OnInit, Input, Output, HostListener, EventEmitter } from '@angular/core';

import { Product, ProductBaseData, productModel }    from '../product.model';
import { ProductController }    from '../product.controller';

import { Observable ,  Subject}        from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap }   from 'rxjs/operators';



@Component({
  selector: 'product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {
  @Output() emmitProduct: EventEmitter<Product> = new EventEmitter<Product>();

 public products: Observable<Product[]>;

 private searchTerms = new Subject<string>();

  constructor(
    private productCtrl: ProductController
  	) { }

  ngOnInit() {

    this.products = this.searchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => this.productCtrl.searchBySlug(term))
      );
  }


  search(term){
    this.searchTerms.next(term)
  }

  selectEntity(product){
    if(product){
    	console.log('has product')
    	this.emmitProduct.next(product);
    }
  }


}

