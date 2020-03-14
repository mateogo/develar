import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { sectores, SectorAtencion } from '../../salud.model';

@Component({
  selector: 'turno-select',
  templateUrl: './turno-select.component.html',
  styleUrls: ['./turno-select.component.scss']
})
export class TurnoSelectComponent implements OnInit {
  @Input() isAlimentos =  true;
  @Input() sectorpreferencial
	@Output() turno$ = new EventEmitter<SectorAtencion>();


	public tokens:SectorAtencion[] = sectores;

  constructor() { }

  ngOnInit() {
    if(this.sectorpreferencial){
      let preferido = this.tokens.find(t => t.val === this.sectorpreferencial);
      if(preferido){
        preferido.style =  {'background-color': "#21cddd"};
      }

    }

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
