import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams }    from '@angular/common/http';
import { Observable, of }    from 'rxjs';
import { catchError }     from 'rxjs/operators';

import {AsistenciaFollowUp, UserWorkload} from './workload-helper';

const whoami = 'workload-service: ';
const ASIS_PREVENCION_RECORD = 'asisprevencion';
const WORKLOAD = 'workloadURL'

@Injectable()
export class WorkLoadService {

  private apiRoutes = {
    backendURL:     'api/asisprevencion',
    searchURL:      'api/asisprevencion/search',
    workloadURL:    'api/asisprevencion/workload',
  }

  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  private whoami = 'workload-service: ';


  constructor(
  	private http: HttpClient) { 

    }






  fetchWorkloadByQuery<T>(query:any): Observable<T>{
    return this.search<T>(WORKLOAD, query);
  }
  
  private search<T>(type:string, query): Observable<T> {
    let searchUrl = `${this.apiRoutes[type] }`;
    let params = this.buildParams(query);
    return this.http
               .get<T>(searchUrl, { params })
               .pipe(
                   catchError(this.handleObsError<T>('search', null))
                 );
  }


  private handleObsError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

	private handleError(error: any): Promise<any> {
		console.error('[%s]: Ocurrió un error: [%s]',whoami, error);
		return Promise.reject(error.message || error);
	}

  private buildParams(query){
    //let params =  new HttpParams().append('slug', query.slug).append('cardType',  query["type"]);
    return Object.getOwnPropertyNames(query)
                 .reduce((p, key) => p.append(key, query[key]), new HttpParams());
  }




}


