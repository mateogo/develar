import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { DsocialController } from '../../../dsocial/dsocial.controller';
import { SaludController } from '../../../salud/salud.controller';
import { CardGraph, predicateType, graphUtilities, predicateLabels } from '../../../develar-commons/asset-helper';
import { Person } from '../../../entities/person/person';
import { Asistencia } from '../../../dsocial/asistencia/asistencia.model';
import { Audit, ParentEntity } from '../../../develar-commons/observaciones/observaciones.model';
import { Observable } from 'rxjs';
import { DaoService } from '../../dao.service';

@Component({
  selector: 'app-carga-excel-page',
  templateUrl: './carga-excel-page.component.html',
  styleUrls: ['./carga-excel-page.component.scss']
})
export class CargaExcelPageComponent implements OnInit {
  public unBindList = [];
  public currentPerson: Person;
  public assetList: CardGraph[] = []
  public hasCurrentPerson = false;
  private hasPersonIdOnURL = true;
  public personFound = false;
  public altaPersona = false;
  private personId: string;
  public isAutenticated = false;  
  public showCoreData = true;
  public asistenciasList: Asistencia[];
  public audit: Audit;
  public parentEntity: ParentEntity;

  constructor(
    private dsCtrl: DsocialController,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,

    private daoService: DaoService,
  	) { }

  ngOnInit() {
    this.cargarExcel().then(
      function(value){
        console.log(value)
      }
    );


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
        console.log("manda a recepcion")
        //this.navigateToRecepcion()
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
      this.assetList = p.assets || [];
      
      this.initAsistenciasList()

      this.audit = this.dsCtrl.getAuditData();
      this.parentEntity = {
        entityType: 'person',
        entityId: this.currentPerson._id,
        entitySlug: this.currentPerson.displayName
      }
    }
  }

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
  /*      Person        */
  /**********************/
  loadPerson(id){
    this.dsCtrl.setCurrentPersonFromId(id).then(p => {
      if(p){
        this.initCurrentPerson(p);

      }
    });
  }

  /////////////////////////////////

  cargarExcel(): Promise<any>{
    return this.daoService.cargarExcel();
  }
}
