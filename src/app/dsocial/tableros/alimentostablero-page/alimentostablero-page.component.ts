import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Person, Address, personModel } from '../../../entities/person/person';

import { DsocialController } from '../../dsocial.controller';
import { devutils }from '../../../develar-commons/utils'

import { 	Asistencia,
					AsistenciaHelper } from '../../asistencia/asistencia.model';

import {  RemitoAlmacen,
          Tile,
          DashboardBrowse,
          ProductosAlmacenTable,
          AlimentosHelper } from '../../alimentos/alimentos.model';



@Component({
  selector: 'alimentostablero-page',
  templateUrl: './alimentostablero-page.component.html',
  styleUrls: ['./alimentostablero-page.component.scss']
})
export class AlimentostableroPageComponent implements OnInit {

  public title = 'Tablero Remitos Almacén';
  public unBindList = [];
  public query: DashboardBrowse = AlimentosHelper.defaultQueryForTablero();

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


  public tableDataSource = new BehaviorSubject<ProductosAlmacenTable[]>([]);
  private tableData: ProductosAlmacenTable[] = [];


	public form: FormGroup;
	public showChart = false;
  public showProductTable = false;

	public dia: DashboardData = {
		label: "Hoy",
		cardinal: 0,
		slug: 'Filtrar SOLO ESTE DÍA'
	}

  public sem: DashboardData = {
    label: "Esta semana",
    cardinal: 0,
    slug: 'Filtrar ESTA SEMANA'
  }

	public mes: DashboardData = {
		label: "Este mes",
		cardinal: 0,
		slug: 'Filtrar ESTE MES'
	}

	public anio: DashboardData = {
		label: "Este año",
		cardinal: 0,
		slug: 'Filtrar ESTE AÑO'
	}

  private fecharef: string;
  private fecharef_date: Date;
  public fecharef_label: string;

  public isHoy =  false;
  public isSem =  false;
  public isMes =  false;
  public isAnio = false;


	private personHelperByCity = {};
	public personByCity: ChartData = new ChartData();

  private remitoalmacenHelperByAction = {};
  public remitoalmacenByAction: ChartData = new ChartData();

  private remitoalmacenHelperBySector = {};
  public remitoalmacenBySector: ChartData = new ChartData();

  private remitoalmacenHelperByTmov = {};
  public remitoalmacenByTmov: ChartData = new ChartData();

  private remitoalmacenHelperByDeposito = {};
  public remitoalmacenByDeposito: ChartData = new ChartData();


  // Sol de Asistencia
  public remitoalmacenList: Asistencia[];
  public itemsFound = false;
  public currentAsistencia:Asistencia;

  // TABLERO
  private masterData;
  public tiles: Tile[] = [];



  constructor(
      private dsCtrl: DsocialController,
    	private router: Router,
    	private fb: FormBuilder,
    	private route:  ActivatedRoute,
    ) { 
  		this.form = this.buildForm();
      this.sectorOptList = this._sectorOptList.map(t => t);
      this.sectorOptList.unshift({val: 'no_definido',  type:'Sin selección', label: 'Sin selección' })

  }

  ngOnInit() {
  	this.initCurrentPage();

  }

  initCurrentPage(){

    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);
    this.fecharef_date = new Date();
    this.fecharef = devutils.txFromDate(this.fecharef_date);
    this.fecharef_label = devutils.txForCurrentWeek(this.fecharef_date);

    this.loadDashboardData(this.fecharef_date)
    
    this.initForm(this.form, this.query);
  }

  loadDashboardData(fecharef: Date){
    this.initPersonByCityChart();
    this.initAsistenciasByActionChart();
    this.initAsistenciasBySectorChart();
    this.tiles = [];

    let sscrp2 = this.dsCtrl.fetchRemitoalmacenDashboard(fecharef).subscribe(master => {
      this.masterData = master;

      Object.keys(this.masterData).forEach(t => {
        // console.dir(t)
        // console.log('Edad [%s] [%s] [%s]', this.masterData[t].edadId, this.masterData[t].sexo, this.masterData[t].cardinal)
        this.tiles.push(this.masterData[t]);
      })

      this.refreshView(this.query);
    })

    this.unBindList.push(sscrp2);
  }

  // Pie

  initForm(form: FormGroup, query: DashboardBrowse): FormGroup {

		form.reset({
        action:      query.action,
        sector:      query.sector,
        estado:      query.estado,
        avance:      query.avance,
        fecharef:    this.fecharef
		});
		return form;
  }

  buildForm(): FormGroup{
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
		
		this.refreshView(this.query);
  }

  toggleHoy(e){
    this.isHoy = !this.isHoy;

    if(this.isHoy){
      this.isSem = false;
      this.isMes = false;
      this.isAnio = false;
    }
    this.refreshView(this.query);
  }

 toggleSem(e){
    this.isSem = !this.isSem;

    if(this.isSem){
      this.isHoy = false;
      this.isMes = false;
      this.isAnio = false;
    }
    this.refreshView(this.query);
  }

  toggleMes(e){
    this.isMes = !this.isMes;

    if(this.isMes){
      this.isHoy = false;
      this.isSem = false;
      this.isAnio = false;
    }
    this.refreshView(this.query);
  }

  toggleAnio(e){
    this.isAnio = !this.isAnio;

    if(this.isAnio){
      this.isHoy = false;
      this.isSem = false;
      this.isMes = false;
    }
    this.refreshView(this.query);
  }

  refreshData(e){
    let fe = this.form.value.fecharef;
    this.fecharef_date = devutils.dateFromTx(fe);
    this.fecharef = devutils.txFromDate(this.fecharef_date);
    this.fecharef_label = devutils.txForCurrentWeek(this.fecharef_date);

    // let sscrp2 = this.dsCtrl.fetchRemitoalmacenDashboard(this.fecharef_date).subscribe(master => {
    //   console.dir(master);

    // })

    this.loadDashboardData(this.fecharef_date);
  }


  isWithinScope(t: Tile, q: DashboardBrowse): boolean {
  	let ok = true;
  	Object.keys(q).forEach(k => {
  		if(q[k]!== "no_definido"){
  			if(q[k] !== t[k]){
  				ok = false;
  			}
  		}
  	})
    if(!ok) return ok;

    if(this.isHoy){
      ok = this.selectJusToday(t);
    }

    if(this.isMes){
      ok = this.selectJusThisMonth(t);
    }

    if(this.isSem){
      ok = this.selectJusThisWeek(t);
    }


  	return ok;
  }

  selectJusToday(t:Tile): boolean {
    return t.id.substr(6,2)!=="00" ? true: false;
  }

  selectJusThisMonth(t:Tile): boolean {
    return t.id.substr(4,2)!=="00" ? true: false;
  }

  selectJusThisWeek(t:Tile): boolean {
    return t.sem ==="SE" ? true: false;
  }

  resetData(){
  	this.dia.cardinal = 0;
    this.sem.cardinal = 0;
  	this.mes.cardinal = 0;
  	this.anio.cardinal = 0;
    this.tableData = [];



  	this.personHelperByCity = {};
  	this.personByCity.error = "";

    this.remitoalmacenHelperByAction = {};
    this.remitoalmacenByAction.error = "";

    this.remitoalmacenHelperBySector = {};
    this.remitoalmacenBySector.error = "";


  }

  /******************
   acum By Date
  *********************/
  acumByDate(t:Tile){
    //console.log('t.id:[%s]  SEM:[%s]', t.id.substr(0,10), t.sem)
  	if(t.id.substr(6,2)!=="00"){
  		this.dia.cardinal += t.cardinal;
  		this.mes.cardinal += t.cardinal;

  	} else if(t.id.substr(4,2)!=="00"){
  		this.mes.cardinal += t.cardinal;
  	}

    if(t.sem === 'SE'){
      this.sem.cardinal += t.cardinal;
    }

  	this.anio.cardinal += t.cardinal;
  }

  /******************
   DataByCity
  *********************/
	initPersonByCityChart(){
		this.personByCity.type = 'pie';

		this.personByCity.labels = [];

	  this.personByCity.data = [];

		this.personByCity.styles = [
		    {
		      backgroundColor: [
			        "#778391",
			        "#5dade0",
			        "#3c4e62",
			        "#778391",
			        "#5dade0",
			        "#3c4e62",
			        "#5dade0",
			        "#5aa9da",
			        "#56a9de",
			        "#4ea1d9",
			        "#47a7d7",
			        "#42a2d2",
			        "#3e9ece",
			        "#3797c7",
			        "#3292c2",
			        "#2d8dbd",
			        "#5dade0",
			        "#5dade0",
			        "#5dade0",
			        "#5dade0",
			        "#5dade0",
			        "#5dade0",
			        "#5dade0",
			        "#3c4e62",
			        "#778391",
			        "#5dade0",
			        "#3c4e62",
			        "#778391",
			        "#5dade0",
			        "#3c4e62",
			      ],
		    }
  		];
		this.personByCity.opts = {
		    elements: {
		      arc : {
		        	borderWidth: 0
		      	}
		    },
		    tooltips: false
		  };

	}

  acumByPersonCity(t:Tile){
  	if(this.personHelperByCity[t.ciudad]){
  		this.personHelperByCity[t.ciudad].cardinal += t.cardinal;

  	}else {
 			this.personHelperByCity[t.ciudad] = {
 				cardinal: t.cardinal,
 				label: personModel.getCiudadLabel(t.ciudad)
 			}
  	}
  }

  resetPersonByCityChart(){

  	let personArray = []
  	Object.keys(this.personHelperByCity).forEach(k => {

  			personArray.push(this.personHelperByCity[k]);

  	})


    personArray.sort((fel, sel)=> {
      if(fel.cardinal < sel.cardinal) return 1;
      else if(fel.cardinal > sel.cardinal) return -1;
      else return 0;
    })

    this.personByCity.data = personArray.map(t => t.cardinal);
    this.personByCity.labels = personArray.map(t => t.label);
    this.personByCity.title  = "Ciudad" //+ this.personByCity.data.reduce((p, t)=> p+t);
    this.personByCity.stitle =  "" //"Asistencias por ciudad";
    this.personByCity.slug = personArray.reduce((p, t)=>p + t.cardinal + "::" + t.label + " / ", " ");

  }

  /******************
   AsistenciasBySECTOR
  *********************/
  initAsistenciasBySectorChart(){
    this.remitoalmacenBySector.type = 'pie';

    this.remitoalmacenBySector.labels = [];

    this.remitoalmacenBySector.data = [];

    this.remitoalmacenBySector.styles = [
        {
          backgroundColor: [
              "#778391",
              "#5dade0",
              "#3c4e62",
              "#778391",
              "#5dade0",
              "#3c4e62",
              "#5dade0",
              "#5aa9da",
              "#56a9de",
              "#4ea1d9",
              "#47a7d7",
              "#42a2d2",
              "#3e9ece",
              "#3797c7",
              "#3292c2",
              "#2d8dbd",
              "#5dade0",
              "#5dade0",
              "#5dade0",
              "#5dade0",
              "#5dade0",
              "#5dade0",
              "#5dade0",
              "#3c4e62",
              "#778391",
              "#5dade0",
              "#3c4e62",
              "#778391",
              "#5dade0",
              "#3c4e62",
            ],
        }
      ];
    this.remitoalmacenBySector.opts = {
        elements: {
          arc : {
              borderWidth: 0
            }
        },
        tooltips: false
      };

  }

  acumByAsistenciasSector(t:Tile){
    if(this.remitoalmacenHelperBySector[t.sector]){
      this.remitoalmacenHelperBySector[t.sector].cardinal += t.cardinal;

    }else {
       this.remitoalmacenHelperBySector[t.sector] = {
         cardinal: t.cardinal,
         label: AsistenciaHelper.getOptionLabel('sectores', t.sector)
       }
    }
  }

  resetAsistenciasBySectorChart(){
    let sectorArray = []

    Object.keys(this.remitoalmacenHelperBySector).forEach(k => {
        sectorArray.push(this.remitoalmacenHelperBySector[k]);
    })

    sectorArray.sort((fel, sel)=> {
      if(fel.cardinal < sel.cardinal) return 1;
      else if(fel.cardinal > sel.cardinal) return -1;
      else return 0;
    })

    this.remitoalmacenBySector.data = sectorArray.map(t => t.cardinal);
    this.remitoalmacenBySector.labels = sectorArray.map(t => t.label);
    this.remitoalmacenBySector.title  = "Sector " //+ this.remitoalmacenBySector.data.reduce((p, t)=> p+t);
    this.remitoalmacenBySector.stitle = "" ;//Asistencias por Sector";
    this.remitoalmacenBySector.slug = sectorArray.reduce((p, t)=>p + t.cardinal + "::" + t.label + " / ", " ");
  }


  /******************
   AsistenciasByACTION
  *********************/
  initAsistenciasByActionChart(){
    this.remitoalmacenByAction.type = 'pie';

    this.remitoalmacenByAction.labels = [];

    this.remitoalmacenByAction.data = [];

    this.remitoalmacenByAction.styles = [
        {
          backgroundColor: [
              "#778391",
              "#5dade0",
              "#3c4e62",
              "#778391",
              "#5dade0",
              "#3c4e62",
              "#5dade0",
              "#5aa9da",
              "#56a9de",
              "#4ea1d9",
              "#47a7d7",
              "#42a2d2",
              "#3e9ece",
              "#3797c7",
              "#3292c2",
              "#2d8dbd",
              "#5dade0",
              "#5dade0",
              "#5dade0",
              "#5dade0",
              "#5dade0",
              "#5dade0",
              "#5dade0",
              "#3c4e62",
              "#778391",
              "#5dade0",
              "#3c4e62",
              "#778391",
              "#5dade0",
              "#3c4e62",
            ],
        }
      ];
    this.remitoalmacenByAction.opts = {
        elements: {
          arc : {
              borderWidth: 0
            }
        },
        tooltips: false
      };

  }

  acumByAsistenciasAction(t:Tile){
    if(this.remitoalmacenHelperByAction[t.action]){
      this.remitoalmacenHelperByAction[t.action].cardinal += t.cardinal;

    }else {
       this.remitoalmacenHelperByAction[t.action] = {
         cardinal: t.cardinal,
         label: AsistenciaHelper.getOptionLabel('actions', t.action)
       }
    }
  }

  resetAsistenciasByActionChart(){

    let actionArray = []
    Object.keys(this.remitoalmacenHelperByAction).forEach(k => {

        actionArray.push(this.remitoalmacenHelperByAction[k]);

    })

    actionArray.sort((fel, sel)=> {
      if(fel.cardinal < sel.cardinal) return 1;
      else if(fel.cardinal > sel.cardinal) return -1;
      else return 0;
    })

    this.remitoalmacenByAction.data = actionArray.map(t => t.cardinal);
    this.remitoalmacenByAction.labels = actionArray.map(t => t.label);
    this.remitoalmacenByAction.title  = "Tipo de Acción " //+ this.remitoalmacenByAction.data.reduce((p, t)=> p+t);
    this.remitoalmacenByAction.stitle = "" ;//Asistencias por tipo de Acción";
    this.remitoalmacenByAction.slug = actionArray.reduce((p, t)=>p + t.cardinal + "::" + t.label + " / ", " ");

  }





  /******************
   Worker
  *********************/

  private addTileToTable(t: Tile){
    let token = AlimentosHelper.tileToTableData(t);
    this.lookUpOnTable(token);

  }

  private lookUpOnTable(tile: ProductosAlmacenTable){
    let token = this.tableData.find(t => t._id === tile._id )
    if(token){
      token.qty += tile.qty;

    }else{
      this.tableData.push(tile);
    }

  }

  reduceTileData(t: Tile){
  	this.acumByDate(t);
  	this.acumByPersonCity(t);
    this.acumByAsistenciasAction(t);
    this.acumByAsistenciasSector(t);
    this.addTileToTable(t);

  }

  refreshView(query: DashboardBrowse){
  	this.showChart = false;
  	this.resetData();

  	setTimeout(()=>{
				//this.query = { ...this.form.value };
		  	this.tiles.forEach(t => {
		  		if(this.isWithinScope(t, query)){
		  			this.reduceTileData(t)
		  		}
		  	});
		  	this.resetPersonByCityChart();
        this.resetAsistenciasByActionChart();
        this.resetAsistenciasBySectorChart();
        this.tableDataSource.next(this.tableData);
  			this.showChart = true;
        this.showProductTable = true;
  	},200)

  }

  moveOn(e){
  	e.stopPropagation();
  	e.preventDefault();
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



