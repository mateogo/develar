import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'llamados-auditbyuser-table',
  templateUrl: './llamados-auditbyuser-table.component.html',
  styleUrls: ['./llamados-auditbyuser-table.component.scss']
})
export class LlamadosAuditbyuserTableComponent implements OnInit {
  @Input() records: Array<UserAudit> = []
  public showTable = false;

  constructor() { }

  ngOnInit(): void {
    this.showTable = true;
  }

}


class UserAudit {
  title: string = '';
  username: string = '';
  userId: string = '';
  personname: string = '';
  fealta: string = '';
  personId: string = '';
  tdoc: string = '';
  ndoc: string = '';
  telefono: string = '';
  isAsignado: boolean = false;
  userAsignadoInicial: string;

  index: string;
  hasTelefono: number = 0; // 2= no tiene teléfono 1: tiene telefono

  qty = 0;
  qinves_lograda = 0;
  qinves_sintel = 0;
  qinves_contel = 0;

  qllamados = 0;
  qllamados_nc = 0;

  qsintel = 0;
  qconntel = 0;

  constructor(title: string, username?: string, userId?: string){
    this.title = title;
    this.username = username ? username: '';
    this.userId = userId ? userId: '';
  }
}

