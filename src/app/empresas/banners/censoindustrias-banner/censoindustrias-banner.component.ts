import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { EmpresasController } from '../../empresas.controller';

import { Person, UpdatePersonEvent, personModel } from '../../../entities/person/person';
import { User } from '../../../entities/user/user';

import { RecordCard, SubCard  } from '../../../site-minimal/recordcard.model';

const CANCEL = "cancel";
const NEXT = "next";
const BACK = "back";
const NUEVO = "nuevo";
const REGISTRAR = "nuevo:cuit"
const UPDATE = "update";

const TARGET_COMERCIO = "comercio";
const TARGET_SEGURIDAD = "personalseguridad";
const TARGET_INDUSTRIA = "industria";
const TARGET_CENSO = "censo:industria";

const HOME = 'home';
const APP = 'app';

const dataLabel = {
  comercio: {

  },
  personalseguridad: {

  }
}


@Component({
  selector: 'censoindustrias-banner',
  templateUrl: './censoindustrias-banner.component.html',
  styleUrls: ['./censoindustrias-banner.component.scss'],
  animations: [
    trigger('heroState', [
      state('inactive', style({
        backgroundColor: '#eee',
        transform: 'scale(1)'
      })),
      state('active',   style({
        backgroundColor: '#cfd8dc',
        transform: 'scale(1.1)'
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ]),
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate(500)
      ]),
      transition('* => void', [
        animate(500, style({transform: 'translateX(100%)'}))
      ])
    ]),
    trigger('blockIn', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate(500)
      ])
    ])
   ]
})
export class CensoindustriasBannerComponent implements OnInit {
	@Input() record: RecordCard;
  @Input() target: string = "comercio" ;// [comercio | personalseguridad]

	public mainimage: string = "";
	public title: string = "";
	public description: string = "";
	public nodes: Array<Servicios> = [];
  public showDetail = false;

  public trState = {state: 'inactive'};
  public flyState = {state: 'void'};
  public blockState = {state: 'void'};

  public firstStep = true;
  public showLogin = false;
  public showBanner = false;

  public secondStep = false;
  public showRegistration = false;
  public showPassword = false;

  public isUpdate = NUEVO;

  public person: Person;
  public isComercio = false;
  public isIndustria = false;

  private unBindList = [];


  public detailImage: RelatedImage;


  constructor(
        private empCtrl: EmpresasController,
        private router: Router,
    ) { }


  ngOnInit(){

  		let query = {
  			publish: true,
  			"publish.topics": 'empresas',
  			"publish.publishOrder": 'banner:censo:industrias',
  		}

      let sscrp1 = this.empCtrl.fetchRecordsByQuery(query).subscribe(records => {
        this.renderHomePage(records);
      });

      this.unBindList.push(sscrp1);

  }

  renderHomePage(records: RecordCard[]) {
  	if(records && records.length){
  		this.record = records[0];
  	}else {
  		this.record = new RecordCard("censo banner no encontrado");
  	}

  	this.isComercio = false;
  	this.isIndustria = false;

  	this.title = this.record.slug;
  	this.description = this.record.description;
  	this.mainimage = this.record.mainimage;

    if(this.target === TARGET_COMERCIO) this.isComercio = true;
    else if(this.target === TARGET_INDUSTRIA) this.isIndustria = true;
    else this.isIndustria = true; // default


  	this.record.relatedcards.forEach(s => {
      let link:string , navigate:string , noLink = true;
      
      let flipImage: RelatedImage = this.flipImage(s);

      if(s.linkTo){
        noLink = false;

        if(s.linkTo.indexOf('http') === -1){
          navigate = s.linkTo;
        }else{
          link = s.linkTo;
        }
      }

  		this.nodes.push({
        title: s.slug,
  			imageUrl: s.mainimage,
        flipImage: flipImage,
  			description: s.description,
        linkTo: link,
        navigateTo: navigate,
        noLink: noLink,
        state: 'inactive'
  		} as Servicios)
  	})

    this.showBanner = true;

    //Development-ONLY
    // this.firstStep = false;
    // this.showLogin = false;
  
    // this.secondStep = true;
    // this.showPassword = false;
    // this.showRegistration = true;

  }

  gotoCensoPage(e, i, node){
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(["/mab/empresas/gestion/censo2020"]);

  }

  private flipImage(s: SubCard): RelatedImage{
    let fimage = s.viewimages.find(t => t.predicate === 'images');
    if(fimage){
      let flipimage = {
        predicate: fimage.predicate,
        entityId: fimage.entityId,
        url: '/download/' + fimage.entityId,
        slug: fimage.slug
      } as RelatedImage;

      return flipimage;

    }else{
      return null;
    }

  }


  // serviceDetail(e, token: Servicios){
  //   e.stopPropagation();
  //   e.preventDefault();
  //   this.trState.state = 'active';
  //   this.flyState.state = 'in';

  //   if(token.flipImage){
  //     token.state = "active";
  //     this.detailImage = token.flipImage;
  //     setTimeout(()=>{
  //       this.showDetail = true;
  //       token.state = "inactive";
  //     },400);
  //   }

  // }

 
  // servicePlain(e){
  //   e.stopPropagation();
  //   e.preventDefault();
  //   this.trState.state = 'inactive';
  //   this.flyState.state = 'void';
  //   this.blockState.state = "in";
  //   setTimeout(()=>{
  //     this.showDetail = false;
  //   },400);


  // }


}


interface RelatedImage {
  predicate: string;
  entityId: string;
  url: string;
  slug: string;
}

interface Servicios {
	imageUrl: string;
  flipImage: RelatedImage;
	description: string;
  title: string;
  linkTo: string;
  navigateTo: string;
  noLink: boolean;
  state: string;
}
