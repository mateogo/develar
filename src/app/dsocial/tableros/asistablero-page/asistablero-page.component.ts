import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { Person, Address, personModel } from '../../../entities/person/person';

import { DsocialController } from '../../dsocial.controller';

import { 	Asistencia,
 					Tile,
          AsistenciaTable,
          AsistenciaBrowse,
          DashboardBrowse,
					Alimento,
          AsistenciaSig, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../asistencia/asistencia.model';


@Component({
  selector: 'asistablero-page',
  templateUrl: './asistablero-page.component.html',
  styleUrls: ['./asistablero-page.component.scss']
})
export class AsistableroPageComponent implements OnInit {

  public title = 'Tablero Solicitudes';
  public unBindList = [];
  public query: DashboardBrowse = AsistenciaHelper.defaultQueryForTablero();

  public actionOptList =   AsistenciaHelper.getOptionlist('actions');
  public sectorOptList =   AsistenciaHelper.getOptionlist('sectores');
  public ciudadesOptList = AsistenciaHelper.getOptionlist('ciudades');
  public avanceOptList =   AsistenciaHelper.getOptionlist('avance');
  public estadoOptList =   AsistenciaHelper.getOptionlist('estado');
  public encuestaOptList = AsistenciaHelper.getOptionlist('encuesta');
  public urgenciaOptList = AsistenciaHelper.getOptionlist('urgencia');
  public ciudadesList =    personModel.ciudades;

	public form: FormGroup;
	public showChart = false;
	//AcumByDate
	public dia: DashboardData = {
		label: "Hoy",
		cardinal: 0,
		slug: 'Asistencias'
	}

	public mes: DashboardData = {
		label: "Este mes",
		cardinal: 0,
		slug: 'Asistencias'
	}

	public anio: DashboardData = {
		label: "Este año",
		cardinal: 0,
		slug: 'Asistencias'
	}

	private personHelperByAge = {};
	public personByAge: ChartData = new ChartData();

	private personHelperBySex = {};
	public personBySex: ChartData = new ChartData();

	private personHelperByCity = {};
	public personByCity: ChartData = new ChartData();


  //Person


  // Sol de Asistencia
  public asistenciasList: Asistencia[];
  public itemsFound = false;
  public currentAsistencia:Asistencia;

  private masterData;

  public tiles: Tile[] = [];



  constructor(
      private dsCtrl: DsocialController,
    	private router: Router,
    	private fb: FormBuilder,
    	private route:  ActivatedRoute,
    ) { 
  		this.form = this.buildForm();

  }

  ngOnInit() {
  	this.initCurrentPage();

  }

  initCurrentPage(){
    let sscrp2 = this.dsCtrl.fetchAsistenciasDashboard().subscribe(master => {
    	this.masterData = master;

    	Object.keys(this.masterData).forEach(t => {
    		//console.log('Edad [%s] [%s] [%s]', this.masterData[t].edadId, this.masterData[t].sexo, this.masterData[t].cardinal)
    		this.tiles.push(this.masterData[t]);
    	})

    	this.refreshView(this.query);
    })

    this.unBindList.push(sscrp2);

    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);
    
    this.initForm(this.form, this.query);

    this.initPersonByAgeChart();
    this.initPersonBySexChart();
    this.initPersonByCityChart();
  }



  // Pie

  initForm(form: FormGroup, query: DashboardBrowse): FormGroup {

		form.reset({
        action:      query.action,
        sector:      query.sector,
        estado:      query.estado,
        avance:      query.avance,
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
    });

    return form;
  }

  /************************/
  /*    Dashboard control   */
  /**********************/
	changeSelectionValue(type, val){
		//console.log('type: [%s] val:[%s] same:[%s]', type, val, this.query === this.form.value);
		this.query[type] = val;
		
		this.refreshView(this.query);
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

  	return ok;
  }

  resetData(){
  	this.dia.cardinal = 0;
  	this.mes.cardinal = 0;
  	this.anio.cardinal = 0;

  	this.personHelperByAge = {};
  	this.personByAge.error = "";

  	this.personHelperBySex = {};
  	this.personBySex.error = "";

  	this.personHelperByCity = {};
  	this.personByCity.error = "";

  }

  /******************
   acum By Date
  *********************/
  acumByDate(t:Tile){
  	if(t.id.substr(6,2)!=="00"){
  		this.dia.cardinal += t.cardinal;
  		this.mes.cardinal += t.cardinal;

  	} else if(t.id.substr(4,2)!=="00"){
  		this.mes.cardinal += t.cardinal;
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
    this.personByCity.title  = " " + this.personByCity.data.reduce((p, t)=> p+t);
    this.personByCity.stitle = "Asistencias por ciudad";
    this.personByCity.slug = personArray.reduce((p, t)=>p + t.cardinal + "::" + t.label + " / ", " ");

  }




  /******************
   PersonBySex
  *********************/
	initPersonBySexChart(){
		this.personBySex.type = 'pie';

		this.personBySex.labels = [];

	  this.personBySex.data = [];

		this.personBySex.styles = [
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
		this.personBySex.opts = {
		    elements: {
		      arc : {
		        	borderWidth: 0
		      	}
		    },
		    tooltips: false
		  };

	}



  labelForPersonSex(id){
  	if(id === "F") return "Mujer"
  	if(id === "M") return "Varón"
  	return "S/Dato"
  }

  acumByPersonSex(t:Tile){
  	if(this.personHelperBySex[t.sexo]){
  		this.personHelperBySex[t.sexo].cardinal += t.cardinal;

  	}else {
 			this.personHelperBySex[t.sexo] = {
 				cardinal: t.cardinal,
 				label: this.labelForPersonSex(t.sexo)
 			}
  	}
  }

  resetPersonBySexChart(){

  	let personArray = []
  	Object.keys(this.personHelperBySex).forEach(k => {
  		if(!(k === "F" || k === "M")){
  			this.personBySex.error += k + ": " + this.personHelperBySex[k].cardinal + "/ "
  		}else {
  			personArray.push(this.personHelperBySex[k]);
  		}
  	})


    personArray.sort((fel, sel)=> {
      if(fel.cardinal < sel.cardinal) return 1;
      else if(fel.cardinal > sel.cardinal) return -1;
      else return 0;
    })

    this.personBySex.data = personArray.map(t => t.cardinal);
    this.personBySex.labels = personArray.map(t => t.label);
    this.personBySex.title  = " " + this.personBySex.data.reduce((p, t)=> p+t);
    this.personBySex.stitle = "Personas por sexo";
    this.personBySex.slug = personArray.reduce((p, t)=>p + t.cardinal + "::" + t.label + " / ", " ");

  }



  /******************
   PersonByAge
  *********************/
	initPersonByAgeChart(){
		this.personByAge.type = 'pie';

		this.personByAge.labels = [];

	  this.personByAge.data = [];

		this.personByAge.styles = [
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
		this.personByAge.opts = {
		    elements: {
		      arc : {
		        	borderWidth: 0
		      	}
		    },
		    tooltips: false
		  };

	}


  labelForPersonAge(id){
  	if(id === "01") return "Adolescente"
  	if(id === "02") return "Veintis"
  	if(id === "03") return "Treintis"
  	if(id === "04") return "Cuarentis"
  	if(id === "05") return "Cincuentis"
  	if(id === "06") return "Sesentis"
  	if(id === "07") return "Setenties"
  	if(id === "08") return "Ochentis"
  	if(id === "09") return "Noventis"
  	return "S/Dato"
  }

  acumByPersonAge(t:Tile){
  	if(this.personHelperByAge[t.edadId]){
  		this.personHelperByAge[t.edadId].cardinal += t.cardinal;

  	}else {
 			this.personHelperByAge[t.edadId] = {
 				cardinal: t.cardinal,
 				label: this.labelForPersonAge(t.edadId)
 			}
  	}
  }

  resetPersonByAgeChart(){

  	let personArray = []
  	Object.keys(this.personHelperByAge).forEach(k => {
  		if(k > "09" || k < "01"){
  			this.personByAge.error += k + ": " + this.personHelperByAge[k].cardinal + "/ "
  		}else {
  			personArray.push(this.personHelperByAge[k]);
  		}
  	})


    personArray.sort((fel, sel)=> {
      if(fel.cardinal < sel.cardinal) return 1;
      else if(fel.cardinal > sel.cardinal) return -1;
      else return 0;
    })

    this.personByAge.data = personArray.map(t => t.cardinal);
    this.personByAge.labels = personArray.map(t => t.label);
    this.personByAge.title  = " " + this.personByAge.data.reduce((p, t)=> p+t);
    this.personByAge.stitle = "Personas por segmento etario";
    this.personByAge.slug = personArray.reduce((p, t)=>p + t.cardinal + "::" + t.label + " / ", " ");

  }

  /******************
   Worker
  *********************/
 reduceTileData(t: Tile){
  	this.acumByDate(t);
  	this.acumByPersonAge(t);
  	this.acumByPersonSex(t);
  	this.acumByPersonCity(t);

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
		  	this.resetPersonByAgeChart();
		  	this.resetPersonBySexChart();
		  	this.resetPersonByCityChart();
  			this.showChart = true;

  	},200)

  }

  /************************/
  /*    Sol/Asistencia   */
  /**********************/
  fetchSolicitudes(query?: any){
    if(!query){
      query = new AsistenciaBrowse();
      query['avance'] = 'emitido';

      this.query = query;
    }

    Object.keys(query).forEach(key =>{
      if(query[key] == null || query[key] == 'no_definido' ) delete query[key];
      if(key === 'fecomp_h' || key === 'fecomp_d') delete query[key];
    })

    this.dsCtrl.fetchAsistenciaByQuery(query).subscribe(list => {
      if(list && list.length > 0){
        this.asistenciasList = list;
        this.dsCtrl.updateTableData();

      }else {
        this.asistenciasList = [];
      }
    })
  }


  tableAction(action){
    let selection = this.dsCtrl.selectionModel;
    let selected = selection.selected as AsistenciaTable[];
    selected.forEach(t =>{
      this.dsCtrl.updateAvanceAsistencia('asistencia', 'autorizado', t.asistenciaId);

    })
    setTimeout(()=>{
      this.fetchSolicitudes(this.query);
    },1000)

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



