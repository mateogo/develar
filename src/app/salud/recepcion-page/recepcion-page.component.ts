import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MatSelectChange } from '@angular/material';

import { SaludController } from '../salud.controller';
import { SaludModel, Ciudadano, SectorAtencion } from '../salud.model';

import {  Asistencia, 
          Alimento, 
          AsistenciaHelper } from '../asistencia/asistencia.model';

import { GenericDialogComponent } from '../../develar-commons/generic-dialog/generic-dialog.component';
import { Turno }  from '../turnos/turnos.model';

import { PriorityToken } from '../turnos/turnos.model';

import { Person, personModel } from '../../entities/person/person';
import { devutils }from '../../develar-commons/utils';

const TSOCIAL = 'tsocial';
const TALIMENTAR = 'talimentar';
const AUDITORIA = 'auditoria';

@Component({
  selector: 'recepcion-page',
  templateUrl: './recepcion-page.component.html',
  styleUrls: ['./recepcion-page.component.scss']
})
export class RecepcionPageComponent implements OnInit {
  public unBindList = [];

  // template helper
  public title = "Secretaría de Salud - Almte Brown";
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
  public sectorAtencion = '';
  public selectPriority = false;
  public selectTurno = false;
  public turnosEmididosFecha = 0;
  public turnosEmitidosList: Turno[];
  public hasAlreadyTurno = false;

  public asistenciasList: Asistencia[] = [];
  public activeAsistenciasList: Asistencia[] = [];
  public lastAsistencia: Asistencia;
  public hasAsistencias = false;
  public hasActiveAsistencias = false;
  public canIssueVoucher = false;
  public canReciveAlimentos = false;
  public forbiddenText = '';

  public hasRemitos = false;

  private token: string;

  public isAutenticated = false;

  // person data
  public pname;
  public alerta;
  public pdoc;
  public edad;
  public edadTxt;
  public ocupacion;
  public nacionalidad;
  public estado;
  public neducativo;
  public sexo;


  constructor(
  		private dsCtrl: SaludController,
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

  /*********************
   *  Template Events /
   ******************/

  personFetched(persons: Person[]){
    if(persons.length){
      this.currentPerson = persons[0];

      this.initPersonDataForDisplay(this.currentPerson);
      this.openTurnosForm();

    }else{
      this.resetForm();
    }
  }

  private initPersonDataForDisplay(p: Person){
    if(!p) return;
    this.initPersonData(p);

    let edad = 0;
    this.sectorAtencion = p.followUp // = AsistenciaHelper.getOptionLabel('followup',p.followUp)

    edad = devutils.edadActual(new Date(p.fenac));
    
    this.displayDoc = personModel.getPersonDocum(p);
    this.displayAddress = personModel.displayAddress(p.locaciones);

    if(p.nombre || p.apellido){
      this.displayName = personModel.getPersonDisplayName(p) + ' (' + edad + ') '
    }
    this.canReciveAlimentos = SaludModel.asistenciaPermitida('alimentos', p)
    
    this.forbiddenText = this.canReciveAlimentos ? '' : 'Tiene planes sociales. '

    this.initAsistenciasList(p);


  }

  private initPersonData(person: Person){
    this.pname = personModel.getPersonDisplayName(person);
    this.alerta = person.alerta;
    this.pdoc = personModel.getPersonDocum(person);
    this.edad = devutils.edadActual(new Date(person.fenac));
    this.ocupacion = personModel.getProfesion(person.tprofesion)
    this.nacionalidad = personModel.getNacionalidad(person.nacionalidad)
    this.estado = personModel.getEstadoCivilLabel(person.ecivil);
    this.neducativo = personModel.getNivelEducativo(person.nestudios);
    this.sexo = person.sexo;

    if(person.fenac){
      this.edad = devutils.edadActual(new Date(person.fenac));
    }else{
      this.edad = 0
    }
    this.edadTxt = this.edad ? '(' + this.edad + ')' : '';




  }

  private initAsistenciasList(p: Person){
    this.asistenciasList = [];
    this.hasAsistencias = false;
    this.canIssueVoucher = true;

    this.activeAsistenciasList = [];
    this.hasActiveAsistencias = false;

    this.dsCtrl.fetchAsistenciaByPerson(p).subscribe(list => {
      if(list && list.length) {
        this.asistenciasList = AsistenciaHelper.asistenciasSortProperly(list);

        this.lastAsistencia = list[list.length - 1]
        this.hasAsistencias = true;
        this.canIssueVoucher = false;

        this.initValidAsistencias(this.asistenciasList);

        this.forbiddenText += this.canIssueVoucher ? '' : 'No tiene solicitud de asistencia activa'
      }

    })
  }

  private initValidAsistencias(list:Asistencia[]){
    this.activeAsistenciasList = AsistenciaHelper.filterActiveAsistencias(list);
    this.hasActiveAsistencias = false;

    if(this.activeAsistenciasList && this.activeAsistenciasList.length) {
      this.hasActiveAsistencias = true;
      this.canIssueVoucher = true;
      this.lastAsistencia = this.activeAsistenciasList[this.activeAsistenciasList.length - 1]
    }
  }



  private sortProperly(records){
    records.sort((fel, sel)=> {
      if(!fel.ts_alta) fel.ts_alta = "zzzzzzz";
      if(!sel.ts_alta) sel.ts_alta = "zzzzzzz";

      if(fel.ts_alta<sel.ts_alta) return 1;
      else if(fel.ts_alta>sel.ts_alta) return -1;
      else return 0;
    })


  }

  private resetForm(){
      this.altaPersona = false;
      this.personFound = false;
      this.selectTurno = false;
      this.selectPriority = false;
      this.currentSector = null;
      this.sectorLabel = "";

  }

  private closeTurnosForm(){
    this.personFound = true;
    this.selectTurno = false;
    this.altaPersona = false;
    this.selectPriority = !this.hasAlreadyTurno;
  }

  private openTurnosForm(){
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

    }else if (priority.action === "alimentar"){
      this.navigateToAlimentar();

    }else if (priority.action === "auditoria"){
      this.navigateToAudit();

    }else if (priority.action === "cancel"){
      this.resetForm();

    }
  }

  navigateTo(){
    this.router.navigate(['../', this.dsCtrl.atencionRoute(TSOCIAL), this.currentPerson._id], {relativeTo: this.route});
  }

  navigateToAlimentar(){
    this.router.navigate(['../', this.dsCtrl.atencionRoute(TALIMENTAR), this.currentPerson._id], {relativeTo: this.route});
  }

  navigateToAudit(){
    this.router.navigate(['../', this.dsCtrl.atencionRoute(AUDITORIA), this.currentPerson._id], {relativeTo: this.route});
  }

  createNuevoTurno(){
    if(this.readyToCreateNewTurno()){
      this.dsCtrl.turnoCreate('turnos', 'ayudadirecta', this.currentSector.val, this.peso, this.currentPerson).subscribe(turno =>{
        this.resetForm();
      })

    }else{
      this.showWarning();
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
    this.currentSector = sector;
    this.dsCtrl.turnosPorDiaSector$(sector.val).subscribe(list => {
      this.turnosEmididosFecha = (list && list.length && list.reduce((s, t) => t.estado!=="baja" ? s + 1 : s, 0)) || 0;
      this.turnosEmitidosList = list;
      this.sectorLabel = sector.label + ' (Turnos dados: #' + this.turnosEmididosFecha+ ')' ;
      this.hasAlreadyTurno = this.validateIfHasTurno(this.turnosEmitidosList, this.currentPerson);

      this.closeTurnosForm();
    })
  }

  validateIfHasTurno(list: Turno[], person: Person):boolean{
    let hasAlreadyTurno = false;

    if(list && list.length){
      let token = list.find(t => t.requeridox.id === person._id && t.estado === 'pendiente' );
      hasAlreadyTurno = token ? true : false;
    }

    return hasAlreadyTurno;
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


