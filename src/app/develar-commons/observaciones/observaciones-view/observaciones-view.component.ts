import { Component, OnInit, Input } from '@angular/core';

import { devutils }from '../../utils'

import {  Observacion, Audit, ParentEntity } from '../observaciones.model';
import {  ObservacionesController } from '../observaciones.controller';
import { 	UpdateObservacionEvent, ObservacionesHelper } from '../observaciones.helper';


@Component({
  selector: 'observaciones-view',
  templateUrl: './observaciones-view.component.html',
  styleUrls: ['./observaciones-view.component.scss']
})
export class ObservacionesViewComponent implements OnInit {
	@Input() token: Observacion;
  @Input() type: string = 'type';

	public fecha;
  public typeLabel;
  public observacion;

  public audit;

  constructor() { }

  ngOnInit() {
  	this.typeLabel = ObservacionesHelper.getOptionLabel(this.type, this.token.type);
  	this.observacion = this.token.observacion;
  	this.fecha = this.token.fe_tx;
    this.audit = this.buildAudit(this.token);

  }

  buildAudit(token: Observacion):string{
    let audit = ''
    let ts, fecha, fecha_txt;
    let atendido = token.audit;

    if(atendido){
      ts =  atendido.username;
      fecha = new Date(atendido.ts_alta);
      fecha_txt = fecha ? fecha.toString(): '';
      audit = `${ts} ${fecha_txt}`
    }

    return audit;
  }

}
