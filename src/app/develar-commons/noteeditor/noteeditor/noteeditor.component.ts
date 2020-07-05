import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { NotePiece, noteModel } from '../note-model';

import { GenericDialogComponent } from '../../../develar-commons/generic-dialog/generic-dialog.component';

const removeRelation = {
  width:  '330px',
  height: '300px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    caption:'Párrafo de nota eliminada',
    title: 'Confirme la acción',
    body: 'Se dará de baja el parágrafo seleccionado',
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
  selector: 'noteeditor',
  templateUrl: './noteeditor.component.html',
  styleUrls: ['./noteeditor.component.scss']
})
export class NoteeditorComponent implements OnInit {
  @Input() addNoteToList: Subject<NotePiece>;
  @Input()
    get noteList():Array<NotePiece>{
      return this.entities;
    }
    set noteList(tokens: NotePiece[]){
      this.entities = tokens;
    }
  @Input() canAddTokens: boolean = true;

  public entities: NotePiece[] = [];
  private acceptNewToken = true;

  constructor(
      public dialogService: MatDialog,
    ) { }

  ngOnInit() {
    if(this.addNoteToList){
      this.addNoteToList.subscribe({
        next: (card) => {
          this.entities.unshift(card);
        }
      })
    }

    //ToDO: chequear que entityTye no sea nula
  }

  addToken(){
    let token = noteModel.newNotePiece({});
    this.entities.unshift(token);
  }

  deleteToken(token: NotePiece){
    let index = this.entities.findIndex(x => x === token);
    if(index !== -1){
      this.openDialog(removeRelation).subscribe(result => {
        if(result==='accept') this.entities.splice(index, 1);
      })
    }
  }

  openDialog(config) {
    let dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed()
  }

}
