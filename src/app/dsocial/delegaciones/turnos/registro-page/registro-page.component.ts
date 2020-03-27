import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


import { DsocialController } from '../../../dsocial.controller';
import { BookshelfController } from '../../../bookshelf.controller';

import { Person, UpdatePersonEvent, personModel } from '../../../../entities/person/person';
import { User } from '../../../../entities/user/user';

import { DsocialModel, Ciudadano, SectorAtencion } from '../../../dsocial.model';

import { RecordCard, SubCard  } from '../../../../site-minimal/recordcard.model';

const CANCEL = "cancel";
const NEXT = "next";
const BACK = "back";
const NUEVO = "nuevo";
const REGISTRAR = "nuevo:cuit"
const UPDATE = "update";
const CORE = 'core';
const FAILED = 'failed';
const SUCCESS = 'success';

const dataLabel = {
  turnos: {

  }
}


@Component({
  selector: 'registro-page',
  templateUrl: './registro-page.component.html',
  styleUrls: ['./registro-page.component.scss']
})
export class RegistroPageComponent implements OnInit {

	public mainimage: string = "";
	public title: string = "";
	public description: string = "";
	public nodes: Array<Servicios> = [];
  public showDetail = false;
  public trState = {state: 'inactive'};
  public flyState = {state: 'void'};
  public blockState = {state: 'void'};

	public record: RecordCard;
  public target = "turnos";


  public firstStep = false;
  public showLogin = false;

  public coreDataStep = false;
  public validateConditionsStep = false;

  private  personExists= false;
  public showPersonEditor = false;

  public person: Person;
  public isComercio = true;

  public peso = 0;

  private unBindList = [];
  public currentSector: SectorAtencion = {
                          val:'altaweb',
                          serial:'tsocial',
                          label: 'Alta Web',
                          style: {'background-color': "#f2dded"}
                        };
  



  public detailImage: RelatedImage;


  constructor(
        private dsCtrl: DsocialController,
        private bkCtrl: BookshelfController,
        private router: Router,
    ) { }

  ngOnInit() {

		this.fetchRecordCard();

  }


  /**********************/
  /*  template events  */
  /********************/
  openLoginPanel(e, i, node){
    e.stopPropagation();
    e.preventDefault();

    if(this.timeOutOfScope()) return;

    if(i === 0){
      this.showLogin = true;
    }
    if(i === 1){
      this.showLogin = false;
    }

  }


  altaPersonEvent(e: UpdatePersonEvent) {
    this.personExists = false;

    if(e.action === UPDATE){
      this.updatePersonRecord(e);
    }

    if(e.action === CANCEL){
      this.moveToFirstStep(true)
    }

  }

  validatePersonEvent(e: UpdatePersonEvent){
    if(e.action === NEXT){
      this.moveToValidateConditionsStep()
    }

    if(e.action === FAILED){
      this.createNuevoTurnoMostrador()
      this.moveToFirstStep(false)



    }

    if(e.action === CANCEL){
      //console.log('CANCEL')


    }
    if(e.action === SUCCESS){
      //console.log('SUCCESS')
      

    }

  }

  private timeOutOfScope(): boolean{
    let ok = false;
    let today = new Date();
    let hours = today.getHours();
    let day = today.getDay()

    console.log('day [%s]   hours[%s]', day, hours)
    if((hours>=14 || hours < 8) || (day < 1 || day > 5) ){
      ok = true;

      this.dsCtrl.openSnackBar('Este espacio queda habilitado de Lunes a Viernes de 8:00 a 14:00hs', 'Cerrar');

    } 

    return ok;

  }

  private createNuevoTurnoMostrador(){
    if(this.readyToCreateNewTurno()){
      this.dsCtrl.turnoCreate('turnos', 'ayudadirecta', this.currentSector.val, this.peso, this.person).subscribe(turno =>{

      })

    }

  }

  private readyToCreateNewTurno(){
    let ready = false;
    if(this.person && this.currentSector){
      ready = true;
    }
    return ready
  }


  documentEvent(e: UpdatePersonEvent){
    if(e.action === CANCEL){
      this.moveToFirstStep(false);
    }

    if(e.action === NEXT){
      this.firstStep = false;
      this.showLogin = false;

      this.person = e.person;

      this.testIfPersonExists(this.person);

    }
  }

  // loadUserFromPerson(person: Person, password: string){
  //   let userId = person.user.userid;
  //   this.dsCtrl.getUserById(userId).then(u => {
  //     if(u){
  //       u.password = password;
  //       this.loginUser(person, u)
  //     }

  //   })

  // }

  // loginUser(person: Person, user: User){

  //   this.dsCtrl.updateCurrentPerson(person);
    
  //   this.dsCtrl.loginUser(user).then(user => {

  //     this.dsCtrl.setCurrentUser(user);

  //     this.dsCtrl.initLoginUser().subscribe(u => {

  //       console.log('ready to NAVIGATE')

  //       if(this.target === TARGET_COMERCIO) {
  //         this.router.navigate(['/mab/empresas/inicio', person._id]);

  //       }else {
  //         this.router.navigate(['/mab/empresas/inicio', person._id]);

  //       }
  //     })
  //   })
  //   .catch((err) =>{

  //   });

  // }



  private updatePersonRecord(e:UpdatePersonEvent){
    let person = e.person;
    if(person._id){
      this.dsCtrl.updatePersonPromise(person._id, person).then(per =>{
        this.person = per;
        this.personExists = true;
        this.moveToValidateConditionsStep();
      })

    }else{
      this.dsCtrl.createPerson(person).then(per => {
        if(per){
          this.person = per;
          this.personExists = true;
          this.moveToValidateConditionsStep();
        }
      });
    }
  }

  private testIfPersonExists(person:Person){
    this.dsCtrl.testPersonByDNI(person.tdoc, person.ndoc).subscribe(plist=>{
      if(plist && plist.length){
        let token = plist[0];

        Object.assign(person, token);
        this.personExists = true;

        this.moveToCoreDataStep(true)//OjO solo por prueba 

      } else {
        this.personExists = false;
        this.moveToCoreDataStep(false)//OjO solo por prueba 

      }
    });
  }

  private fetchRecordCard(){
		let query = {
			publish: true,
			"publish.topics": 'dsocial',
			"publish.publishOrder": 'banner:turnos:delegaciones',
		}

		let sscrp1 = this.bkCtrl.fetchRecordsByQuery(query).subscribe(records => {
		  this.initRecordCard(records);
		  this.initRenderData()
		  this.firstStep = true;
		});

		this.unBindList.push(sscrp1);

  }
  private initRenderData(){
  	// todo ... may be

  }

  private initRecordCard(records: RecordCard[]) {
  	if(records && records.length){
  		this.record = records[0];
  	}else {
  		this.record = new RecordCard("censo banner no encontrado");
  	}

  	this.title = this.record.slug;
  	this.description = this.record.description;
  	this.mainimage = this.record.mainimage;

  	this.record.relatedcards.forEach(s => {
      let link:string , navigate:string , noLink = true;
      
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
        flipImage: null,
  			description: s.description,
        linkTo: link,
        navigateTo: navigate,
        noLink: noLink,
        state: 'inactive'
  		} as Servicios)
  	})

  }

  private moveToFirstStep(loginShow: boolean) {
    this.firstStep = true;
    this.showLogin = loginShow;

    this.coreDataStep = false;
    this.showPersonEditor = false;

    this.validateConditionsStep = false;

  }

  private moveToCoreDataStep(hasPerson: boolean) {
    this.coreDataStep = true;
    this.showPersonEditor = !hasPerson;
 

    this.firstStep = false;
    this.showLogin = false;


    this.validateConditionsStep = false;

  }

  private moveToValidateConditionsStep() {
    this.firstStep = false;
    this.showLogin = false;

    this.coreDataStep = false;
    this.showPersonEditor = false;

    this.validateConditionsStep = true;

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
