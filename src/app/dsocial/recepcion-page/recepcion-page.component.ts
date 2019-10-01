import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MatSelectChange } from '@angular/material';

import { DsocialController } from '../dsocial.controller';
import { DsocialModel, Ciudadano, SectorAtencion } from '../dsocial.model';

import {  Asistencia, 
          Alimento, 
          AsistenciaHelper } from '../asistencia/asistencia.model';

import { RemitoAlmacen, RemitoAlmacenModel,  UpdateRemitoEvent } from '../alimentos/alimentos.model';

import { GenericDialogComponent } from '../../develar-commons/generic-dialog/generic-dialog.component';


import { PriorityToken } from '../turnos/turnos.model';

import { Person, personModel } from '../../entities/person/person';
import { devutils }from '../../develar-commons/utils';

const TSOCIAL = 'tsocial';

@Component({
  selector: 'recepcion-page',
  templateUrl: './recepcion-page.component.html',
  styleUrls: ['./recepcion-page.component.scss']
})
export class RecepcionPageComponent implements OnInit {
  public unBindList = [];

  // template helper
  public title = "Secretaría de Desarrollo Social";
  public subtitle = "Recepción del Vecino/a";

  public tDoc = "DNI";
  public nDoc = "";
  public displayName = "";
  public displayDoc = "";
  public displayAddress = "";
  public sectorLabel = "";
  public peso = 0;

  public currentPerson: Person;
  public currentSector: SectorAtencion;

  public personFound = false;
  public altaPersona = false;
  public selectPriority = false;
  public selectTurno = false;

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
      public dialogService: MatDialog

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

      this.initPersonDataForDisplay(this.currentPerson);
      this.openTurnosForm();

    }else{
      this.resetForm();
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

  resetForm(){
      this.altaPersona = false;
      this.personFound = false;
      this.selectTurno = false;
      this.selectPriority = false;
      this.currentSector = null;
      this.sectorLabel = "";

  }

  closeTurnosForm(){
    this.personFound = true;
    this.selectTurno = false;
    this.altaPersona = false;
    this.selectPriority = true;    
  }

  openTurnosForm(){
    this.personFound = true;
    this.selectTurno = true;
    this.altaPersona = false;
    this.selectPriority = true;
  }

  processTurno(priority: PriorityToken){
    if(priority.action === "update"){
      this.peso = priority.prioridad;
      this.createNuevoTurno();

    }else if (priority.action === "inmediata"){
      this.navigateTo();

    }else if (priority.action === "cancel"){
      this.resetForm();

    }
  }

  navigateTo(){
    this.router.navigate(['../', this.dsCtrl.atencionRoute(TSOCIAL), this.currentPerson._id], {relativeTo: this.route});
  }

  createNuevoTurno(){
    if(this.readyToCreateNewTurno()){
      this.dsCtrl.turnoCreate('turnos', 'ayudadirecta', this.currentSector.serial, this.peso, this.currentPerson).subscribe(turno =>{
        this.resetForm();
      })

      this.checkIfNewAlimento()

    }else{
      this.showWarning();
    }

  }

  checkIfNewAlimento(){
    console.log('Check IfNew Alimento hasAsistencias[%s] [%s]', this.hasAsistencias,this.currentSector.val);
    if(!this.hasAsistencias && this.currentSector.val === "alimentos"){
      let slug = 'Alimentos otorgados de oficio, presentación espontánea 1ra vez'

      this.dsCtrl.createExpressAsistencia(this.currentSector.val, this.currentPerson, slug);
    }
  }

  readyToCreateNewTurno(){
    let ready = false;
    if(this.currentPerson && this.currentSector){
      ready = true;
    }
    return ready
  }

  turnoSelected(sector: SectorAtencion){
    console.log('NuevoTurno: [%s]', sector.label);
    this.currentSector = sector;
    this.sectorLabel = sector.label;

    this.closeTurnosForm();

  }

  openDialog(config) {
    let dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed()
  }

  buildWarningMessage(name){
    warningMessageTpl.data.body = name;
    return warningMessageTpl;
  }

  showWarning(){
    let content = this.buildWarningMessage('SECTOR de atención no seleccionado');
    this.openDialog(content).subscribe(result => {
      if(result === 'accept'){
        // Todo
      }
    });
  }

}

const warningMessageTpl = {
  width:  '330px',
  height: '300px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    caption:'Atención',
    body: 'La persona seleccionada es: ',
    accept:{
      action: 'accept',
      label: 'Aceptar'
    },
    cancel:{
      action: 'cancel',
      label: 'Cancelar'
    }
  }
};


