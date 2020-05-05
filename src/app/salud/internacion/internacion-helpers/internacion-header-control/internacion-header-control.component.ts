import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';

import { InternacionHelper }  from '../../../internacion/internacion.helper';

import { MatDialog } from '@angular/material/dialog';

const ALTA_RAPIDA = 'alta:paciente:locacion';

@Component({
  selector: 'internacion-header-control',
  templateUrl: './internacion-header-control.component.html',
  styleUrls: ['./internacion-header-control.component.scss']
})
export class InternacionHeaderControlComponent implements OnInit {
  @Output() checkBoxEmit : EventEmitter<any>;
  @Output() radioSelectedOption: EventEmitter<any>;
  @Output() currentProyeccionDateEmit : EventEmitter<any>;
  @Output() altaRapidaEvent : EventEmitter<string>;

  radioDefault = 0;
  groupservices = [];

  radioOptions = [
    { value: 0,  descripcion: 'Todo'       },
    { value: 1,  descripcion: 'Ocupación'  },
    { value: 2,  descripcion: 'Disponible' },
  ];

  public proyeccionOffset = 0;
  public proyeccionDate;
  public checkSelected : Array<any> = []
  public slider;
  private selection: SelectionModel<any>;

  constructor(public dialog: MatDialog) {
    this.radioSelectedOption = new EventEmitter<any>();
    this.currentProyeccionDateEmit = new EventEmitter<any>();
    this.checkBoxEmit = new EventEmitter<any>();
    this.altaRapidaEvent = new EventEmitter<string>();
    
  }

  ngOnInit(): void {
    this.initSlider();
    this.groupservices = InternacionHelper.getOptionlist('capacidades')
    this.selection = new SelectionModel<any>(true, this.groupservices);
    // this.selection.clear();
    // this.groupservices.forEach(t=>{
    //   this.selection.select(t);
    // })

  }

  initSlider(){
    this.slider = {
      min: 0,
      max: 14,
      step: 1
    };
    
    this.proyeccionOffset = 0;

    let hoy = new Date();
    this.proyeccionDate = hoy;
  }

  sliderChanged(e){
    this.proyeccionOffset = e.value;

    let hoy = new Date();
    let nuevaFechaProyeccion = new Date(hoy);
    nuevaFechaProyeccion.setDate(
      nuevaFechaProyeccion.getDate() + this.proyeccionOffset
    );

    this.proyeccionDate = nuevaFechaProyeccion;
    this.currentProyeccionDateEmit.emit(this.proyeccionDate)
  }

  radioChanged(e){
    this.radioSelectedOption.emit(this.radioOptions[Number(e.value)]);
  }

  selectedCheckBox(e){
    this.selection.toggle(e);
    this.checkBoxEmit.emit(this.selection.selected);    
  }


  altaRapidaPaciente(){
  	this.altaRapidaEvent.emit(ALTA_RAPIDA)
  }

}
