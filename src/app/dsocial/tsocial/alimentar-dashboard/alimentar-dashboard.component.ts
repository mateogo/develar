import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { Person, BeneficiarioAlimentar, Address, personModel } from '../../../entities/person/person';

import { DsocialController } from '../../dsocial.controller';
import { devutils }from '../../../develar-commons/utils'


@Component({
  selector: 'alimentar-dashboard',
  templateUrl: './alimentar-dashboard.component.html',
  styleUrls: ['./alimentar-dashboard.component.scss']
})
export class AlimentarDashboardComponent implements OnInit {
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


  constructor(
      private dsCtrl: DsocialController,
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


    let sscrp2 = this.dsCtrl.fetchTarjetasPorDiaDashboard(fecharef).subscribe(master => {
      this.masterData = master;

      Object.keys(this.masterData).forEach(t => {
        let token = this.masterData[t] as EntregasDia;
        let isHoy = token.dia === this.hoy.toLowerCase(); 

        token.porciento = parseFloat(token.porciento).toFixed(2) + "%";
        token.isHoy = isHoy;


       this.cards.push(this.masterData[t]);
      })

    //   this.refreshView(this.query);
    });

    // this.unBindList.push(sscrp2);
  }


  moveOn(e){
  	e.stopPropagation();
  	e.preventDefault();
  }


  verEntregadas(e, card: EntregasDia){
    let query = {dia: card.dia, estado: 'entregada'};
    this.searchDay = card.dia;

    this.dsCtrl.fetchTarjetas(query).subscribe(tokens => {

      this.beneficiariosList = tokens;
      this.normaliseList(this.beneficiariosList);

      this.showList = true;

    });
  }

  verRemanentes(e, card: EntregasDia){
    let query = {dia: card.dia, estado: 'pendiente'};
    this.searchDay = card.dia;

    this.dsCtrl.fetchTarjetas(query).subscribe(tokens => {

      this.beneficiariosList = tokens;
      this.normaliseList(this.beneficiariosList);

      this.showList = true;

    });
  }


  private normaliseList(lista: BeneficiarioAlimentar[]){
    if(lista && lista.length){

      lista.forEach(t => {
        if(t.estado === 'entregada'){
          let d = new Date(t.fe_ts);
          t.hora = d.getHours() + ":" + d.getMinutes();
        } else {
          t.hora = '';
        }

      })
    }
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