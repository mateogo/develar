import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';
import { Subject } from 'rxjs';

import { Product, ProductBaseData }    from '../product.model';

import { Tag }        from '../../../develar-commons/develar-entities';

import { ProductController } from '../product.controller';

const LIST = '../';
const EDIT = '../';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

	pageTitle: string = 'Alta nueva carpeta';

	public model: Product;
  private modelId: string;


  // valores default para el medium-editor para campo descripción
  public meContent: string = '';
  public mePlaceholder: string = 'Descripción';

  public basicData: ProductBaseData;
  private modelListener: Subject<Product>;
  private tags: Tag[] = [];


  constructor(
    private modelCtrl: ProductController,
    private router: Router,
    private route: ActivatedRoute,
  	) { 
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id')
    this.modelListener = this.modelCtrl.getModelListener();

    this.modelListener.subscribe(model =>{
      this.model = model;
      this.basicData = this.modelCtrl.getBasicData();
    })

    this.modelCtrl.initProductEdit(this.model, id);

  }


  /*********  SAVE & ?? **********/
  save(target:string){
    this.modelCtrl.saveRecord().then(model =>{
        if(target === 'navigate'){
          this.closeEditor(LIST);

        }else if(target === 'continue'){
          this.continueEditing(model);

        }
    })
  }
  

  /*********  CONTINUE OR LEAVE **********/
  continueEditing(model){
    this.model = model;
    this.modelCtrl.getBasicData();
    this.modelId = model._id;
    this.router.navigate(['../', this.modelId], { relativeTo: this.route });
    //delete this.model._id;
  }

  closeEditor(target){
    this.router.navigate([target], { relativeTo: this.route });
  }

  editCancel(){
    this.closeEditor(LIST);
  }

}
