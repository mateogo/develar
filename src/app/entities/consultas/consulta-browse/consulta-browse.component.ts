import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Consulta, ConsultaQuery } from '../consulta.model';
import { ConsultasService } from '../consultas.service';
import { ConsultaHelper } from '../consulta.helper';
import { devutils } from '../../../develar-commons/utils';

@Component({
  selector: 'consultas-browse',
  templateUrl: './consulta-browse.component.html',
  styleUrls: ['./consulta-browse.component.scss'],
})
export class ConsultaBrowseComponent implements OnInit {
  @Output() lookUpModels = new EventEmitter<ConsultaQuery>();

  public form: FormGroup;
  public estadosList = [];

  public minDate = new Date();
  public minToDate;

  public consultas: Observable<Consulta[]>;
  public sectoresList: [];
  public ejecucionesList: [];
  private searchTerms = new Subject<ConsultaQuery>();
  public query: ConsultaQuery = null;

  constructor(
    private consultaService: ConsultasService,
    private fb: FormBuilder,
    public dialogService: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.estadosList = ConsultaHelper.getConsultaEstadosList();
    this.sectoresList = ConsultaHelper.getOptionList('sectores');
    this.ejecucionesList = ConsultaHelper.getOptionList('ejecucion');

    this.searchTerms.pipe(
      tap(term => this.lookUpModels.next(term))
    ).subscribe();
  }


  initForm() {
    const rangoFecha = devutils.getPreviousWeek(new Date());
    this.form = this.fb.group({
      txFechaDesde: [devutils.datePickerToDate(devutils.dateFromTx(rangoFecha.feDesde))],
      txFechaHasta: [devutils.datePickerToDate(devutils.dateFromTx(rangoFecha.feHasta))],
      estado: [null],
      sector : [null],
      ejecucion : [null]
    });
  }

  onSelectionChange(key: string, term: string): void {
    if (!this.query) {
      this.query = new ConsultaQuery();
    } else {
      this.query[key] = term;
    }
    this.query = ConsultaHelper.cleanQueryToken(this.query);
    this.searchTerms.next(this.query);
  }

  public onSubmit(): void {
    const fvalue = this.form.value;
    this.query = new ConsultaQuery();
    this.query.fechaDesde = devutils.datePickerToNum(fvalue.txFechaDesde);
    this.query.fechaHasta = devutils.datePickerToNumPlusOne(fvalue.txFechaHasta);
    this.query.estado = fvalue.estado;
    this.query.sector = fvalue.sector;

    this.query = ConsultaHelper.cleanQueryToken(this.query);
    this.searchTerms.next(this.query);
  }

  public doDownloadResults(): void {
    this.consultaService.export(this.query);
  }
}
