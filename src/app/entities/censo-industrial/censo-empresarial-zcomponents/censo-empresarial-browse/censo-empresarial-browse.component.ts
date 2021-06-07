import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { devutils } from '../../../../develar-commons/utils';
import { AyudaEnLineaService } from '../../../../develar-commons/ayuda-en-linea.service';

//import {  } from '../../censo.model';
import { CensoFeatureQuery, Condiciones, CondicionBusqueda, buscarEnOptList,tipoBusquedaOptList, CensoEmpresarialHelper} from '../../censo-empresarial-helper';
import { CensoIndustrialService } from '../../censo-industrial.service';

@Component({
  selector: 'censo-empresarial-browse',
  templateUrl: './censo-empresarial-browse.component.html',
  styleUrls: ['./censo-empresarial-browse.component.scss']
})
export class CensoEmpresarialBrowseComponent implements OnInit {
  @Input() query: CensoFeatureQuery;
  @Output() excelExportEvent = new EventEmitter<boolean>();
  @Output() browseEvent = new EventEmitter<CensoFeatureQuery>();

  public buscarEnOptList: CondicionBusqueda[] = CensoEmpresarialHelper.getConditionlist('buscarEn');
  public tipoBusquedaOptList: CondicionBusqueda[] = CensoEmpresarialHelper.getConditionlist('tipoBusqueda');
  public estadoOptList: CondicionBusqueda[] = CensoEmpresarialHelper.getConditionlist('estados');

  public isFilterByIndustriaActive = false;
  public usersOptList = [];

  public form: FormGroup;

  private codigo = {
    censohelp: "censoempresarial:browse:01",
  }

  constructor(
    private fb: FormBuilder,
    private censoService: CensoIndustrialService,
    private helpService: AyudaEnLineaService
  ) { }

  ngOnInit(){
    this.initFormGroup();
    this.usersOptList = this.censoService.buildTuteladoresOptList();
  }

  get condicionesGet(): FormArray {
    return this.form.get('condiciones') as FormArray;
  }

  onSubmit(): void {
    this.emitBrowseEvent();
  }


  addControls(isQuery : boolean, condicion? : Condiciones): void {
    let length = this.condicionesGet.length;
    if (length < 10) {
      const group = this.fb.group({
        termino: [ isQuery ? condicion.termino :  null],
        buscarEn: [isQuery ? condicion.buscarEn : 'all'],
        tipoBusqueda: [isQuery ? condicion.tipoBusqueda : 'aprox']
      })

      this.condicionesGet.push(group);
    }
  }

  removeControl() {
    let index = this.condicionesGet.length - 1;
    this.condicionesGet.removeAt(index);
  }

  onExportExcel() : void {
    this.excelExportEvent.emit(true);
  }

  showHelp(key : string){
    this.helpService.showOnlineHelp(this.codigo[key]);
  }

  public addFilterByIndustria(industria): void {
    this.onSelectionChange('empresaId', industria._id);
    this.isFilterByIndustriaActive = true;

  }

  public removeIndustriaFilter(): void {
    this.onSelectionChange('empresaId', 'no_definido');
    this.isFilterByIndustriaActive = false;
  }

  public onSelectionChange(key: string, term: string): void {

    if (key === 'fechaDesde' || key === 'fechaHasta') {
      this.query[key] = devutils.dateNumFromTx(term)

    } else if (key === 'empresaId') {
      this.query[key] = term;

    } else if (key === 'asignadoId') {
      this.isFilterByIndustriaActive = false;

    }else {
      this.query[key] = term;
    }

    this.emitBrowseEvent();
  }


  private emitBrowseEvent(){
    this.query = this.getReadyToEmitEvent(this.form, this.query);
    this.query = CensoEmpresarialHelper.cleanQueryToken(this.query);
    this.browseEvent.next(this.query);
  }

  private getReadyToEmitEvent(form: FormGroup, query:CensoFeatureQuery): CensoFeatureQuery {
    const fvalue = form.value;
    query.condiciones = this.condicionesGet.getRawValue();

    if(fvalue.fechaDesde) query.fechaDesde = devutils.datePickerToNum(fvalue.fechaDesde); else query.fechaDesde = null;
    if(fvalue.fechaHasta) query.fechaHasta = devutils.datePickerToNum(fvalue.fechaHasta); else query.fechaHasta = null;

    query.avance = fvalue.avance !== "todos" ? fvalue.avance : '';
    query.asignadoId = fvalue.asignadoId;
    return query;
  }

  private initFormGroup(): void {
    if(!this.query) this.query = new CensoFeatureQuery();
    this.form = this.fb.group({
      fechaDesde:   [ this.query.fechaDesde ],
      fechaHasta:   [ this.query.fechaHasta ],
      asignadoId:   [ this.query.asignadoId ],
      avance:       [ this.query.avance     ],
      condiciones: this.fb.array([])
    });

    if(this.query.condiciones && this.query.condiciones.length){
      this.loadControlsFromQuery();
    }else{
      this.addControls(false);
    }
  }

  private loadControlsFromQuery(){
    this.query.condiciones.forEach(condicion => {
      this.addControls(true, condicion);
    })
  }


}
