import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { sectores, SectorAtencion } from '../../dsocial.model';

@Component({
  selector: 'turno-select',
  templateUrl: './turno-select.component.html',
  styleUrls: ['./turno-select.component.scss']
})
export class TurnoSelectComponent implements OnInit {
	@Output() turno$ = new EventEmitter<SectorAtencion>();


	public tokens:SectorAtencion[] = sectores;

  constructor() { }

  ngOnInit() {
  }

  turnoFor(e, token){
  	e.stopPropagation();
  	e.preventDefault();
  	console.log('token [%s]', token.label);
  	this.fetchTurnos(token);
  }

  fetchTurnos(token){
    this.turno$.emit(token)

  }

}
