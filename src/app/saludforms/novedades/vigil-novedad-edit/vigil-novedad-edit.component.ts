import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PersonService } from '../../../salud/person.service';

import { Person, FamilyData, NucleoHabitacional, personModel, Address } from '../../../entities/person/person';

import {  Asistencia,
					Novedad,
					UpdateNovedadEvent,
          UpdateAsistenciaListEvent,
          AsistenciaHelper } from '../../../salud/asistencia/asistencia.model';


@Component({
  selector: 'vigil-novedad-edit',
  templateUrl: './vigil-novedad-edit.component.html',
  styleUrls: ['./vigil-novedad-edit.component.scss']
})
export class VigilNovedadEditComponent implements OnInit {
	@Input() novedad;
  @Input() asistencia: Asistencia;

	@Output() updateToken = new EventEmitter<UpdateNovedadEvent>();

  constructor() { }

  ngOnInit(): void {
  }

}
