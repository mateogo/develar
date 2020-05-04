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
  @Output() checkBoxEmit : EventEmitter<any>;
  @Output() radioSelectedOption: EventEmitter<any>;
  @Output() currentProyeccionDateEmit : EventEmitter<any>;

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
    const dialogRef = this.dialog.open(AltaRapidaPacienteModalComponent, {
      width: '750px',
      data: {data : null}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}


