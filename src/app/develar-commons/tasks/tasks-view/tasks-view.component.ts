import { Component, OnInit, Input } from '@angular/core';

import { devutils }from '../../utils'

import {  Task, Audit, ParentEntity } from '../tasks.model';
import {  TasksController } from '../tasks.controller';
import { 	UpdateTaskEvent, TasksHelper } from '../tasks.helper';


@Component({
  selector: 'tasks-view',
  templateUrl: './tasks-view.component.html',
  styleUrls: ['./tasks-view.component.scss']
})
export class TasksViewComponent implements OnInit {
	@Input() token: Task;
  @Input() modulo: string = 'asisprevencion';

	public fecha;
  public typeLabel;
  public observacion;
  public fe_vto = '';
  public avance = '';
  public fe_alta = '';
  public requerimiento = '';

  public audit;

  constructor() { }

  ngOnInit() {
  	this.typeLabel = TasksHelper.getOptionLabel(this.modulo, this.token.type);
  	this.observacion = this.token.observacion;
  	this.fecha = this.token.fe_alta;
    this.audit = this.buildAudit(this.token);

  }

  buildAudit(token: Task):string{
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
