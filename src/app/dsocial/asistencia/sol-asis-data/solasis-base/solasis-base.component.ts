import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person } from '../../../../entities/person/person';
import { Asistencia, Alimento, UpdateAsistenciaEvent, UpdateAlimentoEvent } from '../../asistencia.model';


const UPDATE = 'update';
const TOKEN_TYPE = 'asistencia';

@Component({
  selector: 'solasis-base',
  templateUrl: './solasis-base.component.html',
  styleUrls: ['./solasis-base.component.scss']
})
export class SolasisBaseComponent implements OnInit {
	@Input() token: Asistencia;
	@Output() updateToken = new EventEmitter<UpdateAsistenciaEvent>();

	public showView = true;
	public showEdit = false;

  public alimento: Alimento;

  public showViewAlimento = false;
  public showEditAlimento = false;

	public openEditor = false;

  constructor() { }

  ngOnInit() {

    this.alimento = this.token.modalidad ? this.token.modalidad :  new Alimento();

  }

  editToken(){
    this.openEditor = !this.openEditor;
    //this.showView = !this.showView;
    this.showEdit = !this.showEdit;

    this.showViewAlimento = false;
    this.showEditAlimento = false;

  }

  manageToken(event: UpdateAsistenciaEvent){
  	console.log('update Contact-Base: [%s]', event.action);
  	this.openEditor = false;
  	this.showEdit = false;
  	//this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event: UpdateAsistenciaEvent){
  	if(event.action === UPDATE){
  		this.updateToken.next(event);
  	}
  }

  editAlimento(){
    this.openEditor = !this.openEditor;
    //this.showView = false;
    this.showEdit = false;
    
    this.showViewAlimento = !this.openEditor
    this.showEditAlimento = this.openEditor
  }

  viewAlimento(){
    this.openEditor = !this.openEditor;
    //this.showView = false;
    this.showEdit = false;

    this.showViewAlimento = this.openEditor
    this.showEditAlimento = !this.openEditor
  }

  manageAlimento(event: UpdateAlimentoEvent ){
    console.log('update MODALIDAD ALIMENTO: [%s]', event.action);
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

	removeToken(){
	}

}