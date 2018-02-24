import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router }            from '@angular/router';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { CardSearchService } from '../bookshelf-search.service';
import { RecordCard, cardHelper } from '../recordcard';
import { User }              from '../../entities/user/user';
import { UserService }       from '../../entities/user/user.service';

@Component({
  selector: 'card-search',
  templateUrl: './bookshelf-search.component.html',
  styleUrls: [ './bookshelf-search.component.scss' ],
  providers: [CardSearchService]
})
export class CardSearchComponent implements OnInit {
  cards: Observable<RecordCard[]>;
  private searchTerms = new Subject<any>();
  @Output() lookUpModels = new EventEmitter<Observable<RecordCard[]>>()

  public cardtypes = cardHelper.cardTypes;
  public cardcategories = cardHelper.cardCategories;
  public selectedType: string;
  public selectedCategory: string;
  public selectedSlug: string = '';
  public selectedTags: Array<string> = [];
  public componentCol = 'fichas';

  constructor(
    private cardSearchService: CardSearchService,
    private userService: UserService,
    private router: Router) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.selectedSlug = term;
    this.lookUpNow();
  }



  ngOnInit(): void {
    this.selectedType = cardHelper.cardTypes[0].val;
    this.cardcategories = cardHelper.getCategories(this.selectedType);
    this.selectedCategory = this.cardcategories[0].val;

    
    this.lookUpModels.emit(this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term =>    // switch to new observable each time the term changes
        // return the http search observable
        this.cardSearchService.search<RecordCard>(term) )
        //: Observable.of<RecordCard[]>([]))
      .catch(error => {
        // TODO: add real error handling
        return Observable.of<RecordCard[]>([]);
      }));

    // this.cards.subscribe((cards: Array<RecordCard>) => {
    //   console.log('SUBSCRIBE!!!!!!!!!![%s]', cards.length);
    //   //this.lookUpModels.emit(cards);
    // })  
  }

  lookUpNow(){
    this.searchTerms.next(this.getQuery(this.selectedSlug, this.selectedType, this.selectedCategory, this.selectedTags));
  }

  getQuery(slug, type, category, tags ){
    let q = {};

    if(slug){
      q['slug'] = slug;
    }

    if(type && type !== 'no_definido'){
      q['cardType'] = type;     
    }

    if(category && category !== 'no_definido'){
      q['cardCategory'] = category;     
    }

    if(tags && tags.length){
      q['taglist'] = tags;     

    }

    return q;
  }

  changeCardType(data){
    this.cardcategories = cardHelper.getCategories(data);
    this.selectedCategory = this.cardcategories[0].val;
    this.selectedType = data;
    this.lookUpNow();
  }

  changeCardCategory(data){
    //this.cardcategories = cardHelper.getCategories(data);
    this.selectedCategory = data;
    this.lookUpNow();
  }

  changeTags(tags:Array<string>){
    this.selectedTags = tags;
    this.lookUpNow();
  }

}



/***
  <div>
    <div *ngFor="let card of cards | async"
         (click)="gotoDetail(card)" class="search-result" >
      {{card.slug}}
    </div>
  </div>
*/