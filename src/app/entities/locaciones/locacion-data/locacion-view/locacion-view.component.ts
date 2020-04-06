import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { devutils }from '../../../../develar-commons/utils'

import { LocacionHospitalaria, LocacionEvent} from '../../locacion.model';

import { LocacionHelper } from '../../locacion.helper';

const NEXT = 'next';
const CORE = 'core';


@Component({
  selector: 'locacion-view',
  templateUrl: './locacion-view.component.html',
  styleUrls: ['./locacion-view.component.scss']
})
export class LocacionViewComponent implements OnInit {
	@Input() locacion: LocacionHospitalaria;
	@Output() updateToken = new EventEmitter<LocacionEvent>();
	public slug;
	public estado;
  public codigo;
  public type;
  public description;
 
  constructor() { }

  ngOnInit() {

    this.slug = this.locacion.slug;
    this.codigo = this.locacion.code;
    this.estado = this.locacion.estado;
    this.type = LocacionHelper.getOptionLabel('hospital', this.locacion.type);
    this.description = this.locacion.description;


  }

  onCancel(){
  	this.emitEvent(NEXT);
  }

  private emitEvent(action:string){
  	this.updateToken.next({
			action: action,
			type: 'VIEW',
			token: this.locacion,
  	});
  }

}
