import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

import { Person, personModel } from '../../../entities/person/person';
import { EmpresasController } from '../../../empresas/empresas.controller';

@Component({
  selector: 'app-censo-industrial-persona-buscar',
  templateUrl: './censo-industrial-persona-buscar.component.html',
  styleUrls: ['./censo-industrial-persona-buscar.component.scss'],
})
export class CensoPersonaBuscarComponent implements OnInit {
  @Input() entityId;
  @Input() entityName;
  @Input() browseTitle = 'Buscar industria por nombre ó CUIT';
  @Input() tdoc = 'CUIT';
  @Input() query = {};

  @Output() person$ = new EventEmitter<Person>();
  @Output() searchTerms = new Subject<string>();

  public persons: Observable<Person[]>;
  public currentPerson: Person;
  public displayNameFld: string;
  public tcompPersonaFisica = personModel.tipoDocumPF;

  constructor(
    private dsCtrl: EmpresasController,
  ) {}

  ngOnInit() {
    this.displayNameFld = this.entityName;

    this.persons = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((t) => t && t.length > 2 && !/[^a-z0-9,ñ\s]+/gi.test(t)),
      switchMap((term) => this.dsCtrl.searchPerson(this.tdoc, term))
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  selectEntity(person: Person) {
    this.currentPerson = person;
    this.person$.emit(person);
  }

  showPersonData(p: Person) {
    let dire = '',
      ndoc = '';

    if (p.ndoc) {
      ndoc = ' | ' + p.tdoc + '::' + p.ndoc;
    }

    if (p && p.locaciones && p.locaciones.length) {
      dire = personModel.displayAddress(p.locaciones);
      dire = dire ? ' | ' + dire : '';
    }

    let txt = `
    ${p.displayName} ${ndoc} ${dire}`;
    return txt;
  }

  private printName(token: Person) {
    let label = token.displayName;

    if (token.nombre && token.apellido) {
      label = token.apellido + ', ' + token.nombre;
    }

    return label;
  }

  changeSelectionValue(type, val) {
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);
  }
}
