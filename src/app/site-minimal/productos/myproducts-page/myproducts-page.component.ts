import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable, Subject } from 'rxjs';

import { SiteMinimalController } from '../../minimal.controller';
import { ProductController } from '../../../entities/products/product.controller';
import { RecordCard } from '../../recordcard.model';



@Component({
  selector: 'myproducts',
  templateUrl: './myproducts-page.component.html',
  styleUrls: ['./myproducts-page.component.scss']
})
export class MyproductsPageComponent implements OnInit {


	//template helpers
	public showBusiness = false;



	//
	private lisnr: Subject<boolean>;
  constructor(
  		private minimalCtrl: SiteMinimalController,
    	private router: Router,
    	private route: ActivatedRoute,
    	private productCtrl: ProductController
  	) { }

  ngOnInit() {
  	this.lisnr = this.productCtrl.initMyProductsListener();

  	this.lisnr.subscribe(onReady => {
  		this.showBusiness = true;
  	})


  }

}
