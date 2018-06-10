import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams }    from '@angular/common/http';

import { Observable ,  of }        from 'rxjs';
import { catchError}   from 'rxjs/operators';

import { Asset } from './develar-entities';

const whoami = 'asset.service';


@Injectable()
export class AssetService {

	private backendUrl = 'api/assets';
  private searchUrl  = 'api/assets/search';
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

	private _currentAsset: Asset;

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleObsError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      //console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

	private handleError(error: any): Promise<any> {
		console.error('[%s]: Ocurrió un error: [%s]',whoami, error);
		return Promise.reject(error.message || error);
	}

  constructor(
  	private http: HttpClient) { }

  getAsset(id: string): Promise<Asset> {
    const url = `${this.backendUrl}/${id}`;

    return this.http.get(url)
        .toPromise()
        .catch(this.handleError);
  }

  getAssets(): Promise<Asset[]>{
    console.log('[%s]: Ready to FindAll', this.backendUrl);

    return this.http.get(this.backendUrl)
      .toPromise()
      .catch(this.handleError);
  }

  create(entity:Asset): Promise<Asset>{
    console.log('Service: entity: [%s], [%s]', entity.id, entity.slug);
  	return this.http
  		.post(this.backendUrl, JSON.stringify(entity), {headers: this.headers})
  		.toPromise()
  		.catch(this.handleError);
  }

  update(entity: Asset): Promise<any> {
    const url = `${this.backendUrl}/${entity._id}`;
    console.log('[%s]: Ready to update:[%s] [%s] ', url, entity._id, entity.slug);
    return this.http
      .put(url, JSON.stringify(entity), {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

  promote(entity: Asset): Promise<any> {
    const url = `${this.backendUrl}/promote/${entity._id}`;
    console.log('[%s]: Ready to promote:[%s] [%s] ', url, entity._id, entity.slug);
    return this.http
      .put(url, JSON.stringify(entity), {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

  delete(id: string): Promise<void>{
  	const url = `${this.backendUrl}/${id}`;
  	return this.http
  		.delete(url, {headers: this.headers})
  		.toPromise()
  		.then(() => null )
  		.catch(this.handleError);
  }

  search(term: string): Observable<Asset[]> {
    let query = `${this.searchUrl}/?slug=${term}`;
    console.log('search: [%s]',query);
    if(!term.trim()){
      return of([] as Asset[]);
    }

   return this.http.get<Asset[]>(query)
             .pipe(
                catchError(this.handleObsError<Asset[]>('search',[]))
               )
  }

  defaultSearch(): Observable<Asset[]> {
    let query = `api/recordcards`;
    console.log('defaultSearch: [%s]',query);
    return this.http
               .get<Asset[]>(query);
  }

}
