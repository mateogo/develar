import { Component, OnInit } from '@angular/core';

import { Person, PersonContactData, Address, UpdatePersonEvent } from '../../../../entities/person/person';

import { PersonService } from '../../../person.service';

import { LocacionHospitalaria, LocacionEvent} from '../../../../entities/locaciones/locacion.model';

import { 	SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, 
					Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec } from '../../internacion.model';

import { InternacionHelper }  from '../../internacion.helper';
import { InternacionService } from '../../internacion.service';

@Component({
  selector: 'app-test-uno',
  templateUrl: './test-uno.component.html',
  styleUrls: ['./test-uno.component.scss']
})
export class TestUnoComponent implements OnInit {

  constructor(
  		private perSrv: PersonService,
  		private intSrv: InternacionService,
  	) { }

  ngOnInit() {
  	this.createSolIntervencion()


  }




  /******************************************/
  /**** CREACIÓN DE S/INTERVENCIÓN *********/
	/****************************************/
  private createSolIntervencion(){
  	this.perSrv.fetchPersonByDNI('DNI', '22111353').subscribe(person => {
  		if(person){
  			console.log('person fetched: [%s]', person.displayName);
  			this.perSrv.updateCurrentPerson(person);
  			this.initNewIntervencion(person)


  		}else {

  		}
  	})
  }

  private initNewIntervencion(person: Person){
  	let spec = new InternacionSpec();
  	this.intSrv.createNewSolicitudInternacion(spec, person).subscribe(sol => {
  		if(sol){
  			console.log('Sol Created: [%s]', sol.compNum);

  		}else {
  			console.log('fallo la creación de solicitud')
  		}
  	})



  }




  /******************************************/
 /**** CREACIÓN DE S/INTERVENCIÓN **********/
/******************************************/



}
