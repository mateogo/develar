import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { DsocialController } from '../../dsocial.controller';
import { DsocialModel, Ciudadano, SectorAtencion, sectores } from '../../dsocial.model';

import { Person, personModel } from '../../../entities/person/person';
import { Turno, TurnoAction, TurnoslModel }  from '../../turnos/turnos.model';

@Component({
  selector: 'turnos-page',
  templateUrl: './turnos-page.component.html',
  styleUrls: ['./turnos-page.component.scss']
})
export class TurnosPageComponent implements OnInit {

  public unBindList = [];

  // template helper
  public title = "Ayuda Social Directa";
  public subtitle = "Atención personalizada";

  public tDoc = "DNI";
  public nDoc = "";

  public currentPerson: Person;
  public personFound = false;
  public altaPersona = false;
  private token: string;

  public isAutenticated = false;
  public turnos:Turno[] = [];
  public showStockTurnos = false;

  public tokens:SectorAtencion[] = sectores;



  constructor(
  		private dsCtrl: DsocialController,
    	private router: Router,
    	private route: ActivatedRoute,

  	) { }

  ngOnInit() {
    let first = true;    
    this.token = this.route.snapshot.paramMap.get('id')

    let sscrp2 = this.dsCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;
        console.log('readyToGo');

        this.initCurrentPage();

      }
    })
    this.unBindList.push(sscrp2);
  }

  showTurnos(turnos: Turno[]){
    console.log('Turnos [%s]', turnos.length);
    this.turnos = turnos;
    this.showStockTurnos = true;
  }

  initCurrentPage(){
    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);
  }

  nuevoTurno(sector: SectorAtencion){

  }

  actionEvent(taction:TurnoAction){
    console.log('actionEvent BUBLED: [%s]', taction.action);
    this.processTurnoEvent(taction);
    this.navigateTo(taction)
  }

  navigateTo(taction: TurnoAction){
    if(taction.action === "atender"){
      let personId = "";
      if(taction.turno.requeridox.id){
        personId = taction.turno.requeridox.id
      }

      this.dsCtrl.fetchPersonById(personId).then(p => {
        this.dsCtrl.updateCurrentPerson(p);
        this.router.navigate(['../', this.dsCtrl.atencionRoute(), personId], {relativeTo: this.route});
      })
    }
  }

  processTurnoEvent(taction: TurnoAction){
    this.dsCtrl.updateTurno(taction).subscribe(t => {
      console.log('Turno UPDATE cb');
    })
  }


}