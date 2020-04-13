import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-alta-rapida-paciente-modal',
  templateUrl: './alta-rapida-paciente-modal.component.html',
  styleUrls: ['./alta-rapida-paciente-modal.component.scss']
})
export class AltaRapidaPacienteModalComponent implements OnInit {

  pacienteForm : FormGroup;
  tiposDocumento: Array<any> = [
    {
      tipo : 'DNI'
    },
    {
      tipo : 'LC'
    },
    {
      tipo : 'LE'
    },
    {
      tipo : 'No informado'
    }
  ]
  constructor(public dialogRef: MatDialogRef<AltaRapidaPacienteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb : FormBuilder) { 
      this.initPacienteForm();
    }

  ngOnInit(): void {
  }

  initPacienteForm(){
    this.pacienteForm = this.fb.group({
      name : ['',Validators.required],
      tipoDni : ['',Validators.required],
      edad : [''],
      telefono: ['',Validators.compose([Validators.pattern('[0-9]+')])],
      dni : ['',Validators.compose([Validators.pattern('[0-9]+'),Validators.minLength(8),Validators.maxLength(8)])],
      diagnostico : ['Alta rápida de paciente'],
      fecha_in : [new Date(), Validators.required],
      fecha_out :[''],
      destino : [''],
      en: ['']
    })

    /**De momento vamos a setear con el arr casero que el tipo de documento sea DNI */
    this.pacienteForm.get('tipoDni').setValue(this.tiposDocumento[0]);
  }

  onPacienteSubmit(){

  }

  seleccionTipoDni(tipoDni){
    let controlDni = this.pacienteForm.get('dni');
    if(tipoDni.tipo === 'No informado'){
      controlDni.disable();
      controlDni.clearValidators();
    }else{
      controlDni.enable();
      controlDni.setValidators(Validators.compose([Validators.pattern('[0-9]+'),Validators.minLength(8),Validators.maxLength(8)]));
    }
    controlDni.updateValueAndValidity();
  }

  volver(){

  }
}
