import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { devutils } from '../../../develar-commons/utils';
import { Turno, TurnoQuery } from '../turno.model';
import { TurnosService } from '../turnos.service';
import { TurnoHelper } from '../turno.helper';
import * as moment from 'moment';
import { AyudaEnLineaService } from '../../../develar-commons/ayuda-en-linea.service';


@Component({
  selector: "turnos-browse",
  templateUrl: './turno-browse.component.html',
  styleUrls: ['./turno-browse.component.scss'],
})
export class TurnoBrowseComponent implements OnInit {
  @Output() lookUpModels = new EventEmitter<TurnoQuery>();

  public codigo = {
      ayuda1: "app:turnos:turno-browse:query",
      ayuda2: "app:turnos:turno-browse:query:dos"
  }

  public form: FormGroup;

  public sedesList = [];
  public tipoConsultaList = [];
  public estadosList = [];
  public estadoAvanceList = [];

  public minDate = new Date();
  public minToDate;

  public turnos$: Observable<Turno[]>;
  private searchTerms = new Subject<TurnoQuery>();
  public query = null;

  public sedeFld: string;
  public tipoConsultaFld: string;

  public openEditor = true;

  constructor(
    private _turnoService: TurnosService,
    private _fb: FormBuilder,
    public dialogService: MatDialog,
    private _onlineHelpService : AyudaEnLineaService
  ) {
    const rangoFecha = devutils.getPreviousWeek(new Date());

    this.form = this._fb.group({
      fechaDesde: [devutils.datePickerToDate(devutils.dateFromTx(rangoFecha.feDesde))],
      fechaHasta: [devutils.datePickerToDate(devutils.dateFromTx(rangoFecha.feHasta))],
      sede: [null],
      tipoConsulta: [null],
      estado: [null],
      avance: [null]
    });
  }

  ngOnInit(): void {
    this.sedesList = TurnoHelper.getSedesList();
    this.tipoConsultaList = TurnoHelper.getTipoConsultaList();
    this.estadosList = TurnoHelper.getTurnoEstadosList();
    this.estadoAvanceList = TurnoHelper.getTurnoEstadoAvanceList();

    this.searchTerms.pipe(
      tap(term => this.lookUpModels.next(term))
    ).subscribe();
  }


  onSelectionChange(key: string, term: string): void {
    if (!this.query) {
      this.query = new TurnoQuery();
    }

    if (key === 'fechaDesde' || key === 'fechaHasta') {
      this.query[key] = (moment(term).format('x')).toString();
    } else {
      this.query[key] = term;
    }

    this.query = this.initQuery(this.form, this.query);
    this.query = TurnoHelper.cleanQueryToken(this.query);
    this.searchTerms.next(this.query);
  }

  selectEntity(turno: Turno): void { }

  doRefreshResults(): void {
    this.query = this.initQuery(this.form, this.query);
    this.query = TurnoHelper.cleanQueryToken(this.query);
    this.searchTerms.next(this.query);
  }

  doDownloadResults(): void {
    this.query = this.initQuery(this.form, this.query);
    this.query = TurnoHelper.cleanQueryToken(this.query);
    this.searchTerms.next(this.query);
    this._turnoService.export(this.query);
  }

  private initQuery(form: FormGroup, query) {
    const fvalue = form.value;

    if (!query) {
      query = new TurnoQuery();
    }

    query.fechaDesde = devutils.datePickerToNum(fvalue.fechaDesde);
    query.fechaHasta = devutils.datePickerToNumPlusOne(fvalue.fechaHasta);
    query.sede = fvalue.sede;
    query.tipoConsulta = fvalue.tipoConsulta;
    query.estado = fvalue.estado;
    query.avance = fvalue.avance;
    return query;
  }

  showHelp(event : MouseEvent, key : string){
    console.log(event.type)
    console.log(this.codigo[key])
    this._onlineHelpService.showOnlineHelp(this.codigo[key]);
  }
}
