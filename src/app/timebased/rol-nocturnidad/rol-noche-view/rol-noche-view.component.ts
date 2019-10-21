import { Component, OnInit, Input } from '@angular/core';

import { devutils }from '../../../develar-commons/utils'

import { TimebasedController } from '../../timebased-controller';

import {  Person,  personModel, Address  } from '../../../entities/person/person';

import { RolNocturnidad, RolNocturnidadItem, UpdateRolEvent }    from '../../timebased.model';
import { TimebasedHelper }    from '../../timebased-helper';


@Component({
  selector: 'rol-noche-view',
  templateUrl: './rol-noche-view.component.html',
  styleUrls: ['./rol-noche-view.component.scss']
})
export class RolNocheViewComponent implements OnInit {
	@Input() token: RolNocturnidad;
  @Input() detailView = true;

	public action;
  public sector;
  public vigencia;
	public cPrefix;
	public cName;
	public cNum;
	public slug;
	public description;
	public fecha;
  public solicitante;
  public avance;
  public estado;
  public agentes: string[] = [];

  constructor() { }

  ngOnInit() {

    console.log('VIEW [%s]', this.token.compNum);
  	this.action = TimebasedHelper.getPrefixedOptionLabel('actions', '', this.token.action);
    this.sector = TimebasedHelper.getPrefixedOptionLabel('sectores', 'Sector', this.token.sector);
    this.vigencia = TimebasedHelper.getPrefixedOptionLabel('vigencia', 'Vigencia', this.token.vigencia);
    this.solicitante = this.token.requeridox ? this.token.requeridox.slug  + ' :: DNI: ' + this.token.requeridox.ndoc : '';
  	this.cPrefix = this.token.compPrefix;
  	this.cName = this.token.compName;
  	this.cNum = this.token.compNum;  
  	this.slug = this.token.slug;
  	this.description = this.token.description;
  	this.fecha = this.token.ferol_txa + ' (' + this.vigencia + ')'

    this.estado =  TimebasedHelper.getPrefixedOptionLabel('estado', 'Estado', this.token.estado);
    this.avance =  TimebasedHelper.getPrefixedOptionLabel('avance', this.estado, this.token.avance);
    
    if(this.token.avance === 'autorizado'){
      this.avance = 'AUTORIZADO';
    }else{
      this.avance = 'Emitido por el interesado';
    }
    let enrolados = this.token.agentes || [];
    this.agentes = enrolados.map(t => 'DNI: ' + t.personDni + " :: " + t.personApellido + ', ' + t.personName);
  }

  verdDetalle(e){
    e.stopPropagation()
    e.preventDefault();
    this.detailView = !this.detailView;
  }


}

