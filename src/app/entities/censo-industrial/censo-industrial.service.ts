import { Injectable } from '@angular/core';
import { DaoService } from '../../develar-commons/dao.service';
import { CensoIndustrias, CensoIndustriasTable, CensoIndustriasQuery } from './censo.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { CensoIndustriasHelper } from './censo-industrial.helper';

const RECORD = 'censoindustrias';

@Injectable({
  providedIn: 'root'
})
export class CensoIndustrialService {

  /**
   * Origen de datos para la tabla del navegador de censos industriales
   */
  private _censosIndustrialesDataSource: BehaviorSubject<CensoIndustriasTable[]> = new BehaviorSubject<CensoIndustriasTable[]>([]);
  private censosIndustrialesList: CensoIndustrias[];

  constructor(
    private dao: DaoService
  ) { }

  public fetchAll(): Observable<CensoIndustrias[]> {
    return this.dao.fetchAll<CensoIndustrias>(RECORD);
  }

  public fetchByQuery(queryobj): Observable<CensoIndustrias[]> {
    return this.dao.search<CensoIndustrias>(RECORD, queryobj);
  }




  /**
   * Navegador de censos industriales
   */
  get dataRecordsSource(): BehaviorSubject<CensoIndustriasTable[]> {
    return this._censosIndustrialesDataSource;
  }

  private loadcensosIndustrialesByQuery(subject: BehaviorSubject<CensoIndustrias[]>, query: CensoIndustriasQuery): void {
    this.fetchByQuery(query).subscribe(items => {
      if (items && items.length > 0) {
        this.censosIndustrialesList = items;
      } else {
        this.censosIndustrialesList = [];
      }

      console.log('censo industrial service censoIndustriasList --> %o', this.censosIndustrialesList);


      subject.next(this.censosIndustrialesList);
    });
  }

  public fetchCensosIndustrialesByQuery(query: CensoIndustriasQuery): BehaviorSubject<CensoIndustrias[]> {
    const subject = new BehaviorSubject<CensoIndustrias[]>([]);
    this.loadcensosIndustrialesByQuery(subject, query);
    return subject;
  }

  public updateTableData(): void {
    const censoTableData = CensoIndustriasHelper.buildCensoTableData(this.censosIndustrialesList);

    console.log('censo industrial service censoIndustriasListTableData --> %o', censoTableData);
    this._censosIndustrialesDataSource.next(censoTableData);
  }
}
