import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { Person, BeneficiarioAlimentar, Address, personModel } from '../../../../entities/person/person';
import {   Asistencia, 
          AsistenciaTable,
          AsistenciaBrowse,
          AsistenciaHelper } from '../../../asistencia/asistencia.model';

import { SaludController } from '../../../salud.controller';
import { devutils }from '../../../../develar-commons/utils'

@Component({
  selector: 'solcovid-dashboard',
  templateUrl: './solcovid-dashboard.component.html',
  styleUrls: ['./solcovid-dashboard.component.scss']
})
export class SolcovidDashboardComponent implements OnInit {
	public token = {
		dia: 'viernes 23-01',
		total: 100,
		entregadas: 79,
		porciento: '23%'
	}

	public cards = [this.token];
	public fecharef_date: Date;
	public fecharef;
	public fecharef_label;
  public isHoy = true;


  public title = 'Tablero Solicitudes';
  public unBindList = [];

	public showChart = false;
  public masterData;
  public hoy;

  public showList = false;
  public searchDay = '';
  public beneficiariosList: BeneficiarioAlimentar[] = [];

  public summaryCards = [];
  public stateCards = []
  public asistenciasList: Asistencia[];



  constructor(
      private dsCtrl: SaludController,
    	private router: Router,
    	private route:  ActivatedRoute,
    ) { 

  }

  ngOnInit() {
  	this.initCurrentPage();

  }

  initCurrentPage(){

    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);
    this.fecharef_date = new Date();
    this.fecharef = devutils.txFromDate(this.fecharef_date);
    this.fecharef_label = devutils.txForCurrentWeek(this.fecharef_date);
    this.hoy = devutils.txDayFormatFromDate(Date.now());

    this.loadDashboardData(this.fecharef_date)    
  }

  loadDashboardData(fecharef: Date){
    this.cards = [];


    let sscrp2 = this.dsCtrl.buildTableroCovid(fecharef).subscribe(master => {
      this.masterData = master;

      this.summaryCards.push(this.masterData.hoy);
      this.summaryCards.push(this.masterData.semana);
      this.masterData.meses.forEach(t => {
      	this.summaryCards.push(t.token);
      })


      this.masterData.estados.forEach(t => {
      	this.stateCards.push(t.token);
      })



      // Object.keys(this.masterData).forEach(t => {
      //   let token = this.masterData[t] as EntregasDia;
      //   let isHoy = token.dia === this.hoy.toLowerCase(); 

      //   token.porciento = parseFloat(token.porciento).toFixed(2) + "%";
      //   token.isHoy = isHoy;


      //  this.cards.push(this.masterData[t]);
      // })

    //   this.refreshView(this.query);
    });

    // this.unBindList.push(sscrp2);
  }


  moveOn(e){
  	e.stopPropagation();
  	e.preventDefault();
  }

  verDetalle(e, card: EntregasDia){

    this.fetchSolicitudes(card);
  }



  private fetchSolicitudes(card: any){
    let query = {avance : card.key};

    this.showList = false;

    if(!query){
      query = new AsistenciaBrowse();
      query['avance'] = 'emitido';

    }


    this.dsCtrl.fetchAsistenciaByQuery(query).subscribe(list => {
      if(list && list.length > 0){
        this.asistenciasList = list;

        this.sortProperly(this.asistenciasList);

        this.showList = true;

      }else {
        this.asistenciasList = [];

        this.showList = false;

      }

    })

  }

  private sortProperly(records: Asistencia[]){
    let ts_now = Date.now();

    records.sort((fel: Asistencia, sel: Asistencia)=> {
      let fprio = fel.prioridad || 2;
      let sprio = sel.prioridad || 2;

      if(fprio < sprio ) return 1;

      else if(fprio > sprio ) return -1;

      else{
        let cfel = AsistenciaHelper.getCostoEsperaCovid(fel, ts_now);
        let csel = AsistenciaHelper.getCostoEsperaCovid(sel, ts_now);

        if(cfel < csel ) return 1;

        else if(cfel > csel) return -1;

        else return 0;
      }


    });
  }

}



interface DashboardData {
	label: string;
	cardinal: number;
	slug: string;

}

class ChartData {
	type: string;
	labels: string[] = [];
	data : any[] = [];
	styles: any[] = [];
	opts: any ={};
	title: string = "";
	stitle: string = "";
	slug: string = "";
	error: string = "";

}


interface EntregasDia {
	dia: string;
	total: number;
	entregadas: number;
	porciento: string;
  isHoy: boolean;
}