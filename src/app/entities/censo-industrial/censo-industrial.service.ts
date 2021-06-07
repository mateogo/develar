import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'

import { MatSnackBar } from '@angular/material/snack-bar';

import { DaoService } from '../../develar-commons/dao.service';

import { CensoIndustrias, CensoIndustriasTable } from '../../empresas/censo.model';

import { CensoIndustriasQuery } from './censo.model';
import { CensoFeatureQuery, ConsultaCensoQuery } from './censo-empresarial-helper';

import { CensoIndustriasHelper} from './censo-industrial.helper';

import { User }          from '../user/user';

const RECORD = 'censoindustrias';
const EXPORTAR_URL = 'api/' + RECORD + '/exportarcensos';


@Injectable({
  providedIn: 'root'
})
export class CensoIndustrialService {

  /**
   * Origen de datos para la tabla del navegador de censos industriales
   */
  private _censosIndustrialesDataSource: BehaviorSubject<CensoIndustriasTable[]> = new BehaviorSubject<CensoIndustriasTable[]>([]);
  private _censoListDataSource: BehaviorSubject<CensoIndustrias[]> = new BehaviorSubject<CensoIndustrias[]>([]);
  private _trabajadorxs: User[];

  private currentCenso: CensoIndustrias;
  private censosIndustrialesList: CensoIndustrias[];
  private emitVidaQueryDataSource = new BehaviorSubject<any[]>([]);
  private urlSearch : string = 'api/vida/search';

  constructor(
    private snackBar: MatSnackBar,
    private http : HttpClient,
    private dao: DaoService
  ) { 

    this.fetchUserByRole(['vigilancia:operator', 'vigilancia:admin','vigilancia:master']).subscribe(tokens => {
      this._trabajadorxs = tokens || [];
    })

  }

  public fetchAll(): Observable<CensoIndustrias[]> {
    return this.dao.fetchAll<CensoIndustrias>(RECORD);
  }

  public fetchByQuery(queryobj): Observable<CensoIndustrias[]> {
    return this.dao.search<CensoIndustrias>(RECORD, queryobj);
  }



  private buildParams(query : any){
    return Object.getOwnPropertyNames(query)
                 .reduce((p, key) => p.append(key, query[key]), new HttpParams());
  }

  /**
   * Navegador de censos industriales
   */
  get dataRecordsSource(): BehaviorSubject<CensoIndustriasTable[]> {
    return this._censosIndustrialesDataSource;
  }

  /**
   * Censo List emitter
   */
   get censoListSource$(): BehaviorSubject<CensoIndustrias[]> {
    return this._censoListDataSource;
  }

  public fetchCensosIndustrialesByQuery(query: CensoIndustriasQuery|CensoFeatureQuery): BehaviorSubject<CensoIndustrias[]> {
    const subject = new BehaviorSubject<CensoIndustrias[]>([]);
    this.loadcensosIndustrialesByQuery(subject, query);
    return subject;
  }


  private loadcensosIndustrialesByQuery(subject: BehaviorSubject<CensoIndustrias[]>, query: CensoIndustriasQuery|CensoFeatureQuery): void {
    this.fetchByQuery(query).subscribe(items => {
      if (items && items.length > 0) {
        this.censosIndustrialesList = items;
      } else {
        this.censosIndustrialesList = [];
      }

      subject.next(this.censosIndustrialesList);
    });
  }
  
  public broadcastCensoList(): void {
    console.log('broadcast')
    this._censoListDataSource.next(this.censosIndustrialesList);
  }
  
  public updateTableData(): void {
    const censoTableData = CensoIndustriasHelper.buildCensoTableData(this.censosIndustrialesList);
    this._censosIndustrialesDataSource.next(censoTableData);
  }

  buildTuteladoresOptList(){
    let arr = []
    if(!this._trabajadorxs) return arr;
    
    arr = this._trabajadorxs.map(x => ({val: x._id, label: x.displayName}) )
    

    arr.sort((f, s)=>{
      if(f.label < s.label )return -1;
      if(f.label > s.label ) return 1;
      return 0
    })
    arr.unshift({val: 'no_definido', label: 'Sin selección'});

    return arr;
  }



  private fetchUserByRole(roles: Array<string>){
    let query = {
      roles: roles
    }
    return this.dao.search<User>('user', query);

  }

  fetchCensoById(censoId: string){
    const subject = new Subject<CensoIndustrias>();
    this.loadCensoById(subject, censoId);
    return subject;
  }

  private loadCensoById(subject: Subject<CensoIndustrias>, censoId: string):void {
  	this.dao.findById<CensoIndustrias>(RECORD, censoId).then(censo => {
  		if(censo){
  			this.currentCenso = censo;

      } else {
  			this.currentCenso = null;
      }

      subject.next(this.currentCenso)
  	})
  }

  /***************************/
  /** Dashboard Censo Empresarial ****/
  /***************************/
  exportToExcel (query : CensoFeatureQuery){
    console.log('[%s] INIT exportación a Excel - query --> %o', query);

    const urlAndParams = this.buildParamsFromArray((EXPORTAR_URL + '?'), query);

    window.open(urlAndParams, 'about: blank');
  }
  
  excelExport(query: CensoIndustriasQuery): void {
    console.log('[%s] INIT exportación a Excel - query --> %o', query);

    const params = this.buildParams(query);
    const url = EXPORTAR_URL + '?' + params.toString();

    window.open(url, 'about: blank');
  }

  
  searchArray<Acervo>( query : CensoFeatureQuery, consulta: ConsultaCensoQuery) : Observable<Acervo[]> {

    let searchUrl = this.buildParamsFromArray(this.urlSearch, query);
    let params = this.buildParams(consulta);
    return this.http
               .get<Acervo[]>(searchUrl, { params })
               .pipe(
                   catchError(this.handleObsError<Acervo[]>('search',[]))
                 ) as Observable<Acervo[]>;
  }

  private handleObsError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }


  private buildParamsFromArray(url: string, query) : string {
    let searchUrl = url;

    let recurso = '?recurso=' + query.recurso + "&isArray=" +  (query.condiciones.length > 1 ? true : false);

    let condiciones : string = "";

    query.condiciones.forEach( condicion => {
      condiciones = condiciones + "&termino=" + condicion.termino + "&buscarEn=" + condicion.buscarEn + "&tipoBusqueda="+condicion.tipoBusqueda;
    });

    return searchUrl = searchUrl+recurso+condiciones;
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




}
