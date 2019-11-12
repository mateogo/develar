import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, EncuestaAmbiental } from '../../../../entities/person/person';

import { 	Asistencia, 
					Pedido,
					ItemPedido,
					Modalidad,
					AsistenciaHelper } from '../../asistencia.model';


import { KitOptionList, AlimentosHelper } from '../../../alimentos/alimentos.model';

import { devutils }from '../../../../develar-commons/utils'

@Component({
  selector: 'solicita-pedidos-view',
  templateUrl: './solicita-pedidos-view.component.html',
  styleUrls: ['./solicita-pedidos-view.component.scss']
})
export class SolicitaPedidosViewComponent implements OnInit {
	@Input() pedido: Pedido;
  @Input() kitOptList:KitOptionList[] = [];

	public type;
	public freq;
	public qty;
	public fechad;
	public fechah;
	public observacion;

	public modalidad: Modalidad;
	public deposito;
	public urgencia;
	public kitId;
	public kitQty;
	public causa;
	public estado;
	public avance;
	public entrega;
	public items: ItemPedido[] = [];

  constructor() { }

  ngOnInit() {
		if(this.pedido && this.pedido.modalidad){
			this.modalidad = this.pedido.modalidad;
			this.freq = AsistenciaHelper.getOptionLabel('frecuencia',this.modalidad.freq);
			this.fechad = this.modalidad.fe_txd;
			this.fechah = this.modalidad.fe_txh;
			if(this.freq === 'unicavez' ||this.freq === 'unica') {
				this.entrega = 'Previsto de entrega: '+ this.fechad 

			}else {
				this.entrega = 'Período de entrega:: ' + this.fechad +' - ' + this.fechah

			}
		}
		this.kitId = this.pedido.kitId;
		this.kitQty = this.pedido.kitQty;

		this.deposito = this.pedido.deposito;
		this.urgencia = this.pedido.urgencia;
		this.observacion = this.pedido.observacion ? 'Observación: ' + this.pedido.observacion: '';


		this.causa = this.pedido.causa ? 'Motivación/ Causa: ' + this.pedido.causa : '';

		this.estado = AsistenciaHelper.getOptionLabel('estado',this.pedido.estado);
		this.avance = AsistenciaHelper.getOptionLabel('avance',this.pedido.avance);

		this.items = this.pedido.items;
  }

}