import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams }    from '@angular/common/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Person, Address, NotificationMessage } from './person';



@Injectable()
export class PersonService {

	private personsUrl      = 'api/persons';
  private personsearchUrl = 'api/persons/search';
  private geocodeUrl = 'api/utils/geocode';

  private headers = new HttpHeaders().set('Content-Type', 'application/json');


	private _currentPerson: Person;

	private handleError(error: any): Promise<any> {
		console.error('Ocurrió un error person service: [%s]', error);
		return Promise.reject(error.message || error);
	}

  constructor(
  	private http: HttpClient) { }

  buildParams(query){
    return Object.getOwnPropertyNames(query)
                 .reduce((p, key) => p.append(key, query[key]), new HttpParams());
  }

  fetch(query): Observable<Person[]> {
    let params = this.buildParams(query);
    return this.http
               .get<Person[]>(this.personsearchUrl, { params });
  }

  search(term: string): Observable<Person[]> {
    let query = `${this.personsUrl}/search?displayName=${term}`;
    console.log('search: [%s]',query);
    return this.http
               .get<Person[]>(query);
  }

  getPerson(id: string): Promise<Person> {
    const url = `${this.personsUrl}/${id}`;
    console.log('[%s]: Ready to GET:[%s] ', url, id);

    return this.http.get(url)
        .toPromise()
        .catch(this.handleError);
  }

  getPersons(): Promise<Person[]>{
    console.log('[%s]: Ready to FindAll ', this.personsUrl);
  	return this.http.get(this.personsUrl)
  			.toPromise()
  			.catch(this.handleError);
  }

  create(person:Person): Promise<Person>{
    console.log('Service: person: [%s], [%s]', person.id, person.displayName);
  	return this.http
  		.post(this.personsUrl, JSON.stringify(person), {headers: this.headers})
  		.toPromise()
  		.catch(this.handleError);
  }

  update(person: Person): Promise<any> {
    const url = `${this.personsUrl}/${person._id}`;
    console.log('[%s]: Ready to update:[%s] [%s] [%s] ', url, person._id, person.displayName, person.locaciones.length);
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
            console.log('iajuuu Person updated');
          })

        }

      }else{
        person = new Person(name, email);
        this.create(person).then(p => {
            console.log('iajuuu Person created');

        })

      }
    })
  }

}
