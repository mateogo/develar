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
  selector: 'app-solicitudes-internacion-modal',
  templateUrl: './solicitudes-internacion-modal.component.html',
  styleUrls: ['./solicitudes-internacion-modal.component.scss']
})
export class SolicitudesInternacionModalComponent implements OnInit {

  //table  
  public columnasMostradas = ['select', 'tDoc', 'nDoc', 'name', 'diagnostico'];

  public dataSource: SolicitudInternacion[]; 
  public locaciones: LocacionAvailable[] = [];

  public derivarDisabled = true;
  public derivarLabel = 'Asignar';

  //formulario
  public form: FormGroup;
  public locacionesFCtrl = new FormControl();
  public opcionesFiltradas: Observable<LocacionAvailable[]>;
  public selection = new SelectionModel<any>(true, []);





  constructor(
            public dialogRef: MatDialogRef<SolicitudesInternacionModalComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any,
            private fb: FormBuilder,
            ) {
    this.initDerivacionForm();
  }

  ngOnInit(): void {
    this.dataSource = this.data.solicitudes;
    this.locaciones = this.data.locaciones || [];

    this.opcionesFiltradas = this.locacionesFCtrl.valueChanges
                                .pipe(
                                  startWith(''),
                                  map(value => this._filter(value))
                                );
  }

  private _filter(value:string): LocacionAvailable[]{
    let filterValue = value.toLowerCase();
    return this.locaciones.filter(loc => loc.code.toLowerCase().includes(filterValue))
  }

  private initDerivacionForm(){
    this.form = this.fb.group({
      centroSalud: ['', Validators.required] /* ,
      pacientes: ['', Validators.required] */
    });
  }

  toggleDerivar(){
    //Si hay algo seleccionado, habilito el botón 'derivar', de lo contrario lo inhabilito
    this.derivarDisabled = !this.selection.selected.length;

    //Cambio el label:
    this.derivarLabel = this.derivarDisabled ? 'Derivar' : `Derivar (${this.selection.selected.length})`;
  }

  onClickDerivar(){

    this.dialogRef.close({
      locacion: this.locacionesFCtrl.value,
      solicitudes: this.selection.selected
    });
    
  }
  onCanel(){
      this.dialogRef.close();
  
  }
  /* ============================================= */
  /* Selector */


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

  onDerivacionSubmit(){

  }
}

class LocacionAvailable {
  target?: string;
  servicio?: string;
  id: string;
  code: string;
  slug: string;
  capacidad = 0;
  ocupado = 0;


}

