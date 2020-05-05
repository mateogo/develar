import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import {     SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, 
                    Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
                    MasterAllocation, AsignarRecursoEvent } from '../../../salud/internacion/internacion.model';


@Component({
  selector: 'app-buffer-modal',
  templateUrl: './buffer-modal.component.html',
  styleUrls: ['./buffer-modal.component.scss']
})
export class BufferModalComponent implements OnInit {
  //table  
  public columnasMostradas = ['select', 'tDoc', 'nDoc', 'name', 'diagnostico', 'servicio'];

  public dataSource: SolicitudInternacion[]; 

  public derivarDisabled = true;
  public derivarLabel = 'Asignar';

  //formulario
  // public form: FormGroup;
  // public locacionesFCtrl = new FormControl();
  // public opcionesFiltradas: Observable<LocacionAvailable[]>;
  public selection = new SelectionModel<any>(true, []);

  constructor(
            public dialogRef: MatDialogRef<BufferModalComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any,
            private fb: FormBuilder,
            ) {
  }

  ngOnInit(): void {
    this.dataSource = this.data.solicitudes;

  }


  toggleDerivar(){
    //Si hay algo seleccionado, habilito el botón 'derivar', de lo contrario lo inhabilito
    this.derivarDisabled = !this.selection.selected.length;

    //Cambio el label:
    this.derivarLabel = this.derivarDisabled ? 'Derivar' : `Derivar (${this.selection.selected.length})`;
  }

  onCanel(){
      this.dialogRef.close();  
  }


  onSelect(row: any){
    this.selection.toggle(row);
    this.toggleDerivar();
  }

  isAllSelected(){
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  masterToggle(){
    this.isAllSelected()?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row));

    this.toggleDerivar();
  }

  checkboxLabel(row?: any): string{
    if(!row){
      return `${this.isAllSelected() ? 'seleccionar' : 'deseleccionar'} todo`;
    }
    return `${this.selection.isSelected(row) ? 'deseleccionar' : 'seleccionar'} paciente`;
  }

}
