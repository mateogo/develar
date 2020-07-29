import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SaludController } from '../../../salud.controller';

import { 	Asistencia, 
          AsistenciaTable,
          VigilanciaBrowse,
					Alimento,
          AsistenciaSig, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../../asistencia/asistencia.model';

const SEGUIMIENTO = 'SEGUIMIENTO';
const SEARCH = 'search';
const EXPORT = 'export';

@Component({
  selector: 'app-llamados-dashboard-page',
  templateUrl: './llamados-dashboard-page.component.html',
  styleUrls: ['./llamados-dashboard-page.component.scss']
})
export class LlamadosDashboardPageComponent implements OnInit, OnDestroy {
  public query: VigilanciaBrowse;

  public data$ = new BehaviorSubject<any>({});

  constructor(
      private dsCtrl: SaludController,
  	) { }


  ngOnInit(): void {
		this.query = new VigilanciaBrowse();
		this.query.reporte = SEGUIMIENTO;

  }

  ngOnDestroy(): void {
  	delete this.query;
  }

  /************************/
  /*   TEMPLATE EVENTS   */
  /**********************/
  refreshSelection(query: VigilanciaBrowse){

    this.query = AsistenciaHelper.cleanQueryToken(query, false);

    if(query.searchAction === SEARCH){
    	this.fetchSolicitudes(this.query);

		}else if (query.searchAction === EXPORT){
			this.dsCtrl.exportSequimientosByQuery(this.query);

		}

 }



  /************************/
  /*    Sol/Asistencia   */
  /**********************/
  private fetchSolicitudes(query: any){

    this.data$.next(this.query)

    this.dsCtrl.fetchSeguimientoByQuery(query).subscribe(list => {
      if(list && list.length > 0){
      	//this.data$.next(list);

      }else {
      	//

      }

    })
  }



}
