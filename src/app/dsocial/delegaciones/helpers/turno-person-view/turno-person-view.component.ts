import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person, UpdatePersonEvent, personModel } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

const NEXT = 'next';
const CORE = 'core';


@Component({
  selector: 'turno-person-view',
  templateUrl: './turno-person-view.component.html',
  styleUrls: ['./turno-person-view.component.scss']
})
export class TurnoPersonViewComponent implements OnInit {
	@Input() person: Person;
	@Output() updateToken = new EventEmitter<UpdatePersonEvent>();
	public pname;
  public alerta;
	public pdoc;
  public edad;
  public edadTxt;
  public ocupacion;
  public nacionalidad;
  public estado;
  public neducativo;
  public sexo;

  constructor() { }

  ngOnInit() {
  	this.pname = personModel.getPersonDisplayName(this.person);
    this.alerta = this.person.alerta;
  	this.pdoc = personModel.getPersonDocum(this.person);
    this.edad = devutils.edadActual(new Date(this.person.fenac));
    this.ocupacion = personModel.getProfesion(this.person.tprofesion)
    this.nacionalidad = personModel.getNacionalidad(this.person.nacionalidad)
    this.estado = personModel.getEstadoCivilLabel(this.person.ecivil);
    this.neducativo = personModel.getNivelEducativo(this.person.nestudios);
    this.sexo = this.person.sexo;

    if(this.person.fenac){
      this.edad = devutils.edadActual(new Date(this.person.fenac));
    }else{
      this.edad = 0
    }
    this.edadTxt = this.edad ? '(' + this.edad + ')' : '';


  }
  onCancel(){
  	this.emitEvent(NEXT);
  }

  private emitEvent(action:string){
  	this.updateToken.next({
			action: action,
			token: CORE,
			person: this.person
  	});

  }

}
