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
  	//this.createSolIntervencion()
  	//this.fetchRecursosDisponibles()


  }

  fetchRecursos(){
  	this.fetchRecursosDisponibles()
  }


  createAsitenciaPool(){
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



	private fetchRecursosDisponibles(){
		this.intSrv.fetchCapacidadDisponible().subscribe(alocationList =>{
			this.perSrv.fetchPersonByDNI('DNI', '22111353').subscribe(person => {
				console.log('PersonFetched: [%s]', person.displayName);
				let hosp = alocationList[0];
				console.log('Hospital Selected [%s]', hosp.code);
				this.intSrv.fetchInternacionesByPersonId(person._id).subscribe(list => {
					if(list && list.length){
						let asistencia = list[0];
						console.log('asistencia RETRIEVE [%s]', asistencia.compNum);
						this.intSrv.allocateInternacion(asistencia, hosp._id, 'UTI' ).subscribe(sol =>{

							console.dir(sol)
						})

					}
				})



			})





		});

	}





  /******************************************/
 /**** CREACIÓN DE S/INTERVENCIÓN **********/
/******************************************/



}
