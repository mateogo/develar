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
const PRIVADO = 'APRIVADO';

@Component({
  selector: 'internacion-dashboard-page',
  templateUrl: './internacion-dashboard-page.component.html',
  styleUrls: ['./internacion-dashboard-page.component.scss']
})
export class InternacionDashboardPageComponent implements OnInit {

  public title = 'Tablero Ocupación Locaciones de Internación';
  public tableTitle = 'Capacidad disponible general'
  public totalTitle = 'Ocupación locaciones públicas'
  public unBindList = [];
  public query: DashboardBrowse = AsistenciaHelper.defaultQueryForTablero();


  public hospitalOptList =    InternacionHelper.getOptionlist('hospital');
  public serviciosOptList =   InternacionHelper.getOptionlist('servicios');
  public capacidadesOptList = InternacionHelper.getOptionlist('capacidades');
  public periferiaOptList =   InternacionHelper.getOptionlist('estadosPeriferia');
  public groupservices = [];

  public showData = false;
  public showChart = false;

  public  totalCapacidad: any = {};
  public  masterCapacidad: any = {};
  public  masterList: MasterAllocation[] = [];
  public  pool: MasterAllocation;
  public  locacionesHospitalarias:Array<any> = []
  public  locacionesList: Array<string> = [];

  public  locacionHospSelected: string;
  private capacidadesSelection: SelectionModel<any>;


  public data$ = new BehaviorSubject<any>({});
	public form: FormGroup;

  private fecharef: string;
  private fecharef_date: Date;
  public fecharef_label: string;
  public targetEtario: number = 0;

  public chartOptions: any = {};
  public chartLabels: any = {};
  public chartType = 'doughnut';
  public ets = ['total', 'adu', 'ped', 'neo']


	
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

  /************************/
  /*    Dashboard control   */
  /**********************/
  changeSelectionValue(type, val){
    //c onsole.log('type: [%s] val:[%s] same:[%s]', type, val, this.query === this.form.value);
    this.query[type] = val;    
    this.refreshView(this.query);
  }

  radioChanged(e){
    console.log('radio Changed: [%s]', e.value);
    this.targetEtario = parseInt(e.value, 10);
    this.totalCapacidad = this.globalResourcesData()

    this.refreshView(this.query);

  }

  changeLocacion(type, val){
    //c onsole.log('type: [%s] val:[%s] same:[%s]', type, val, this.query === this.form.value);
    this.query[type] = val;
    this.locacionHospSelected = this.locacionesHospitalarias.find(t => t.code === val).slug;
    
    this.refreshView(this.query);
  }

  selectedCheckBox(e){
    this.capacidadesSelection.toggle(e);
    this.refreshView(this.query);
  }


  refreshData(e){
    let fe = this.form.value.fecharef;
    this.fecharef_date = devutils.dateFromTx(fe);
    this.fecharef = devutils.txFromDate(this.fecharef_date);
    this.fecharef_label = devutils.txForEpidemioWeek(this.fecharef_date);
    this.reloadLocacionesData();

  }

  getOcupacionPorcentual(ocupado, capacidad){
    if(capacidad === 0 ) return ''
    return Math.floor( ocupado / capacidad * 100) + "%"
  }




  private initOnce(){
    // debug only: this.data$.next('Hellouuuu!')
    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);
    this.fecharef_date = new Date();
    this.fecharef = devutils.txFromDate(this.fecharef_date);
    this.fecharef_label = devutils.txForEpidemioWeek(this.fecharef_date);

    this.initForm(this.form, this.query);

    this._isrv.fetchLocacionesHospitalarias({}).subscribe( list =>{
      this.locacionesHospitalarias = list;

      this.locacionHospSelected = 'Recursos generales del distrito'
      let generic = {code: 'GENERAL', slug: this.locacionHospSelected } as LocacionHospitalaria;

      this.locacionesHospitalarias.unshift(generic);
    })

    this.groupservices = InternacionHelper.getOptionlist('capacidades')
    this.capacidadesSelection = new SelectionModel<any>(true, this.groupservices);


  }


  private reloadLocacionesData(){
    this.showChart = false;
    this.masterList = [];
    this.loadMasterAllocation().subscribe(alocationList =>{
      if(alocationList && alocationList.length){

        this.masterList = this.initMasterAllocator(alocationList)
        //todo
        //this.locacionesList = this.filterActiveLocaciones(this.masterList);

        //this.data$.next(this.masterList);
        this.totalCapacidad = this.globalResourcesData()

        this.refreshView(this.query)

      }else {
        //TODO
      }

    })

  }
  private filterActiveLocaciones(masterList: MasterAllocation[]){

    return this.groupservices.filter(loc => {
      let locacion = this.masterList.find(t => t.code === loc.code);
      if(!locacion || !locacion.disponible) return false;
      let sum = 0;
      this.groupservices.forEach(ser => {
        sum += (locacion.disponible[ser.val]['capaciad']['total'] || 0);
      })
      return sum;
    })

  }
    
  private loadMasterAllocation(): Observable<MasterAllocation[]>{
    return this._isrv.fetchCapacidadDisponible()
  }

  private initMasterAllocator(list: MasterAllocation[]): MasterAllocation[] {
    let pool = list.find(t => t.code === 'pool');
    if(pool){
      this.pool = pool;

    }else{
      this.pool = null;
    }

    return list.filter(t => t.code !== 'pool');
  }



  private initForm(form: FormGroup, query: DashboardBrowse): FormGroup {

		form.reset({
        locacionhosp: query.locacionhosp,
        sintoma:     query.sintoma,
        sector:      query.sector,
        estado:      query.estado,
        avance:      query.avance,
        targetEtario: this.targetEtario,
        fecharef:    this.fecharef
		});
		return form;
  }

  private buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      locacionhosp:  [null],
      targetEtario:  [null],
      sector:       [null],
			sintoma:      [null],
      avance:       [null],
      estado:       [null],
      fecharef:     [null]
    });

    return form;
  }




  /***************************
   Regeneramos los gráficos
  *************************/

  private refreshView(query: DashboardBrowse){
  	//this.showChart = false;
    this.showData = false;
    this.capacidadesOptList = this.selectedCapacidades();
    this.buildChartData(query);

  	setTimeout(()=>{
      this.showData = true;
      this.showChart = true;

  	},200)

  }


  private selectedCapacidades(): Array<any>{
    return this.groupservices.filter(t => this.capacidadesSelection.selected.find( s => s.val === t.val))
  }



  private buildChartData(query?: DashboardBrowse){
    let chartData = new ChartData();
    this.masterCapacidad = this.resourceSelectedData(query['locacionhosp']);

    this.capacidadesOptList = this.capacidadesOptList.filter(t => (this.masterCapacidad[t.val].ocupado + this.masterCapacidad[t.val].libre) > 0 )

    for(let capacidad of this.capacidadesOptList){
      let dataSet = [ {data: [ this.masterCapacidad[capacidad.val].ocupado, this.masterCapacidad[capacidad.val].libre ], label: capacidad.label} ];
      //this.chartLabels =[ 'OCUP: ' + this.masterCapacidad[capacidad.val].ocupado, 'DISP: ' + this.masterCapacidad[capacidad.val].libre]
      this.chartLabels =[ 'OCUP: ', 'DISP: ']

      this.chartOptions[capacidad.val] = {
        responsive: true,
        maintainAspectRation: false,

        legend: {
          position: 'top',
        },

        title: {
          display: true,
          text: capacidad.label + ' - Disponible: ' +  this.masterCapacidad[capacidad.val].libre + ' / ' + ( this.masterCapacidad[capacidad.val].ocupado + this.masterCapacidad[capacidad.val].libre ) + ' - Ocupación: ' + this.getOcupacionPorcentual(this.masterCapacidad[capacidad.val].ocupado, ( this.masterCapacidad[capacidad.val].ocupado + this.masterCapacidad[capacidad.val].libre ))
        },

        animation: {
          animateScale: true,
          animateRotate: true
        },

        tooltips: {
          callbacks: {
            label: function(item, data) {
                  return data.datasets[item.datasetIndex].label+ ": "+ data.labels[item.index]+ ": "+ data.datasets[item.datasetIndex].data[item.index];
            }

          }
        }
      }
    }// end for


  } // end method

  private resourceSelectedData(scope){
    let capacidades = {}

    this.capacidadesOptList.forEach(t=>{
      capacidades[t.val] =  {ocupado: 0, libre: 0};

    })


    this.masterList.forEach(t => {
      if(t.code === scope || scope === 'GENERAL'){
        let disponible = t.disponible;
        for(let label of this.capacidadesOptList){
          let ocupado = 0, capacidad = 0;

          if(this.targetEtario === 0) {
            ocupado =   disponible[label.val]['ocupado']['total'];
            capacidad = disponible[label.val]['capacidad']['total'];
          } else if(this.targetEtario === 1) {
            ocupado =   disponible[label.val]['ocupado']['adu'];
            capacidad = disponible[label.val]['capacidad']['adu'];
          } else if(this.targetEtario === 2) {
            ocupado =   disponible[label.val]['ocupado']['ped'];
            capacidad = disponible[label.val]['capacidad']['ped'];
          } else if(this.targetEtario === 3) {
            ocupado =   disponible[label.val]['ocupado']['neo'];
            capacidad = disponible[label.val]['capacidad']['neo'];
          }


          capacidades[label.val].ocupado += ocupado
          capacidades[label.val].libre += capacidad - ocupado
        }        
      }

    })

    return capacidades
  }



  private globalResourcesData(){
    console.log('refresh View')
    let capacidades = {}

    this.capacidadesOptList.forEach(t=>{
      capacidades[t.val] =  {capacidad: 0, ocupado: 0, libre: 0, porcentual:""};

    })


    this.masterList.forEach(t => {
        if(t.type === PRIVADO) return;

        let disponible = t.disponible;
        for(let label of this.capacidadesOptList){
          let ocupado = 0, capacidad = 0;
          if(this.targetEtario === 0) {
            ocupado =   disponible[label.val]['ocupado']['total'];
            capacidad = disponible[label.val]['capacidad']['total'];
          } else if(this.targetEtario === 1) {
            ocupado =   disponible[label.val]['ocupado']['adu'];
            capacidad = disponible[label.val]['capacidad']['adu'];
          } else if(this.targetEtario === 2) {
            ocupado =   disponible[label.val]['ocupado']['ped'];
            capacidad = disponible[label.val]['capacidad']['ped'];
          } else if(this.targetEtario === 3) {
            ocupado =   disponible[label.val]['ocupado']['neo'];
            capacidad = disponible[label.val]['capacidad']['neo'];
          }
          console.log('acum globalResources: [%s]:[%s] [%s] [%s]', t.code, label.val, ocupado, capacidad)

          capacidades[label.val].ocupado += ocupado;
          capacidades[label.val].capacidad += capacidad;
          capacidades[label.val].libre += capacidad - ocupado;

        }        

    })

    for(let label of this.capacidadesOptList){
      let porcentual = capacidades[label.val].capacidad 
                      ? Math.floor( capacidades[label.val].ocupado / capacidades[label.val].capacidad * 100) + "%" 
                      : '';
      capacidades[label.val].porcentual = porcentual;
    }

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



