import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { Person, Address, personModel } from '../../../../entities/person/person';

import { SaludController } from '../../../salud.controller';
import { devutils }from '../../../../develar-commons/utils'

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
					AsistenciaHelper } from '../../../asistencia/asistencia.model';


@Component({
  selector: 'vigilancia-dashboard-page',
  templateUrl: './vigilancia-dashboard-page.component.html',
  styleUrls: ['./vigilancia-dashboard-page.component.scss']
})
export class VigilanciaDashboardPageComponent implements OnInit {

  public title = 'Tablero Solicitudes';
  public unBindList = [];
  public query: DashboardBrowse = AsistenciaHelper.defaultQueryForTablero();

  public _sectorOptList =   AsistenciaHelper.getOptionlist('sectores');
  public sectorOptList =   [];


  public estadoOptList =   AsistenciaHelper.getOptionlist('estadoActualInfection');
  public avanceOptList =   AsistenciaHelper.getOptionlist('avanceInfection');
  public sintomaOptList =   AsistenciaHelper.getOptionlist('sintomaInfection');

  public actualState: Array<DashboardData> = []


  public ciudadesOptList = AsistenciaHelper.getOptionlist('ciudades');
  public encuestaOptList = AsistenciaHelper.getOptionlist('encuesta');
  public urgenciaOptList = AsistenciaHelper.getOptionlist('urgencia');
  public ciudadesList =    personModel.ciudades;

	public form: FormGroup;
	public showChart = false;
	//AcumByDate
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


	private personHelperByAge = {};
	public personByAge: ChartData = new ChartData();

	private personHelperBySex = {};
	public personBySex: ChartData = new ChartData();

	private personHelperByCity = {};
	public personByCity: ChartData = new ChartData();

  private asistenciasHelperBySintoma = {};
  public asistenciasBySintoma: ChartData = new ChartData();

  private asistenciasHelperByAvance = {};
  public asistenciasByAvance: ChartData = new ChartData();

  //Person<


  // Sol de Asistencia
  public asistenciasList: Asistencia[];
  public itemsFound = false;
  public currentAsistencia:Asistencia;

  private masterData;

  public tiles: Tile[] = [];



  constructor(
      private dsCtrl: SaludController,
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
    this.initPersonByAgeChart();
    this.initPersonBySexChart();
    this.initPersonByCityChart();
    this.initAsistenciasBySintomaChart();
    this.initAsistenciasByAvanceChart();
    this.tiles = [];

    let sscrp2 = this.dsCtrl.fetchEpidemioDashboard(fecharef).subscribe(master => {
      this.masterData = master;

      Object.keys(this.masterData).forEach(t => {
        //co nsole.log('Edad [%s] [%s] [%s]', this.masterData[t].edadId, this.masterData[t].sexo, this.masterData[t].cardinal)
        this.tiles.push(this.masterData[t]);
      })

      this.refreshView(this.query);
    })

    this.unBindList.push(sscrp2);
  }

  // Pie

  initForm(form: FormGroup, query: DashboardBrowse): FormGroup {

		form.reset({
        sintoma:     query.sintoma,
        sector:      query.sector,
        estado:      query.estado,
        avance:      query.avance,
        fecharef:    this.fecharef
		});
		return form;
  }

  private buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      sector:       [null],
			sintoma:      [null],
      avance:       [null],
      estado:       [null],
      fecharef:     [null]
    });

    return form;
  }

  /************************/
  /*    Dashboard control   */
  /**********************/
	changeSelectionValue(type, val){
		//con sole.log('type: [%s] val:[%s] same:[%s]', type, val, this.query === this.form.value);
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

    this.actualState = []

    for(let i=0; i<7; i +=1 ){
      let token = {
        label: this.estadoOptList[i].label,
        cardinal: 0,
        slug: ''
      }
      this.actualState.push(token);

    }

  	this.personHelperByAge = {};
  	this.personByAge.error = "";

  	this.personHelperBySex = {};
  	this.personBySex.error = "";

  	this.personHelperByCity = {};
  	this.personByCity.error = "";

    this.asistenciasHelperBySintoma = {};
    this.asistenciasBySintoma.error = "";

    this.asistenciasHelperByAvance = {};
    this.asistenciasByAvance.error = "";


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
  initAsistenciasByAvanceChart(){
    this.asistenciasByAvance.type = 'pie';

    this.asistenciasByAvance.labels = [];

    this.asistenciasByAvance.data = [];

    this.asistenciasByAvance.styles = [
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
    this.asistenciasByAvance.opts = {
        elements: {
          arc : {
              borderWidth: 0
            }
        },
        tooltips: false
      };

  }

  acumByAsistenciasAvance(t:Tile){
    if(this.asistenciasHelperByAvance[t.avance]){
      this.asistenciasHelperByAvance[t.avance].cardinal += t.cardinal;

    }else {
       this.asistenciasHelperByAvance[t.avance] = {
         cardinal: t.cardinal,
         label: AsistenciaHelper.getOptionLabel('avanceOptList', t.avance)
       }
    }
  }

  resetAsistenciasByAvanceChart(){

    let avanceArray = []
    Object.keys(this.asistenciasHelperByAvance).forEach(k => {

        avanceArray.push(this.asistenciasHelperByAvance[k]);

    })


    avanceArray.sort((fel, sel)=> {
      if(fel.cardinal < sel.cardinal) return 1;
      else if(fel.cardinal > sel.cardinal) return -1;
      else return 0;
    })

    this.asistenciasByAvance.data = avanceArray.map(t => t.cardinal);
    this.asistenciasByAvance.labels = avanceArray.map(t => t.label);
    this.asistenciasByAvance.title  = "Evolución " //+ this.asistenciasByAvance.data.reduce((p, t)=> p+t);
    this.asistenciasByAvance.stitle = "" ;//Asistencias por Avance";
    this.asistenciasByAvance.slug = avanceArray.reduce((p, t)=>p + t.cardinal + "::" + t.label + " / ", " ");

  }


  /******************
   AsistenciasBySINTOMA
  *********************/
  initAsistenciasBySintomaChart(){
    this.asistenciasBySintoma.type = 'pie';

    this.asistenciasBySintoma.labels = [];

    this.asistenciasBySintoma.data = [];

    this.asistenciasBySintoma.styles = [
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
    this.asistenciasBySintoma.opts = {
        elements: {
          arc : {
              borderWidth: 0
            }
        },
        tooltips: false
      };

  }

  acumByAsistenciasSintoma(t:Tile){
    if(this.asistenciasHelperBySintoma[t.sintoma]){
      this.asistenciasHelperBySintoma[t.sintoma].cardinal += t.cardinal;

    }else {
       this.asistenciasHelperBySintoma[t.sintoma] = {
         cardinal: t.cardinal,
         label: AsistenciaHelper.getOptionLabel('sintomaOptList', t.sintoma)
       }
    }
  }

  resetAsistenciasBySintomaChart(){

    let sintomaArray = []
    Object.keys(this.asistenciasHelperBySintoma).forEach(k => {

        sintomaArray.push(this.asistenciasHelperBySintoma[k]);

    })

    sintomaArray.sort((fel, sel)=> {
      if(fel.cardinal < sel.cardinal) return 1;
      else if(fel.cardinal > sel.cardinal) return -1;
      else return 0;
    })

    this.asistenciasBySintoma.data = sintomaArray.map(t => t.cardinal);
    this.asistenciasBySintoma.labels = sintomaArray.map(t => t.label);
    this.asistenciasBySintoma.title  = "Sintoma" //+ this.asistenciasBySintoma.data.reduce((p, t)=> p+t);
    this.asistenciasBySintoma.stitle = "" ;//Asistencias por tipo de Acción";
    this.asistenciasBySintoma.slug = sintomaArray.reduce((p, t)=>p + t.cardinal + "::" + t.label + " / ", " ");

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

    this.personBySex.title  = "Sexo " //+ this.personBySex.data.reduce((p, t)=> p+t);
    this.personBySex.stitle = "";
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

  acumByActualState(t: Tile){
    let index = parseInt(t.estado, 10);
    
    if(index > 6 || index < 0 ) return;

    this.actualState[index].cardinal += t.cardinal;
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
  		//if(k > "09" || k < "01"){
      if(k > "11" || k < "00"){
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
    this.personByAge.title  = "Segmento etario "// + this.personByAge.data.reduce((p, t)=> p+t);
    this.personByAge.stitle = "" // "Personas por segmento etario";

    this.personByAge.slug = personArray.reduce((p, t)=>p + t.cardinal + "::" + t.label + " / ", " ");

  }

  /******************
   Worker
  *********************/
 reduceTileData(t: Tile){
  	this.acumByDate(t);
    this.acumByActualState(t);
  	this.acumByPersonAge(t);
  	this.acumByPersonSex(t);
  	this.acumByPersonCity(t);
    this.acumByAsistenciasSintoma(t);
    this.acumByAsistenciasAvance(t);

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
        this.resetAsistenciasBySintomaChart();
        this.resetAsistenciasByAvanceChart();
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
      this.dsCtrl.updateAvanceAsistencia('asistencia', t.asistenciaId);

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



