import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { DsocialController } from '../../dsocial.controller';
import { DsocialModel, Ciudadano, SectorAtencion, sectores } from '../../dsocial.model';

import {  Person,
          Address,
          FamilyData,
          personModel,

          UpdatePersonEvent,

          PersonContactData 
        } from '../../../entities/person/person';

import {   Asistencia, 
          Alimento, 
          UpdateAsistenciaListEvent,
          AsistenciaHelper } from '../../asistencia/asistencia.model';

import { RemitoAlmacen } from '../../alimentos/alimentos.model';

import { Turno, TurnoAction, TurnosModel }  from '../../turnos/turnos.model';
import { Audit, ParentEntity } from '../../../develar-commons/observaciones/observaciones.model';

const UPDATE = 'update';
const NAVIGATE = 'navigate';

@Component({
  selector: 'audit-page',
  templateUrl: './audit-page.component.html',
  styleUrls: ['./audit-page.component.scss']
})
export class AuditPageComponent implements OnInit {

  public unBindList = [];

  // template helper
  public title = "RED FAMILIAR y de VECINDAD";
  public subtitle = "Asistencia Social Directa";
  public titleRemitos = "Historial de entregas";
  public titleAuditoria = "Auditoría de entregas";

  public tDoc = "DNI";
  public nDoc = "";

  public currentPerson: Person;
  public contactList:   PersonContactData[];
  public addressList:   Address[];
  public familyList:    FamilyData[];

  
  public asistenciasList: Asistencia[];
  public showHistorial = false;
  public showAuditoria = false;
  public remitosList: RemitoAlmacen[];

  public audit: Audit;
  public parentEntity: ParentEntity;


  //public contactData = new PersonContactData();

  public hasCurrentPerson = false;
  private hasPersonIdOnURL = true;

  public personFound = false;
  public altaPersona = false;
  private personId: string;

  public isAutenticated = false;
  public currentTurno:Turno;

  public auditData: AuditEntregas;
  public entregasList: PersonToken[] = [];
  
  public sectors:SectorAtencion[] = sectores;


  constructor(
  		private dsCtrl: DsocialController,
    	private router: Router,
    	private route: ActivatedRoute,
  	) { }

  ngOnInit() {
    let first = true;    
    this.personId = this.route.snapshot.paramMap.get('id')
    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);

    if(!this.personId){
      this.hasPersonIdOnURL = false;
    }

    let sscrp2 = this.dsCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;

        this.initCurrentPage();

      }
    })
    this.unBindList.push(sscrp2);
  }


  initCurrentPage(){

    if(!this.personId){
      if(this.dsCtrl.activePerson){
        this.personId = this.dsCtrl.activePerson._id;
        this.initCurrentPerson(this.dsCtrl.activePerson);

      } else {
        this.navigateToRecepcion()
      }

    } else {
      if(!this.dsCtrl.activePerson || this.dsCtrl.activePerson._id !== this.personId){
        this.loadPerson(this.personId);

      } else {
        this.initCurrentPerson(this.dsCtrl.activePerson);

      }

    }
  }

  initCurrentPerson(p: Person){
    if(p && this.currentPerson && p._id === this.currentPerson._id){
      return;
    }

    if(p){
      this.currentPerson = p;
      this.contactList = p.contactdata || [];
      this.addressList = p.locaciones || [];
      this.familyList  = p.familiares || [];
      
      this.initAsistenciasList()

      this.loadHistorialRemitos()

      this.audit = this.dsCtrl.getAuditData();

      this.parentEntity = {
        entityType: 'person',
        entityId: this.currentPerson._id,
        entitySlug: this.currentPerson.displayName
      }
      this.auditPerson()
    }

  }

  /**********************/
  /*   Asistencias     */
  /********************/
  initAsistenciasList(){
    this.asistenciasList = [];
    this.dsCtrl.fetchAsistenciaByPerson(this.currentPerson).subscribe(list => {
      this.asistenciasList = list || [];
      this.sortProperly(this.asistenciasList);

      this.hasCurrentPerson = true;
    })
  }

  sortProperly(records){
    records.sort((fel, sel)=> {
      if(fel.fecomp_tsa < sel.fecomp_tsa) return 1;
      else if(fel.fecomp_tsa > sel.fecomp_tsa) return -1;
      else return 0;
    })
  }


  /**********************/
  /*      Events       */
  /********************/
  updateCore(event: UpdatePersonEvent){
    if(event.action === UPDATE){
      this.dsCtrl.updatePerson(event);
    }

  }

	auditPerson(personId?: string){
    this.showAuditoria = false;
    let id = personId ? personId : this.currentPerson._id;
		this.dsCtrl.auditEntregasByPerson(id).subscribe(audit => {
			if(audit){
				this.processAuditData(audit);
			}


		})

	}

	processAuditData(audit){

		this.auditData = audit as AuditEntregas;
		this.entregasList = [];
		this.prepareDataForDisplay(this.auditData);
		this.showAuditoria = true;
	}

	private prepareDataForDisplay(audit: AuditEntregas){
		let entregas = audit.entregas;
		let master = audit.masterPerson;

		if(entregas && entregas.length){
			for(let pid in master){

				let person = master[pid];
				let tokens = entregas.filter(t => t.remitoPersonId === person.personId)
				person['entregas'] = tokens || [];
				this.entregasList.push(person);

			}
		}
	}


  updateAsistenciaList(event: UpdateAsistenciaListEvent){

    if(event.action === UPDATE){
      this.initAsistenciasList();
    }

    if(event.action === NAVIGATE){
      if(this.hasPersonIdOnURL){
        this.router.navigate(['../../', this.dsCtrl.atencionRoute('seguimiento'), 
           this.personId], {relativeTo: this.route});

      }else{
        this.router.navigate(['../', this.dsCtrl.atencionRoute('seguimiento'), 
           this.personId], {relativeTo: this.route});
      }
     }

  }




  /**********************/
  /*      Person        */
  /**********************/
  loadPerson(id){
    this.dsCtrl.setCurrentPersonFromId(id).then(p => {
      if(p){
        this.initCurrentPerson(p);

      }
    });
  }

  /*****************************/
  /*     Historial Remitos    */
  /***************************/
  private loadHistorialRemitos(){
    this.dsCtrl.fetchRemitoAlmacenByPerson(this.currentPerson).subscribe(list =>{
      this.remitosList = list || []
      this.sortRemitosProperly(this.remitosList);
      if(list && list.length){
        this.showHistorial = true;
      }else{
        this.showHistorial = false;

      }


    })
  }

  private sortRemitosProperly(records){
    records.sort((fel, sel)=> {
      if(!fel.ts_alta) fel.ts_alta = "zzzzzzz";
      if(!sel.ts_alta) sel.ts_alta = "zzzzzzz";

      if(fel.ts_alta<sel.ts_alta) return 1;
      else if(fel.ts_alta>sel.ts_alta) return -1;
      else return 0;
    })
  }




  /**********************/
  /*      Turnos        */
  /**********************/
  navigateToRecepcion(){
    if(this.hasPersonIdOnURL){
      this.router.navigate(['../../', this.dsCtrl.atencionRoute('recepcion')], {relativeTo: this.route});

    } else {
      this.router.navigate(['../', this.dsCtrl.atencionRoute('recepcion')], {relativeTo: this.route});
    }

  }


  nuevoTurno(sector: SectorAtencion){
  }

  actionEvent(taction:TurnoAction){
    this.processTurnoEvent(taction);
  }

  processTurnoEvent(taction: TurnoAction){
    this.dsCtrl.updateTurno(taction).subscribe(t => {
    })

  }


}

interface PersonToken {
    personId: string; 
    personDisplayAs: string; 
    personRole: string; 
    personTDOC: string; 
    personNDOC: string; 
    locaciones: Address[]; 
    vinculos: FamilyData[];
    entregas?: Entregas[];

}

interface MasterPerson {
	[key: string]: PersonToken;

}

interface Entregas {
	remitoId: string;
	remitoPersonId: string;
	remitoFecha: string;
	remitoTS: number;
	remitoNro: string;
	remitoAction: string;
	remitoItems: number;

}

interface AuditEntregas {
	initTs: number;
	initTe: number;
	masterPerson: MasterPerson;
	entregas: Entregas[];
	
}



/***

**/