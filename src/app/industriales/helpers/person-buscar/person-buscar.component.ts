import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap
} from 'rxjs/operators';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { GenericDialogComponent } from '../../../develar-commons/generic-dialog/generic-dialog.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { Person, personModel } from '../../../entities/person/person';

import { DsocialController } from '../../../dsocial/dsocial.controller';

@Component({
  selector: "persona-buscar",
  templateUrl: './person-buscar.component.html',
  styleUrls: ['./person-buscar.component.scss'],
  providers: [GenericDialogComponent],
})
export class PersonBuscarComponent implements OnInit {
  @Input() entityId;
  @Input() entityName;
  @Input() browseTitle = 'buscar persona/organización por nombre ó DNI...';
  @Input() tdoc = 'CUIT';
  @Input() query = {};

  @Output() person$ = new EventEmitter<Person>();
  @Output() searchTerms = new Subject<string>();

  public persons: Observable<Person[]>;
  public currentPerson: Person;
  public displayNameFld: string;
  public openEditor = true;

  //private searchTerms = new Subject<string>();

  constructor(
    private dsCtrl: DsocialController,
    public dialogService: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.displayNameFld = this.entityName;

    this.persons = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((t) => t && t.length > 2 && !/[^a-z0-9,ñ\s]+/gi.test(t)),
      switchMap((term) => this.dsCtrl.searchPerson(this.tdoc, term)),
      // FIXME
      // tap(item => this.person$.emit(new Person('', null, null, this.tdoc, term)))
      tap(item => this.ifNeededEmitEmptyPerson(item))
    );
  }

  private ifNeededEmitEmptyPerson(items, terms?) {
    if (items && items.length === 0) {
      const emptyPerson = new Person('', null, null, this.tdoc);
      this.person$.emit(emptyPerson);
    }
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  selectEntity(person: Person) {
    this.currentPerson = person;
    this.person$.emit(person);
  }

  showEntity() {
    if (!this.currentPerson) return;

    let content = this.buildNewPersonAlertMessage(this.displayNameFld);
    this.openDialog(content).subscribe((result) => {
      if (result === 'accept') {
        // Todo
      }
    });
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

  buildNewPersonAlertMessage(name) {
    let per = this.currentPerson;
    let nombre = this.printName(per);
    let content = `
  			Nombre: ${nombre} <br>
        ${per.tdoc}: ${per.ndoc}
 	  `;

    newPersonConfirm.data.body = content;
    return newPersonConfirm;
  }

  private printName(token: Person) {
    let label = token.displayName;
    if (token.nombre && token.apellido)
      label = token.apellido + ', ' + token.nombre;
    return label;
  }

  openDialog(config) {
    let dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed();
  }

  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {
      duration: 3000,
    });

    snck.onAction().subscribe((e) => {
      //c onsole.log('action???? [%s]', e);
    });
  }
} /// End Person Buscar COmponent

const newPersonConfirm = {
  width: '330px',
  height: '300px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    caption: 'Consulta',
    body: 'La persona seleccionada es: ',
    accept: {
      action: 'accept',
      label: 'Aceptar',
    },
    cancel: {
      action: 'cancel',
      label: 'Cancelar',
    },
  },
};

//dialogRef.updateSize('430px', '220px');
//ver: md-Option: ngAfterContentInit
