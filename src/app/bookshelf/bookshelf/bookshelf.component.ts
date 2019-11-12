import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { RecordCard }         from '../recordcard';
import { CardSearchService }  from '../bookshelf-search.service';
import { Observable }         from 'rxjs';
import { SharedService }      from '../../develar-commons/shared-service';

// Observable class extensions

@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.scss'],
  providers: [CardSearchService]
})
export class BookshelfComponent implements OnInit {

	//models: Observable<RecordCard[]>;
  models: RecordCard[] = [];
  pageTitle = 'Dashboard';

	getModels(): void{
		this.recordcardService.defaultSearch<RecordCard>().subscribe(cards => {
      this.models = cards;
    })

	}


  constructor(
  		private recordcardService: CardSearchService,
      private _sharedService: SharedService

  	) { 
    this._sharedService.emitChange(this.pageTitle)

  }

  lookup(cards: Observable<RecordCard[]>){
    //this.models = cards.switchMap((cards) => Observable.of(cards));
    cards.subscribe(cards =>{
      this.models = cards;
    }, 
    (err) => {
      console.log('error en Lookup BookshelfComponent (HttpErrorResponse)')
    });
    //this.models = cards;
  }

  ngOnInit() {
  	this.getModels();
  }

  gotoDetail(card: RecordCard){
    console.log('gotoDetail');

  }

  searchCards(query: string){
    console.log('searchCARDS BEGIN');

  }

}

// "typescript_tsdk": "/Users/mateogomezortega/Repositorios/develar/develar-6/node_modules/typescript/lib" 

