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
  public searchToken;

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

  		}else{
  			this.person$.emit([]);
  		}

  	});

  }

  altaPerson(){
    this.datosDocumento['tdoc'] = this.tDoc;
    this.datosDocumento['ndoc'] = this.searchToken;

    this.altaPersona = true;

  }

  searchTerm(event){
    this.searchToken = event;

  }

  personFetched(person:Person){
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
