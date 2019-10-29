import { Component, OnInit, OnDestroy, Input, Output, OnChanges, HostListener, EventEmitter } from '@angular/core';
import { Subject ,  Observable } from 'rxjs';

import { Product, Productsn, ProductEvent, ProductBaseData, productModel }    from '../product.model';
import { Person }    from '../../person/person';

import { ProductController }    from '../product.controller';

import { devutils } from '../../../develar-commons/utils';

@Component({
  selector: 'productsn-create',
  templateUrl: './productsn-create.component.html',
  styleUrls: ['./productsn-create.component.scss']
})
export class ProductsnCreateComponent implements OnInit {
	@Input() productBase: Product;
	
  @Input() actualOwner: Person;

	public productId: string = "";
	public productName:string = "";
	
  public actualOwnerId: string = "";
  public actualOwnerName:string = "";

  public codeList: string = "";
  public codeArray: Array<string> = [];



  public editable = true;

  constructor(
    private productCtrl: ProductController) { }

  ngOnInit() {
  	if(this.productBase){
  		this.productName = this.productBase.slug;
  		this.productId = this.productBase._id;
  	}

  	if(this.actualOwner){
  		this.actualOwnerName = this.actualOwner.displayName;
  		this.actualOwnerId = this.actualOwner._id;
  	}  	
  }

  save(target){
  	this.codeArray = this.buildCodeArray(this.codeList);

  	this.productCtrl.saveSerialList(this.codeArray, this.productBase, this.buildProductEvent());
  }

  buildProductEvent(): ProductEvent{
  	let pevent = new ProductEvent();
    let now = new Date();
  	pevent.estado = "activo";
  	pevent.eventType = 'alta';

  	pevent.fe = now.getTime();
  	pevent.feTxt = devutils.txFromDate(now);

  	pevent.ownerId = this.actualOwnerId;
  	pevent.ownerName = this.actualOwnerName;
  	pevent.slug = this.productBase.slug;
  	pevent.locationId = this.actualOwnerId;
  	return pevent;
  }

  cancel(target){
  }

  buildCodeArray(data){
  	let mx = data.match(/(\d+)/g);

  	if(! (mx && mx.length)) return [];

  	let mstr = mx.map(token => '' + token);

  	return mstr;
  }


}
