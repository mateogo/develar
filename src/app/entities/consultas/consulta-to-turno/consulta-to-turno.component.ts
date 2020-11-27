import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { devutils } from '../../../develar-commons/utils';
import { TurnoHelper } from '../../turnos/turno.helper';
import { RequirenteTurno } from '../../turnos/turno.model';
import { TurnosService } from '../../turnos/turnos.service';
import { ConsultaTable } from '../consulta.model';

@Component({
  selector: 'app-consulta-to-turno',
  templateUrl: './consulta-to-turno.component.html',
  styleUrls: ['./consulta-to-turno.component.scss']
})
export class ConsultaToTurnoComponent implements OnInit {
  public form: FormGroup;

  public tipoConsultaList = [];
  public sedesList = [];

  // La persona que generó la consulta, y que se usará como solicitante
  // del turno a crear
  public person: RequirenteTurno;

  // ----------------------------------
  // Manejo del selector de fecha
  public minDate = new Date();

  public availableSlots = [];

  constructor(
    private _fb: FormBuilder,
    private dialogRef: MatDialogRef<ConsultaToTurnoComponent>,
    private _turnoService: TurnosService,
    @Inject(MAT_DIALOG_DATA) public data: ConsultaTable
  ) {
    this.form = this._fb.group({
      turnoId: [null, Validators.required],
      tipoConsulta: [null, Validators.required],
      sede: [null, Validators.required],
      txFecha: [{ value: null, disabled: true}, Validators.required],
      txHora: [{ value: null, disabled: true }, Validators.required],
      detalle: [{ value: this.data ? this.data.descripcion : null,  disabled: true}, Validators.required]
    });

    this.tipoConsultaList = TurnoHelper.getTipoConsultaList();
    this.sedesList = TurnoHelper.getSedesList();
  }

  ngOnInit(): void {
  }

  public onTipoConsultaChange(tipoConsulta: string): void {
    this.form.get('sede').setValue(this.tipoConsultaList.find(item =>
      item.val === tipoConsulta
    ).sede);

    this.onSedeChange(this.form.get('sede').value);
  }

  public onSedeChange(sede: string): void {
    this.selectFirstHorarioAvailable();
  }

  private selectFirstHorarioAvailable(): void {
    const tipoConsulta = this.form.get('tipoConsulta').value;
    const sede = this.form.get('sede').value;

    if (tipoConsulta && sede) {
        this._turnoService.fetchFirstAvailableSlot(tipoConsulta, sede).then(item => {
        this.form.get('txFecha').setValue(this.nextDay(item.dow));
        // this.form.get('txHora').setValue(item._id);

        // FIXME
        const dateTx = devutils.datePickerToTx(this.form.get('txFecha').value);
        this.buildHorariosList(dateTx, sede);


        this.form.get('txHora').setValue(item.slug);
        this.form.get('turnoId').setValue(item._id);
      });
    }
  }

  private nextDay(x) {
    const now = new Date();
    now.setDate(now.getDate() + (x + (14 - now.getDay())) % 7);
    return now;
  }


  private buildHorariosList(dateTx: string, sede: string): void {
    this._turnoService.fetchAvailableSlots(sede, dateTx).subscribe(turnosDisponibles => {
      if (turnosDisponibles && turnosDisponibles.length > 0) {
        this.availableSlots = turnosDisponibles
          .map((item) => ({ sede: TurnoHelper.getOptionLabel('sede', item.sede), slug: item.slug, val: item.hora, slotId: item._id }));

        this.form.get('txHora').setValue(this.availableSlots[0]);

      }
    });
  }

  public closeDialog(): void {
    const fvalues = this.form.getRawValue();

    this.dialogRef.close({
      data: fvalues
    });
  }

  /**
   * Función auxiliar usada para comparar los datos relacionados con el
   * mat-select de hora (slot); al ser un objeto completo requiere un
   * comparador personalizado
   */
  public comparatorForTurnoId(t1:any, t2:any): boolean {
    return t1.slotId == t2.slotId;
  }

}
