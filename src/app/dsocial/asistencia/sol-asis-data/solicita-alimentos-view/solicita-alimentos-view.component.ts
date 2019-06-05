import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, EncuestaAmbiental } from '../../../../entities/person/person';

import { 	Asistencia, 
					Alimento, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../asistencia.model';

import { devutils }from '../../../../develar-commons/utils'

@Component({
  selector: 'alimentos-view',
  templateUrl: './solicita-alimentos-view.component.html',
  styleUrls: ['./solicita-alimentos-view.component.scss']
})
export class SolicitaAlimentosViewComponent implements OnInit {
	@Input() token: Alimento;

	public type;
	public freq;
	public qty;
	public fechad;
	public fechah;
	public observacion;


  constructor() { }

  ngOnInit() {
	this.type = AsistenciaHelper.getOptionLabel('alimentos',this.token.type);
	this.freq = AsistenciaHelper.getOptionLabel('frecuencia',this.token.freq);
	this.qty = this.token.qty;
	this.fechad = this.token.fe_txd;
	this.fechah = this.token.fe_txh;
	this.observacion = this.token.observacion;



  // <!-- type  freq  qty  -->
  // <!-- fe_tsd  fe_tsh  fe_txd  fe_txh   -->
  // <!-- observacion -->





  }

}
