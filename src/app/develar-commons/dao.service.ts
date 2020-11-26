import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams }    from '@angular/common/http';
import { Observable, of }    from 'rxjs';
import { catchError }     from 'rxjs/operators';

import { VigilanciaBrowse } from '../salud/asistencia/asistencia.model';

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
      //con sole.error(error); // log to cons ole instead

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
      serial:{
        backendURL: 'api/seriales',
        searchURL:  'api/seriales/search',
        nextItemURL: 'api/seriales/nextitem'
      },
      turno:{
        backendURL: 'api/turnos',
        searchURL:  'api/turnos/search',
        nextItemURL: 'api/turnos/nextitem'
      },
      asistencia:{
        backendURL:   'api/asistencias',
        searchURL:    'api/asistencias/search',
        dashboardURL: 'api/asistencias/tablero',
        nextItemURL:  'api/asistencias/nextitem'
      },
      gturno:{
        backendURL:   'api/turnosasignados',
        searchURL:    'api/turnosasignados/search',
        dashboardURL: 'api/turnosasignados/tablero',
        nuevoturnoURL:  'api/turnosasignados/nuevoturno'
      },
      asisprevencion:{
        backendURL:     'api/asisprevencion',
        searchURL:      'api/asisprevencion/search',
        dashboardURL:   'api/asisprevencion/tablero',
        epidemioURL:    'api/asisprevencion/epidemio',
        seguimientoURL: 'api/asisprevencion/seguimiento',
        nextItemURL:    'api/asisprevencion/nextitem'
      },
      pcultural:{
        backendURL:   'api/eventosculturales',
        searchURL:    'api/eventosculturales/search',
        dashboardURL: 'api/eventosculturales/tablero',
        nextItemURL:  'api/eventosculturales/nextitem'
      },
      censoindustrias:{
        backendURL:   'api/censoindustrias',
        searchURL:    'api/censoindustrias/search',
        dashboardURL: 'api/censoindustrias/tablero',
        nextItemURL:  'api/censoindustrias/nextitem'
      },
      budget:{
        backendURL:   'api/presupuestos',
        searchURL:    'api/presupuestos/search',
        dashboardURL: 'api/presupuestos/tablero',
        nextItemURL:  'api/presupuestos/nextitem'
      },
      auditentrega:{
        backendURL:      'api/auditentregas',
        searchURL:       'api/auditentregas/search',
        auditpersondURL: 'api/auditentregas/auditperson',
      },
      rolnocturnidad:{
        backendURL:   'api/rolnocturnidad',
        searchURL:    'api/rolnocturnidad/search',
        dashboardURL: 'api/rolnocturnidad/tablero'
      },
      remitoalmacen:{
        backendURL:   'api/remitosalmacen',
        searchURL:    'api/remitosalmacen/search',
        dashboardURL: 'api/remitosalmacen/tablero',
        exportarURL:  'api/remitosalmacen/exportarmovimientos',
        nextItemURL:  'api/remitosalmacen/nextitem'
      },
      folder:{
        backendURL: 'api/folders',
        searchURL:  'api/folders/search'
      },
      observacion:{
        backendURL: 'api/observaciones',
        searchURL:  'api/observaciones/search'
      },
      task:{
        backendURL: 'api/tasks',
        searchURL:  'api/tasks/search'
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
      productkit:{
        backendURL: 'api/productkits',
        searchURL:  'api/productkits/search'
      },
      issue:{
        backendURL: 'api/issues',
        searchURL:  'api/issues/search'
      },
      productit:{
        backendURL: 'api/productits',
        searchURL:  'api/productits/search'
      },
      productsn:{
        backendURL: 'api/productserial',
        searchURL:  'api/productserial/search'
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
        emitnotificationURL: 'api/conversations/emitnotification',
        userconversation:  'api/conversations/userconversation'
      },
      person:{
        backendURL: 'api/persons',
        searchURL:  'api/persons/search',
        upsertURL:  'api/persons/upsert'
      },
      locacionhospitalaria:{
        backendURL: 'api/locacionhospitalaria',
        searchURL:  'api/locacionhospitalaria/search',
        upsertURL:  'api/locacionhospitalaria/upsert'
      },
      internacion:{
        backendURL:  'api/solinternacion',
        searchURL:   'api/solinternacion/search',
        upsertURL:   'api/solinternacion/upsert',
        workflowURL: 'api/solinternacion/updateprocess'
      },
      beneficiarioalimentar:{
        backendURL:   'api/alimentar',
        searchURL:    'api/alimentar/search',
        beneficiarioURL:    'api/alimentar/beneficiario',
        upsertURL:    'api/alimentar/upsert',
        dashboardURL: 'api/alimentar/tablero',
      },
      parser:{
        backendURL: 'api/parser/highlight'
      },
      geocode: {
        backendURL: 'api/utils/geocode'
      },
      userweb : {
        backendURL : 'api/usuariosweb',
        searchURL : 'api/usuariosweb/search'
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

  findEntityById<T>(type: string, entity:string, id: string): Promise<T> {
    let url = `${this.dao[type][entity]}/${id}`;

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

  	return this.http
  		.post(url, JSON.stringify(entity), {headers: this.headers})
  		.toPromise()
  		.catch(this.handleError);
  }

  emitnotification<T>(type: string, entity:T): Promise<T>{
    let url = `${this.dao[type].emitnotificationURL}`;

    return this.http
      .post(url, JSON.stringify(entity), {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

  userCommunity<T>(type: string, entity:T): Promise<T>{
    let url = `${this.dao[type].relationURL}`;

    return this.http
      .post(url, JSON.stringify(entity), {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

  usersFromPersons(type: string, query:any): Promise<any>{
    let url = `${this.dao[type].createusersURL}`;

    return this.http
      .post(url, JSON.stringify(query), {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

  highlight(type: string, query:any): Promise<any>{
    let url = `${this.dao[type].backendURL}`;

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

  partialUpdate<T>(type: string, id: string, entity: any): Promise<T> {
    let url = `${this.dao[type].backendURL}/${id}`;
    return this.http
      .put<T>(url, JSON.stringify(entity), {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }


  delete<T>(type:string, id: string): Promise<void>{
    let url = `${this.dao[type].backendURL}/${id}`;
  	return this.http
  		.delete<T>(url, {headers: this.headers})
  		.toPromise()
  		.then(() => null )
  		.catch(this.handleError);
  }

  search<T>(type:string, query): Observable<T[]> {
    let searchUrl = `${this.dao[type].searchURL}`;
    let params = this.buildParams(query);
    return this.http
               .get<T[]>(searchUrl, { params })
               .pipe(
                   catchError(this.handleObsError<T[]>('search',[]))
                 );
  }

  searchOne<T>(type:string, query): Observable<T> {
    let searchUrl = `${this.dao[type].searchURL}`;
    let params = this.buildParams(query);
    return this.http
               .get<T>(searchUrl, { params })
               .pipe(
                   catchError(this.handleObsError<T>('search'))
                 );
  }

  nextSerial<T>(type:string, query): Observable<T> {
    let searchUrl = `${this.dao[type].nextItemURL}`;
    let params = this.buildParams(query);
    return this.http
               .post<T>(searchUrl, JSON.stringify(query), {headers: this.headers})
               .pipe(
                   catchError(this.handleObsError<T>('search'))
                 );
  }

  upsert<T>(type:string, query, entity:T): Observable<T> {
    let url = `${this.dao[type].upsertURL}`;
    let params = this.buildParams(query);
    return this.http
               .post<T>(url, JSON.stringify(entity), {headers: this.headers, params: params})
  }

  processGTurno<T>(type:string, entity): Observable<T[]> {
    let url = `${this.dao[type].nuevoturnoURL}`;

    return this.http
               .post<T[]>(url, JSON.stringify(entity), {headers: this.headers})
  }



  fetch<T>(type:string, searchUrl:string,  query): Observable<T[]> {
    let url = `${this.dao[type].backendURL}/${searchUrl}`;
    let params = this.buildParams(query);

    return this.http
               .get<T[]>(url, { params })
               .pipe(
                   catchError(this.handleObsError<T[]>('search',[]))
                 );
  }

  fetchTarjetaAlimentar<T>(type:string, beneficiario:string): Observable<T[]> {
    let url = `${this.dao[type].beneficiarioURL}/${beneficiario}`;

    return this.http
               .get<T[]>(url)
               .pipe(
                   catchError(this.handleObsError<T[]>('search',[]))
                 );
  }

  fetchAll<T>(type:string): Observable<T[]> {
    let url = `${this.dao[type].backendURL}`;

    return this.http
               .get<T[]>(url)
               .pipe(
                   catchError(this.handleObsError<T[]>('search',[]))
                 );
  }

  defaultSearch<T>(type:string): Observable<T[]> {
    let url = `${this.dao[type].searchURL}`;
    return this.http
               .get<T[]>(url)
               .pipe(
                   catchError(this.handleObsError<T[]>('search',[]))
                 );
  }

  closeSession<T>(type: string): Observable<T[]> {
    let url = `${this.dao[type].closesessionURL}`;
    return this.http
               .get<T[]>(url)
               .pipe(
                   catchError(this.handleObsError<T[]>('search',[]))
                 );
  }

  fetchEpidemioDashboard<T>(type: string, fecha: number): Observable<T> {
    let url = `${this.dao[type].epidemioURL}/${fecha}`;
    return this.http
               .get<T>(url)
               .pipe(
                   catchError(this.handleObsError<T>('search',null))
                 );
  }

  fetchSeguimientoDashboard<T>(type: string, query: VigilanciaBrowse): Observable<T[]> {
    let searchUrl = `${this.dao[type].seguimientoURL}`;
    let params = this.buildParams(query);
    return this.http
               .get<T[]>(searchUrl, { params })
               .pipe(
                   catchError(this.handleObsError<T[]>('search',[]))
                 );
  }
  
  fetchAsistenciaDashboard<T>(type: string, fecha: number): Observable<T> {
    let url = `${this.dao[type].dashboardURL}/${fecha}`;
    return this.http
               .get<T>(url)
               .pipe(
                   catchError(this.handleObsError<T>('search',null))
                 );
  }
  
  fetchTarjetasPorDiaAlimentarDashboard<T>(type: string, fecha: number): Observable<T> {
    let url = `${this.dao[type].dashboardURL}`;
    return this.http
               .get<T>(url)
               .pipe(
                   catchError(this.handleObsError<T>('search',null))
                 );
  }

  buildTableroCovid<T>(type: string, fecha: number): Observable<T> {
    let url = `${this.dao[type].dashboardURL}`;
    return this.http
               .get<T>(url)
               .pipe(
                   catchError(this.handleObsError<T>('search',null))
                 );
  }


  fetchEntregasTAlimentarDashboard<T>(type: string, fecha: number): Observable<T> {
    let url = `${this.dao[type].dashboardURL}/${fecha}`;
    return this.http
               .get<T>(url)
               .pipe(
                   catchError(this.handleObsError<T>('search',null))
                 );
  }

  fetchAuditEntregas<T>(type: string, personId: string): Observable<T> {
    let url = `${this.dao[type].auditpersondURL}/${personId}`;
    return this.http
               .get<T>(url)
               .pipe(
                   catchError(this.handleObsError<T>('search',null))
                 );
  }

  geocodeForward<T>(query: any): Promise<T[]>{
    let url = `${this.dao['geocode'].backendURL}`;

    return this.http
      .post(url, JSON.stringify(query), {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

  exportarMovimientos<T>(type:string, query): Observable<T[]> {
    let exportUrl = `${this.dao[type].exportarURL}`;
    let params = this.buildParams(query);
    return this.http
               .get<T[]>(exportUrl, { params })
               .pipe(
                   catchError(this.handleObsError<T[]>('search',[]))
                 );
  }

  processCovidWorkflow<T>(type:string, query: any): Observable<T> {

    let url = `${this.dao[type].workflowURL}`;

    return this.http
               .post<T>(url, JSON.stringify(query), { headers: this.headers })
  }

  fetchMasterAllocato3r<T>(type:string, query: any): Observable<T> {

    let url = `${this.dao[type].workflowURL}`;

    return this.http
               .post<T>(url, JSON.stringify(query), { headers: this.headers })
  }

  fetchMasterAllocator<T>(type:string, query: any): Observable<T[]> {
    let searchUrl = `${this.dao[type].workflowURL}`;
    let params = this.buildParams(query);
    return this.http
               .get<T[]>(searchUrl, { params })
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

