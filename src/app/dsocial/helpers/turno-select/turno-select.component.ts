import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { sectores, SectorAtencion } from '../../dsocial.model';

@Component({
  selector: 'turno-select',
  templateUrl: './turno-select.component.html',
  styleUrls: ['./turno-select.component.scss']
})
export class TurnoSelectComponent implements OnInit {
  @Input() isAlimentos =  true;
	@Output() turno$ = new EventEmitter<SectorAtencion>();


	public tokens:SectorAtencion[] = sectores;

  constructor() { }

  ngOnInit() {
  }

  turnoFor(e, token){
  	e.stopPropagation();
  	e.preventDefault();
    if(token.val === "alimentos" && !this.isAlimentos) return;
  	this.fetchTurnos(token);
  }

  fetchTurnos(token){
    this.turno$.emit(token)

  }

}
