import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { DsocialController } from '../dsocial.controller';
import { DsocialModel, Ciudadano, SectorAtencion } from '../dsocial.model';

import { Person, personModel } from '../../entities/person/person';

@Component({
  selector: 'recepcion-page',
  templateUrl: './recepcion-page.component.html',
  styleUrls: ['./recepcion-page.component.scss']
})
export class RecepcionPageComponent implements OnInit {
  public unBindList = [];

  // template helper
  public title = "Secretaría de Desarrollo Social";
  public subtitle = "Recepción del Vecino";

  public tDoc = "DNI";
  public nDoc = "";

  public currentPerson: Person;
  public personFound = false;
  public altaPersona = false;
  private token: string;

  public isAutenticated = false;



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


  initCurrentPage(){
    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);
  }

  personFetched(persons: Person[]){
    console.log('Bubbled')
    if(persons.length){
      this.personFound = true;
      this.altaPersona = false;
      this.currentPerson = persons[0];

    }else{
      this.altaPersona = true;
      this.personFound = false;
    }
  }

  cancelNewPerson(){
      this.altaPersona = false;
      this.personFound = false;
  }

  nuevoTurno(sector: SectorAtencion){
    console.log('Nuevo Turno Requerido: [%s]',sector.label);
    this.personFound = false;
    this.altaPersona = false;
    this.dsCtrl.turnoCreate('turnos', 'ayudadirecta', sector.serial, this.currentPerson).subscribe(turno =>{
      console.log('turno: [%s]', turno.compNum);
    })

  }



}
