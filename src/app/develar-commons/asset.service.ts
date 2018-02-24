import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';

import { Asset } from './develar-entities';
const whoami = 'asset.service';



@Injectable()
export class AssetService {

	private backendUrl = 'api/assets';
  private searchUrl  = 'api/assets/search';
	private headers = new Headers({'Content-Type': 'application/json'});
	private _currentAsset: Asset;

	private handleError(error: any): Promise<any> {
		console.error('[%s]: Ocurrió un error: [%s]',whoami, error);
		return Promise.reject(error.message || error);
	}

  constructor(
  	private http: Http) { }


  getAsset(id: string): Promise<Asset> {
    const url = `${this.backendUrl}/${id}`;

    return this.http.get(url)
        .toPromise()
        .then(response => response.json() as Asset)
        .catch(this.handleError);
  }

  getAssets(): Promise<Asset[]>{
    console.log('[%s]: Ready to FindAll', this.backendUrl);

    return this.http.get(this.backendUrl)
      .toPromise()
      .then(response => response.json() as Asset[])
      .catch(this.handleError);
  }

  create(entity:Asset): Promise<Asset>{
    console.log('Service: entity: [%s], [%s]', entity.id, entity.slug);
  	return this.http
  		.post(this.backendUrl, JSON.stringify(entity), {headers: this.headers})
  		.toPromise()
  		.then(response => response.json() as Asset)
  		.catch(this.handleError);
  }

  update(entity: Asset): Promise<any> {
    const url = `${this.backendUrl}/${entity._id}`;
    console.log('[%s]: Ready to update:[%s] [%s] ', url, entity._id, entity.slug);
    return this.http
      .put(url, JSON.stringify(entity), {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Asset)
      .catch(this.handleError);
  }

  promote(entity: Asset): Promise<any> {
    const url = `${this.backendUrl}/promote/${entity._id}`;
    console.log('[%s]: Ready to promote:[%s] [%s] ', url, entity._id, entity.slug);
    return this.http
      .put(url, JSON.stringify(entity), {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Asset)
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
    return this.http
               .get(query)
               .map(response => response.json() as Asset[]);
  }
  defaultSearch(): Observable<Asset[]> {
    let query = `api/recordcards`;
    console.log('defaultSearch: [%s]',query);
    return this.http
               .get(query)
               .map(response => response.json() as Asset[]);
  }


}
