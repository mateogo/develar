import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'dashboard-documentacion',
  templateUrl: './dashboard-documentacion.component.html',
  styleUrls: ['./dashboard-documentacion.component.scss']
})
export class DashboardDocumentacionComponent implements OnInit {

  public documentacionDashboardTitle : string = 'Documentación adjunta';
  public documentacionDashboardSubtitle : string = 'Gestión de documentos y archivos digitales integrados a la plataforma'
  constructor(private _router : Router,  private _route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  gotoDocumentacionPage() : void{
    this._router.navigate(['dashboard','documentacion']);
  }

}
