import { Component, OnInit, Input } from '@angular/core';

import { Person, personModel } from '../../../entities/person/person';

import { 	SolicitudInternacion, Internacion } from '../../../salud/internacion/internacion.model';

import { devutils }from '../../../develar-commons/utils'



@Component({
  selector: 'ilocacion-view',
  templateUrl: './ilocacion-view.component.html',
  styleUrls: ['./ilocacion-view.component.scss']
})
export class IlocacionViewComponent implements OnInit {
	@Input() person: Person;
	@Input() solinternacion: SolicitudInternacion;
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

  public hasSolicitud = false;
  public solintNum = '';
  public internadoEn = '';
  public estadoInternacion = '';
  public servicio = '';


  constructor() { }

  ngOnInit() {
  	this.buildPersonData()

  	this.buildSolicitudData(this.solinternacion)

  }

  private buildSolicitudData(sol: SolicitudInternacion){
  	if(!sol) return;

  	this.solintNum = 'Sol Internacion: ' + sol.compNum + ' ' + sol.fecomp_txa;
  	this.estadoInternacion = sol.queue;
  	if(sol.internacion){
  		this.internadoEn = 'Alocado en: ' + sol.internacion.locCode;
  		this.estadoInternacion = sol.internacion.estado;
  		this.servicio = sol.internacion.servicio;
  	}
  	if(sol.triage){
  		this.servicio = sol.triage.servicio;
  	}

  	this.hasSolicitud = true;
  }

  private buildPersonData(){
  	if(!this.person) return;
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

}
