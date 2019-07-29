import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, EncuestaAmbiental } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

@Component({
  selector: 'ambiental-view',
  templateUrl: './ambiental-data-view.component.html',
  styleUrls: ['./ambiental-data-view.component.scss']
})
export class AmbientalDataViewComponent implements OnInit {
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
  public qhabitantes;

  public ubicacion;

  constructor() { }

  ngOnInit() {
		this.ecocina = personModel.getEstadoVivLabel(this.token.ecocina,   'completo');
		this.ebanio = personModel.getEstadoVivLabel(this.token.ebanio,   'completo');
		this.emobiliario = personModel.getEstadoVivLabel(this.token.emobiliario,   'calificacion');
		this.tventilacion = personModel.getEstadoVivLabel(this.token.tventilacion,   'adecuado');
		this.tmobiliario = personModel.getTiposVivLabel(this.token.tmobiliario,   'suficiente');

		this.ubicacion = this.buildUbicacion(this.token.street1, this.token.barrio, this.token.city);

		this.aniosresid = this.token.aniosresid ? '- Permanencia (años): ' + this.token.aniosresid : '';
		this.qvivxlote = this.token.qvivxlote ? '- Viv/lote: ' + this.token.qvivxlote : '';
		this.qhabitantes = this.token.qhabitantes ? '- Ocupantes: ' + this.token.qhabitantes : '';


		this.tbanio = personModel.getTiposVivLabel(this.token.tbanio,   'interno');
		this.domterreno = personModel.getTiposVivLabel(this.token.domterreno,   'terreno', '- Dominio terreno:');
		this.tipoviv = personModel.getTiposVivLabel(this.token.tipoviv,   'tvivienda', '- Tipo vivienda:');
		this.matviv = personModel.getTiposVivLabel(this.token.matviv,   'mvivienda');
		this.techoviv = personModel.getTiposVivLabel(this.token.techoviv,   'techo');
		this.pisoviv = personModel.getTiposVivLabel(this.token.pisoviv,   'piso');
		this.agua = personModel.getTiposVivLabel(this.token.agua,   'agua', '- Agua:');
		this.electricidad = personModel.getTiposVivLabel(this.token.electricidad,   'electricidad', '- Luz:');
		this.cloaca = personModel.getTiposVivLabel(this.token.cloaca,   'colaca', '- Desagüe:');
		this.gas = personModel.getTiposVivLabel(this.token.gas,   'gas', '- Gas: ');

  	console.log('Ambiental VIEW: [%s]:[%s] [%s]',this.tipoviv, this.token.tipoviv, this.token.street1);

  }

  buildUbicacion(street, barrio, city){
  	let _barrio = ''
  	if(city && barrio){
  		_barrio = personModel.getBarrioLabel(city, barrio) + ' (' +  personModel.getCiudadLabel(city)  + ')';

  	}else if(city){
  		_barrio = personModel.getCiudadLabel(city) ;

  	}
  	return street + ' ' + _barrio;
  }


}
