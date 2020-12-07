import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CardGraph } from '../../../develar-commons/asset-helper';
import { GenericDialogComponent } from '../../../develar-commons/generic-dialog/generic-dialog.component';
import { DocumentacionCardModalComponent } from '../documentacion-card-modal/documentacion-card-modal.component';
import { DocumentacionService } from '../documentacion.service';

@Component({
  selector: 'documentacion-card',
  templateUrl: './documentacion-card.component.html',
  styleUrls: ['./documentacion-card.component.scss']
})
export class DocumentacionCardComponent implements OnInit {

  @Input() token: CardGraph;
  @Output() onDeleteCard : EventEmitter<CardGraph> = new EventEmitter<CardGraph>();
  url: string;
  constructor(public matDialog: MatDialog,
    private _service: DocumentacionService,
    private dialogService: MatDialog) { }

  ngOnInit(): void {
    if (this.token.mimetype.substring(0, 5) === 'image') {
      this.url = 'download/' + this.token.entityId;
    } else {
      let fondo: string = this._service.loadDefaultImg(this.token.mimetype, this.token);
      this.url = '../../../../assets/img/' + fondo;
    }
  }

  showModal() {
    const dialogRef = this.matDialog.open(DocumentacionCardModalComponent, { data: { asset: this.token, isEdit: false } }).afterClosed().subscribe(result => {

    })
  }

  onEdit() {
    const dialogRef = this.matDialog.open(DocumentacionCardModalComponent, {
      data: {
        asset: this.token, isEdit: true
      }
    }).afterClosed().subscribe(result => {

    })
  }

  onDelete() : void {
    this.openDialog(deleteDocumentacionDialog).subscribe((result) => {
      if (result === 'accept') {
        this.onDeleteCard.emit(this.token);
      }
    })
  }

  private openDialog(config): Observable<any> {
    const dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed();
  }

  

}


const deleteDocumentacionDialog = {
  width: '330px',
  height: '260px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    title: 'Confirme la acción',
    body: '¿Confirma eliminación de la documentación?',
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
