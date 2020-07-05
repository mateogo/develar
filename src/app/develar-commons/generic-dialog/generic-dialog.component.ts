import { Component, OnInit, Inject, Input, Output, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

const defaultContent = {
	caption:'Atención',
	title: 'Indique la acción a realizar',
	body: 'Seleccione Aceptar para proceder, Cancelar para rechazar',
	accept:{
		action: 'accept',
		label: 'Aceptar'
	},
	cancel:{
		action: 'cancel',
		label: 'Cancelar'
	}
};


@Component({
  selector: 'dialog-window',
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.scss']
})
export class GenericDialogComponent implements OnInit {
	@Input() content;
	@Input() contentType = 'text';

	hasAccept = false;
	hasCancel = false;

	headerTemplate: TemplateRef<any>;

  constructor(
    public dialogRef: MatDialogRef<GenericDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  	){
	}

  ngOnInit() {
  	if(this.data && this.data.accept) this.hasAccept = true;
  	if(this.data && this.data.cancel) this.hasCancel = true;
  	this.headerTemplate = this.data.itemplate;
  }


}

//*ngFor="let col of TABLE_COLUMNS" [(ngModel)]='col' >{{col}}
