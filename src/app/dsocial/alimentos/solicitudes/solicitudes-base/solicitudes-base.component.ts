import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person } from '../../../../entities/person/person';
import {  Asistencia,
          Alimento,
          VoucherType,
          AsistenciaHelper,
          UpdateAsistenciaEvent,
          UpdateAlimentoEvent } from '../../../asistencia/asistencia.model';

const UPDATE = 'update';
const TOKEN_TYPE = 'asistencia';
const ALIMENTOS = 'alimentos';
const ALIMENTOS_LABEL = "Voucher alimentos";
const HABITACIONAL = 'habitacional';
const HABITACIONAL_LABEL = "Voucher materiales";
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

  public voucherType: VoucherType;

  constructor() { }

  ngOnInit() {
    if(this.token && this.token.action === 'habitat'){
      this.token.action = 'habitacional';
    }

    this.voucherType = AsistenciaHelper.getVoucherType(this.token);
    this.initEntrega(this.voucherType);

    /**
        {val: 'encuesta',     isRemitible: false, key:'',          type:'EncuestaSocAmb', label: 'Encuesta' },
        {val: 'alimentos',    isRemitible: true,  key:'modalidad', type:'Alimentos',    label: 'Alimentos' },
        {val: 'habitacional', isRemitible: true,  key:'pedidos',   type:'Habitacional',  label: 'Habitacional' },
        {val: 'sanitaria',    isRemitible: true,  key:'pedidos',   type:'Sanitaria',  label: 'Sanitaria' },
        {val: 'subsidio',     isRemitible: false, key:'',          type:'Subsidio',     label: 'Subsidio' },
        {val: 'salud',        isRemitible: true,  key:'pedidos',   type:'Salud (RVI)',  label: 'Salud (RVI)' },
        {val: 'nutricion',    isRemitible: true,  key:'pedidos',   type:'Nutrición',    label: 'Nutrición' },
        {val: 'pension',      isRemitible: false, key:'',          type:'Pensión',      label: 'Pensión' },
        {val: 'migracion',    isRemitible: false, key:'',          type:'Desplazam habitat', label: 'Desplazamiento x zona inundable' },
        {val: 'no_definido',  isRemitible: false, key:'',          type:'Sin selección',  label: 'Sin selección' },

    */


  }

  initEntrega(voucherType: VoucherType){
    //this.alimento = this.token.modalidad ? this.token.modalidad :  new Alimento();
    //this.pedido  = this.token.pedido ? this.token.pedido : new Pedido();

    this.voucher_label = voucherType.label;
    this.isRemitible = voucherType.isRemitible;

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
