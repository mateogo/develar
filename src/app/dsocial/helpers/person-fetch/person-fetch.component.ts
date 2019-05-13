import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import { Person, personModel } from '../../../entities/person/person';
import { DsocialController } from '../../dsocial.controller';


@Component({
  selector: 'person-fetch',
  templateUrl: './person-fetch.component.html',
  styleUrls: ['./person-fetch.component.scss']
})
export class PersonFetchComponent implements OnInit {
	@Output() person$ = new EventEmitter<Person[]>();

  public tDoc = "DNI";
  public nDoc = "";
  public datosDocumento = {};
	public tcompPersonaFisica:Array<any> = personModel.tipoDocumPF;

  public currentPerson: Person;
  public personFound = false;
  public altaPersona = false;


	private personListener:Subject<Person[]>;

  constructor(
  		private dsCtrl: DsocialController,
  	) { }

  ngOnInit() {
  }

  fetchPerson(){
  	this.personListener = this.dsCtrl.fetchPersonByDNI(this.tDoc, this.nDoc);
  	this.personListener.subscribe(tokens => {
  		if(tokens && tokens.length){
  			this.person$.emit(tokens);
  			console.log('Persons emittted: [%s]', tokens.length);
  		}else{
  			this.person$.emit([]);
  		}

  	});

  }

  altaPerson(){
    console.log('altapersona embebida')
    this.datosDocumento['tdoc'] = this.tDoc;
    this.datosDocumento['ndoc'] = this.nDoc;

    this.altaPersona = true;

  }

  personFetched(person:Person){
    console.log('alta persona embebidaOK');
    this.currentPerson = person;
    this.person$.emit([this.currentPerson]);
    this.altaPersona = false;

  }
  
  cancelNewPerson(){
      this.altaPersona = false;
      this.personFound = false;
  }


  // Template Helpers
	changeSelectionValue(type, val) {
	}


}