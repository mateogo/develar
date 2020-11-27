import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'dashboard-documentacion',
  templateUrl: './dashboard-documentacion.component.html',
  styleUrls: ['./dashboard-documentacion.component.scss']
})
export class DashboardDocumentacionComponent implements OnInit {

  public documentacionDashboardTitle : string = 'Documentación';
  public documentacionDashboardSubtitle : string = 'Mis documentaciones'
  constructor(private _router : Router,  private _route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  gotoDocumentacionPage() : void{
    this._router.navigate(['dashboard','documentacion']);
  }

}
