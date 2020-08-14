import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SaludController } from '../../../salud/salud.controller';

import { PersonService } from '../../../salud/person.service';

import { Person, FamilyData, NucleoHabitacional, personModel, Address } from '../../../entities/person/person';

import {  Asistencia, 
          MuestraLaboratorio, 
          UpdateAsistenciaEvent,
          AsistenciaHelper } from '../../../salud/asistencia/asistencia.model';

import { Audit, ParentEntity } from '../../../develar-commons/observaciones/observaciones.model';

import { CoreEditModalService }           from '../../vigilancia-zmodal-managers/core-edit-modal.service';
import { FollowUpNovedadModalService }    from '../../vigilancia-zmodal-managers/fup-seguimiento-modal.service';
import { FollowUpCalendarioModalService } from '../../vigilancia-zmodal-managers/fup-calendario-modal.service';
import { FollowUpEsquemaModalService }    from '../../vigilancia-zmodal-managers/fup-esquema-modal.service';
import { FollowUpHistoriaModalService }   from '../../vigilancia-zmodal-managers/fup-historia-modal.service';

import { CovidBaseModalService }          from '../../vigilancia-zmodal-managers/covid-base-modal.service';
import { LaboratorioNovedadService }      from '../../vigilancia-zmodal-managers/laboratorio-novedad-modal.service';


import { ContactoEstrechosModalService }  from '../../vigilancia-zmodal-managers/contactos-estrechos-modal.service';

const ROLE_ADMIN = 'vigilancia:admin';
const UPDATE =   'update';
const CANCEL =   'cancel';
const ERROR =    'error';


@Component({
  selector: 'vigil-seguimiento-base',
  templateUrl: './vigil-seguimiento-base.component.html',
  styleUrls: ['./vigil-seguimiento-base.component.scss'],
  providers: [ CoreEditModalService, 
  						FollowUpNovedadModalService, FollowUpCalendarioModalService, FollowUpEsquemaModalService, FollowUpHistoriaModalService,
  						CovidBaseModalService,
  						ContactoEstrechosModalService,
  						LaboratorioNovedadService ]
})
export class VigilSeguimientoBaseComponent implements OnInit {
	@Input() asistencia: Asistencia;
  @Input() detailView = true;
  @Input() viewList: Array<String> = [];
  @Input() showObservacionesPanel = false;
  @Output() fetchPerson = new EventEmitter<string>();

  public muestraslabList: Array<MuestraLaboratorio> = [];
  public audit;

  private workflowOptList = AsistenciaHelper.getWorkflow();
  public nextStepOptList = [];

  public isCovid = false;
  public isDenuncia = false;
  public showButtons = false;
  public tipoEdit = 1;

  private person: Person;
  private familyList: Array<FamilyData> = [];
  
  private formAction = "";
  private fireEvent: UpdateAsistenciaEvent;

  public novedadesTitle = 'EVOLUCIÓN';

  // manageAsistenciaView
  public showAsistenciaView = true;
  public showEditor = false;
  public showPanel = true;

  public auditToken: Audit;
  public parentEntity: ParentEntity;


  constructor(
    public dialog: MatDialog,
    private perSrv: PersonService,
    private dsCtrl: SaludController,
    private coreEdit: CoreEditModalService,
    private fupEdit: FollowUpNovedadModalService,
    private fupCalendar: FollowUpCalendarioModalService,
    private fupEsquema: FollowUpEsquemaModalService,
    private fupHistory: FollowUpHistoriaModalService,
    private covidEdit: CovidBaseModalService,
    private cEstrecho: ContactoEstrechosModalService,
    private labNovedad: LaboratorioNovedadService
  	) { 

	}

  ngOnInit() {

    this.buildMuestrasLaboratorio(this.asistencia);

    this.audit = this.buildAudit(this.asistencia);
    this.auditToken = this.dsCtrl.getAuditData();
    this.parentEntity = {
      entityType: 'person',
      entityId: this.asistencia.idPerson,
      entitySlug: this.asistencia.requeridox.slug
    }

  }


  actionTriggered(e){
    e.source._checked = false;
    this.manageModalEditors(e.value);
  }

  editLaboratorio(e){
    e.source._checked = false;
    this.openLaboratorioModal(e.value);
  }

  editVinculo(vinculo: FamilyData ){
    this.openVinculosFam(this.asistencia, vinculo )
  }

  vinculoSelected(personId: string){
    //TODO
    this.fetchPerson.next(personId);
  }

  coreDataSelected(asistencia: Asistencia){
		this.coreEdit.openDialog(asistencia).subscribe(editEvent =>{
			if(editEvent.action === UPDATE){
        this.asistencia = editEvent.token;
        this.manageAsistenciaView(this.viewList);				
			}
		})
  }

  viewPanelsSelected(e){
    this.manageAsistenciaView(e.value)
  }

  closeFollowUpPanel(){
    this.showPanel = false;
  }



  private manageAsistenciaView(viewList){
    this.showAsistenciaView = false;
    this.buildMuestrasLaboratorio(this.asistencia);
    this.viewList = viewList;

    setTimeout(() => {
      this.showAsistenciaView = true;
    },70)
  }

  private manageModalEditors(token: string){

    if(token === 'seguimiento')           this.openSeguimientoModal()
    if(token === 'seguimientofwup')       this.openSeguimientoFwUpModal()
    if(token === 'calendarioseguimiento') this.openCalendarioModal()
    if(token === 'historialseguimiento')  this.openSeguimientoHistoryModal()

    if(token === 'infection')     this.openInfectionModal()

    if(token === 'laboratorio')   this.openLaboratorioModal(null)
    if(token === 'vinculofam')    this.openVinculosFam(this.asistencia, null);

  }


  private openLaboratorioModal(muestralab: MuestraLaboratorio){

		this.labNovedad.openDialog(this.asistencia, muestralab).subscribe(editEvent =>{
			if(editEvent.action === UPDATE){
        this.asistencia = editEvent.token;
        this.manageAsistenciaView(this.viewList);				
			}
		})

  }

  private openInfectionModal(){

		this.covidEdit.openDialog(this.asistencia).subscribe(editEvent =>{
			if(editEvent.action === UPDATE){
        this.asistencia = editEvent.token;
        this.manageAsistenciaView(this.viewList);				
			}
		})
  }


  private openSeguimientoModal(){

		this.fupEsquema.openDialog(this.asistencia).subscribe(editEvent =>{
			if(editEvent.action === UPDATE){
        this.asistencia = editEvent.token;
        this.manageAsistenciaView(this.viewList);				
			}
		})

  }

  private openSeguimientoFwUpModal(){

		this.fupEdit.openDialog(this.asistencia).subscribe(editEvent =>{
			if(editEvent.action === UPDATE){
        this.asistencia = editEvent.token;
        this.manageAsistenciaView(this.viewList);				
			}
		})

  }

  private openCalendarioModal(){

		this.fupCalendar.openDialog(this.asistencia).subscribe(editEvent =>{
			if(editEvent.action === UPDATE){
        this.asistencia = editEvent.token;
        this.manageAsistenciaView(this.viewList);				
			}
		})

  }

  private openSeguimientoHistoryModal(){

		this.fupHistory.openDialog(this.asistencia).subscribe(editEvent =>{
			if(editEvent.action === UPDATE){
        this.asistencia = editEvent.token;
        this.manageAsistenciaView(this.viewList);				
			}
		})

  }


  private openVinculosFam(token: Asistencia, vinculo?: FamilyData){
		this.cEstrecho.openDialog(this.asistencia, vinculo).subscribe(editEvent =>{
			if(editEvent.action === UPDATE){
        this.asistencia = editEvent.token;
        this.manageAsistenciaView(this.viewList);				
			}
		})

  }



  private buildMuestrasLaboratorio(token: Asistencia){
    this.muestraslabList = token.muestraslab || [];

  }

  private buildAudit(token: Asistencia):string{
    let audit = ''
    let ts, sector, fecha, fecha_txt;
    let atendido = token.atendidox;

    if(atendido){
      ts =  atendido.slug;
      sector = atendido.sector;
      fecha = new Date(token.ts_prog);
      fecha_txt = fecha ? fecha.toString(): '';
      audit = `${ts} Sector: ${sector} ${fecha_txt}`
    }

    return audit;
  }

}
