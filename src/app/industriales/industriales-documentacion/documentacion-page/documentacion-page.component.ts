import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documentacion-page',
  templateUrl: './documentacion-page.component.html',
  styleUrls: ['./documentacion-page.component.scss']
})
export class DocumentacionPageComponent implements OnInit {
  
  
  constructor(private _router : Router,
    public _matDialog : MatDialog) { }

  ngOnInit(): void {
  }

  goToDashboard() : void {
    this._router.navigate(['dashboard']);
  }

  cargarDocumento() : void {
  }

}
