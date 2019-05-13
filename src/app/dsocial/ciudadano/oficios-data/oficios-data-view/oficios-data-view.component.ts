import { Component, OnInit, Input } from '@angular/core';
import { personModel, OficiosData } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

@Component({
  selector: 'oficios-view',
  templateUrl: './oficios-data-view.component.html',
  styleUrls: ['./oficios-data-view.component.scss']
})
export class OficiosDataViewComponent implements OnInit {
/*****

<p class='text-destacado'>{{ tdato }} {{tocupacion}}  ::{{ ocupacion }}::</p>
<p class='text-normal'>{{ lugar }}</p>
<p class='text-normal'>{{ remuneracion }}/{{ ume }} ::{{qdiasmes}}:: </p>
<p class='text-normal'>Estado: {{ estado }} - 
		<strong>Desde:</strong> {{ desde }} - 
		<strong>Hasta:</strong>{{ hasta }} </p>

*****/

	@Input() token: OficiosData;
	public tdato;
	public tocupacion;
	public ocupacion;
	public lugar;
	public remuneracion;
	public ume;
	public qdiasmes;
	public estado;
	public desde;
	public hasta;


  constructor() { }

  ngOnInit() {
  	this.tdato = personModel.getOficiosTDatoLabel(this.token.tdato);
  	this.tocupacion = personModel.getOficiosTOcupacionLabel(this.token.tocupacion);
  	this.ume = personModel.getOficiosUMELabel(this.token.ume_remun);
  	this.estado = personModel.getOficiosEstadoLabel(this.token.estado);

  	this.ocupacion = this.token.ocupacion;
  	this.lugar = this.token.lugar;
  	this.remuneracion = this.token.remuneracion;
  	this.qdiasmes = this.token.qdiasmes;
  	this.desde = this.token.desde;
  	this.hasta = this.token.hasta;
  }


}
