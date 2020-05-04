import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-transito-modal',
  templateUrl: './transito-modal.component.html',
  styleUrls: ['./transito-modal.component.scss']
})
export class TransitoModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  onClickDerivar(){
    //TODO: derivar pacientes
  }

}
