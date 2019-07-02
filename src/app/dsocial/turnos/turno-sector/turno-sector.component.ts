import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';
import { DsocialController } from '../../dsocial.controller';

import { DsocialModel, Ciudadano, SectorAtencion } from '../../dsocial.model';
import { Person, personModel }  from '../../../entities/person/person';
import { Turno, TurnoslModel }  from '../../turnos/turnos.model';

@Component({
  selector: 'turno-sector',
  templateUrl: './turno-sector.component.html',
  styleUrls: ['./turno-sector.component.scss']
})
export class TurnoSectorComponent implements OnInit {
	@Input() sector: SectorAtencion;
  @Input() type: string;
  @Input() name: string;
	@Output() turnos$ = new EventEmitter<Turno[]>();

  public stockTurnos: Turno[] = [];
  public items = 0;

  constructor(
  		private dsCtrl: DsocialController,
  	) { }

  ngOnInit() {
    this.refreshTurnos(false);

  }

  refreshTurnos(emit:boolean){
    this.dsCtrl.turnosPorSector$(this.type, this.name, this.sector.serial).subscribe(turnos =>{
      this.stockTurnos = turnos
      this.items = turnos.length;

      if(emit){
        this.turnos$.emit(this.stockTurnos);
      }
    });

  }

  emitPendingList(e){
    e.stopPropagation();
    e.preventDefault();
    this.refreshTurnos(true);


  }



  turnoFor(e, sector){
  	e.stopPropagation();
  	e.preventDefault();
  	this.fetchTurnos(sector);
  }

  fetchTurnos(sector){
    this.turnos$.emit(sector)

  }

}
