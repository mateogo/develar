import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SaludController } from '../../../salud/salud.controller';

import { NovedadesFollowUpService }  from '../../vigilancia-zmodal-managers/fup-novedades-modal.service';
import { LaboratorioNovedadService } from '../../vigilancia-zmodal-managers/laboratorio-novedad-modal.service';

import { PersonService } from '../../../salud/person.service';

import { Person, FamilyData, NucleoHabitacional, personModel, Address } from '../../../entities/person/person';

import {  Asistencia,
					Novedad,
          MuestraLaboratorio, 
					UpdateNovedadEvent,
          UpdateAsistenciaListEvent,
          AsistenciaHelper } from '../../../salud/asistencia/asistencia.model';


const UPDATE = 'update';
const DELETE = 'delete';
const TOKEN_TYPE = 'asistencia';
const NAVIGATE = 'navigate';
const SELECT = 'select';

const BG_COLOR_DEFAULT = "#ffffff";
const BG_COLOR_SELECTED = "#f2eded"; //75787B //0645f5

@Component({
  selector: 'vigil-novedad-base',
  templateUrl: './vigil-novedad-base.component.html',
  styleUrls: ['./vigil-novedad-base.component.scss'],
  providers: [   NovedadesFollowUpService,
                 LaboratorioNovedadService
             ]
})
export class VigilNovedadBaseComponent implements OnInit {
	@Input() novedad: Novedad;
  @Input() asistencia: Asistencia;

  @Input() viewMode = 'show'; // show||select

	@Output() updateToken = new EventEmitter<UpdateNovedadEvent>();

	public showView = true;
	public showEditPanel = false;

  public isHisopado = false;

  public showEditBase = false;
  public showEditModalidad = false;

  public showEditControl = true;
  public showSelectControl = false;

  public chips: ChipSchema[] = [];

	public openEditor = false;

  public toggleSelectd = false;
  public selectedStyle = {};

  constructor(
    private novedadService: NovedadesFollowUpService,
    private labNovedad: LaboratorioNovedadService

    ) { }

  ngOnInit() {
    if(this.viewMode === 'show'){
      this.showEditControl = true;
      this.showSelectControl = false;

    }else if(this.viewMode === 'select'){
      this.showEditControl = false;
      this.showSelectControl = true;

    }

    this.loadChips();
    this.initOnce();

    // if(!this.novedad.compNum || this.novedad.compNum === "00000"){
    //   this.editToken()
    // }
  }

  private initOnce(){
    if(this.novedad.intervencion === 'hisopar' &&  this.novedad.isActive === true){
      this.isHisopado = true;
    }
  }

  muestraLaboratorio(){
    this.openLaboratorioModal(null)
  }

  editToken(){
    this.openNovedadesModal(this.novedad);

    // this.showEditBase = !this.showEditBase;
    // //

    // if(this.showEditBase){
    //   this.showView = false;
    //   this.showEditModalidad = false;
    //   this.showEditPanel = true;

    // }else{
    //   this.showView = true;
    //   this.showEditModalidad = false;
    //   this.showEditPanel = false;

    // }
  }


  private loadChips(){
    this.chips = [] as ChipSchema[];
    let chip = this.asistenciaDataStatus(this.chips);
  }

  private asistenciaDataStatus(chips: ChipSchema[]): ChipSchema[] {
    let isImperfecta = false; //AsistenciaHelper.isAsistenciaImperfecta(this.novedad);

    if(isImperfecta){
      let chip = {
        color: (isImperfecta) ? 'warn' : 'accent',
        text: (isImperfecta) ? 'Falta perfeccionar' : 'ok',
      } as ChipSchema

      chips.push(chip);
    }

    return chips;
  }



  manageBase(event: UpdateNovedadEvent){
    this.showView = true;
    this.showEditBase = false;
    this.showEditModalidad = false;
    this.showEditPanel = false;

  	this.emitEvent(event);
  }



  emitEvent(event: UpdateNovedadEvent){
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

  private emitEventFromModal(){
    this.updateToken.next(
      {
        action: UPDATE,
        type: TOKEN_TYPE,
        token: this.novedad
      } as UpdateNovedadEvent
    )

  }

  tokenSelected(){
    this.toggleSelectd = !this.toggleSelectd;

    this.emitEvent({
      action: SELECT,
      type: TOKEN_TYPE,
      selected: this.toggleSelectd,
      token: this.novedad

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

  editModalidad(){

  }


  private manageModalEditors(token: string){


    if(token === 'laboratorio')   this.openLaboratorioModal(null)
    if(token === 'novedades')   this.openNovedadesModal(null)

  }


  private openLaboratorioModal(muestralab: MuestraLaboratorio){

    this.labNovedad.openDialog(this.asistencia, muestralab).subscribe(editEvent =>{
      if(editEvent.action === UPDATE){
        this.asistencia = editEvent.token;
        this.emitEventFromModal()
        //
      }
    })

  }

  private openNovedadesModal(novedad: Novedad){

    this.novedadService.openDialog(this.asistencia, novedad).subscribe(editEvent =>{
      if(editEvent.action === UPDATE){
        this.asistencia = editEvent.token;
        this.emitEventFromModal()
        //this.manageAsistenciaView(this.viewList);        
      }
    })


  }


}

interface ChipSchema{
  color:string;
  text: string;
}
