import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

import { ChartType} from 'chart.js';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
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


import {     SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, LocacionAvailable,
                    Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
                    MasterAllocation, AsignarRecursoEvent } from '../../../../salud/internacion/internacion.model';

import { LocacionHospitalaria, Servicio} from '../../../../entities/locaciones/locacion.model';

import { InternacionHelper }  from '../../../../salud/internacion/internacion.helper';
import { InternacionService } from '../../../../salud/internacion/internacion.service';

const CAMA_LIBRE = 'libre';
const CAMA_OCUPADA = 'ocupada';
const ASIGNAR = 'asignar';
const BORRAR = false;

@Component({
  selector: 'internacion-dashboard-page',
  templateUrl: './internacion-dashboard-page.component.html',
  styleUrls: ['./internacion-dashboard-page.component.scss']
})
export class InternacionDashboardPageComponent implements OnInit {

  public title = 'Tablero Ocupación Locaciones de Internación';
  public unBindList = [];
  public query: DashboardBrowse = AsistenciaHelper.defaultQueryForTablero();


  public hospitalOptList =    InternacionHelper.getOptionlist('hospital');
  public serviciosOptList =   InternacionHelper.getOptionlist('servicios');
  public capacidadesOptList = InternacionHelper.getOptionlist('capacidades');
  public periferiaOptList =   InternacionHelper.getOptionlist('estadosPeriferia');

  private viewList: Array<string> = [];
  public viewList$ = new BehaviorSubject<Array<string>>([]);
  public showData = false;

  public masterList: MasterAllocation[] = [];
  public pool: MasterAllocation;
  public master_internacion: any;
  public master_periferia: any;
  public master_camas: any;
  public locacionesHospitalarias:Array<any> = []

  public groupservices = [];
  private selection: SelectionModel<any>;

  public data$ = new BehaviorSubject<any>({});

	public form: FormGroup;
	public showChart = false;
	//AcumByDate

  private fecharef: string;
  private fecharef_date: Date;
  public fecharef_label: string;
  public epidemio_week: string; 

  private locacionesHelperByOcupation = {};
  public  locacionesByOcupation: ChartData = new ChartData();

  public chartMasterData: any = {};
  public chartData: Array<ChartData> = [];
  public masterCapacidad: any = {};
  public locacionesSelected: Array<string> = [];
  public capacidades = [];

  
  public chartOptions;
  public chartDataSet;
  public chartLabels;
  public chartTitle;
  public chartSubTitle;

	
  //Person<


  // Sol de Asistencia
  
  private masterData;



  constructor(
      private dsCtrl: SaludController,
      private _isrv: InternacionService,
    	private router: Router,
    	private fb: FormBuilder,
    	private route:  ActivatedRoute,
    ) { 
  		this.form = this.buildForm();
  }

  ngOnInit() {
  	this.initOnce();
    this.reloadLocacionesData();  
  }

  private initOnce(){
    // debug only: this.data$.next('Hellouuuu!')
    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);
    this.fecharef_date = new Date();
    this.fecharef = devutils.txFromDate(this.fecharef_date);
    this.fecharef_label = devutils.txForEpidemioWeek(this.fecharef_date);

    this.initForm(this.form, this.query);

    this.chartOptions = {
      responsive: true,

      legend: {
        position: 'top',
      },

      title: {
        display: true,
        text: 'Ocupación general'
      },

      animation: {
        animateScale: true,
        animateRotate: true
      },

      tooltips: {
        callbacks: {
          label: function(item, data) {
              console.log(data.labels, item);
              return data.datasets[item.datasetIndex].label+ ": "+ data.labels[item.index]+ ": "+ data.datasets[item.datasetIndex].data[item.index];
          }

        }
      }
    }

    this.chartDataSet = [
      {data: [70, 30], label: 'UTI'},
      {data: [60, 40], label: 'UTE'}

    ]
    this.chartLabels =[ 'OCUP', 'DISP']
    this.chartTitle = 'Ocupación general';
    this.chartSubTitle = 'UTI - UTE';

    this._isrv.fetchLocacionesHospitalarias({}).subscribe( list =>{
      this.locacionesHospitalarias = list;
    })

    this.groupservices = InternacionHelper.getOptionlist('capacidades')
    this.selection = new SelectionModel<any>(true, this.groupservices);


  }

  // borrar
  private refreshListView(list){
    this.viewList = list.map(t => t.val) || [] ;
    this.viewList$.next(this.viewList);
  }

  private reloadLocacionesData(){
    this.showData = false;
    this.loadMasterAllocation()

  }
    
  private loadMasterAllocation(){
    this.masterList = [];

    this._isrv.fetchCapacidadDisponible().subscribe(alocationList =>{
      if(alocationList && alocationList.length){

        this.showMasterAllocator(alocationList)

      }else {
        //TODO
      }

    });
  }
  private showMasterAllocator(list: MasterAllocation[]){
    this.data$.next(list);

    let pool = list.find(t => t.code === 'pool');
    if(pool){
      this.pool = pool;
      //this.botonesPool = this._isrv.getBotonesPool(this.pool);
      // debug only this.data$.next(list);

    }else{
      this.pool = null;
    }

    this.masterList = list.filter(t => t.code !== 'pool');
    this.refreshView(this.query)


  }



  // Pie

  initForm(form: FormGroup, query: DashboardBrowse): FormGroup {

		form.reset({
        locacionhosp: query.locacionhosp,
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
      locacionhosp:  [null],
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

  selectedCheckBox(e){
    this.selection.toggle(e);
    //this.checkBoxEmit.emit(this.selection.selected);    
  }




  refreshData(e){
    let fe = this.form.value.fecharef;
    this.fecharef_date = devutils.dateFromTx(fe);
    this.fecharef = devutils.txFromDate(this.fecharef_date);
    this.fecharef_label = devutils.txForEpidemioWeek(this.fecharef_date);



  }


  resetData(){



  }



  acumByLocacionesOcupation(list: MasterAllocation[]){
    //acaestoy



    // if(this.asistenciasHelperByAvance[t.avance]){
    //   this.asistenciasHelperByAvance[t.avance].cardinal += t.cardinal;

    // }else {
    //    this.asistenciasHelperByAvance[t.avance] = {
    //      cardinal: t.cardinal,
    //      label: AsistenciaHelper.getOptionLabel('avanceOptList', t.avance)
    //    }
    // }
  }

  resetLocacionesByOcupacionChart(){

  }



  /******************
   AsistenciasBySINTOMA
  *********************/

  refreshView(query: DashboardBrowse){
  	this.showChart = false;
  	this.resetData();
    this.buildOcupacionGeneral();

  	setTimeout(()=>{


      this.showChart = true;


  	},200)

  }

  getDataSet(capacidad: string){
    return [[this.masterCapacidad[capacidad].ocupado, this.masterCapacidad[capacidad].libre ]  ];
  }
  

  buildOcupacionGeneral(){
    let chartData = new ChartData();
    this.masterCapacidad = this.getOcupacionData('general');



    this.chartDataSet = [
      {data: [70, 30], label: 'UTI'},
      {data: [60, 40], label: 'UTE'}

    ]
    this.chartLabels =[ 'OCUP', 'DISP']
    this.chartTitle = 'Ocupación general';
    this.chartSubTitle = 'UTI - UTE';
    

  }

  private getOcupacionData(scope){
    let capacidades = {}

    this.capacidadesOptList.forEach(t=>{
      capacidades[t.val] =  {ocupado: 0, libre: 0};

    })


    this.masterList.forEach(t => {
      let disponible = t.disponible;
      for(let label of this.capacidades){
        capacidades[label].ocupado += disponible[label].ocupado;
        capacidades[label].libre += disponible[label].capacidad - disponible[label].ocupado
      }

    })

    console.dir(capacidades)
    return capacidades


  }




}// end component


interface DashboardData {
	label: string;
	cardinal: number;
	slug: string;

}

class ChartData {
	type: ChartType = 'doughnut';
  dataset: any[] = [];
	labels: string[] = [];
	data : any[] = [];
	styles: any[] = [];
	opts: any ={};
	title: string = "";
	stitle: string = "";
	slug: string = "";
	error: string = "";

}



