import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CardGraph, graphUtilities } from '../../../../develar-commons/asset-helper';
import { Subject } from 'rxjs';

import {  UpdateItemListEvent } from '../../../../entities/person/person';

const CORE = 'core';
const TOKEN_TYPE = 'assets';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';


@Component({
  selector: 'person-assets-panel',
  templateUrl: './person-assets-panel.component.html',
  styleUrls: ['./person-assets-panel.component.scss']
})
export class PersonAssetsPanelComponent implements OnInit {
	@Input() assetList: Array<CardGraph>;
	@Output() updateAssets = new EventEmitter<UpdateItemListEvent>();

  public addAssetToList = new Subject<CardGraph>();


  public title = 'Archivos digitales';
	public showList = false;
	public showEdit = false;

  public showAddresses = false;
  public openEditor = true;

  constructor() { }

  ngOnInit() {
  	if(this.assetList && this.assetList.length){
			this.assetList = graphUtilities.buildGraphList('image', this.assetList);
  		this.showList = true;
  	}
  }

  deleteItem(t:CardGraph){
    let index = this.assetList.indexOf(t);

    if(index !== -1){
      this.assetList.splice(index, 1)
    } 
  }

  addItem(){
    this.showEdit = true;

  }

  createCardGraphFromAsset(asset){
    let card = graphUtilities.cardGraphFromAsset('asset', asset, 'documento');
    console.log('emitONCE')
    this.addAssetToList.next(card);
  }

  onSubmit(){
    this.emitEvent(UPDATE);
  }

  onCancel(){
  	this.emitEvent(CANCEL);
  }

  emitEvent(action: string){
    this.showEdit = false;

  	if(action !== CANCEL){
  		this.updateAssets.next({
  		action: action,
  		type: TOKEN_TYPE,
  		items: this.assetList
  	});
  	}
  }

}
