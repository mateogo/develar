import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { GoogleSearchResponse }  from './develar-entities';

@Injectable()
export class GcseService {
	private gcseURL = 'api/gcse';
  private machine = 'community_prg';

  constructor(private http: Http) {}

  setMachine(machine: string){
    this.machine = machine;
  }

  search(term: string): Observable<GoogleSearchResponse> {
    console.log('search service[%s]', term)
  	let query = `${this.gcseURL}/?q=${term}&machine=${this.machine}`;
  	console.log('search: [%s]',query);
    return this.http
               .get(query)
               .map(response => response.json() as GoogleSearchResponse);
  }
  defaultSearch(): Observable<GoogleSearchResponse> {
  	let query = `api/recordcards/?q=develar`;
  	console.log('defaultSearch: [%s]',query);
    return this.http
               .get(query)
               .map(response => response.json() as GoogleSearchResponse);
  }

}
