import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams }       from '@angular/common/http';

import { Observable, of }     from 'rxjs';
import { catchError }     from 'rxjs/operators';


import { RecordCard }           from './recordcard';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

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
    let params = this.buildParams(query);

    return this.http
               .get<T[]>(this.recordcardsUrl, { params }).pipe(
                   catchError(this.handleError<T[]>('search',[]))
                 );
  }

  defaultSearch<T>(): Observable<T[]> {
  	//let searchUrl = `api/recordcards`;
    return this.http
               .get<T[]>(this.recordcardsUrl);
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      //console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
 


}
