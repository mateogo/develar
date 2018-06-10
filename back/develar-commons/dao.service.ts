import { Injectable }    from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams }    from '@angular/common/http';
import { Observable, of }    from 'rxjs';
import { catchError }     from 'rxjs/operators';




const whoami = 'DAO.service';

@Injectable()
export class DaoService {

	private backendUrl = 'api/folders';
  private searchUrl  = 'api/folders/search';
  
	private headers = new HttpHeaders().set('Content-Type', 'application/json');
  private dao = {};

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
  	private http: HttpClient) { 
    this.buildDaoData()
  }

  buildDaoData(){
    this.dao = {
      folder:{
        backendURL: 'api/folders',
        searchURL:  'api/folders/search'
      },
      tag:{
        backendURL: 'api/tags',
        searchURL:  'api/tags/search'
      },
      recordcard:{
        backendURL: 'api/recordcards',
        searchURL:  'api/recordcards/search'
      },
      product:{
        backendURL: 'api/products',
        searchURL:  'api/products/search'
      },
      productit:{
        backendURL: 'api/productits',
        searchURL:  'api/productits/search'
      },
      community:{
        backendURL: 'api/communities',
        searchURL:  'api/communities/search',
        relationURL: 'api/communities/usercommrel'
      },
      user:{
        backendURL: 'api/users',
        searchURL:  'api/users/search',
        closesessionURL:  'api/users/closesession',
        createusersURL:  'api/users/userfromperson',
      },
      notification:{
        backendURL: 'api/conversations',
        searchURL:  'api/conversations/search',
        emitnotificationURL: 'api/conversations/emitnotification'
      },
      person:{
        backendURL: 'api/persons',
        searchURL:  'api/persons/search',
        upsertURL:  'api/persons/upsert'
      },
      parser:{
        backendURL: 'api/parser/highlight'
      }
    };
  }

  buildParams(query){
    //let params =  new HttpParams().append('slug', query.slug).append('cardType',  query["type"]);
    return Object.getOwnPropertyNames(query)
                 .reduce((p, key) => p.append(key, query[key]), new HttpParams());
  }

  findById<T>(type: string, id: string): Promise<T> {
    let url = `${this.dao[type].backendURL}/${id}`;

    return this.http.get(url)
        .toPromise()
        .catch(this.handleError);
  }

  findAll<T>(type: string): Promise<T[]>{
    let url = `${this.dao[type].backendURL}`;

    return this.http.get(url)
      .toPromise()
      .catch(this.handleError);
  }

  create<T>(type: string, entity:T): Promise<T>{
    let url = `${this.dao[type].backendURL}`;
    console.log('create [%s]', url)

  	return this.http
  		.post(url, JSON.stringify(entity), {headers: this.headers})
  		.toPromise()
  		.catch(this.handleError);
  }

  emitnotification<T>(type: string, entity:T): Promise<T>{
    let url = `${this.dao[type].emitnotificationURL}`;
    console.log('emitnotification [%s]', url)

    return this.http
      .post(url, JSON.stringify(entity), {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

  userCommunity<T>(type: string, entity:T): Promise<T>{
    let url = `${this.dao[type].relationURL}`;
    console.log('user-community Relation [%s]', url)

    return this.http
      .post(url, JSON.stringify(entity), {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

  usersFromPersons(type: string, query:any): Promise<any>{
    let url = `${this.dao[type].createusersURL}`;
    console.log('create Users from Persons: [%s]', url)

    return this.http
      .post(url, JSON.stringify(query), {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

  highlight(type: string, query:any): Promise<any>{
    let url = `${this.dao[type].backendURL}`;
    console.log('parse text: [%s]', url)

    return this.http
      .post(url, JSON.stringify(query), {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }


  update<T>(type: string, id: string, entity: T): Promise<any> {
    let url = `${this.dao[type].backendURL}/${id}`;
    return this.http
      .put(url, JSON.stringify(entity), {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

  delete<T>(type:string, id: string): Promise<void>{
    let url = `${this.dao[type].backendURL}/${id}`;
  	return this.http
  		.delete(url, {headers: this.headers})
  		.toPromise()
  		.then(() => null )
  		.catch(this.handleError);
  }

  search<T>(type:string, query): Observable<T[]> {
    let searchUrl = `${this.dao[type].searchURL}`;;
    let params = this.buildParams(query);
    return this.http
               .get<T[]>(searchUrl, { params })
               .pipe(
                   catchError(this.handleObsError<T[]>('search',[]))
                 );
  }

  upsert<T>(type:string, query, entity:T): Observable<T> {
    let url = `${this.dao[type].upsertURL}`;
    let params = this.buildParams(query);
    return this.http
               .post<T>(url, JSON.stringify(entity), {headers: this.headers, params: params})
  }


  fetch<T>(type:string, searchUrl:string,  query): Observable<T[]> {
    let url = `${this.dao[type].backendURL}/${searchUrl}`;;
    let params = this.buildParams(query);

    return this.http
               .get<T[]>(url, { params })
               .pipe(
                   catchError(this.handleObsError<T[]>('search',[]))
                 );
  }

  defaultSearch<T>(type:string): Observable<T[]> {
    let query = `${this.dao[type].searchURL}`;
    return this.http
               .get<T[]>(query)
               .pipe(
                   catchError(this.handleObsError<T[]>('search',[]))
                 );
  }

  closeSession<T>(type: string): Observable<T[]> {
    let query = `${this.dao[type].closesessionURL}`;
    return this.http
               .get<T[]>(query)
               .pipe(
                   catchError(this.handleObsError<T[]>('search',[]))
                 );
  }


  //********* MAIL **************************
  //          sendMail send mail
  //********* MAIL **************************
  mailFactory(opt?: Object): MailModel{
    return new MailModel(opt);
  }

  send(mail: MailModel): Promise<any> {
    console.log('user SEND MAIL BEGINs ');
    return this.http
      .post(mail.url, JSON.stringify(mail.content), {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

}

class MailModel{
  private urlRoot = '/api/utils/sendmail';
  private httpHeaders = new Headers({'Content-Type': 'application/json'});

  private mailData = {
    template: 'default',
    prefix: 'develar',
    from:  '',
    to:    '',
    cc:    '',
    subject:  '',
    body:  '',
  }

  private handleError(error: any): Promise<any> {
    console.error('Ocurrió un error [user.service]', error);

    return Promise.reject(error.message || error);
  }

  constructor (options?: Object){
    if(options) Object.assign(this.mailData, options);
  }

  set bodyTemplate(tmpl){
    this.mailData.template = tmpl;
  }

  get bodyTemplate(){
    return this.mailData.template;
  }

  set subjectPrefix(txt){
    this.mailData.prefix = txt;
  }

  get subjectPrefix(){
    return this.mailData.prefix;
  }


  set mailFrom(data){
    this.mailData.from = data;
  }

  set mailTo(data){
    this.mailData.to = data;
  }

  set mailSubject(data){
    this.mailData.subject = data;
  }

  set mailBody(data){
    this.mailData.body = data;
  }

  get content(){
    return this.mailData;
  }
  
  get url(){
    return this.urlRoot;
  }

  get headers(){
    return this.httpHeaders;
  }
}

