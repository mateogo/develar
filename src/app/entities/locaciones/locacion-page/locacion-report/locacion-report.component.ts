import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { devutils }from '../../../../develar-commons/utils'



import {  LocacionHospitalaria, 
          ReportAllocationData,
          OcupaciomPorArea,
          OcupacionHospitalariaBrowse,
          OcupacionToken,
          Servicio} from '../../../../entities/locaciones/locacion.model';

import { InternacionHelper }  from '../../../../salud/internacion/internacion.helper';
import { InternacionService } from '../../../../salud/internacion/internacion.service';

import { DashboardBrowse } from '../../locacion.model';

import { LocacionHelper } from '../../locacion.helper';
import { LocacionService } from '../../locacion.service';


const CAMA_LIBRE = 'libre';
const CAMA_OCUPADA = 'ocupada';
const ASIGNAR = 'asignar';
const BORRAR = false;
const PRIVADO = 'HOSPCPRIV';


@Component({
  selector: 'locacion-report',
  templateUrl: './locacion-report.component.html',
  styleUrls: ['./locacion-report.component.scss']
})
export class LocacionReportComponent implements OnInit {
  public title = 'Tablero Ocupación Locaciones de Internación';
  public totalTitle = 'Nivel de ocupación total en Almirante Brown'

  public capacidadesOptList = LocacionHelper.getOptionlist('capacidadesreporte');
  public groupservices = [];
  private capacidadesSelection: SelectionModel<any>;

  public showData = false;

  public masterReportList: ReportAllocationData[] = []; 
  public totalCapacidad: any = {};

  public data$ = new BehaviorSubject<any>({});
	public form: FormGroup;

  private fecharef: string;
  private fecharef_date: Date;
  public  fecharef_label: string;
  public fechaEfectiva: string;


  constructor(
      private locSrv: LocacionService,
    	private fb: FormBuilder,
    ) { 
  		this.form = this.buildForm();
  }

  ngOnInit() {
  	this.initOnce();
    this.reloadOcupacionData();
  }



  refreshData(e){
    let fe = this.form.value.fecharef;
    this.fecharef_date = devutils.dateFromTx(fe);
    this.fecharef = devutils.txFromDate(this.fecharef_date);
    this.fecharef_label = devutils.txForEpidemioWeek(this.fecharef_date);
    this.reloadOcupacionData();

  }

  getOcupacionPorcentual(ocupado, capacidad){
    if(capacidad === 0 ) return ''
    return Math.floor( ocupado / capacidad * 100) + "%"
  }


  private initOnce(){
    this.fecharef_date = new Date();
    this.fecharef = devutils.txFromDate(this.fecharef_date);
    this.fecharef_label = devutils.txForEpidemioWeek(this.fecharef_date);

    this.initForm(this.form);

    this.groupservices = LocacionHelper.getOptionlist('capacidadesreporte');
    this.capacidadesSelection = new SelectionModel<any>(true, this.groupservices);
  }

  private reloadOcupacionData(){
    let query = this.locSrv.ocupacionHospitalariaSelector
    query.fecha_tx = this.fecharef;

    this.locSrv.fetchCapacidadDisponible(query).subscribe(map => {
      if(map){
        this.masterReportList = Array.from(map.values())
        //this.data$.next(this.masterReportList);
        this.totalCapacidad = this.globalResourcesData(this.masterReportList)
        this.refreshView()
      }
    })
  }



  private initForm(form: FormGroup): FormGroup {
		form.reset({
        fecharef:    this.fecharef
		});
		return form;
  }

  private buildForm(): FormGroup{
  	let form: FormGroup;
    form = this.fb.group({
      fecharef:     [null]
    });

    return form;
  }




  /***************************
   Regeneramos los gráficos
  *************************/

  private refreshView(){
    this.showData = false;
    this.capacidadesOptList = this.selectedCapacidades();

  	setTimeout(()=>{
      this.showData = true;

  	},200)

  }


  private selectedCapacidades(): Array<any>{
    return this.groupservices.filter(t => this.capacidadesSelection.selected.find( s => s.val === t.val))
  }


  private globalResourcesData(masterList: ReportAllocationData[]){
    let capacidades = {}

    this.capacidadesOptList.forEach(t=>{
      capacidades[t.val] =  {capacidad: 0, ocupado: 0, real: 0, libre: 0, librereal: 0, porcentual:"", porcentualreal:""};
    })
    masterList.forEach(t => {
        //if(t.type === PRIVADO) return;

        let disponible = t.disponible;
        for(let label of this.capacidadesOptList){
          let ocupado = 0, capacidad = 0, real =0;
          if(!disponible[label.val]['real']){
            disponible[label.val]['real'] = disponible[label.val]['capacidad']           
          }
          
          ocupado =   disponible[label.val]['ocupado'];
          capacidad = disponible[label.val]['capacidad'];
          real = disponible[label.val]['real'] || disponible[label.val]['capacidad'];

          capacidades[label.val].ocupado += ocupado;
          capacidades[label.val].capacidad += capacidad;
          capacidades[label.val].real += real;
          capacidades[label.val].libre += capacidad - ocupado;
          capacidades[label.val].librereal += real - ocupado;
        }        
    })

    for(let label of this.capacidadesOptList){
      let porcentual = capacidades[label.val].capacidad 
                      ? Math.floor( capacidades[label.val].ocupado / capacidades[label.val].capacidad * 100) + "%" 
                      : '';
      capacidades[label.val].porcentual = porcentual;

      let porcentualreal = capacidades[label.val].real 
                      ? Math.floor( capacidades[label.val].ocupado / capacidades[label.val].real * 100) + "%" 
                      : '';
      capacidades[label.val].porcentualreal = porcentualreal;
    }
    return capacidades
  }

}
