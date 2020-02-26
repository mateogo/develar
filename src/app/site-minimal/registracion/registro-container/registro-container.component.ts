import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { SiteMinimalController } from '../../minimal.controller';

import { Person, UpdatePersonEvent, personModel } from '../../../entities/person/person';
import { User } from '../../../entities/user/user';

import { RecordCard, SubCard  } from '../../recordcard.model';

const CANCEL = "cancel";
const NEXT = "next";
const BACK = "back";
const NUEVO = "nuevo";
const REGISTRAR = "nuevo:cuit"
const UPDATE = "update";

const TARGET_COMERCIO = "comercio";
const TARGET_SEGURIDAD = "personalseguridad";

const dataLabel = {
  comercio: {

  },
  personalseguridad: {

  }
}


@Component({
  selector: 'registro-container',
  templateUrl: './registro-container.component.html',
  styleUrls: ['./registro-container.component.scss'],
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
export class RegistroContainerComponent implements OnInit {
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

  public secondStep = false;
  public showRegistration = false;
  public showPassword = false;

  public isUpdate = NUEVO;

  public person: Person;
  public isComercio = true;


  public detailImage: RelatedImage;


  constructor(
        private minimalCtrl: SiteMinimalController,
        private router: Router,
    ) { }

  ngOnInit() {

  	this.title = this.record.slug;
  	this.description = this.record.description;
  	this.mainimage = this.record.mainimage;

    if(this.target === TARGET_COMERCIO) this.isComercio = true;
    else if(this.target === TARGET_SEGURIDAD) this.isComercio = false;
    else console.log('SOCORROOOO');


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

    //Development-ONLY
    // this.firstStep = false;
    // this.showLogin = false;
  
    // this.secondStep = true;
    // this.showPassword = false;
    // this.showRegistration = true;

  }

  ndocStep(e: UpdatePersonEvent){
    if(e.action === CANCEL){
      this.firstStep = true;
      this.showLogin = false;

      this.secondStep = false;
      this.showRegistration = false;
      this.showPassword = false;
    }

    if(e.action === NEXT){
      this.firstStep = false;
      this.showLogin = false;

      this.person = e.person;

      this.testIfComercioExists(this.person);

    }
  }

  claveStep(e: UpdatePersonEvent){
    if(e.action === CANCEL){
      this.firstStep = true;
      this.showLogin = true;

      this.secondStep = false;
      this.showPassword = false;
      this.showRegistration = false;

    }

    // ingresó clave de acceso
    if(e.action === NEXT){
      this.firstStep = true;
      this.showLogin = false;

      this.loadUserFromPerson(this.person, e.token);

      this.secondStep = true;
      this.showPassword = false;
      this.showRegistration = false;
    }

    // ABRIR PANEL DE REGISTRACIÓN
    if(e.action === REGISTRAR){
      this.firstStep = false;
      this.showLogin = false;
 
      this.secondStep = true;
      this.showPassword = false;
      this.showRegistration = true;
    }
  }

  loadUserFromPerson(person: Person, password: string){
    let userId = person.user.userid;
    this.minimalCtrl.getUserById(userId).then(u => {
      if(u){
        u.password = password;
        this.loginUser(person, u)
      }

    })

  }

  loginUser(person: Person, user: User){

    this.minimalCtrl.updateCurrentPerson(person);
    
    this.minimalCtrl.loginUser(user).then(user => {

      this.minimalCtrl.setCurrentUser(user);

      this.minimalCtrl.initLoginUser().subscribe(u => {

        console.log('ready to NAVIGATE')

        if(this.target === TARGET_COMERCIO) {
          this.router.navigate(['/mab/empresas/inicio', person._id]);

        }else {
          this.router.navigate(['/mab/empresas/inicio', person._id]);

        }
      })
    })
    .catch((err) =>{

    });

  }

  serviceDetail(e, token: Servicios){
    e.stopPropagation();
    e.preventDefault();
    this.trState.state = 'active';
    this.flyState.state = 'in';

    if(token.flipImage){
      token.state = "active";
      this.detailImage = token.flipImage;
      setTimeout(()=>{
        this.showDetail = true;
        token.state = "inactive";
      },400);
    }

  }

  testIfComercioExists(person:Person){
    this.minimalCtrl.testPersonByDNI(person.tdoc, person.ndoc).subscribe(plist=>{
      if(plist && plist.length){
        let token = plist[0];
        console.log('PERSON EXISTS: [%s]', token.displayName);
        Object.assign(person, token);
       if(token.user && token.user.userid){
          this.isUpdate = "update";

        }else {
          this.isUpdate = "create";
        }
 
      } else {
        this.isUpdate = "create";
      }

      this.secondStep = true;
      this.showPassword = true;
      this.showRegistration = false;
    });
  }

  // EVENTO DESDE ALTA NUEVO COMERCIO
  altaComercio(e:UpdatePersonEvent){
    if(e.action === CANCEL){
      this.firstStep = true;
      this.showLogin = false;

      this.secondStep = false;
      this.showPassword = false;
      this.showRegistration = false;

    }

    if(e.action === NUEVO){
      this.firstStep = false;
      this.showLogin = false;

      this.person = e.person;
      this.isUpdate = "update";

      this.secondStep = true;
      this.showPassword = true;
      this.showRegistration = false;

    }
  }

  servicePlain(e){
    e.stopPropagation();
    e.preventDefault();
    this.trState.state = 'inactive';
    this.flyState.state = 'void';
    this.blockState.state = "in";
    setTimeout(()=>{
      this.showDetail = false;
    },400);


  }
  togglePanel(e, i, node){
    e.stopPropagation();
    e.preventDefault();
  	if(i === 0){
  		this.showRegistration = false;
  		this.showLogin = true;
  	}
  	if(i === 1){
  		this.showLogin = false;
  		this.showRegistration = true;
  	}

  }

  flipImage(s: SubCard): RelatedImage{
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
