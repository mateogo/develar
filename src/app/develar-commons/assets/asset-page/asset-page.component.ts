import { Component, OnInit, Input } from '@angular/core';
import { CardGraph, predicateType, graphUtilities, predicateLabels } from '../../asset-helper';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GenericDialogComponent } from '../../generic-dialog/generic-dialog.component';
import { Subject } from 'rxjs';

const removeRelation = {
  width:  '330px',
  height: '300px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    caption:'Baja de relación',
    title: 'Confirme la acción',
    body: 'Se dará de baja la relación seleccionada en esta ficha',
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
  selector: 'asset-page',
  templateUrl: './asset-page.component.html',
  styleUrls: ['./asset-page.component.scss'],
  providers: [GenericDialogComponent]
})
export class AssetPageComponent implements OnInit {
  @Input() addCardToList: Subject<CardGraph>;
  @Input()
    get relatedList():Array<CardGraph>{
      return this.entities;
    }
    set relatedList(tokens: CardGraph[]){
      this.entities = tokens;
    }
  @Input() entityType: string = 'resource'
  @Input() canAddTokens: boolean = true;

  public entities: CardGraph[] = [];
  private acceptNewToken = true;
  public formLabels:object;

  constructor(
      public dialogService: MatDialog,
    ) { }

  ngOnInit() {
    this.formLabels = predicateLabels[this.entityType] || predicateLabels['default'];

    if(this.addCardToList){
      this.addCardToList.subscribe({
        next: (card) => {
          this.entities.unshift(card);
        }
      })
    }

    //ToDO: chequear que entityTye no sea nula
  }

  addToken(){
    let token = graphUtilities.initNewCardGraph(this.entityType, this.entities);

    this.entities.unshift(token);
  }

  deleteToken(token: CardGraph){
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
