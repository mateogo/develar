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
    this.updateTableList();
    this.model$.next(this.model);
  }

  updateKit(token: UpdateProductEvent){
  	this.productCtrl.manageKits(token).subscribe(m => {
      this.updateTableList();
  	})

  }

  updateTableList(){
    this.productCtrl.fetchKits('productkit', {})
  }


  actionTriggered(e){
    if(e === "editone"){
      this.editOneKit()
      
    } else if(e === "deleteone"){
      this.deleteOneKit()

    }
    //fetchSelectedProductKitList

  }

  editOneKit(){
    let kit:KitProduct[] = this.productCtrl.fetchSelectedProductKitList();
    if(kit && kit.length){
      this.model = kit[0];
      this.model$.next(this.model);
    }
  }  

  deleteOneKit(){
    let kit:KitProduct[] = this.productCtrl.fetchSelectedProductKitList();
    if(kit && kit.length){
      this.productCtrl.deleteKit(kit[0]._id);
      setTimeout(()=>{
        this.updateTableList();
      },1000);
    }
  }  

}
