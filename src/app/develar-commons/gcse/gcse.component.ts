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

import { GoogleSearchResponse, searchMachines } from '../develar-entities';
import { GcseService } from '../gcse.service';


@Component({
  selector: 'app-gcse',
  templateUrl: './gcse.component.html',
  styleUrls: ['./gcse.component.scss'],
  providers: [GcseService]
})
export class GcseComponent implements OnInit {
  @Output() recordThisRequest = new EventEmitter<GoogleSearchResponse>();


  private grecord: Observable<GoogleSearchResponse>;
  private searchTerms = new Subject<string>();

  private lookUpModels = new EventEmitter<Observable<GoogleSearchResponse>>();
  results:Array<any>;
  machine = 'community_prg';
  machines = searchMachines;
  targetUrl:string;

  constructor(
    private googleSearchService: GcseService,
    private router: Router) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    if(this.machine !== 'hack') this.searchTerms.next(term);
  }

  crawl(target: string): void {
    console.log('crawl: [%s]', target)
    this.targetUrl = target;
    //this.searchTerms.next(term);
  }

  showResultSet(items:Array<any>){
    this.results = items;
  }

  ngOnInit(): void {

    // this.searchTerms.subscribe(term => {
    //   //console.log('term Subscribed:[%s]', term)
    // })
    this.lookUpModels.subscribe({
      next: (ovble:Observable<GoogleSearchResponse>)=> {
        ovble.subscribe( data => {
          if(data) this.showResultSet(data.items)
        })
      }
    })

    this.lookUpModels.emit(this.searchTerms
      .debounceTime(600)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()
      .switchMap(term => {
        console.log('switch map')
        if(term){
          return this.googleSearchService.search(term);
        }else {
          return Observable.of<GoogleSearchResponse>(new GoogleSearchResponse());
        }
      })
      .catch(error => {
        // TODO: add real error handling
        return Observable.of<GoogleSearchResponse>(new GoogleSearchResponse());
      }));

  }

  open(event) {
    let clickedComponent = event.target.closest('.nav-item');
    let items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
    clickedComponent.classList.add('opened');
  }

  close(event) {
    let clickedComponent = event.target;
    let items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
  }

  saveURL(token){
    console.log('saveURL: [%s]', token.title)
    this.recordThisRequest.emit(token);
  }
  
  crawlURL(target){
    console.log('crawlURL: [%s]', target.title)
        this.targetUrl = target.link;
  }

  handleCrawlingData(sub:Subject<any>){
    sub.subscribe({
      next: (x) => {console.log('iajjjjjjjjuuuuuuuuuuuuuuuuu');}
    })
  }

  selectMachine(e, item){
    e.preventDefault();
    this.machine = item;
    console.log('Machine selected:[%s]', this.machine)
    e.target.closest('.nav-item').classList.remove('opened');
    if(this.machine !== 'hack') this.googleSearchService.setMachine(this.machine);
    //e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.remove('opened');
    //e.target.parentElement.parentElement.parentElement.parentElement.parentElement
  }

}
