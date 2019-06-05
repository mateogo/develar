import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person } from '../../../../entities/person/person';
import { Asistencia, Alimento, UpdateAsistenciaEvent, UpdateAlimentoEvent } from '../../../asistencia/asistencia.model';

const UPDATE = 'update';
const TOKEN_TYPE = 'asistencia';
const ALIMENTOS = 'alimentos';
const ACTION = 'create';

@Component({
  selector: 'solicitudes-base',
  templateUrl: './solicitudes-base.component.html',
  styleUrls: ['./solicitudes-base.component.scss']
})
export class SolicitudesBaseComponent implements OnInit {
	@Input() token: Asistencia;
	@Output() updateToken = new EventEmitter<UpdateAsistenciaEvent>();

	public showView = true;
	public showEdit = false;

  public alimento: Alimento;
  public isAlimento = false;

  public showViewAlimento = false;
  public showEditAlimento = false;

	public openEditor = false;

  constructor() { }

  ngOnInit() {

    this.alimento = this.token.modalidad ? this.token.modalidad :  new Alimento();
    this.initAlimentos(this.alimento);

  }

  initAlimentos(alimento:Alimento){
    if(this.token.action === ALIMENTOS){
      this.isAlimento = true
    }


  }


  emitEvent(event: UpdateAsistenciaEvent){
  	if(event.action === ACTION){
  		this.updateToken.next(event);
  	}
  }


    
  generarVoucher(e){
    e.preventDefault();
    e.stopPropagation();
    console.log('GenerarVoucherALIMENTOS BEGIN')

    this.emitEvent({
      action: ACTION,
      type: TOKEN_TYPE,
      token: this.token
    });


  }

	removeToken(){
	}

}
