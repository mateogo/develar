import { Component, Input, OnInit } from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


import { RecordCard, SubCard  } from '../recordcard.model';


@Component({
  selector: 'top-servicios',
  templateUrl: './top-servicios.component.html',
  styleUrls: ['./top-servicios.component.scss'],
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
export class TopServiciosComponent implements OnInit {
	@Input() record: RecordCard;

	public mainimage: string = "";
	public title: string = "";
	public description: string = "";
	public nodes: Array<Servicios> = [];
  public showDetail = false;
  public trState = {state: 'inactive'};
  public flyState = {state: 'void'};
  public blockState = {state: 'void'};

  public detailImage: RelatedImage;

  constructor() { }

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

  ngOnInit() {

  	this.title = this.record.slug;
  	this.description = this.record.description;
  	this.mainimage = this.record.mainimage;

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

/***
benchmarking
http://develar.co:4200/download/5a7e2f54ca280f07c28bc34b

branding
http://develar.co:4200/download/5a7e2f54ca280f07c28bc34e

com corp
http://develar.co:4200/download/5a7e2f54ca280f07c28bc351

estrat medios
http://develar.co:4200/download/5a7e2f54ca280f07c28bc354

estrat relacion
http://develar.co:4200/download/5a7e2f55ca280f07c28bc357

estrategia susten
http://develar.co:4200/download/5a7e2f55ca280f07c28bc35a

marketing
http://develar.co:4200/download/5a7e2f55ca280f07c28bc35d

social media
http://develar.co:4200/download/5a7e2f55ca280f07c28bc360



*/

