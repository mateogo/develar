import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Person } from './../person';

import { PersonService } from '../person.service';

import { Observable ,  Subject, }        from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter }   from 'rxjs/operators';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GenericDialogComponent } from '../../../develar-commons/generic-dialog/generic-dialog.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

// Observable class extensions


// Observable operators





const newPersonConfirm = {
  width:  '330px',
  height: '300px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    caption:'Alta de nueva persona',
    title: 'Confirme la acción',
    body: 'Se dará de una nueva person con nombre: ',
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

@Component({
  selector: 'person-browse',
  templateUrl: './browseperson.component.html',
  styleUrls: ['./browseperson.component.scss'],
  providers: [PersonService, GenericDialogComponent]
})
export class BrowsepersonComponent implements OnInit {
	@Input() entityId;
  @Input() entityName;
	@Output() updatePerson: EventEmitter<Person> = new EventEmitter<Person>();
  @Output() lookUpModels = new EventEmitter<Person[]>();

  public persons: Observable<Person[]>;
  private searchTerms = new Subject<string>();
  public displayNameFld: string;
  public openEditor = true;

  constructor(
 				private personService: PersonService,
        public dialogService: MatDialog,
        public snackBar: MatSnackBar,
  	) { 
  }

  ngOnInit() {
    this.displayNameFld = this.entityName;

    this.persons = this.searchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(t => t && t.length >2),
        switchMap(term => this.personService.searchPerson(term))
      );

    this.persons.subscribe(tokens => {
      console.log('browse persons')
      if(tokens&& tokens.length){
        this.lookUpModels.next(tokens);
      }
    })


      // .debounceTime(300)
      // .distinctUntilChanged()
      // .switchMap(term => term
      //   ? this.personService.search(term)
      //   : Observable.of<Person[]>([]))
      // .catch(error => {
      //   return Observable.of<Person[]>([]);
      // });

  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  selectEntity(person:Person){
  	//console.log('PersonSelected: [%s] inputFld:[%s]', person._id, this.displayNameFld);
    this.updatePerson.emit(person);
  }

  addEntity(){
    console.log('add Entity: BEGIN [%s]', this.displayNameFld);
    if(this.displayNameFld && this.displayNameFld.length >5){
      let content = this.buildNewPersonAlertMessage(this.displayNameFld);
      this.openDialog(content).subscribe(result => {
        if(result === 'accept'){
          this.personService.insertNewPerson(this.displayNameFld).then(model =>{
            this.updatePerson.emit(model);
            this.openSnackBar('Alta exitosa', 'aceptar');
          })
        }
      });
    }
  }

  buildNewPersonAlertMessage(name){
    newPersonConfirm.data.body = newPersonConfirm.data.body + name;
    return newPersonConfirm;
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


}

//dialogRef.updateSize('430px', '220px');
//ver: md-Option: ngAfterContentInit