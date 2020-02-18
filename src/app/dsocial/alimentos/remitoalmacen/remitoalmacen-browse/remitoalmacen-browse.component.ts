import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Person, Address, personModel } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

import { 	Asistencia,
					AsistenciaHelper } from '../../../asistencia/asistencia.model';

import {  RemitoAlmacen,
          Tile,
          RemitoalmacenBrowse,
          ProductosAlmacenTable,
          AlimentosHelper } from '../../../alimentos/alimentos.model';



@Component({
  selector: 'remitoalmacen-browse',
  templateUrl: './remitoalmacen-browse.component.html',
  styleUrls: ['./remitoalmacen-browse.component.scss']
})
export class RemitoalmacenBrowseComponent implements OnInit {
	@Input() query: RemitoalmacenBrowse = AlimentosHelper.defaultQueryForAlmacen();
	@Output() updateQuery = new EventEmitter<RemitoalmacenBrowse>();


  public title = 'Selección de movimientos de almacén';
  public unBindList = [];

  public actionOptList =   AsistenciaHelper.getOptionlist('actions');
  public _sectorOptList =   AsistenciaHelper.getOptionlist('sectores');
  public sectorOptList =    [];
  public depositoOptList =  AsistenciaHelper.getOptionlist('deposito');

  public avanceOptList =   AsistenciaHelper.getOptionlist('avance');
  public estadoOptList =   AsistenciaHelper.getOptionlist('estado');

  public tmovOptList =     AlimentosHelper.getOptionlist('tmov');
  public umeOptList =      AlimentosHelper.getOptionlist('ume');

  public ciudadesOptList = AsistenciaHelper.getOptionlist('ciudades');
  public ciudadesList =    personModel.ciudades;


	public form: FormGroup;

  private fecharef: string;
  private fecharef_date: Date;
  public  fecharef_label: string;

  public isHoy =  false;
  public isSem =  false;
  public isMes =  false;
  public isAnio = false;


	private personHelperByCity = {};
	public  personByCity: ChartData = new ChartData();

  private remitoalmacenHelperByAction = {};
  public  remitoalmacenByAction: ChartData = new ChartData();

  private remitoalmacenHelperBySector = {};
  public  remitoalmacenBySector: ChartData = new ChartData();

  private remitoalmacenHelperByTmov = {};
  public  remitoalmacenByTmov: ChartData = new ChartData();

  private remitoalmacenHelperByDeposito = {};
  public  remitoalmacenByDeposito: ChartData = new ChartData();


  // Sol de Asistencia
  public remitoalmacenList: Asistencia[];
  public itemsFound = false;
  public currentAsistencia:Asistencia;

  // TABLERO
  private masterData;
  public tiles: Tile[] = [];

  constructor(
    	private fb: FormBuilder,
    ) { 
  		this.form = this.buildForm();
      this.sectorOptList = this._sectorOptList.map(t => t);
      this.sectorOptList.unshift({val: 'no_definido',  type:'Sin selección', label: 'Sin selección' })

  }

  ngOnInit() {
  	this.initCurrentPage();
  }

  private initCurrentPage(){

    this.fecharef_date = new Date();
    this.fecharef = devutils.txFromDate(this.fecharef_date);
    this.fecharef_label = devutils.txForCurrentWeek(this.fecharef_date);
    
    this.initForm(this.form, this.query);
  }


  /************************/
  /*     EVENTS           */
  /**********************/
  onSubmit(action){
    this.submitQuery(this.form, this.query);
    this.emitEvent(action);
  }

  onCancel(){
    this.emitEvent('cancel');
  }

  private emitEvent(action: string){
    console.log('emitEvent: [%s]', action)
    this.query.searchAction = action;
    this.updateQuery.next(this.query);
  }


  /************************/
  /*     FORM            */
  /**********************/
  private buildForm(): FormGroup{
    let form: FormGroup;

    form = this.fb.group({
      sector:       [null],
      action:       [null],
      avance:       [null],
      estado:       [null],
      fecharef:     [null]
    });

    return form;
  }

  private initForm(form: FormGroup, query: RemitoalmacenBrowse): FormGroup {

		form.reset({
        action:      query.action,
        sector:      query.sector,
        estado:      query.estado,
        avance:      query.avance,
        fecharef:    this.fecharef
		});
		return form;
  }

  private submitQuery(form: FormGroup, query: RemitoalmacenBrowse): RemitoalmacenBrowse {
    const fvalue = form.value;
    const entity = query;
    let dateD = devutils.dateFromTx(fvalue.fecomp_d);
    let dateH = devutils.dateFromTx(fvalue.fecomp_h);

    // entity.fecomp_d =   fvalue.fecomp_d;
    // entity.fecomp_h =   fvalue.fecomp_h;

    // entity.fecomp_ts_d = dateD ? dateD.getTime() : null;
    // entity.fecomp_ts_h = dateH ? dateH.getTime() : null;


    entity.action =       fvalue.action;
    entity.sector =       fvalue.sector;
    entity.estado =       fvalue.estado;
    entity.avance =       fvalue.avance;

    return entity;
  }

  /************************/
  /*    Product Table    */
  /**********************/

  tableAction(e){
    //console.log('TableAction ToDo');
  }


  /************************/
  /*  Dashboard control  */
  /**********************/
	changeSelectionValue(type, val){
		//console.log('type: [%s] val:[%s] same:[%s]', type, val, this.query === this.form.value);
		this.query[type] = val;
		
  }


  refreshData(e){
    let fe = this.form.value.fecharef;
    this.fecharef_date = devutils.dateFromTx(fe);
    this.fecharef = devutils.txFromDate(this.fecharef_date);
    this.fecharef_label = devutils.txForCurrentWeek(this.fecharef_date);
    console.log('refreshData to BEGIN')

    // let sscrp2 = this.dsCtrl.fetchRemitoalmacenDashboard(this.fecharef_date).subscribe(master => {
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




