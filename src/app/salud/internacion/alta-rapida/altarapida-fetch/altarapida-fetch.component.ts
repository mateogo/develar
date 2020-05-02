import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import { Person,UpdatePersonEvent, UpdateEventEmitter, personModel } from '../../../../entities/person/person';
import { PersonService } from '../../../person.service';

const CREATE =   'create';
const UPDATE =   'update';
const CANCEL =   'cancel';
const SELECTED = 'selected';

@Component({
  selector: 'altarapida-fetch',
  templateUrl: './altarapida-fetch.component.html',
  styleUrls: ['./altarapida-fetch.component.scss']
})
export class AltarapidaFetchComponent implements OnInit {
	@Output() person$ = new EventEmitter<Person>();

  public tDoc = "DNI";
  public nDoc = "";
  public searchToken;

	public tcompPersonaFisica:Array<any> = personModel.tipoDocumPF;

  public currentPerson: Person;
  public personFound = false;
  public altaPersona = false;


  constructor(
  		private perSrv: PersonService,
  	) { }

  ngOnInit() {
  }


  createNewPersonEvent(){
  	if(!this.currentPerson || !this.personFound){
	    this.currentPerson = new Person('');
	    this.currentPerson.tdoc = this.tDoc;
	    this.currentPerson.ndoc = this.searchToken;
  	}
    this.altaPersona = true;
  }

      						
  // captura evento desde el buscador de persona. 
  personFetched(person: Person){
    this.currentPerson = person;
    this.altaPersona = false;
    this.personFound = true;
    this.person$.emit(this.currentPerson);
  }

  // captura evento desde el ALTA de persona
  personEvent(event: UpdatePersonEvent){
    if(event.action === UPDATE){
      this.updatePerson(event.person);

    }else if(event.action === CREATE ){
    	this.createPerson(event.person)

    }else if(event.action === CANCEL ){
      this.altaPersona = false;
      this.personFound = false;

    }

  }


  searchTerm(event){
    this.searchToken = event;
    this.altaPersona = false;
    this.personFound = false;
  }

 
  // Template Helpers
	changeSelectionValue(type, val) {
	}

  /************************************/
  /******* Person Manager *******/
  /**********************************/
  private updatePerson(person: Person){
  	if(!person._id) return; // ToDo: error

    this.perSrv.partialUpdatePerson(person._id, person).then(per => {

    	if(per){
    		this.currentPerson = per;
		    this.person$.emit(this.currentPerson);
    		this.altaPersona = false;
    		this.personFound = true;

    	}else{
        //c onsole.log('ERROR: updating Person')
      	//todo: error
    	}
    })
  }

  private createPerson(person: Person){
    this.perSrv.createPerson(person).then(per => {
    	if(per){
    		this.currentPerson = per;
		    this.person$.emit(this.currentPerson);
    		this.altaPersona = false;
    		this.personFound = true;

    	}else {
        //c onsole.log('ERROR: updating Person')
    		//todo: error
    	}
    })
  }

}
