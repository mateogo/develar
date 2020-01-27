import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { SisplanController } from '../../sisplan.controller';

import { Pcultural, PculturalHelper } from '../pcultural.model';

import { UpdateEvent } from '../../sisplan.service';

import { devutils }from '../../../develar-commons/utils'

import { Audit, ParentEntity } from '../../../develar-commons/observaciones/observaciones.model';


const TOKEN_TYPE = 'pcultural';
const CANCEL = 'cancel';
const UPDATE = 'update';
const DELETE = 'delete';

@Component({
  selector: 'pcultural-page',
  templateUrl: './pcultural-page.component.html',
  styleUrls: ['./pcultural-page.component.scss']
})
export class PculturalPageComponent implements OnInit {

  public sectorOptList =    PculturalHelper.getOptionlist('sector');
  public formatoOptList =   PculturalHelper.getOptionlist('formato');
  public programaOptList =  PculturalHelper.getOptionlist('programa');
  public publicoOptList =   PculturalHelper.getOptionlist('publico');

  public typeOptList =      PculturalHelper.getOptionlist('type');
  public stypeOptList =     [];
  public stypeOptMap =      PculturalHelper.getSubTypeMap();

  public sedeOptList =      PculturalHelper.getOptionlist('sede');
  public locacionOptList =  [];
  public locacionOptMap =   PculturalHelper.getLocacionMap();

  public title;

  private unBindList = [];

  //Observaciones
  public audit: Audit;
  public parentEntity: ParentEntity;

  public hasCurrentPcultural: boolean = false;
  private hasPculturalIdOnURL: boolean = false;
  private currentPcultural: Pcultural;
  private pculturalId: string;


  constructor(
    private dsCtrl: SisplanController,
    private route:  ActivatedRoute,
 		private router: Router,
  	) { 
  	console.log('0000000')

	}



  ngOnInit() {
  	this.title = 'Proyectos Culturales'

    let first = true;    
    this.pculturalId = this.route.snapshot.paramMap.get('id')
    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);

    if(!this.pculturalId){
      this.hasPculturalIdOnURL = false;
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

    if(!this.pculturalId){
      if(this.dsCtrl.activePcultural){
        this.pculturalId = this.dsCtrl.activePcultural._id;
        this.initCurrentPcultural(this.dsCtrl.activePcultural);

      } else {
        this.navigateToAltaPcultural()
      }

    } else {
      if(!this.dsCtrl.activePcultural || this.dsCtrl.activePcultural._id !== this.pculturalId){
        this.loadPcultural(this.pculturalId);

      } else {
        this.initCurrentPcultural(this.dsCtrl.activePcultural);

      }

    }
  }

  initCurrentPcultural(pcultural: Pcultural){

    if(pcultural && this.currentPcultural && pcultural._id === this.currentPcultural._id){
      return;
    }

    if(pcultural){

      this.currentPcultural = pcultural;

      this.audit = this.dsCtrl.getAuditData();
      this.parentEntity = {
        entityType: 'pcultural',
        entityId:   this.currentPcultural._id,
        entitySlug: this.currentPcultural.slug
      }

			this.hasCurrentPcultural = true;
    }
 
  }

  /**********************/
  /*      Pcultural        */
  /**********************/
  loadPcultural(id){
    this.dsCtrl.setCurrentPculturalFromId(id).then(pcul => {
      if(pcul){
        this.initCurrentPcultural(pcul);

      }
    });
  }


  /**********************/
  /*      Events        */
  /**********************/
  updateCore(event: UpdateEvent){
    if(event.action === UPDATE){
      this.dsCtrl.updatePartialPcultural(event);
    }

  }

  /**********************/
  /*      Helpers        */
  /**********************/
  private navigateToAltaPcultural(){
    if(this.hasPculturalIdOnURL){
      this.router.navigate(['../../', this.dsCtrl.navigationRoute('recepcion')], {relativeTo: this.route});

    } else {
      this.router.navigate(['../', this.dsCtrl.navigationRoute('recepcion')], {relativeTo: this.route});
    }

  }



}
