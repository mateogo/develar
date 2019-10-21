import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person, UpdatePersonEvent } from '../../../../entities/person/person';

const UPDATE = 'update';
const NAVIGATE = 'navigate';
const CORE = 'core';



@Component({
  selector: 'comercio-core-status',
  templateUrl: './comercio-core-status.component.html',
  styleUrls: ['./comercio-core-status.component.scss']
})
export class ComercioCoreStatusComponent implements OnInit {
	@Input() person: Person;
	@Output() updatePerson = new EventEmitter<UpdatePersonEvent>();

	public showView = true;
	public showEdit = false;
	public openEditor = false;

	public chips: ChipSchema[] = [];

	public token = {
		description: 'token description'

	};

  constructor() { }

  ngOnInit() {
  	this.buildChipList();
  }

  buildChipList(){
  	if(!this.person) return;

  	this.chips.push(this.coreDataStatus());
  	this.chips.push(this.contactDataStatus());
  	this.chips.push(this.locacionesDataStatus());
  	this.chips.push(this.personalDataStatus());
  }

  coreDataStatus(): ChipSchema {
  	let chip = {
  		color:'primary',
  		text: 'Datos básicos'
  	}
  	return chip;
  }

  contactDataStatus(): ChipSchema {
  	let chip = {
  		color: (this.person.contactdata && this.person.contactdata.length) ? 'accent' : 'warn',
  		text: 'Datos de contacto'
  	}
  	return chip;
  }
	
	locacionesDataStatus(): ChipSchema {
  	let chip = {
  		color: (this.person.locaciones && this.person.locaciones.length) ? 'accent' : 'warn',
  		text: 'Ubicación de los locales'
  	}
  	return chip;
  }

	personalDataStatus(): ChipSchema {
  	let chip = {
  		color: (this.person.integrantes && this.person.integrantes.length) ? 'accent' : 'warn',
  		text: 'Personal de seguridad'
  	}
  	return chip;
  }


  updateCore(event: UpdatePersonEvent){
  	console.log('core-status update')
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event:UpdatePersonEvent){
  		this.updatePerson.next(event);
  }


	editToken(){
		this.openEditor = !this.openEditor;
		this.showView = !this.showView;
		this.showEdit = !this.showEdit;
	}

  navigateTo(){
    // this.openEditor = !this.openEditor;
    // this.showView = !this.showView;
    // this.showEdit = !this.showEdit;
    this.emitEvent({
      action: NAVIGATE,
      token: 'core',
      person: this.person
      
    })
  }


	removeToken(){
	}

}

interface ChipSchema{
	color:string;
	text: string;
}
