import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'llamados-asis-table',
  templateUrl: './llamados-asis-table.component.html',
  styleUrls: ['./llamados-asis-table.component.scss']
})
export class LlamadosAsisTableComponent implements OnInit {
  @Input() records: Array<UserAudit> = []
  public showTable = false;

  constructor() { }

  ngOnInit(): void {
    this.showTable = true;
  }

}



class UserAudit {
  title: string = '';
  username: string = 'Sin dato';
  userId: string = '';
  personname: string = '';
  personId: string = '';
  fealta: string = ''
  tdoc: string = '';
  ndoc: string = '';
  telefono: string = '';
  userAsignadoInicial: string;

  isAsignado: boolean = false;
  asignadoId: string;
  asignadoSlug: string;

  index: string;
  hasTelefono: number = 0; // 2= no tiene teléfono 1: tiene telefono

  hasInvestigacion: number = 0;
  qty = 0;
  qinves_lograda = 0;
  qinves_sintel = 0;
  qinves_contel = 0;

  qllamados = 0;
  qllamados_nc = 0;

  qsintel = 0;
  qconntel = 0;

  constructor(title: string, userId?: string, username?: string){
    this.title = title;
    this.userId = userId ? userId : '';
    this.username = username ? username : 'Sin dato';
  }
}


