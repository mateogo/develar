import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Consulta, ConsultaTable, ConsultaQuery, Requirente } from './consulta.model';
import { ConsultaHelper } from './consulta.helper';
import { UserWeb } from '../user-web/user-web.model';
import { UserWebService } from '../user-web/user-web.service';
import { DaoService } from '../../develar-commons/dao.service';
import { devutils } from '../../develar-commons/utils';


const RECORD = 'consultas';
const MANAGER = {
    consulta: {
      isActive: true,
      hasNecesidad: false,
      hasCumplimiento: true,
      ejecucion: 'emitido',
      sector: 'comunicacion',
      urgencia: 2,
      estado: 'activo'
    },
    asesoramiento: {
      isActive: true,
      hasNecesidad: true,
      hasCumplimiento: true,
      ejecucion: 'emitido',
      sector: 'comunicacion',
      urgencia: 2,
      estado: 'activo'
    },
    solmaterial: {
      isActive: true,
      hasNecesidad: true,
      hasCumplimiento: true,
      ejecucion: 'emitido',
      sector: 'comunicacion',
      urgencia: 2,
      estado: 'activo'
    }
}
@Injectable({
  providedIn: 'root'
})
export class ConsultasService {
  private urlMap = {
    findAll: 'api/consultas',
    search: 'api/consultas/search',
    create: 'api/consultas',
    findOne: 'api/consultas/%s',
    update: 'api/consultas/%s',
    delete: 'api/consultas/%s',
    export: 'api/consultas/exportar'
  };

  public _user$: BehaviorSubject<UserWeb>
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  /**
   * Origen de datos para la tabla del navegador de consultas
   *
   */
  private _consultasDataSource: BehaviorSubject<ConsultaTable[]> = new BehaviorSubject<ConsultaTable[]>([]);
  private consultasList: Consulta[];

  constructor(
    private _http: HttpClient,
    private _user: UserWebService,
    private _dao : DaoService
  ) { }

  fetchConsultaFromUser(user: any, query?: any): Observable<Consulta[]>{
    query = query || {};
    Object.assign(query, {userId: user._id})
    return this._dao.search<Consulta>(RECORD, query);
  }

  public fetchAll(): Observable<Consulta[]> {
    return this._http.get<Consulta[]>(this.urlMap.findAll, { headers: this.headers });
  }

  get user$(){
    return this._user.userEmitter;
  }

  public fetchByQuery(queryobj): Observable<Consulta[]> {
    const params = this.buildParams(queryobj);
    return this._http.get<Consulta[]>(this.urlMap.search, { params });
  }

  public fetchById(id: string): Promise<Consulta> {
    return this._http.get<Consulta>(this.urlMap.findOne.replace('%s', id), { headers: this.headers }).toPromise();
  }

  public create(consulta: Consulta): Promise<Consulta> {
    return this._http.post<Consulta>(this.urlMap.create, consulta, { headers: this.headers }).toPromise();
  }

  public edit(id: string, consulta: Consulta): Promise<Consulta> {
    return this._http.put<Consulta>(this.urlMap.update.replace('%s', id), consulta, { headers: this.headers }).toPromise();
  }

  public delete(id: string): Promise<Consulta> {
    return this._http.delete<Consulta>(this.urlMap.delete.replace('%s', id), { headers: this.headers }).toPromise();
  }

  public export(queryobj): void {
    const params = this.buildParams(queryobj);
    const url = this.urlMap.export + '?' + params.toString();
    window.open(url, 'about: blank');
  }

  private buildParams(query) {
    return Object.getOwnPropertyNames(query)
                 .reduce((p, key) => p.append(key, query[key]), new HttpParams());
  }

  /**
   * Navegador de turnos
   *
   */
  get dataRecordsSource(): BehaviorSubject<ConsultaTable[]> {
    return this._consultasDataSource;
  }

  public fetchConsultasByQuery(query: ConsultaQuery): BehaviorSubject<Consulta[]> {
    const subject = new BehaviorSubject<Consulta[]>([]);
    this.loadConsultasByQuery(subject, query);
    return subject;
  }

  private loadConsultasByQuery(subject: BehaviorSubject<Consulta[]>, query: ConsultaQuery): void {
    this.fetchByQuery(query).subscribe(items => {
      if (items && items.length > 0) {
        this.consultasList = items;
      } else {
        this.consultasList = [];
      }
      subject.next(this.consultasList);
    });
  }

  public updateTableData(): void {
    const consultaTableData = ConsultaHelper.buildConsultasBrowseDataTable(this.consultasList);
    this._consultasDataSource.next(consultaTableData);
  }

  manageConsulta(consulta: Consulta, user: UserWeb): Subject<Consulta>{
    let listener = new Subject<Consulta>();
    this.preSave(listener, consulta, user);
    return listener;
  }

  createConsultaRecord(listener: Subject<Consulta>, consulta: Consulta){
    this._dao.create<Consulta>(RECORD, consulta).then(consulta => {
      listener.next(consulta);
    })
  }

  updateConsultaRecord(listener: Subject<Consulta>, consulta: Consulta){
    this._dao.update<Consulta>(RECORD,consulta._id, consulta).then(consulta => {
      listener.next(consulta);
    })
  }

  private preSave(listener: Subject<Consulta>, consulta: Consulta, user: UserWeb){
    let isNew = consulta._id ? false: true;

    if(isNew){
      this.initNewConsulta(consulta, user);
      this.createConsultaRecord(listener, consulta);

    }else {
      //this.updateConsulta(consulta);
      this.updateConsultaRecord(listener, consulta);
    }


  }

  

  private initNewConsulta(consulta: Consulta, user: UserWeb){
    let today = new Date();
    Object.assign(consulta, MANAGER[consulta.type])
    consulta.requirente = this.buildRequirente(consulta, user);
    consulta.fecomp_txa = devutils.txFromDate(today);
    consulta.fecomp_tsa = today.getTime();
    consulta.fe_necesidad = devutils.txFromDate(today);
    consulta.fets_necesidad = today.getTime();


  }

  private buildRequirente(consulta: Consulta, user: UserWeb): Requirente{
    let requirente = new Requirente();
    requirente.userId = user._id;
    requirente.personId = null;
    requirente.slug = user.username;
    return requirente
  }

  fetchConsultaById(id: string): Promise<Consulta>{
    return this._dao.findById<Consulta>(RECORD, id);
  }





 
}
