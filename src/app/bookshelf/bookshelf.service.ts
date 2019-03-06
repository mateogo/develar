import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams }       from '@angular/common/http';



import { RecordCard } from './recordcard';



@Injectable()
export class RecordCardService {

	private recordcardsUrl = 'api/recordcards';
  private searchUrl = 'api/recordcards/search';

	private headers = new HttpHeaders({'Content-Type': 'application/json'});
	private _currentRecordCard: RecordCard;

	private handleError(error: any): Promise<any> {
		console.error('Ocurrió un error recordcard service: [%s]', error);
		return Promise.reject(error.message || error);
	}

  constructor(
  	private http: HttpClient) { }

  buildParams(query){
    return Object.getOwnPropertyNames(query)
                 .reduce((p, key) => p.append(key, query[key]), new HttpParams());
  }

  loadRecordCards<T>(query): Promise<T[]> {
    //let searchUrl = `${this.recordcardsUrl}/?slug=${query.term}&cardType=${query.type}&cardCategory=${query.category}`;
    let url = this.searchUrl;
    let params = this.buildParams(query);

    return this.http
               .get<T[]>(url, { params })
               .toPromise()
               .then(response => response)
               .catch(this.handleError);

  }

  getRecordCard(id: string): Promise<RecordCard> {
    const url = `${this.recordcardsUrl}/${id}`;

    return this.http.get(url)
        .toPromise()
        .then(response => response as RecordCard)
        .catch(this.handleError);
  }

  getRecordCards(): Promise<RecordCard[]>{

    return this.http.get(this.recordcardsUrl)
      .toPromise()
      .then(response => response as RecordCard[])
      .catch(this.handleError);
  }

  create(recordcard:RecordCard): Promise<RecordCard>{
  	return this.http
  		.post(this.recordcardsUrl, JSON.stringify(recordcard), {headers: this.headers})
  		.toPromise()
  		.then(response => response as RecordCard)
  		.catch(this.handleError);
  }

  update(recordcard: RecordCard): Promise<any> {
    const url = `${this.recordcardsUrl}/${recordcard._id}`;
    return this.http
      .put(url, JSON.stringify(recordcard), {headers: this.headers})
      .toPromise()
      .then(response => response as RecordCard)
      .catch(this.handleError);
  }

  promote(recordcard: RecordCard): Promise<any> {
    const url = `${this.recordcardsUrl}/promote/${recordcard._id}`;
    return this.http
      .put(url, JSON.stringify(recordcard), {headers: this.headers})
      .toPromise()
      .then(response => response as RecordCard)
      .catch(this.handleError);
  }

  delete(id: string): Promise<void>{
  	const url = `${this.recordcardsUrl}/${id}`;
  	return this.http
  		.delete(url, {headers: this.headers})
  		.toPromise()
  		.then(() => null )
  		.catch(this.handleError);
  }

}
