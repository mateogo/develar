import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable ,  Subject, }        from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap }   from 'rxjs/operators';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GenericDialogComponent } from '../../../develar-commons/generic-dialog/generic-dialog.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { Person, personModel } from '../../../entities/person/person';

import { DsocialController } from '../../dsocial.controller';


@Component({
  selector: 'persona-buscar',
  templateUrl: './person-buscar.component.html',
  styleUrls: ['./person-buscar.component.scss'],
  providers: [GenericDialogComponent]
})
export class PersonBuscarComponent implements OnInit {
	@Input() entityId;
  @Input() entityName;

	@Output() person$ = new EventEmitter<Person>();
  @Output() searchTerms = new Subject<string>();
  @Output() lookUpModels = new EventEmitter<Observable<Person[]>>()

  public persons: Observable<Person[]>;
  public currentPerson: Person;
  public displayNameFld: string;
  public openEditor = true;

  //private searchTerms = new Subject<string>();

  constructor(
       	private dsCtrl: DsocialController,
        public dialogService: MatDialog,
        public snackBar: MatSnackBar,
  	) { 
  }

  ngOnInit() {
    this.displayNameFld = this.entityName;

    this.persons = this.searchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => this.dsCtrl.searchPerson(term))
      );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  selectEntity(person:Person){
  	console.log('PersonSelected: [%s] inputFld:[%s]', person._id, this.displayNameFld);
  	this.currentPerson = person;
    this.person$.emit(person);
  }

  showEntity(){
    console.log('add Entity: BEGIN [%s]', this.displayNameFld);
    if(!this.currentPerson) return;

    let content = this.buildNewPersonAlertMessage(this.displayNameFld);
    this.openDialog(content).subscribe(result => {
      if(result === 'accept'){
      	// Todo
      }
    });
  }

  buildNewPersonAlertMessage(name){
  	let per = this.currentPerson;
    let nombre = this.printName(per);
  	let content = `
  			Nombre: ${nombre} <br>
        ${per.tdoc}: ${per.ndoc}
 	  `;
    
    newPersonConfirm.data.body = content;
    return newPersonConfirm;
  }

  private printName(token: Person){
    let label = token.displayName;
    if(token.nombre && token.apellido) label = token.apellido + ", " + token.nombre;
    return label;
  }

  openDialog(config) {
    let dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed()
  }

  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {
      duration: 3000,
    });

    snck.onAction().subscribe((e)=> {
      //console.log('action???? [%s]', e);
    })
  }



}/// End Person Buscar COmponent



const newPersonConfirm = {
  width:  '330px',
  height: '300px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    caption:'Consulta',
    body: 'La persona seleccionada es: ',
    accept:{
      action: 'accept',
      label: 'Aceptar'
    },
    cancel:{
      action: 'cancel',
      label: 'Cancelar'
    }
  }
};

//dialogRef.updateSize('430px', '220px');
//ver: md-Option: ngAfterContentInit