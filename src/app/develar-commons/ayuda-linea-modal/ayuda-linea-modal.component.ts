import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RecordCard } from '../../bookshelf/recordcard';

@Component({
  selector: 'ayuda-linea-modal',
  templateUrl: './ayuda-linea-modal.component.html',
  styleUrls: ['./ayuda-linea-modal.component.scss']
})
export class AyudaLineaModalComponent implements OnInit {

  public recordCards : RecordCard[];

  constructor(public dialogRef : MatDialogRef<AyudaLineaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data : DataAyudaLinea) { 
      this.recordCards = this.data.recordCards;
      console.log(this.recordCards)
    }

  ngOnInit(): void {
  }

}

export class DataAyudaLinea {
  recordCards : RecordCard[];
  codigo : string;
}
