import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ConsultaHelper } from '../../../entities/consultas/consulta.helper';

@Component({
  selector: 'app-turnos-industriales-dialog-consulta',
  templateUrl: './turnos-industriales-dialog-consulta.component.html',
  styleUrls: ['./turnos-industriales-dialog-consulta.component.scss']
})
export class TurnosIndustrialesDialogConsultaComponent implements OnInit {

  public form: FormGroup;

  public consultaTypeList = [];

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<TurnosIndustrialesDialogConsultaComponent>
  ) {
    this.consultaTypeList = ConsultaHelper.getOptionList('consultaType');

    this.form = this._fb.group({
      type: [{value: 'consultaturno', disabled: true }],
      description: [null, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close({
      result: true,
      data: this.form.getRawValue()
    });
  }

}
