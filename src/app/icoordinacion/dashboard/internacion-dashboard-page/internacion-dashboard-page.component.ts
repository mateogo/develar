import { Component, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Person, personModel } from '../../../entities/person/person';

import { SolInternacionBrowse } from '../../../salud/internacion/internacion.model';

import { InternacionService } from '../../../salud/internacion/internacion.service';
import { InternacionHelper } from '../../../salud/internacion/internacion.helper';

import { devutils }from '../../../develar-commons/utils'



const SEGUIMIENTO = 'SEGUIMIENTO';
const SEARCH = 'search';
const EXPORT = 'export';


@Component({
  selector: 'internacion-dashboard-page',
  templateUrl: './internacion-dashboard-page.component.html',
  styleUrls: ['./internacion-dashboard-page.component.scss']
})
export class InternacionDashboardPageComponent implements OnInit {
  public query: SolInternacionBrowse;

  public data$ = new BehaviorSubject<any>({});

  public showData: boolean = false; 

  constructor(
    	private dsCtrl: InternacionService,
  	) { }

  ngOnInit(): void {

  	this.query = new SolInternacionBrowse();
  }

  refreshSelection(query: SolInternacionBrowse){
    this.query = InternacionHelper.cleanQueryToken(query, false);
    this.data$.next(this.query);

    this.showData = false;

    console.log('Refresh Selection: listo para buscar');

    if(query.searchAction === SEARCH){

    	this.dsCtrl.fetchInternacionesByQuery(this.query).subscribe(list =>{
    		if(list && list.length){

    			console.log('Resultado búsqueda: [%s]', list.length);

          this.data$.next(list);
          this.showData = true;

    		}else{
    			console.log('Sin Reultados')
    		}

    	})

		}else if (query.searchAction === EXPORT){

		}

 }



}
