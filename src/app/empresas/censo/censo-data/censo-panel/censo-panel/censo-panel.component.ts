import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService, UpdateListEvent, UpdateEvent } from '../../../../censo-service';

import { CensoIndustrias,
					CensoActividad,
          CensoBienes,
          CensoProductos,
          CensoMaquinarias,
          CensoPatentes,
          CensoRecursosHumanos,
          CensoExpectativas,
					EstadoCenso, 
					Empresa, 
          CensoData, 
          CensoInversion,
          CensoComercializacion} from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'


const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

const literales = {
  actividades: {
    title: 'Actividades principales y secundarias',
    token_type: 'actividad'

  },
  bienes: {
    title: 'Principales materias primas e insumos',
    token_type: 'bien'
  },

  productos: {
    title: 'Principales productos (Hasta 10 productos, en orden de relevancia)',
    token_type: 'productos'
  },

  comercializacion: {
    title: 'Comercialización y Marketing',
    token_type: 'comercializacion'
  },

  inversion: {
    title: 'Planes de inversión y mejora tecnológica',
    token_type: 'inversion'
  },

  expectativas: {
    title: 'Expectativas, riesgos y oportunidades',
    token_type: 'expectativas'
  },

  maquinarias: {
    title: 'Activos en maquinarias y tecnología',
    token_type: 'inversion'
  },

  patentes: {
    title: 'Activos en patentes, licencias y marcas',
    token_type: 'patentes'
  },

  rhumanos: {
    title: 'Talentos humanos',
    token_type: 'rhumanos'
  },

}

@Component({
  selector: 'censo-panel',
  templateUrl: './censo-panel.component.html',
  styleUrls: ['./censo-panel.component.scss']
})
export class CensoPanelComponent implements OnInit {
	@Input() items: CensoActividad[]|CensoBienes[]|CensoProductos[]|CensoInversion[]|CensoMaquinarias[]|CensoPatentes[]|CensoComercializacion[]|CensoRecursosHumanos[]|CensoExpectativas[];
  @Input() type: string = "actividades";
	@Output() updateItems = new EventEmitter<UpdateListEvent>();

  public title: string;
	public showList = false;
  public openEditor = true;
  private token_type = 'actividad'

  constructor() { }

  ngOnInit() {
    this.title = literales[this.type].title;
    this.token_type = literales[this.type].token_type;

  	if(this.items && this.items.length){
  		this.showList = true;
  	}
  }

  updateItem(event: UpdateEvent){
    if(event.action === DELETE){
      this.deleteItem(event.payload);
    }

  	this.emitEvent(event);
  }

  private deleteItem(t:any){
    let index = this.items.indexOf(t);

    if(index !== -1){
      this.items.splice(index, 1)
    }
  }

  addItem(){
    let item;

    if(this.type === "actividades"){
      item = new CensoActividad();
    }

    if(this.type === "bienes"){
      item = new CensoBienes();
    }

    if(this.type === "productos"){
      item = new CensoProductos();
    }

    if(this.type === "maquinarias"){
      item = new CensoMaquinarias();
    }

    if(this.type === "patentes"){
      item = new CensoPatentes();
    }

    if(this.type === "expectativas"){
      item = new CensoExpectativas();
    }

    if(this.type === "rhumanos"){
      item = new CensoRecursosHumanos();
    }

    if(this.type === "comercializacion"){
      item = new CensoComercializacion();
    }

    if(this.type === "inversion"){
      item = new CensoInversion();
    }

    if(this.items){
      this.items.push(item);
    }else{
      this.items = [item]
    }

    this.showList = true;
  }

  emitEvent(event:UpdateEvent){
    if(event.action !== CANCEL){
 
      if(this.type === "actividades"){
        this.updateItems.next({
              action: UPDATE,
              type: this.token_type,
              items: this.items as CensoActividad[]
        });
      }

      if(this.type === "bienes"){
        this.updateItems.next({
              action: UPDATE,
              type: this.token_type,
              items: this.items as CensoBienes[]
        });
      }

      if(this.type === "productos"){
        this.updateItems.next({
              action: UPDATE,
              type: this.token_type,
              items: this.items as CensoProductos[]
        });
      }

      if(this.type === "maquinarias"){
        this.updateItems.next({
              action: UPDATE,
              type: this.token_type,
              items: this.items as CensoMaquinarias[]
        });
      }

      if(this.type === "patentes"){
        this.updateItems.next({
              action: UPDATE,
              type: this.token_type,
              items: this.items as CensoPatentes[]
        });
      }

      if(this.type === "comercializacion"){
        this.updateItems.next({
              action: UPDATE,
              type: this.token_type,
              items: this.items as CensoComercializacion[]
        });
      }

      if(this.type === "rhumanos"){
        this.updateItems.next({
              action: UPDATE,
              type: this.token_type,
              items: this.items as CensoRecursosHumanos[]
        });
      }

      if(this.type === "expectativas"){
        this.updateItems.next({
              action: UPDATE,
              type: this.token_type,
              items: this.items as CensoExpectativas[]
        });
      }

      if(this.type === "inversion"){
        this.updateItems.next({
              action: UPDATE,
              type: this.token_type,
              items: this.items as CensoInversion[]
        });
      }
    }
  }

}
