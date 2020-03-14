import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';
import { SaludController } from '../../salud.controller';

import { SaludModel, Ciudadano, SectorAtencion } from '../../salud.model';
import { Person, personModel }  from '../../../entities/person/person';
import { Turno, TurnoAction, TurnosModel }  from '../../turnos/turnos.model';


@Component({
  selector: 'turno-view',
  templateUrl: './turno-view.component.html',
  styleUrls: ['./turno-view.component.scss']
})
export class TurnoViewComponent implements OnInit {
	@Input() turno:Turno;
  @Input() showToggle = true;
  @Input() card_size = "medium"; // medium|small
  @Input() puesto = "llamado"; // llamado|atencion

	@Output() turnoaction$ = new EventEmitter<TurnoAction>();

  public espera = "";
  public ingreso = "";
  public isCallDesk = true;
  public isAttentionDesk = false;

  public tokenStyle = {
    medium: {
          "min-width":  "250px",
          "max-width":  "300px",
          "min-height": "300px",
          "padding":    "15px",
          "margin":     "15px",
        },
    small: {
          "min-width":  "250px",
          "max-width":  "300px",
          "min-height": "150px",
          "max-height": "150px",
          "padding":    "15px",
          "margin":     "15px",
        }
  };


public btnGroupStyle = {
    medium: {
        "margin-right": "5px",
        "margin-top": "30px",
        },
    small: {
        "margin-right": "5px",
        "margin-top": "5px",
        }
  };

  constructor(
  		private dsCtrl: SaludController,
  	) { }

  ngOnInit() {
    this.evalEspera();

    if(this.puesto === "llamado") { 
      this.isAttentionDesk = false;
      this.isCallDesk = true;
    }else{
      this.isAttentionDesk = true;
      this.isCallDesk = false;
    }


  }

  evalEspera(){
    let time = Date.now();
    let delta = (time - this.turno.ts_alta)/1000/60  //en minutos;

    this.ingreso = new Date(this.turno.ts_alta).toLocaleString();
    if(delta<60){
      this.espera = Math.floor(delta) + ' minutos';

    }else{
      this.espera = Math.floor(delta/60) + ' horas';

    }
  }

  procesarTurno(action){
    // action = [atender|baja|cumplido|derivar]
    let taction: TurnoAction = {
        id_turno: this.turno._id,
        action: action,
        estado: 'activo',
        turno: this.turno
    }
    this.turnoaction$.emit(taction);

  }

}
