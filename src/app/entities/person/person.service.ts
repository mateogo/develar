import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams }    from '@angular/common/http';

import { Observable, of }     from 'rxjs';
import { catchError }     from 'rxjs/operators';


import { DaoService }    from '../../develar-commons/dao.service';

import { Person, Address, NotificationMessage } from './person';



@Injectable()
export class PersonService {

	private personsUrl      = 'api/persons';
  private personsearchUrl = 'api/persons/search';
  private geocodeUrl = 'api/utils/geocode';

  private headers = new HttpHeaders().set('Content-Type', 'application/json');


	private _currentPerson: Person;

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleObsError<T> (operation = 'operation', result: T) {
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
		console.error('Ocurrió un error person service: [%s]', error);
		return Promise.reject(error.message || error);
	}

  constructor(
    private daoService: DaoService,
    private http: HttpClient) { }

  buildParams(query){
    return Object.getOwnPropertyNames(query)
                 .reduce((p, key) => p.append(key, query[key]), new HttpParams());
  }

  fetch(query): Observable<Person[]> {
    let params = this.buildParams(query);
    return this.http
              .get<Person[]>(this.personsearchUrl, { params })
              .pipe(
                catchError(this.handleObsError<Person[]>('fetchPerson', [] ))
               );
  }

  search(term: string): Observable<Person[]> {
    if(!(term && term.trim())){
      return of([] as Person []);
    }

    let query = `${this.personsUrl}/search?displayName=${term}`;

    return this.http
        .get<Person[]>(query)
        .pipe(
          catchError(this.handleObsError<Person[]>('searchPerson', [] ))
         );
  }

  searchPerson(term: string): Observable<Person[]> {
      let query = {};
      let test = Number(term);

      if(!(term && term.trim())){
        return of([] as Person[]);
      }
      
      if(isNaN(test)){
        query['displayName'] = term;
      }else{
        query['ndoc'] = term;

      }

      return this.daoService.search<Person>('person', query);
  }

  getPerson(id: string): Promise<Person> {
    const url = `${this.personsUrl}/${id}`;
    return this.http.get(url)
        .toPromise()
        .catch(this.handleError);
  }

  getPersons(): Promise<Person[]>{
  	return this.http.get(this.personsUrl)
  			.toPromise()
  			.catch(this.handleError);
  }

  create(person:Person): Promise<Person>{
  	return this.http
  		.post(this.personsUrl, JSON.stringify(person), {headers: this.headers})
  		.toPromise()
  		.catch(this.handleError);
  }

  update(person: Person): Promise<any> {
    const url = `${this.personsUrl}/${person._id}`;
    return this.http
      .put(url, JSON.stringify(person), {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

  delete(id: string): Promise<void>{
  	const url = `${this.personsUrl}/${id}`;
  	return this.http
  		.delete(url, {headers: this.headers})
  		.toPromise()
  		.then(() => null )
  		.catch(this.handleError);
  }

  addressLookUp(address: Address): Promise<any>{
    return this.http
      .post(this.geocodeUrl, JSON.stringify(address), {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

  insertNewPerson(name: string, email?:string): Promise<any>{
      let entity: Person = new Person(name, email);
      //ToDO: revisar la inicialización
      return this.create(entity);
  }

  findOrCreatePerson(name: string, email: string, message?: any){
    let msj:NotificationMessage;
    let person: Person;

    if(message){
      msj = new NotificationMessage(message);
    }

    this.fetch({email: email}).subscribe(persons => {
      if(persons && persons.length){
        person = persons[0];
        if(msj){
          person.messages.push(msj)
          this.update(person).then(p => {
          })

        }

      }else{
        person = new Person(name, email);
        this.create(person).then(p => {
        })

      }
    })
  }

}
