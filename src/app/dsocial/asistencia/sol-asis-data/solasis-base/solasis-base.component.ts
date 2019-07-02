import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person } from '../../../../entities/person/person';
import { Asistencia, Alimento, UpdateAsistenciaEvent, UpdateAlimentoEvent } from '../../asistencia.model';


const NAVIGATE = 'navigate';
const UPDATE = 'update';
const SELECT = 'select';
const TOKEN_TYPE = 'asistencia';

const BG_COLOR_DEFAULT = "#ffffff";
const BG_COLOR_SELECTED = "#f2eded"; //75787B //0645f5


@Component({
  selector: 'solasis-base',
  templateUrl: './solasis-base.component.html',
  styleUrls: ['./solasis-base.component.scss']
})
export class SolasisBaseComponent implements OnInit {
	@Input() token: Asistencia;
  @Input() viewMode = 'show'; // show||select
	@Output() updateToken = new EventEmitter<UpdateAsistenciaEvent>();

	public showView = true;
	public showEdit = false;

  public alimento: Alimento;

  public showViewAlimento = false;
  public showEditAlimento = false;

	public openEditor = false;

  public editMode = true;
  public selectMode = false;

  public toggleSelectd = false;
  public selectedStyle = {};

  constructor() { }

  ngOnInit() {

    this.alimento = this.token.modalidad ? this.token.modalidad :  new Alimento();
    if(this.viewMode === 'show'){
      this.editMode = true;
      this.selectMode = false;

    }else if(this.viewMode === 'select'){
      this.editMode = false;
      this.selectMode = true;

    }

    if(!this.token.compNum || this.token.compNum === "00000"){
      this.editToken()
    }

  }

  editToken(){
    this.openEditor = !this.openEditor;
    //this.showView = !this.showView;
    this.showEdit = !this.showEdit;

    this.showViewAlimento = false;
    this.showEditAlimento = false;

  }

  editAlimento(){
    this.openEditor = !this.openEditor;
    //this.showView = false;
    this.showEdit = false;
    
    this.showViewAlimento = !this.openEditor
    this.showEditAlimento = this.openEditor
  }

  navigateSeguimiento(){
    this.manageToken({
      action: NAVIGATE,
      type: TOKEN_TYPE,
      token: this.token
    })
  }

  manageToken(event: UpdateAsistenciaEvent){
  	this.openEditor = false;
  	this.showEdit = false;
  	//this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event: UpdateAsistenciaEvent){
  	if(event.action === UPDATE){
  		this.updateToken.next(event);
  	}
    if(event.action === NAVIGATE){
      this.updateToken.next(event);
    }
    if(event.action === SELECT){
      this.updateToken.next(event);
    }
  }



  viewAlimento(){
    this.openEditor = !this.openEditor;
    //this.showView = false;
    this.showEdit = false;

    this.showViewAlimento = this.openEditor
    this.showEditAlimento = !this.openEditor
  }

  manageAlimento(event: UpdateAlimentoEvent ){
    this.openEditor = false;
    this.showEdit = false;
    //this.showView = true;
    this.token.modalidad = event.token;
    
    this.emitEvent({
      action: event.action,
      type: TOKEN_TYPE,
      token: this.token
    });

  }

  tokenSelected(){
    this.toggleSelectd = !this.toggleSelectd;

    this.emitEvent({
      action: SELECT,
      type: TOKEN_TYPE,
      selected: this.toggleSelectd,
      token: this.token

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