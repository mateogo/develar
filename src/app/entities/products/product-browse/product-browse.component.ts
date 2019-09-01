import { Component, OnInit, Input, TemplateRef, ViewChild}  from '@angular/core';
import { Router }   from '@angular/router';

import { Observable }  from 'rxjs';

import { SharedService }   from '../../../develar-commons/shared-service';
import { DaoService }      from '../../../develar-commons/dao.service';

import { Product }         from '../product.model';



@Component({
  selector: 'product-browse',
  templateUrl: './product-browse.component.html',
  styleUrls: ['./product-browse.component.scss']
})
export class ProductBrowseComponent implements OnInit {
	@ViewChild('actionsTmpl', { static: true }) public actionsTemplate: TemplateRef<any>
  @ViewChild('viewTmpl', { static: true }) public viewTmpl: TemplateRef<any>
  public models: Product[] = [];

  @Input()
  set entities(models: Product[]){
    this.models = models;
    // models.subscribe((models: Product[]) => {
    //   this.models = models;
    // })
  }


	pageTitle: string = "Explorador de carpetas";

	selectedModel:  Product;

	columns = [];
	rows = [];
	loadingIndicator: boolean = true;

	getModels(): void{
		this.daoService.findAll<Product>('product')
			.then(models =>{
				this.models = models;
				setTimeout(()=>{this.loadingIndicator = false}, 1500);
			});

	}

  constructor(
  		private daoService: DaoService,
  		private _sharedService: SharedService
  	) { }

  ngOnInit() {
    this.columns = [
      {prop: 'code', name: 'Código', minWidth: 80, cellTemplate: this.viewTmpl},
      {prop: 'pclass', name: 'Clase', minWidth: 80, cellTemplate: this.viewTmpl},
      {prop: 'name', name: 'Producto', minWidth: 180, cellTemplate: this.viewTmpl},
      {prop: 'slug', name: 'Denominación', minWidth: 250},
      {prop: 'pume', name: 'UnMedida', minWidth: 80},
      {prop: 'estado', name: 'Estado', minWidth: 80},
      {prop: '_id', name: 'Acciones', minWidth: 90, sortable: false, cellTemplate: this.actionsTemplate},

    ];

    if(!(this.models && this.models.length)){
      this.getModels();
    }else{
      setTimeout(()=>{this.loadingIndicator = false}, 1500);
    }
  }

}
