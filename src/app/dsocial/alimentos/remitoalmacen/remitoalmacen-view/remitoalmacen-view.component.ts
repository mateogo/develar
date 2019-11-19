import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, Address } from '../../../../entities/person/person';

import { 	Asistencia,
					AsistenciaHelper,
					Alimento } from '../../../asistencia/asistencia.model';

import { devutils }from '../../../../develar-commons/utils'
import { RemitoAlmacen, AlimentosHelper, ItemAlmacen, UpdateRemitoEvent } from '../../alimentos.model';

//compPrefix; compName; compNum
//fecomp_txa; action; slug
//description;
//sector; estado; avance; ts_alta; ts_fin; ts_prog;
const ALIMENTOS = 'alimentos'

@Component({
  selector: 'remitoalmacen-view',
  templateUrl: './remitoalmacen-view.component.html',
  styleUrls: ['./remitoalmacen-view.component.scss']
})
export class RemitoalmacenViewComponent implements OnInit {
	@Input() token: RemitoAlmacen;

	public action;
	public entrega;
	public kitEntrega;

	public items: Array<ItemAlmacen>;

	public modalidad: RemitoAlmacen;
	public isAlimentos = false;

	public audit = '';


  constructor() { }

		// compPrefix:  string = 'REM';
		// compName:    string = 'R/Entrega';
		// compNum:     string = '00000';
		// personId:    string;
		// parentId:    string;
		// kitEntrega:  string;
		// qty:         number = 1; 
		// deposito:    string = 'almacen';
		// tmov:        string = 'entrega';
		// fecomp_tsa:  number;
		// fecomp_txa:  string;
		// action:      string = 'alimentos';
		// slug:        string;
		// description: string;
		// sector:      string;
		// estado:      string = 'activo';
		// avance:      string = 'emitido';
		// ts_alta:     number;
		// ts_fin:      number;
		// ts_prog:     number;



  ngOnInit() {

  	this.action = AsistenciaHelper.getOptionLabel('actions', this.token.action);
  	this.entrega = AlimentosHelper.getOptionLabel('tmov', this.token.tmov);

  	this.items = this.token.entregas;

  	if(this.token.kitEntrega){
  		this.kitEntrega = AlimentosHelper.getOptionLabel('kitentrega', this.token.kitEntrega);
  		
  	}else{
  		this.kitEntrega = '';
  	}
  	
  	this.audit = this.buildAudit(this.token);


  }

  buildAudit(token: RemitoAlmacen):string{
    let audit = ''
    let ts, sector, fecha, fecha_txt;
    let atendido = token.atendidox;

    if(atendido){
      ts =  atendido.slug;
      sector = atendido.sector;
      fecha = new Date(token.ts_prog);
      fecha_txt = fecha ? fecha.toString(): '';
      audit = `${ts} Sector: ${sector} ${fecha_txt}`
    }

    return audit;
  }


  umeLabel(item:ItemAlmacen ) {
  	return AlimentosHelper.getOptionLabel('ume', item.ume) || 'Un';

  }


  initDatosModalidad(token: Alimento){

  	this.isAlimentos = true;
  }

}
