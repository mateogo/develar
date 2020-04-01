import {Component, Inject, OnInit, TemplateRef} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface DialogActionData{
	action: string;
	label:  string;
	value?: any;
}

export interface DialogData {
	caption:string;
	title: string;
	body: string;
	accept: DialogActionData;
	cancel:DialogActionData;
	input: DialogActionData;
	itemplate?: TemplateRef<any>;
}

@Component({
  selector: 'modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent implements OnInit {
	hasAccept = false;
	hasCancel = false;
	headerTemplate: TemplateRef<any>;


  constructor(
    public dialogRef: MatDialogRef<ModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  	if(this.data && this.data.accept) this.hasAccept = true;
  	if(this.data && this.data.cancel) this.hasCancel = true;
  	this.headerTemplate = this.data.itemplate;
  }

}
