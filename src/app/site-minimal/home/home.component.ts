import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { SiteMinimalController } from '../minimal.controller';
import { RecordCard } from '../recordcard.model';



const HOME_TYPE = 'webresource';
const BRANDING = 'topbranding';
const ABOUT = 'topabout';
const DESTACADO = 'destacado';
const SERVICIOS = 'topservicios';
const CONTACTO = 'formcontacto';

@Component({
  selector: 'public-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	public isTopbranding = false;
  public topbranding: RecordCard;

  public isTopabout = false;
  public topabout: RecordCard;

  public isDestacado = false;
  public destacado: RecordCard;

  public isServicios = false;
  public servicios: RecordCard;

  public isContacto = false;
  public contacto: RecordCard;


  constructor(
  		private minimalCtrl: SiteMinimalController,
    	private router: Router,
    	private route: ActivatedRoute,
  	) { }

  ngOnInit() {
  	console.log('Home ngOnInit BEGIN')
  	this.minimalCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url)
  	
  	this.minimalCtrl.fetchHomeResources().subscribe(tokens => {
  		console.log('***************** Home Component ******************')
      console.log('HomeComponent cb  =====>[%s]',tokens.length);
			if(tokens && tokens.length){

        tokens.forEach(record => {
          if(record.cardType === HOME_TYPE && record.cardCategory === BRANDING){
            this.topbranding = record;
            this.isTopbranding = true

          }else if(record.cardType === HOME_TYPE && record.cardCategory === ABOUT){
            this.topabout = record;
            this.isTopabout = true

          }else if(record.cardType === HOME_TYPE && record.cardCategory === DESTACADO){
            this.destacado = record;
            this.isDestacado = true

          }else if(record.cardType === HOME_TYPE && record.cardCategory === CONTACTO){
            this.contacto = record;
            this.isContacto = true

          }else if(record.cardType === HOME_TYPE && record.cardCategory === SERVICIOS){
            this.servicios = record;
            this.isServicios = true
          }
        })
			}

  	});
  }



}





/*************
  	this.route.url.subscribe(u =>{
  		console.log('*********** Url Segment: [%s]',u.toString());
  		console.dir(u);
  	});

  	//this.route.snapshot.url;
  	console.log('router snapshotURL : [%s]',this.router.routerState.snapshot.url);
  	console.log('route  snapshotURL : [%s]',this.route.snapshot.url);

  	let urlmodule = this.route.snapshot.url.toString();
  	let urlglobal = this.router.routerState.snapshot.url;
  	let urlpath: string = "";
  	console.log('router snapshotURL : [%s]',urlglobal);
  	console.log('route  snapshotURL : [%s]',urlmodule);
  	
  	if(urlmodule){
  		urlpath = urlglobal.substr(1, (urlglobal.length - urlmodule.length -2));
  		console.log('url path [%s] [%s]', urlpath ,(urlglobal.length - urlmodule.length -1));
  	}else{
  		urlpath = urlglobal.substr(1);

  	}

  	let urltest = this.router.routerState.snapshot.url;
  	// urltest.forEach(s => {
  	// 	console.log('urltest for each: [%s]',s.toString())
  	// })

  	let split = urlpath.split('/');
  	split.forEach(s => {
  		console.log('********* split: [%s]', s);
  	})

    console.log('firstChild: [%s]', this.route.firstChild);
    console.log('fragmeng: [%s]', this.route.fragment);
    console.log('outlet: [%s]', this.route.outlet);
    console.log('parent: [%s]', this.route.parent);
    console.log('children: [%s]', this.route.children);


  	// url.subscribe(tokens =>{
  	// 	tokens.forEach(token => {
  	// 		console.log('Token URL: token')
  	// 	})
  	// })

********/
