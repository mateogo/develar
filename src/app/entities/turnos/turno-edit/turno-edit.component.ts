import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


import { TurnosService } from '../turnos.service';
import { TurnoHelper } from '../turno.helper';
import { Turno } from '../turno.model';
import { devutils } from '../../../develar-commons/utils';
import { UserWeb } from '../../user-web/user-web.model';
import { UserWebService } from '../../user-web/user-web.service';

@Component({
  selector: 'app-turno-edit',
  templateUrl: './turno-edit.component.html',
  styleUrls: ['./turno-edit.component.scss']
})
export class TurnoEditComponent implements OnInit {
  public form: FormGroup;
  public sedesList = [];
  public tipoConsultaList = [];
  public estadosList = [];
  public estadoAvanceList = [];

  public minDate = new Date();

  public availableSlots = [];

  public user: UserWeb;

  private idTurno: string;
  private turno: Turno;


  constructor(
    private _turnoService: TurnosService,
    private _userService: UserWebService,
    private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.sedesList = TurnoHelper.getSedesList();
    this.tipoConsultaList = TurnoHelper.getTipoConsultaList();
    this.estadosList = TurnoHelper.getTurnoEstadosList();
    this.estadoAvanceList = TurnoHelper.getTurnoEstadoAvanceList();

    this.idTurno = this._route.snapshot.params.id;

    this.form = this._fb.group({
      _id: [null],
      tipoConsulta: [null],
      sede: [null],
      estado: [null],
      avance: [null],
      txFecha: [null],
      txHora: [null],
      detalle: [null]
    });
  }

  ngOnInit(): void {
    this.loadTurno(this.idTurno);
  }

  private loadTurno(idTurno: string) {
    this._turnoService.fetchById(idTurno)
      .then(turno => {        
        this.turno = turno;
        this.initUser(turno.requirente.userId);
        this.buildHorariosList(turno.txFecha, turno.sede);        
        this.initForm(turno);
      })
      .catch(error => {
        //this._router.navigate(['../..'], { relativeTo: this._route });
      });
  }

  private initForm(turno: Turno): void {
    this.form.reset({
      _id: turno ? turno._id : null,
      tipoConsulta: turno ? turno.tipoConsulta : null,
      sede: turno ? turno.sede : null,
      txFecha: turno ? devutils.dateFromTx(turno.txFecha) : null,
      txHora: turno ? turno.txHora : null,
      detalle: turno ? turno.detalle : null,
      estado: turno ? turno.estado : null,
      avance: turno ? turno.avance : null
    });
  }

  private initUser(userId: string): void {
    this._userService.fetchById(userId)
      .then(entity => {
        this.user = entity;
      })
      .catch(error => {
        this._snackBar.open(
          'Ocurrieron errores al cargar el turno; intente nuevamente',
          'Cerrar',
          {
            duration: 1500
          });
      });
  }

  public onTipoConsultaChange(tipoConsulta: string): void {
    this.form.get('sede').setValue(this.tipoConsultaList.find(item =>
      item.val === tipoConsulta
    ).sede);
  }

  public onDateChange(event): void {
    let fecha = devutils.datePickerToDate(event.value);
    if(!fecha) return;

    let dateTx = devutils.txFromDate(fecha);
    const sede = this.form.get('sede').value;
    this.buildHorariosList(dateTx, sede);
  }

  private buildHorariosList(dateTx: string, sede: string): void {
    this._turnoService.fetchAvailableSlots(sede, dateTx).subscribe(turnosDisponibles => {
      if (turnosDisponibles && turnosDisponibles.length > 0) {
        this.availableSlots = turnosDisponibles
          .map((item) => ({ sede: TurnoHelper.getOptionLabel('sede', item.sede), slug: item.slug, val: item.hora, slotId: item._id }));

          this._turnoService.fetchAvailableSlotById(this.turno.turnoId).then(slot => {
            //c onsole.log('buildHorariosList[slot=%o]', slot);
            this.form.get('txHora').setValue({ sede: slot.sede, slug: slot.slug, val: slot.hora, slotId: slot._id });
          })
          
      }
    });


  }

  public doCancelEdit(): void {
    this._router.navigate(['../..'], { relativeTo: this._route });
  }

  public comparatorForTurnoId(t1:any, t2:any): boolean {
    return t1.slotId == t2.slotId;
  }

  public doEditTurno(): void {
    const fvalue = this.form.value;
    const turno = new Turno();
    turno._id = fvalue._id;
    turno.estado = fvalue.estado;
    turno.avance = fvalue.avance;
    turno.sede = fvalue.sede;
    turno.tipoConsulta = fvalue.tipoConsulta;
    turno.detalle = fvalue.detalle;

    turno.txHora = fvalue.txHora.slug;
    turno.turnoId = fvalue.txHora.slotId;
    turno.txFecha = devutils.datePickerToTx(fvalue.txFecha);

    turno.tsFechaHora = devutils.datePickerToDate(fvalue.txFecha).setHours(fvalue.txHora.val);

    this._turnoService.edit(turno._id, turno)
      .then(result => {
        this._router.navigate(['../..'], { relativeTo: this._route });
      })
      .catch(error => {
        this._snackBar.open(
          'Ocurrió un error al editar; intente nuevamente',
          'Error',
          {
            duration: 1500
          });
      });
  }
}
