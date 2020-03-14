import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, EncuestaAmbiental } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'


@Component({
  selector: 'encuesta-view',
  templateUrl: './address-eval-view.component.html',
  styleUrls: ['./address-eval-view.component.scss']
})
export class AddressEvalViewComponent implements OnInit {
	@Input() token: EncuestaAmbiental;

	public ecocina;
	public ebanio;
	public emobiliario;
	public tbanio;
	public tmobiliario;
	public tventilacion;
	public domterreno;
	public tipoviv;
	public matviv;
	public techoviv;
	public pisoviv;
	public agua;
	public electricidad;
	public cloaca;
	public gas;
  public aniosresid;
  public qvivxlote;
  public tviv;

  constructor() { }

  ngOnInit() {
		this.ecocina = personModel.getEstadoVivLabel(this.token.ecocina,   'completo');
		this.ebanio = personModel.getEstadoVivLabel(this.token.ebanio,   'completo');
		this.emobiliario = personModel.getEstadoVivLabel(this.token.emobiliario,   'calificacion');
		this.tbanio = personModel.getTiposVivLabel(this.token.tbanio,   'interno');
		this.tmobiliario = personModel.getTiposVivLabel(this.token.tmobiliario,   'suficiente');
		this.tventilacion = personModel.getEstadoVivLabel(this.token.tventilacion,   'adecuada');
		this.domterreno = personModel.getEstadoVivLabel(this.token.domterreno,   'terreno');
		this.tipoviv = personModel.getEstadoVivLabel(this.token.tipoviv,   'tvivienda');
		this.matviv = personModel.getEstadoVivLabel(this.token.matviv,   'mvivienda');
		this.techoviv = personModel.getEstadoVivLabel(this.token.techoviv,   'techo');
		this.pisoviv = personModel.getEstadoVivLabel(this.token.pisoviv,   'piso');
		this.agua = personModel.getEstadoVivLabel(this.token.agua,   'agua');
		this.electricidad = personModel.getEstadoVivLabel(this.token.electricidad,   'electricidad');
		this.cloaca = personModel.getEstadoVivLabel(this.token.cloaca,   'colaca');
		this.gas = personModel.getEstadoVivLabel(this.token.gas,   'gas');


  }

}


