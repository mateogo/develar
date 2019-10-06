import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person } from '../../../../entities/person/person';
import { Asistencia, Alimento, UpdateAsistenciaEvent, UpdateAlimentoEvent } from '../../../asistencia/asistencia.model';

const UPDATE = 'update';
const TOKEN_TYPE = 'asistencia';
const ALIMENTOS = 'alimentos';
const ALIMENTOS_LABEL = "Voucher alimentos";
const MATERIALES = 'materiales';
const MATERIALES_LABEL = "Voucher materiales";
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
  public isRemitible = false;

  public showViewAlimento = false;
  public showEditAlimento = false;

	public openEditor = false;
  public voucher_label = "Voucher alimentos";

  constructor() { }

  ngOnInit() {

    this.alimento = this.token.modalidad ? this.token.modalidad :  new Alimento();
    this.initAlimentos(this.alimento);

  }

  initAlimentos(alimento:Alimento){
    if(this.token.action === ALIMENTOS ){
      this.voucher_label = ALIMENTOS_LABEL;
      this.isRemitible = true
    } else if(this.token.action === MATERIALES){
      this.voucher_label = MATERIALES_LABEL;
      this.isRemitible = true

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

    this.emitEvent({
      action: ACTION,
      type: TOKEN_TYPE,
      token: this.token
    });


  }

	removeToken(){
	}

}
