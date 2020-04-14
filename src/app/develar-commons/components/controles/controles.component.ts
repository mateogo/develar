import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';

import { InternacionHelper }  from '../../../salud/internacion/internacion.helper';

import { AltaRapidaPacienteModalComponent } from '../../alta-rapida-paciente-modal/alta-rapida-paciente-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'internacion-controles',
  templateUrl: './controles.component.html',
  styleUrls: ['./controles.component.scss']
})
export class ControlesComponent implements OnInit {
  @Output() radioSelectedOption: EventEmitter<any>;
  @Output() currentProyeccionDateEmit : EventEmitter<any>;
  @Output() checkBoxEmit : EventEmitter<any>;

  radioDefault = 0;
  groupservices = [
    {
      value : 0,
      descripcion : 'Cuidados intensivos'
    },
    {
      value : 1,
      descripcion : 'Cuidados intermedios'
    },
    {
      value : 2,
      descripcion : 'Guardias y otros'
    }
  ];
  radioOptions = [
    {
      value: 0,
      descripcion: 'Todo'
    },
    {
      value: 1,
      descripcion: 'Disponible'
    },
    {
      value: 2,
      descripcion: 'Ocupado'
    },
  ];

  currentProyeccion;
  currentProyeccionDate;
  checkSelected : Array<any> = []
  slider;
  selection = new SelectionModel<any>(true, []);

  constructor(public dialog: MatDialog) {
    this.radioSelectedOption = new EventEmitter<any>();
    this.currentProyeccionDateEmit = new EventEmitter<any>();
    this.checkBoxEmit = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.initSlider();
    this.groupservices = InternacionHelper.getOptionlist('capacidades')
  }

  initSlider(){
    this.slider = {
      min: 0,
      max: 14,
      step: 1
    };
    
    this.currentProyeccion = 0;

    let hoy = new Date();
    this.currentProyeccionDate = hoy;
  }

  sliderChanged(e){
    this.currentProyeccion = e.value;

    let hoy = new Date();
    let nuevaFechaProyeccion = new Date(hoy);
    nuevaFechaProyeccion.setDate(
      nuevaFechaProyeccion.getDate() + this.currentProyeccion
    );

    this.currentProyeccionDate = nuevaFechaProyeccion;
    this.currentProyeccionDateEmit.emit(this.currentProyeccionDate)
  }

  radioChanged(e){
    this.radioSelectedOption.emit(this.radioOptions[Number(e.value)]);
  }

  selectedCheckBox(e){
    this.selection.toggle(e);
    this.checkBoxEmit.emit(this.selection.selected);
    
  }

  altaRapidaPaciente(){
    const dialogRef = this.dialog.open(AltaRapidaPacienteModalComponent, {
      width: '750px',
      data: {data : null}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}


