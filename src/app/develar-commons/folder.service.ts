import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams }    from '@angular/common/http';

import { Observable, of }    from 'rxjs';
import { catchError }     from 'rxjs/operators';

import { Folder } from './develar-entities';

const whoami = 'folder.service';


@Injectable()
export class FolderService {

	private backendUrl = 'api/folders';
  private searchUrl  = 'api/folders/search';

  private headers = new HttpHeaders().set('Content-Type', 'application/json');

	private _currentFolder: Folder;


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


  getFolder(id: string): Promise<Folder> {
    const url = `${this.backendUrl}/${id}`;

    return this.http.get(url)
        .toPromise()
        .catch(this.handleError);
  }

  getFolders(): Promise<Folder[]>{
    return this.http.get(this.backendUrl)
      .toPromise()
      .catch(this.handleError);
  }

  create(entity:Folder): Promise<Folder>{
  	return this.http
  		.post(this.backendUrl, JSON.stringify(entity), {headers: this.headers})
  		.toPromise()
  		.catch(this.handleError);
  }

  update(entity: Folder): Promise<any> {
    const url = `${this.backendUrl}/${entity._id}`;
    return this.http
      .put(url, JSON.stringify(entity), {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

  promote(entity: Folder): Promise<any> {
    const url = `${this.backendUrl}/promote/${entity._id}`;
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

  search(term: string): Observable<Folder[]> {
    let query = `${this.searchUrl}/?slug=${term}`;
    if(!(term && term.trim())){
      return of([] as Folder[]);
    }

    return this.http
               .get<Folder[]>(query)
               .pipe(
                   catchError(this.handleObsError<Folder[]>('search',[]))
                 );
  }

  defaultSearch(): Observable<Folder[]> {
    let query = `api/recordcards`;
    return this.http
               .get<Folder[]>(query)
               .pipe(
                   catchError(this.handleObsError<Folder[]>('defaultSearch',[]))
                 );
  }

}
