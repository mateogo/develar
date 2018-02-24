import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable }    from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';

import { Folder } from './develar-entities';
const whoami = 'folder.service';



@Injectable()
export class FolderService {

	private backendUrl = 'api/folders';
  private searchUrl  = 'api/folders/search';
	private headers = new Headers({'Content-Type': 'application/json'});
	private _currentFolder: Folder;

	private handleError(error: any): Promise<any> {
		console.error('[%s]: Ocurrió un error: [%s]',whoami, error);
		return Promise.reject(error.message || error);
	}

  constructor(
  	private http: Http) { }


  getFolder(id: string): Promise<Folder> {
    const url = `${this.backendUrl}/${id}`;

    return this.http.get(url)
        .toPromise()
        .then(response => response.json() as Folder)
        .catch(this.handleError);
  }

  getFolders(): Promise<Folder[]>{
    console.log('[%s]: Ready to FindAll', this.backendUrl);

    return this.http.get(this.backendUrl)
      .toPromise()
      .then(response => response.json() as Folder[])
      .catch(this.handleError);
  }

  create(entity:Folder): Promise<Folder>{
    console.log('Service: entity: [%s], [%s]', entity.id, entity.slug);
  	return this.http
  		.post(this.backendUrl, JSON.stringify(entity), {headers: this.headers})
  		.toPromise()
  		.then(response => response.json() as Folder)
  		.catch(this.handleError);
  }

  update(entity: Folder): Promise<any> {
    const url = `${this.backendUrl}/${entity._id}`;
    console.log('[%s]: Ready to update:[%s] [%s] ', url, entity._id, entity.slug);
    return this.http
      .put(url, JSON.stringify(entity), {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Folder)
      .catch(this.handleError);
  }

  promote(entity: Folder): Promise<any> {
    const url = `${this.backendUrl}/promote/${entity._id}`;
    console.log('[%s]: Ready to promote:[%s] [%s] ', url, entity._id, entity.slug);
    return this.http
      .put(url, JSON.stringify(entity), {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Folder)
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
    console.log('search: [%s]',query);
    return this.http
               .get(query)
               .map(response => response.json() as Folder[]);
  }
  defaultSearch(): Observable<Folder[]> {
    let query = `api/recordcards`;
    console.log('defaultSearch: [%s]',query);
    return this.http
               .get(query)
               .map(response => response.json() as Folder[]);
  }


}
