import { Component, Input, OnInit } from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


import { RecordCard, SubCard  } from '../../recordcard.model';


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

	public mainimage: string = "";
	public title: string = "";
	public description: string = "";
	public nodes: Array<Servicios> = [];
  public showDetail = false;
  public trState = {state: 'inactive'};
  public flyState = {state: 'void'};
  public blockState = {state: 'void'};
  public showLogin = true;
  public showRegistration = false;
  public showComponent = true;


  public detailImage: RelatedImage;


  constructor() { }

  ngOnInit() {

  	this.title = this.record.slug;
  	this.description = this.record.description;
  	this.mainimage = this.record.mainimage;
    console.log('REGISTRO!! [%s]', this.description);

  	this.record.relatedcards.forEach(s => {
      console.log('relatedCards')
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
  togglePanel(e, i, node){
    e.stopPropagation();
    e.preventDefault();
  	console.log('togglePanel: [i]', i);
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
