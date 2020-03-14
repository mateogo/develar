import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';
import { SaludController } from '../../salud.controller';

import { SaludModel, Ciudadano, SectorAtencion } from '../../salud.model';
import { Person, personModel }  from '../../../entities/person/person';
import { Turno, TurnosModel }  from '../../turnos/turnos.model';

@Component({
  selector: 'turno-sector',
  templateUrl: './turno-sector.component.html',
  styleUrls: ['./turno-sector.component.scss']
})
export class TurnoSectorComponent implements OnInit {
	@Input() sector: SectorAtencion;
  @Input() stockTurnos:  Turno[] = [];
  @Input() type: string;
  @Input() name: string;
	@Output() turnos$ = new EventEmitter<Turno[]>();

  public items = 0;

  constructor(
  		private dsCtrl: SaludController,
  	) { }

  ngOnInit() {
    this.items = (this.stockTurnos && this.stockTurnos.length) || 0;
    //this.refreshTurnos(false);

  }

  refreshTurnos(emit:boolean){
    this.dsCtrl.turnosPorSector$(this.type, this.name, this.sector.val).subscribe(turnos =>{
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

}
