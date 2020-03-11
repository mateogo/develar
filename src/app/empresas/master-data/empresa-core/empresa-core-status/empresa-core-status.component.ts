import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person, UpdatePersonEvent, personModel } from '../../../../entities/person/person';
import { devutils }from '../../../../develar-commons/utils'
import { CensoIndustriasService } from '../../../censo-service';

const UPDATE = 'update';
const NAVIGATE = 'navigate';
const CORE = 'core';

@Component({
  selector: 'empresa-core-status',
  templateUrl: './empresa-core-status.component.html',
  styleUrls: ['./empresa-core-status.component.scss']
})
export class EmpresaCoreStatusComponent implements OnInit {
	@Input() person: Person;
	@Output() updatePerson = new EventEmitter<UpdatePersonEvent>();

	public showView = false;
	public showEdit = false;
	public openEditor = false;

	public chips: ChipSchema[] = [];

  public pname;
  public familyName;
  public pdoc;
  public edad;
  public edadTxt;
  public ocupacion;
  public nacionalidad;
  public estado;
  public neducativo;
  public sexo;



	public token = {
		description: 'token description'

	};

  constructor() { }

  ngOnInit() {
  	this.buildChipList();
    this.showView = true;
  }

  private buildChipList(){
  	if(!this.person) return;

    this.buildPersonData();
  	this.chips.push(this.coreDataStatus());
  	this.chips.push(this.contactDataStatus());
  	this.chips.push(this.locacionesDataStatus());
  	this.chips.push(this.personalDataStatus());
  }

  private buildPersonData(){
    this.familyName = personModel.getPersonFamilyName(this.person);
    this.pname = personModel.getPersonDisplayName(this.person);
    this.pdoc = personModel.getPersonDocum(this.person);
    this.edad = devutils.edadActual(new Date(this.person.fenac));
    this.nacionalidad = personModel.getNacionalidad(this.person.nacionalidad)
    this.estado = personModel.getEstadoCivilLabel(this.person.ecivil);
    this.neducativo = personModel.getNivelEducativo(this.person.nestudios);
    this.sexo = this.person.sexo;
    this.ocupacion = CensoIndustriasService.getOptionLabel('profesiones', this.person.tprofesion)

    if(this.person.fenac){
      this.edad = devutils.edadActual(new Date(this.person.fenac));
    }else{
      this.edad = 0
    }
    this.edadTxt = this.edad ? '(' + this.edad + ')' : '';


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
