import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { devutils }from '../../../develar-commons/utils'

import { DsocialController } from '../../dsocial.controller';
import { BookshelfController } from '../../bookshelf.controller';

import { Person, UpdatePersonEvent, personModel } from '../../../entities/person/person';
import { User } from '../../../entities/user/user';

import { DsocialModel, Ciudadano, SectorAtencion } from '../../dsocial.model';

import { RecordCard, SubCard  } from '../../../site-minimal/recordcard.model';


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
  selector: 'alimentar-consulta',
  templateUrl: './alimentar-consulta.component.html',
  styleUrls: ['./alimentar-consulta.component.scss']
})
export class AlimentarConsultaComponent implements OnInit {


  private unBindList = [];
  public firstStep = false;

	public mainimage: string = "";
	public title: string = "";
	public description: string = "";
	public nodes: Array<Servicios> = [];
	public record: RecordCard;


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
  private fetchRecordCard(){
		let query = {
			publish: true,
			"publish.topics": 'dsocial',
			"publish.publishOrder": 'banner:talimentar:turnos',
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

    if(this.record.relatedcards && this.record.relatedcards.length){
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
    }else{
      // error: la ficha no tiene sub-fichas.
      

        this.nodes.push({
          title: 'Error al cargar la ficha',
          imageUrl: this.record.mainimage,
          flipImage: null,
          description: this.record.description,
          linkTo: '',
          navigateTo: '',
          noLink: true,
          state: 'inactive'
        } as Servicios)


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
