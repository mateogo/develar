import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person } from '../../../../entities/person/person';
import { Asistencia,
          Alimento,
          Encuesta,
          Pedido,
          AsistenciaHelper,
          UpdateAsistenciaEvent,
          UpdatePedidoEvent,
          UpdateEncuestaEvent,
          UpdateAlimentoEvent } from '../../asistencia.model';


const NAVIGATE = 'navigate';
const DELETE = 'delete';
const UPDATE = 'update';
const SELECT = 'select';
const TOKEN_TYPE = 'asistencia';

const MODALIDAD_ALIMENTO = 'alimentos';
const MODALIDAD_HABITACIONAL = 'habitacional';
const MODALIDAD_SANITARIA = 'sanitaria';
const MODALIDAD_ENCUESTA = 'encuesta';

const BG_COLOR_DEFAULT = "#ffffff";
const BG_COLOR_SELECTED = "#f2eded"; //75787B //0645f5


@Component({
  selector: 'solasis-base',
  templateUrl: './solasis-base.component.html',
  styleUrls: ['./solasis-base.component.scss']
})
export class SolasisBaseComponent implements OnInit {
	@Input() asistencia: Asistencia;
  @Input() viewMode = 'show'; // show||select

	@Output() updateToken = new EventEmitter<UpdateAsistenciaEvent>();

	public showView = true;
	public showEditPanel = false;

  public showEditBase = false;
  public showEditModalidad = false;

  public showEditControl = true;
  public showSelectControl = false;

  public alimento: Alimento;
  public encuesta: Encuesta;
  public modalidad: string;
  public isAlimentos = false;
  public isEncuesta = false;

  public isPedido = false;
  public pedido:Pedido;

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
    let isImperfecta = AsistenciaHelper.isAsistenciaImperfecta(this.asistencia);

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
    this.isPedido = false;

    if(this.asistencia.action === MODALIDAD_ALIMENTO) {
      this.alimento = this.asistencia.modalidad ? this.asistencia.modalidad : new Alimento();
      this.modalidad = MODALIDAD_ALIMENTO;
      this.isAlimentos = true;

    } else if(this.asistencia.action === MODALIDAD_HABITACIONAL){
      this.pedido = this.asistencia.pedido ? this.asistencia.pedido : new Pedido();
      this.modalidad = MODALIDAD_HABITACIONAL;
      this.isPedido = true;

    } else if(this.asistencia.action === MODALIDAD_SANITARIA){
      this.pedido = this.asistencia.pedido ? this.asistencia.pedido : new Pedido();
      this.modalidad = MODALIDAD_SANITARIA;
      this.isPedido = true;


    } else if(this.asistencia.action === MODALIDAD_ENCUESTA){
      this.encuesta = this.asistencia.encuesta ? this.asistencia.encuesta : new Encuesta();
      this.modalidad = MODALIDAD_ENCUESTA;
      this.isEncuesta = true;

    }

  }

  editModalidad(){
    this.setModalidad();
    
    this.showEditModalidad = !this.showEditModalidad;

    if(this.showEditModalidad){
      this.showView = false;
      this.showEditBase = false;
      this.showEditPanel = true;

    }else{
      this.showView = true;
      this.showEditBase = false;
      this.showEditPanel = false;
    }

  }

  navigateSeguimiento(){
    this.manageBase({
      action: NAVIGATE,
      type: TOKEN_TYPE,
      token: this.asistencia
    })
  }

  manageBase(event: UpdateAsistenciaEvent){
    this.showView = true;
    this.showEditBase = false;
    this.showEditModalidad = false;
    this.showEditPanel = false;

  	this.emitEvent(event);
  }

  manageAlimento(event: UpdateAlimentoEvent ){
    this.showView = true;
    this.showEditBase = false;
    this.showEditModalidad = false;
    this.showEditPanel = false;

    this.asistencia.modalidad = event.token;
    
    this.emitEvent({
      action: event.action,
      type: TOKEN_TYPE,
      token: this.asistencia
    });

  }

  manageEncuesta(event: UpdateEncuestaEvent ){
    this.showView = true;
    this.showEditBase = false;
    this.showEditModalidad = false;
    this.showEditPanel = false;

    this.asistencia.encuesta = event.token;
    
    this.emitEvent({
      action: event.action,
      type: TOKEN_TYPE,
      token: this.asistencia
    });

  }


  managePedido(event: UpdatePedidoEvent ){
    this.showView = true;
    this.showEditBase = false;
    this.showEditModalidad = false;
    this.showEditPanel = false;

    this.asistencia.pedido = event.token;
    
    this.emitEvent({
      action: event.action,
      type: TOKEN_TYPE,
      token: this.asistencia
    });

  }


  emitEvent(event: UpdateAsistenciaEvent){
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

  //ToDo: Borrar
  viewAlimento(){
    this.openEditor = !this.openEditor;
    //this.showView = false;
    this.showEditPanel = false;

    this.showEditModalidad = !this.openEditor
  }

  tokenSelected(){
    this.toggleSelectd = !this.toggleSelectd;

    this.emitEvent({
      action: SELECT,
      type: TOKEN_TYPE,
      selected: this.toggleSelectd,
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
