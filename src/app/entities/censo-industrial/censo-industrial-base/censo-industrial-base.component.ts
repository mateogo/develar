import { Component, OnInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ArrayDataSource } from '@angular/cdk/collections';

import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FollowUpEsquemaModalService }    from '../zmanagers/censo-followup.service';

import { CensoIndustrias, UpdateCensoEvent } from '../../../empresas/censo.model';
import { CensoIndustrialService } from '../censo-industrial.service';

const UPDATE =   'update';

@Component({
  selector: 'censo-industrial-base',
  templateUrl: './censo-industrial-base.component.html',
  styleUrls: ['./censo-industrial-base.component.scss'],
  providers: [ FollowUpEsquemaModalService ]
})
export class CensoIndustrialBaseComponent implements OnInit {
  @Input() censo: CensoIndustrias;
  public showCesnoManage = true;

  constructor(
    private fupService: FollowUpEsquemaModalService,

  ) { }

  ngOnInit(): void {
  }

  actionTriggered(e){
    e.source._checked = false;
    this.manageModalEditors(e.value);
  }

  private manageModalEditors(token: string){
    if(token === 'seguimiento')        this.openSeguimientoModal(token);
    if(token === 'followupdate')       this.openSeguimientoModal(token);
    if(token === 'followhistory')      this.openSeguimientoModal(token);
    if(token === 'vista')              this.openVistaModal(token);
  }

  private openSeguimientoModal(target: string){

		this.fupService.openDialog(this.censo, target).subscribe(editEvent =>{
			if(editEvent.action === UPDATE){
        this.censo = editEvent.token;
        this._manageAsistenciaView();				
			}
		})
  }

  private _manageAsistenciaView(){
    this.showCesnoManage = false;
    setTimeout(() => {
      this.showCesnoManage = true;
    },70)
  }

  private openVistaModal(target: string){
		this.fupService.openDialog(this.censo, target).subscribe(editEvent =>{
      //

		})
  }



}
