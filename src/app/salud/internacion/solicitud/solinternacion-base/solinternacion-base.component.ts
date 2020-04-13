import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person } from '../../../../entities/person/person';

import { 	SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, MotivoInternacion,
					Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
					MasterAllocation, UpdateInternacionEvent } from '../../internacion.model';

import { InternacionHelper }  from '../../internacion.helper';


const NAVIGATE = 'navigate';
const DELETE = 'delete';
const UPDATE = 'update';
const SELECT = 'select';
const TOKEN_TYPE = 'asistencia';

const BG_COLOR_DEFAULT = "#ffffff";
const BG_COLOR_SELECTED = "#f2eded"; //75787B //0645f5


@Component({
  selector: 'solinternacion-base',
  templateUrl: './solinternacion-base.component.html',
  styleUrls: ['./solinternacion-base.component.scss']
})
export class SolinternacionBaseComponent implements OnInit {
	@Input() asistencia: SolicitudInternacion;
  @Input() viewMode = 'show'; // show||select

	@Output() updateToken = new EventEmitter<UpdateInternacionEvent>();

	public showView = true;
	public showEditPanel = false;

  public showEditBase = false;
  public showEditModalidad = false;

  public showEditControl = true;
  public showSelectControl = false;

  public modalidad: string;
  public isAlimentos = false;
  public isEncuesta = false;


  public chips: ChipSchema[] = [];



	public openEditor = false;

  public toggleSelectd = false;
  public selectedStyle = {};

  constructor() { }

  ngOnInit() {
    if(this.viewMode === 'show'){
      this.showEditControl = true;
      this.showSelectControl = false;
      this.setModalidad()

    }else if(this.viewMode === 'select'){
      this.showEditControl = false;
      this.showSelectControl = true;

    }

    this.loadChips();


    if(!this.asistencia.compNum || this.asistencia.compNum === "00000"){
      this.editToken()
    }
  }


  editToken(){
    this.showEditBase = !this.showEditBase;

    if(this.showEditBase){
      this.showView = false;
      this.showEditModalidad = false;
      this.showEditPanel = true;

    }else{
      this.showView = true;
      this.showEditModalidad = false;
      this.showEditPanel = false;

    }
  }



  private loadChips(){
    this.chips = [] as ChipSchema[];
    let chip = this.asistenciaDataStatus(this.chips);
  }

  private asistenciaDataStatus(chips: ChipSchema[]): ChipSchema[] {
    let isImperfecta = false; //AsistenciaHelper.isAsistenciaImperfecta(this.asistencia);

    if(isImperfecta){
      let chip = {
        color: (isImperfecta) ? 'warn' : 'accent',
        text: (isImperfecta) ? 'Falta perfeccionar' : 'ok',
      } as ChipSchema

      chips.push(chip);
    }

    return chips;
  }

  setModalidad(){
    this.isAlimentos = false;
    this.isEncuesta = false;
  }

  editModalidad(){

  }

  navigateSeguimiento(){
    this.manageBase({
      action: NAVIGATE,
      type: TOKEN_TYPE,
      token: this.asistencia
    })
  }

  manageBase(event: UpdateInternacionEvent){
    this.showView = true;
    this.showEditBase = false;
    this.showEditModalidad = false;
    this.showEditPanel = false;

  	this.emitEvent(event);
  }


  emitEvent(event: UpdateInternacionEvent){
  	if(event.action === UPDATE){
  		this.updateToken.next(event);
  	}
    if(event.action === NAVIGATE){
      this.updateToken.next(event);
    }
    if(event.action === DELETE){
      this.updateToken.next(event);
    }
    if(event.action === SELECT){
      this.updateToken.next(event);
    }
  }


  tokenSelected(){
    this.toggleSelectd = !this.toggleSelectd;

    this.emitEvent({
      action: SELECT,
      type: TOKEN_TYPE,
      //selected: this.toggleSelectd,
      token: this.asistencia

    });
    this.toggleSelectedMode();


  }

  toggleSelectedMode(){
    if(this.toggleSelectd){
      this.selectedStyle = {
        background: BG_COLOR_SELECTED
      }

    }else{
      this.selectedStyle = {
        background: BG_COLOR_DEFAULT
      }
    }
  }

	removeToken(){
	}

}

interface ChipSchema{
  color:string;
  text: string;
}
