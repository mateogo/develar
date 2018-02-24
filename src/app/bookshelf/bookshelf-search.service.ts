import { Injectable } from '@angular/core';
import { HttpClient, HttpParams }       from '@angular/common/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { RecordCard }           from './recordcard';

@Injectable()
export class CardSearchService {
	private recordcardsUrl = 'api/recordcards/search';

  constructor(private http: HttpClient) {}


  // api:
  // http.get|post|put(ur, data, options).subscribe()
  buildParams(query){
    //let params =  new HttpParams().append('slug', query.slug).append('cardType',  query["type"]);

    return Object.getOwnPropertyNames(query)
                 .reduce((p, key) => p.append(key, query[key]), new HttpParams());

  }


  search<T>(query): Observable<T[]> {
  	//let searchUrl = `${this.recordcardsUrl}/?slug=${query.term}&cardType=${query.type}&cardCategory=${query.category}`;
    let searchUrl = this.recordcardsUrl;
    let params = this.buildParams(query);

    return this.http
               .get<T[]>(searchUrl, { params });
  }

  defaultSearch<T>(): Observable<T[]> {
  	//let searchUrl = `api/recordcards`;
    let searchUrl = this.recordcardsUrl;
    let params = this.buildParams({});
    return this.http
               .get<T[]>(searchUrl, { params });
  }

}
