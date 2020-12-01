import { Component, OnInit } from '@angular/core';
import { TurnosService } from '../../entities/turnos/turnos.service';

@Component({
  selector: 'app-admin-scripts',
  templateUrl: './admin-scripts.component.html',
  styleUrls: ['./admin-scripts.component.scss']
})
export class AdminScriptsComponent implements OnInit {

  constructor(
    private _turnoService: TurnosService

  	) { }

  ngOnInit(): void {
  }


  regenerarTurnosNominales(){
  	console.log('Ready to REGENERAR TURNOS NOMINALES');
  	this._turnoService.regenerarTurnosNominales().subscribe(response => {
  		console.log('Regeneración de turnos cb: ')
  		console.dir(response);
  	})

  }

}
