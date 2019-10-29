import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router }            from '@angular/router';

import { Observable ,  Subject, of }        from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap }   from 'rxjs/operators';

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
    this.targetUrl = target;
  }

  showResultSet(items:Array<any>){
    this.results = items;
  }

  ngOnInit(): void {
    this.lookUpModels.subscribe({
      next: (ovble:Observable<GoogleSearchResponse>)=> {
        ovble.subscribe( data => {
          if(data) this.showResultSet(data.items)
        })
      }
    })

    this.lookUpModels.emit(this.searchTerms

      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(t => t && t.length >2 && !(/[^a-z0-9,ñ\s]+/ig.test(t))),
        switchMap(term => {
          if(term){
            return this.googleSearchService.search(term);
          }else {
            return of<GoogleSearchResponse>(new GoogleSearchResponse());
          }

        }),
        catchError((e) =>of<GoogleSearchResponse>(new GoogleSearchResponse()) )

      )// end pipe
    );//end lookUpModels.emit
  }// end ngInit

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
    this.recordThisRequest.emit(token);
  }
  
  crawlURL(target){
        this.targetUrl = target.link;
  }

  handleCrawlingData(sub:Subject<any>){
    sub.subscribe({
      next: (x) => {}
    })
  }

  selectMachine(e, item){
    e.preventDefault();
    this.machine = item;
    e.target.closest('.nav-item').classList.remove('opened');
    if(this.machine !== 'hack') this.googleSearchService.setMachine(this.machine);
  }

}
