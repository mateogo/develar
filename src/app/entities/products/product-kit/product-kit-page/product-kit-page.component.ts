import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';
import { Subject } from 'rxjs';

import { Product, KitProduct, UpdateProductEvent }    from '../../product.model';

import { ProductController } from '../../product.controller';

const LIST = '../';
const EDIT = '../';


@Component({
  selector: 'product-kit-page',
  templateUrl: './product-kit-page.component.html',
  styleUrls: ['./product-kit-page.component.scss']
})
export class ProductKitPageComponent implements OnInit {

	pageTitle: string = 'Alta nueva carpeta';

	public model: KitProduct = new KitProduct();
  public model$ = new Subject<KitProduct>();

  private modelId: string;

  constructor(
    private productCtrl: ProductController,
    private router: Router,
    private route: ActivatedRoute,
  	) { 
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id')

    console.log('productCreate INIT [%s]', id)
    this.updateTableList();
    this.model$.next(this.model);
  }

  updateKit(token: UpdateProductEvent){
  	console.log('Bubbled!!!! [%s] [%s]', token.action, token.type)
  	this.productCtrl.manageKits(token).subscribe(m => {
      this.updateTableList();
  		console.log('Grabación exitosa [%s]', m._id)
  	})

  }

  updateTableList(){
    this.productCtrl.fetchKits('productkit', {})
  }


  actionTriggered(e){
    console.log('actionTrieggered [%s]', e)
    if(e === "editone"){
      this.editOneKit()
      
    } else if(e === "deleteone"){
      this.deleteOneKit()

    }
    //fetchSelectedProductKitList

  }

  editOneKit(){
    let kit:KitProduct[] = this.productCtrl.fetchSelectedProductKitList();
    console.log('EditONE: kit list [%s]', kit , kit&&kit.length)
    if(kit && kit.length){
      this.model = kit[0];
      this.model$.next(this.model);
    }
  }  

  deleteOneKit(){
    let kit:KitProduct[] = this.productCtrl.fetchSelectedProductKitList();
    console.log('DeleteONE: kit list [%s]', kit , kit&&kit.length)
    if(kit && kit.length){
      this.productCtrl.deleteKit(kit[0]._id);
      setTimeout(()=>{
        this.updateTableList();
      },1000);
    }
  }  

}
