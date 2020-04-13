import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-solicitudes-internacion-modal',
  templateUrl: './solicitudes-internacion-modal.component.html',
  styleUrls: ['./solicitudes-internacion-modal.component.scss']
})
export class SolicitudesInternacionModalComponent implements OnInit {

  columnasMostradas = ['select', 'tDoc', 'nDoc', 'name', 'diagnostico'];
  dataSource;
  derivarDisabled = true;
  derivarLabel = 'Derivar';

  formControlCentroSalud = new FormControl();

  opciones = ['Hospital 1', 'Hospital 2', 'Club A', 'Club B'];
  opcionesFiltradas: Observable<string[]>;

  derivacionForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  ) {
    this.initDerivacionForm();
  }

  ngOnInit(): void {
    this.dataSource = this.data.solicitudes;

    this.opcionesFiltradas = this.formControlCentroSalud.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value:string): string[]{
    const filterValue = value.toLowerCase();

    return this.opciones.filter(opcion => opcion.toLowerCase().includes(filterValue));
  }

  initDerivacionForm(){
    this.derivacionForm = this.fb.group({
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
    //TODO: seleccionar la lista para poder derivar
    
  }

  /* ============================================= */
  /* Selector */

  selection = new SelectionModel<any>(true, []);

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
