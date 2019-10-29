import { Component, OnInit, Input, Output, HostListener, EventEmitter } from '@angular/core';

import { Product, ProductBaseData, productModel }    from '../product.model';
import { ProductController }    from '../product.controller';

import { Observable ,  Subject}        from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap }   from 'rxjs/operators';



@Component({
  selector: 'product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {
  @Output() emmitProduct: EventEmitter<Product> = new EventEmitter<Product>();

 public products: Observable<Product[]>;

 private searchTerms = new Subject<string>();

 public openEditor = false;


  constructor(
    private productCtrl: ProductController
  	) { }

  ngOnInit() {

    this.products = this.searchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(t => t && t.length >2 && !(/[^a-z0-9,ñ\s]+/ig.test(t))),
        switchMap(term => this.productCtrl.searchBySlug(term))
      );
  }


  search(term){
    this.searchTerms.next(term)
  }

  selectEntity(product){
    if(product){
    	this.emmitProduct.next(product);
    }
  }

  editToken(){

  }


}

