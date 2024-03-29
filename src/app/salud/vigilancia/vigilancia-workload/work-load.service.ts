import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams }    from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, Subject,  of }    from 'rxjs';
import { catchError }     from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import {WorkloadHelper, WorkLoad, AsistenciaFollowUp, UserWorkload, WorkPlanToken, EventEmitted} from './workload-helper';

import { WorkloadZmodalByuserComponent } from './workload-zmodal-byuser/workload-zmodal-byuser.component';

//import { VigilanciaLaboratorioComponent } from '../../salud/vigilancia/vigilancia-zmodal/vigilancia-laboratorio/vigilancia-laboratorio.component';

const ROLE_ADMIN = 'vigilancia:admin';
const UPDATE =   'update';
const CANCEL =   'cancel';
const ERROR =    'error';


const whoami = 'workload-service: ';
const ASIS_PREVENCION_RECORD = 'asisprevencion';
const WORKLOAD = 'workloadURL'
const WEEKPLANNING = 'weekplanningURL'

@Injectable()
export class WorkLoadService {

  private apiRoutes = {
    backendURL:      'api/asisprevencion',
    searchURL:       'api/asisprevencion/search',
    workloadURL:     'api/asisprevencion/workload',
    weekplanningURL: 'api/asisprevencion/weekplanning'
  }

  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  private whoami = 'workload-service: ';

  private dialogResult$ = new Subject<EventEmitted>();



  constructor(
    public dialog: MatDialog,
    private snackBar:  MatSnackBar,

  	private http: HttpClient) { 

  }

  fetchWorkloadByQuery<T>(query:any): Observable<T>{
    return this.search<T>(WORKLOAD, query);
  }

  fetcWeekPlanningByQuery<T>(query:any): Observable<T>{
    return this.search<T>(WEEKPLANNING, query);
  }

  private search<T>(targetUrl: string, query): Observable<T> {
    let searchUrl = `${this.apiRoutes[targetUrl]}`;
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
		return Promise.reject(error.message || error);
	}

  private buildParams(query){
    //let params =  new HttpParams().append('slug', query.slug).append('cardType',  query["type"]);
    return Object.getOwnPropertyNames(query)
                 .reduce((p, key) => p.append(key, query[key]), new HttpParams());
  }

  filterAsistencias(user: UserWorkload, asistencias: AsistenciaFollowUp[]): AsistenciaFollowUp[]{
    return asistencias.filter(asis => asis.asignadoId === user.asignadoId)
  }

  openUserDialog(user: UserWorkload, asistencias: AsistenciaFollowUp[], workplan: Array<WorkPlanToken> ): Subject<EventEmitted>{
    this.openModalDialog(user, asistencias, workplan);
    return this.dialogResult$;
  }

  /***************************/
  /** Notification HELPER ****/
  /***************************/
  openSnackBar(message: string, action: string, config?: any) {
    config = config || {}
    config = Object.assign({duration: 3000}, config)

    let snck = this.snackBar.open(message, action, config);

    snck.onAction().subscribe((e)=> {
      //c onsole.log('action???? [%s]', e);
    })
  }


  private openModalDialog(user: UserWorkload,asistencias: AsistenciaFollowUp[],  workplan:Array<WorkPlanToken>){
    const dialogRef = this.dialog.open(
      WorkloadZmodalByuserComponent,
      {
        width: '800px',
        data: {
          asistencias: asistencias,
          user: user,
          workplan: workplan
        }
      }
    );

    dialogRef.afterClosed().subscribe((res: EventEmitted) => {
        if(res) this.dialogResult$.next(res);
        else this.fireCancel();
    });    

  }

  private fireCancel(){
    this.dialogResult$.next({
      action:'operación:cancelada',
      type:  CANCEL,
      token: null
    } as EventEmitted)
  }


}
/***
 * db.asisprevencion.find({
 *              
 * })
 * 
 * 
 */

