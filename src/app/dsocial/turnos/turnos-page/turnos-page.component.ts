import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { DsocialController } from '../../dsocial.controller';
import { DsocialModel, Ciudadano, SectorAtencion, sectores } from '../../dsocial.model';

import { Person, personModel } from '../../../entities/person/person';
import { Turno, TurnoAction, TurnosModel }  from '../../turnos/turnos.model';

@Component({
  selector: 'turnos-page',
  templateUrl: './turnos-page.component.html',
  styleUrls: ['./turnos-page.component.scss']
})
export class TurnosPageComponent implements OnInit {

  public unBindList = [];

  // template helper
  public title = "Atención DS";
  public subtitle = "Turnos pendientes por sector";

  public tDoc = "DNI";
  public nDoc = "";

  public currentPerson: Person;
  public personFound = false;
  public altaPersona = false;
  private token: string;

  public isAutenticated = false;
  public currentSector = '';
  public showStockTurnos = false;
  public stockTurnos:any = {};
  public showSectorPanel = false;
  private intervalProcess: any;

  public sectoresOptList:SectorAtencion[] = sectores;

  private socket: SocketIOClient.Socket; 

  constructor(
  		private dsCtrl: DsocialController,
    	private router: Router,
    	private route: ActivatedRoute,

  	) { }

  ngOnInit() {
    let first = true;    
    this.token = this.route.snapshot.paramMap.get('id');


    let sscrp2 = this.dsCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;

        this.initSocket();
        this.initPageData();
        this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);

        // let sscrp3 =  this.dsCtrl.turnoEventListener.subscribe(t => {
        //   this.initPageData();
        // })
        // this.addToBindingList(sscrp3);

        //this.intervalProcess = setInterval(this.initPageData, 1000 * 60, this);
      }
    })
    this.addToBindingList(sscrp2);
  }

  ngOnDestroy(){
    this.unBindList.forEach(suscrip =>{
      suscrip.unsubscribe();
    })
    //clearInterval(this.intervalProcess);

  }

  private addToBindingList(sscrp){
    this.unBindList.push(sscrp);   
  }

  private initPageData(){
    this.showSectorPanel = false;
    this.resetCounter();

    this.dsCtrl.turnosPendientes$().subscribe(list => {
      if(list && list.length){
        list.forEach(t => {

          if(!this.stockTurnos[t.sector]){
            this.stockTurnos[t.sector] = this.socorroNoExisteSector(t);
          }

          this.stockTurnos[t.sector].stock += 1;
          this.stockTurnos[t.sector].turnos.push(t)
        })
      }

      this.showSectorPanel = true;
    })
  }

  private socorroNoExisteSector(t: Turno){
      return {
        sector: {
          val: t.sector,
          serial: t.sector,
          label: t.sector,
          style: ''
        },
        stock: 0,
        turnos: []
      }
  }

  private resetCounter(){
    this.sectoresOptList.forEach(t => {
      this.stockTurnos[t.val] = {
        sector: t,
        stock: 0,
        turnos: []
      }
    })    
  }

  /********************
   * Template Events /
   *****************/
  initSocket(){
    let that = this;
    if(!this.socket){
      this.socket = this.dsCtrl.socket;
      this.socket.on('turnos:update', function (msj: any) {
        that.initPageData();
      });
    }

  }


  /********************
   * Template Events /
   *****************/
  showTurnos(turnos: Turno[], sector: SectorAtencion){
    this.showStockTurnos = false;
    this.currentSector = sector.val
    this.stockTurnos[sector.val] = {
      sector: sector,
      stock: turnos.length,
      turnos: TurnosModel.sortProperly(turnos)
    }

    this.showStockTurnos = true;
  }


  actionEvent(taction:TurnoAction){
    if(taction.action === "baja") this.showSectorPanel = false;
    this.processTurnoEvent(taction);
    this.navigateTo(taction)
  }

  private navigateTo(taction: TurnoAction){
    if(taction.action === "atender"){
      let personId = "";
      if(taction.turno.requeridox.id){
        personId = taction.turno.requeridox.id
      }

      this.dsCtrl.fetchPersonById(personId).then(p => {
        this.dsCtrl.updateCurrentPerson(p);
        this.router.navigate(['../', this.dsCtrl.atencionRoute(taction.turno.sector), personId], {relativeTo: this.route});
      })
    }
  }

  private processTurnoEvent(taction: TurnoAction){
    this.dsCtrl.updateTurno(taction).subscribe(t => {
      if(taction.action === "baja") this.deleteFromList(taction.turno);
      this.showSectorPanel = true;
    })
  }

  private deleteFromList(turno: Turno){
    let index = this.stockTurnos[this.currentSector].turnos.indexOf(turno);
    if(index !== -1) {
      this.stockTurnos[this.currentSector].turnos.splice(index, 1)
    }
  }

}

interface StockTurnos {
  sector: SectorAtencion,
  stock: number,
  turnos: Turno[]
}
