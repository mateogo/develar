import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams }    from '@angular/common/http';

import { Observable }     from 'rxjs';
import { map }     from 'rxjs/operators';

import { GoogleSearchResponse }  from './develar-entities';

@Injectable()
export class GcseService {
	private gcseURL = 'api/gcse';
  private machine = 'community_prg';

  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  setMachine(machine: string){
    this.machine = machine;
  }

  search(term: string): Observable<GoogleSearchResponse> {
  	let query = `${this.gcseURL}/?q=${term}&machine=${this.machine}`;
    return this.http
               .get<GoogleSearchResponse>(query);
  }

  defaultSearch(): Observable<GoogleSearchResponse> {
  	let query = `api/recordcards/?q=develar`;
    return this.http
               .get<GoogleSearchResponse>(query);
  }

}
