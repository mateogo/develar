import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { devutils } from '../../../develar-commons/utils';
import { Observable, Subject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { tap } from 'rxjs/operators';

import { CensoIndustrias, CensoIndustriasQuery } from '../censo.model';
import { CensoIndustriasHelper } from '../censo-industrial.helper';
import { CensoIndustrialService } from '../censo-industrial.service';

@Component({
  selector: 'app-censo-industrial-browse',
  templateUrl: './censo-industrial-browse.component.html',
  styleUrls: ['./censo-industrial-browse.component.scss']
})
export class CensoIndustrialBrowseComponent implements OnInit {
  @Output() lookUpModels = new EventEmitter<CensoIndustriasQuery>();

  public form: FormGroup;

  public estadoAvanceList = [];
  public usersOptList = [];


  public censos$: Observable<CensoIndustrias[]>;
  private searchTerms = new Subject<CensoIndustriasQuery>();

  public query = null;

  public isFilterByIndustriaActive = false;

  constructor(
    private fb: FormBuilder,
    private censoService: CensoIndustrialService
  ) {
    const rangoFecha = devutils.getPreviousWeek(new Date());

    this.form = this.fb.group({
      fechaDesde: [devutils.datePickerToDate(devutils.dateFromTx(rangoFecha.feDesde))],
      fechaHasta: [devutils.datePickerToDate(devutils.dateFromTx(rangoFecha.feHasta))],
      avance: [null],
      asignadoId: [null],
    });
  }

  ngOnInit(): void {
    this.estadoAvanceList = CensoIndustriasHelper.getOptionlist('avance');
    this.usersOptList = this.censoService.buildTuteladoresOptList();

    this.searchTerms.pipe(
      tap(term => this.lookUpModels.next(term))
    ).subscribe();
  }

  changeSelectionValue(type,  val){

  }

  public doRefreshResults(): void {
    this.query = this.initQuery(this.form, this.query);
    this.query = CensoIndustriasHelper.cleanQueryToken(this.query);
    this.searchTerms.next(this.query);
  }

  public onSelectionChange(key: string, term: string): void {
    if (!this.query) {
      this.query = new CensoIndustriasQuery();
    }

    if (key === 'fechaDesde' || key === 'fechaHasta') {
      this.query[key] = devutils.dateNumFromTx(term)
    } else {
      this.query[key] = term;
    }

    if (key === 'empresaId') {
      //
    }

    if (key === 'asignadoId') {
      this.isFilterByIndustriaActive = false;
    }

    this.query = this.initQuery(this.form, this.query);
    this.query = CensoIndustriasHelper.cleanQueryToken(this.query);
    this.searchTerms.next(this.query);
  }

  private initQuery(form: FormGroup, query) {
    const fvalue = form.value;

    if (!query) {
      query = new CensoIndustriasQuery();
    }

    query.fechaDesde = devutils.datePickerToNum(fvalue.fechaDesde);
    query.fechaHasta = devutils.datePickerToNumPlusOne(fvalue.fechaHasta);
    query.sede = fvalue.sede;
    query.tipoConsulta = fvalue.tipoConsulta;
    query.estado = fvalue.estado;
    query.avance = fvalue.avance;
    query.asignadoId = fvalue.asignadoId;
    return query;
  }

  public addFilterByIndustria(industria): void {
    this.onSelectionChange('empresaId', industria._id);
  }

  public removeIndustriaFilter(): void {
    // setteo a no_definido; luego el método cleanQueryToken() limpiará este campo
    // atento a dicho valor
    this.onSelectionChange('empresaId', 'no_definido');

    this.isFilterByIndustriaActive = false;
  }

  public doDownloadResults(): void {
    console.log('Descargamos de Excel');

    this.query = this.initQuery(this.form, this.query);
    this.query = CensoIndustriasHelper.cleanQueryToken(this.query);
    this.searchTerms.next(this.query);
    this.censoService.excelExport(this.query);
  }
}
