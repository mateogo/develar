import { Component, OnInit, Input, Output, HostListener, EventEmitter } from '@angular/core';

import { Product, ProductBaseData, productModel }    from '../../../entities/products/product.model';

import { Observable ,  Subject}        from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap }   from 'rxjs/operators';

import { DsocialController } from '../../dsocial.controller';


@Component({
  selector: 'almacen-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class AlmacenSearchComponent implements OnInit {
  @Output() emmitProduct: EventEmitter<Product> = new EventEmitter<Product>();

 public products: Observable<Product[]>;

 private searchTerms = new Subject<string>();

 public openEditor = false;

  constructor(
     private dsCtrl: DsocialController,
  	) { }

  ngOnInit() {

    this.products = this.searchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(t => t && t.length >2 && !(/[^a-z0-9]+/ig.test(t))),
        switchMap(term => this.dsCtrl.searchBySlug(term))
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
