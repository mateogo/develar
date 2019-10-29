import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Observable ,  Subject}        from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap }   from 'rxjs/operators';

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
  	this.assets = this.searchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => this.assetService.search(term))
      )

    this.assets.subscribe(assets => {

    })

  }

  search(term: string):void{
  	this.searchTerms.next(term);
  }

  selectEntity(asset:Asset){
    this.lookUpModels.emit(asset);
  }

}
