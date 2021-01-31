import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, debounceTime, filter, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../../develar-commons/shared-service';
import { devutils } from '../../../develar-commons/utils';

import { TurnosService } from '../turnos.service';
import { TurnoHelper } from '../turno.helper';
import { Turno, RequirenteTurno, TurnoDisponible } from '../turno.model';
import { UserWeb } from '../../user-web/user-web.model';
import { UserService } from '../../user/user.service';

const ESTADO_NO_CONFIRM = 'noconfirmado';
@Component({
  selector: 'app-turno-create',
  templateUrl: './turno-create.component.html',
  styleUrls: ['./turno-create.component.scss']
})
export class TurnoCreateComponent implements OnInit {
  public form: FormGroup;
  public sedesList;
  public tipoConsultaList;
  public minDate = new Date();

  public availableSlots = [];

  public users$: Observable<UserWeb[]>;
  public selectedUser: UserWeb;
  private searchTerms: Subject<string> = new Subject<string>();

  public pageTitle = 'Gestión de turnos';

  constructor(
    private _turnoService: TurnosService,
    private _userService: UserService,
    private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _shared: SharedService
  ) {
    this.form = this._fb.group({
      _id: [null],
      tipoConsulta: [null],
      sede: [null],
      txFecha: [null],
      txHora: [null],
      detalle: [null],
      email: [null]
    });

    this.sedesList = TurnoHelper.getSedesList();
    this.tipoConsultaList = TurnoHelper.getTipoConsultaList();

    this._shared.emitChange(this.pageTitle);
  }

  ngOnInit(): void {
    this.users$ = this.searchTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(term => term && term.length > 4),
      switchMap(term => this._userService.testUserByEmail(term))
    );
  }

  public onTipoConsultaChange(tipoConsulta: string): void {
    this.form.get('sede').setValue(this.tipoConsultaList.find(item =>
      item.val === tipoConsulta
    ).sede);

    this.onSedeChange(this.form.get('sede').value);
  }

  public onDateChange(event): void {
    let fecha = devutils.datePickerToDate(event.value);
    if (!fecha) return;

    let dateTx = devutils.txFromDate(fecha);
    const sede = this.form.get('sede').value;
    this.buildHorariosList(dateTx, sede);
  }

  public onSedeChange(sede: string): void {
    this.selectFirstHorarioAvailable();
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

  public doCancelCreate(): void {
    this._router.navigate(['..'], { relativeTo: this._route });
  }

  public doCreateTurno(): void {
    if (!this.selectedUser) {
      this._snackBar.open('Primero seleccione un usuario', 'Cerrar', {
        duration: 1500
      });
    } else {
      const fvalue = this.form.value;

      //c onsole.log('doCreateTurno[fvalue=%o]', fvalue);

      this._userService.fetchPersonByUserId(this.selectedUser._id).then(person => {
        const turno = new Turno();
        turno.requirente = new RequirenteTurno();

        turno.requirente.userId = this.selectedUser._id;
        turno.requirente.personId = person[0]._id;
        turno.requirente.ndoc = person[0].ndoc;
        turno.requirente.displayName = person[0].displayName;

        turno.estado = 'activo';
        turno.avance = ESTADO_NO_CONFIRM;
        turno.sede = fvalue.sede;
        turno.tipoConsulta = fvalue.tipoConsulta;
        turno.detalle = fvalue.detalle;
        turno.txHora = fvalue.txHora.slug;
        turno.txFecha = devutils.datePickerToTx(fvalue.txFecha);
        turno.tsFechaHora = devutils.datePickerToDate(fvalue.txFecha).setHours(fvalue.txHora.val);
        turno.turnoId = fvalue.txHora.slotId;

        this._turnoService.create(turno).then(result => {
          this._router.navigate(['..'], { relativeTo: this._route });
        }).catch(error => {
          this._snackBar.open('Error al crear el turno; intente nuevamente', 'Cerrar', {
            duration: 1500
          });
        });
      });
    }
  }

  /**
   * Obtiene y selecciona el primer turno nominal disponible para poder asignar
   * un turno
   *
   */
  private selectFirstHorarioAvailable(): void {
    const tipoConsulta = this.form.get('tipoConsulta').value;
    const sede = this.form.get('sede').value;


    //c onsole.log('selectFirstHorarioAvailable[tipoConsulta=%s, sede=%s]', tipoConsulta, sede);

    if (tipoConsulta && sede) {
      // 'item' es un objeto TurnoDisponible con los datos del slot que deberiamos
      // usar... pero primero hay que comprobarlo
      this._turnoService.fetchFirstAvailableSlot(tipoConsulta, sede).then(item => {
        // Primero calculamos la distancia entre
        const slotDow = item.dow;
        const hoyDow = new Date().getDay();
        const dowDistance = slotDow - hoyDow;

        //c onsole.log('selectFirstHorarioAvailable[dowDistance=%s]', dowDistance);

        // this.form.get('txFecha').setValue(moment().add(item.dow, 'days'));
        this.form.get('txFecha').setValue(this.nextDay(item.dow));
        this.form.get('txHora').setValue(item._id);

            // FIXME
    const dateTx = devutils.datePickerToTx(this.form.get('txFecha').value);
    this.buildHorariosList(dateTx, sede);

        // this.form.get('turnoId').setValue(item._id);
      });
    }
  }

  private nextDay(x) {
    const now = new Date();
    // now.setDate(now.getDate() + (x +(7 - now.getDay())) % 7);
    now.setDate(now.getDate() + (x + (14 - now.getDay())) % 7);
    return now;
  }

  public doSearch(email: string): void {
    this.searchTerms.next(email);
  }

  public doSelectEntity(user: UserWeb): void {
    this.selectedUser = user;
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
