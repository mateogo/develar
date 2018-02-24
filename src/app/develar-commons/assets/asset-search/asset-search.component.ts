import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/switchMap'

import { AssetService } from '../../asset.service';
import { Asset } from '../../develar-entities';

@Component({
  selector: 'asset-search',
  templateUrl: './asset-search.component.html',
  styleUrls: ['./asset-search.component.scss']
})
export class AssetSearchComponent implements OnInit {
	@Output() lookUpModels = new EventEmitter<Asset>();
	assets: Observable<Asset[]>;
	searchTerms = new Subject<string>();


  constructor(
  	private assetService: AssetService,
  	private router: Router
  	) { }

  ngOnInit() {


  	this.assets = this.searchTerms
  			.debounceTime(300)
  			.distinctUntilChanged()
  			.switchMap(term => term
  				? this.assetService.search(term)
  				: Observable.of<Asset[]>([])
  			)
  			.catch(error => {
  				return Observable.of<Asset[]>([]);
  			});

    this.assets.subscribe(assets => {
      console.log(assets.length);
    })



  }

  search(term: string):void{
  	this.searchTerms.next(term);
  }

  selectEntity(asset:Asset){
    console.log('AssetSelected:[%s]', asset.slug);
    this.lookUpModels.emit(asset);
  }



}
