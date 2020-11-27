import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, debounceTime, filter, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../../develar-commons/shared-service';
import { devutils } from '../../../develar-commons/utils';

import { ConsultasService } from '../consultas.service';
import { UserWeb } from '../../user-web/user-web.model';
import { UserWebService } from '../../user-web/user-web.service';


@Component({
  selector: 'app-consulta-create',
  templateUrl: './consulta-create.component.html',
  styleUrls: ['./consulta-create.component.scss']
})
export class ConsultaCreateComponent implements OnInit {
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
    private _consultaService: ConsultasService,
    private _userService: UserWebService,
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

    // this.sedesList = ConsultaHelper.getSedesList();
    // this.tipoConsultaList = ConsultaHelper.getTipoConsultaList();

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
  }

  public onDateChange(event): void {
    // console.log(event.value._d.getDay());

    // const dow = event.value._d.getDay();
    // const sede = this.form.get('sede').value;

    // this._turnoService.fetchAvailableSlots().subscribe(turnosDisponibles => {
    //   this.buildHorariosList(turnosDisponibles, dow, sede);
    // });
  }

  private buildHorariosList(dayOfWeek: number, sede: string): void {
    // console.log('buildHorario [%s] [%s]', dayOfWeek, sede);

    // if (items && items.length > 0) {
    //   console.log(items);

    //   this.availableSlots = items.filter(
    //     item => item.dow === dayOfWeek && item.sede === sede
    //   ).map(
    //     item => ({ label: item.hora, val: item.hora})
    //   );

    //   console.log(this.availableSlots);
    // }
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

      // this._userService.fetchPersonByUserId(this.selectedUser._id).then(person => {
      //   const turno = new Turno();
      //   turno.requirente = new RequirenteTurno();

      //   turno.requirente.userId = this.selectedUser._id;
      //   turno.requirente.personId = person[0]._id;
      //   turno.requirente.ndoc = person[0].ndoc;
      //   turno.requirente.displayName = person[0].displayName;

      //   turno.estado = 'activo';
      //   turno.avance = 'pendiente';
      //   turno.sede = fvalue.sede;
      //   turno.tipoConsulta = fvalue.tipoConsulta;
      //   turno.detalle = fvalue.detalle;
      //   turno.txHora = fvalue.txHora;
      //   turno.txFecha = fvalue.txFecha.format('L');
      //   //turno.tsFechaHora = new Date(turno.txFecha + ' ' + devutils.txFromHora(new Date(0, 0, 0, parseInt(fvalue.txHora, 10)))).getTime();
      //   turno.tsFechaHora = devutils.dateNumFromTx(turno.txFecha + ' ' + devutils.txFromHora(new Date(0, 0, 0, parseInt(fvalue.txHora, 10))));

      //   this._turnoService.create(turno).then(result => {
      //     this._router.navigate(['..'], { relativeTo: this._route });
      //   }).catch(error => {
      //     this._snackBar.open('Error al crear el turno; intente nuevamente', 'Cerrar', {
      //       duration: 1500
      //     });
      //   });
      // });
    }
  }

  public doSearch(email: string): void {
    this.searchTerms.next(email);
  }

  public doSelectEntity(user: UserWeb): void {
    this.selectedUser = user;
  }
}
