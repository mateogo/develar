import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

@Component({
  moduleId: module.id,
  selector: 'page-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.scss']
})
export class PageDialogComponent implements OnInit {
  pageTitle: string = "Dialog";
  dialogRef: MatDialogRef<DialogResultComponent>;
  selectedOption: string;

  constructor( public dialog: MatDialog, private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  openDialog() {
    let dialogRef = this.dialog.open(DialogResultComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
    });
  }

  ngOnInit() {}
}

@Component({
  selector: 'dialog-result',
  templateUrl: 'dialog-result.html',
})
export class DialogResultComponent {
  jazzMessage = 'Jazzy jazz jazz';
  constructor(public dialogRef: MatDialogRef<DialogResultComponent>) {}
}