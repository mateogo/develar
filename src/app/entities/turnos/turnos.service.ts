import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Turno, TurnoDisponible, TurnoTable, TurnoQuery } from './turno.model';
import { TurnoHelper } from './turno.helper';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  private urlMap = {
    findAll: 'api/turnospresenciales',
    // Dado un tipo de consulta, sede y fecha, devuelve un listado de todos los
    // horarios disponibles para una fecha, sede y tipo de consulta
    findAllDisponibles: 'api/turnospresenciales/alldisponibles',
    findDisponibles: 'api/turnospresenciales/disponibles',
    findDisponibleById: 'api/turnospresenciales/disponibles/%s',
    // Dado un tipo de consulta y sede, devuelve el primer horario (fecha y hora)
    // disponible para dicha sede y tipo de consulta
    findPrimeraDisponible: 'api/turnospresenciales/primerodisponible',
    search: 'api/turnospresenciales/search',
    create: 'api/turnospresenciales',
    findOne: 'api/turnospresenciales/%s',
    update: 'api/turnospresenciales/%s',
    delete: 'api/turnospresenciales/%s',
    export: 'api/turnospresenciales/exportar'
  };

  private headers = new HttpHeaders().set('Content-Type', 'application/json');


  /**
   * Origen de datos para la tabla del navegador de turnos
   */
  private _turnosDataSource: BehaviorSubject<TurnoTable[]> = new BehaviorSubject<TurnoTable[]>([]);
  private turnosList: Turno[];

  constructor(
    private _http: HttpClient
  ) { }

  public fetchAll(): Observable<Turno[]> {
    return this._http.get<Turno[]>(this.urlMap.findAll, { headers: this.headers });
  }

  public fetchByQuery(queryobj): Observable<Turno[]> {
    const params = this.buildParams(queryobj);
    return this._http.get<Turno[]>(this.urlMap.search, { params });
  }

  public fetchById(id: string): Promise<Turno> {
    return this._http.get<Turno>(this.urlMap.findOne.replace('%s', id), { headers: this.headers }).toPromise();
  }

  public create(turno: Turno): Promise<Turno> {
    return this._http.post<Turno>(this.urlMap.create, turno, { headers: this.headers }).toPromise();
  }

  public edit(id: string, turno: Turno): Promise<Turno> {
    return this._http.put<Turno>(this.urlMap.update.replace('%s', id), turno, { headers: this.headers }).toPromise();
  }

  public delete(id: string): Promise<Turno> {
    return this._http.delete<Turno>(this.urlMap.delete.replace('%s', id), { headers: this.headers }).toPromise();
  }

  // public fetchAvailableSlots(): Observable<TurnoDisponible[]> {
  //   return this._http.get<TurnoDisponible[]>(this.urlMap.findAllDisponibles, { headers: this.headers });
  // }

  public fetchAvailableSlotById(id: string): Promise<TurnoDisponible> {
    return this._http.get<TurnoDisponible>(this.urlMap.findDisponibleById.replace('%s', id), { headers: this.headers }).toPromise();
  }

  public fetchAvailableSlots(sede: string, dateTx: string): Observable<TurnoDisponible[]> {
    const query = { sede: sede, dateTx: dateTx };
    const params = this.buildParams(query);
    return this._http.get<TurnoDisponible[]>(this.urlMap.findDisponibles, { params });
  }


  public fetchFirstAvailableSlot(tipoConsulta: string, sede: string): Promise<TurnoDisponible> {
    const params = this.buildParams({
      tipoConsulta: tipoConsulta,
      sede: sede
    });

    return this._http.get<TurnoDisponible>(this.urlMap.findPrimeraDisponible, { params }).toPromise();
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
  get dataRecordsSource(): BehaviorSubject<TurnoTable[]> {
    return this._turnosDataSource;
  }

  public fetchTurnosByQuery(query: TurnoQuery): BehaviorSubject<Turno[]> {
    const subject = new BehaviorSubject<Turno[]>([]);
    this.loadTurnosByQuery(subject, query);
    return subject;
  }

  private loadTurnosByQuery(subject: BehaviorSubject<Turno[]>, query: TurnoQuery): void {
    this.fetchByQuery(query).subscribe(items => {
      if (items && items.length > 0) {
        this.turnosList = items;
      } else {
        this.turnosList = [];
      }
      subject.next(this.turnosList);
    });
  }

  public updateTableData(): void {
    const turnoTableData = TurnoHelper.buildTurneraBrowseDataTable(this.turnosList);
    this._turnosDataSource.next(turnoTableData);
  }
}
