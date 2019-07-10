import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { DsocialController } from '../dsocial.controller';
import { DsocialModel, Ciudadano, SectorAtencion } from '../dsocial.model';

import {  Asistencia, 
          Alimento, 
          AsistenciaHelper } from '../asistencia/asistencia.model';

import { RemitoAlmacen, RemitoAlmacenModel,  UpdateRemitoEvent } from '../alimentos/alimentos.model';


import { Person, personModel } from '../../entities/person/person';
import { devutils }from '../../develar-commons/utils'

@Component({
  selector: 'recepcion-page',
  templateUrl: './recepcion-page.component.html',
  styleUrls: ['./recepcion-page.component.scss']
})
export class RecepcionPageComponent implements OnInit {
  public unBindList = [];

  // template helper
  public title = "Secretaría de Desarrollo Social";
  public subtitle = "Recepción del Vecino";

  public tDoc = "DNI";
  public nDoc = "";
  public displayName = "";
  public displayDoc = "";
  public displayAddress = "";

  public currentPerson: Person;
  public personFound = false;
  public altaPersona = false;

  public asistenciasList: Asistencia[] = [];
  public lastAsistencia: Asistencia;
  public hasAsistencias = false;

  public remitosList: RemitoAlmacen[] = [];
  public lastRemito: RemitoAlmacen;
  public hasRemitos = false;

  private token: string;

  public isAutenticated = false;



  constructor(
  		private dsCtrl: DsocialController,
    	private router: Router,
    	private route: ActivatedRoute,

  	) { }

  ngOnInit() {
    let first = true;    
    this.token = this.route.snapshot.paramMap.get('id')

    let sscrp2 = this.dsCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;

        this.initCurrentPage();

      }
    })
    this.unBindList.push(sscrp2);
  }


  initCurrentPage(){
    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);
  }

  personFetched(persons: Person[]){
    if(persons.length){
      this.currentPerson = persons[0];

      this.initPersonDataForDisplay(this.currentPerson)

      this.personFound = true;
      this.altaPersona = false;

    }else{
      this.altaPersona = false;
      this.personFound = false;
    }
  }

  initPersonDataForDisplay(p: Person){
    if(!p) return;

    let edad = 0;
    edad = devutils.edadActual(new Date(p.fenac));
    
    this.displayDoc = personModel.getPersonDocum(p);
    this.displayAddress = personModel.displayAddress(p.locaciones);

    if(p.nombre || p.apellido){
      this.displayName = personModel.getPersonDisplayName(p) + ' (' + edad + ') '
    }
    this.initAsistenciasList(p);
    this.loadHistorialRemitos(p);


  }

  initAsistenciasList(p: Person){
    this.asistenciasList = [];
    this.hasAsistencias = false;

    this.dsCtrl.fetchAsistenciaByPerson(p).subscribe(list => {
      console.log('initAsistencia: [%s]', list && list.length);
      if(list && list.length) {
        this.asistenciasList = list;
        this.lastAsistencia = list[list.length - 1]
        this.hasAsistencias = true;
      }

    })
  }

  loadHistorialRemitos(p: Person){
    this.dsCtrl.fetchRemitoAlmacenByPerson(p).subscribe(list =>{
      this.remitosList = list || []
      this.sortProperly(this.remitosList);
  
      if(list && list.length){
        this.lastRemito = list[0];
        this.hasRemitos = true;
      }else{
        this.lastRemito = null;
        this.hasRemitos = false;
      }

    })
  }
  sortProperly(records){
    records.sort((fel, sel)=> {
      if(!fel.ts_alta) fel.ts_alta = "zzzzzzz";
      if(!sel.ts_alta) sel.ts_alta = "zzzzzzz";

      if(fel.ts_alta<sel.ts_alta) return 1;
      else if(fel.ts_alta>sel.ts_alta) return -1;
      else return 0;
    })


  }




  cancelNewPerson(){
      this.altaPersona = false;
      this.personFound = false;
  }

  nuevoTurno(sector: SectorAtencion){
    this.personFound = false;
    this.altaPersona = false;
    this.dsCtrl.turnoCreate('turnos', 'ayudadirecta', sector.serial, this.currentPerson).subscribe(turno =>{

    })

  }



}
