import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { SiteMinimalController } from '../minimal.controller';
import { RecordCard } from '../recordcard.model';



const HOME_TYPE = 'webresource';
const BRANDING =  'topbranding';
const ABOUT =     'topabout';
const ABOUTLR =   'topaboutlr';
const DESTACADO = 'destacado';
const SERVICIOS = 'topservicios';
const CONTACTO =  'topcontacto';
const CARROUSEL = 'topcarrousel';
const SIDEMENU =  'sidemenu';
const FICHA =     'ficha';
const FOOTER =    'footer';

const HOME = 'home';



@Component({
  selector: 'public-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	public isTopbranding = false;
  public topbranding: RecordCard;

  public isTopcarrousel = false;
  public topcarrousel: RecordCard;

  public isTopabout = false;
  public topabout: RecordCard;

  public isTopaboutlr = false;
  public topaboutlr: RecordCard;

  public isDestacado = false;
  public destacado: RecordCard;

  public isServicios = false;
  public servicios: RecordCard;

  public isContacto = false;
  public contacto: RecordCard;

  public isFooter = false;
  public footer: RecordCard;

  public isPapers = false;
  public papers: RecordCard[] = [];

  public unBindList = [];


  constructor(
  		private minimalCtrl: SiteMinimalController,
    	private router: Router,
    	private route: ActivatedRoute,
  	) { }

  ngOnInit() {
    let first = true;

    let sscrp2 = this.minimalCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;

        this.initHomePage();
      }
    })

    this.unBindList.push(sscrp2);
  }

  ngOnDestroy(){
    this.unBindList.forEach(x => {x.unsubscribe()});
  }

  initHomePage(){
    this.minimalCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);

    if(this.minimalCtrl.navigateToUserCommunity()){
      this.router.navigate(['./', this.minimalCtrl.userUrl], { relativeTo: this.route })

    }else{

      let sscrp1 = this.minimalCtrl.fetchContextRecords(HOME).subscribe(records => {
        this.renderHomePage(records);
      });

      this.unBindList.push(sscrp1);

    }

  }

  renderHomePage(records: RecordCard[]){
    this.minimalCtrl.setHomeTitle();

    if(records && records.length){

      records.forEach(record => {

        let publish = record.publish;
        //console.log('renderHome: [%s] [%s]',publish.template,  publish.template === CARROUSEL)
        
        if(publish.template === BRANDING){
          this.topbranding = record;
          this.isTopbranding = true

        }else if(publish.template === CARROUSEL){
          this.topcarrousel = record;
          this.isTopcarrousel = true

        }else if(publish.template === ABOUT){
          this.topabout = record;
          this.isTopabout = true

        }else if(publish.template === ABOUTLR){
          this.topaboutlr = record;
          this.isTopaboutlr = true

        }else if(publish.template === DESTACADO){
          this.destacado = record;
          this.isDestacado = true

        }else if(publish.template === CONTACTO){
          this.contacto = record;
          this.isContacto = true

        }else if(publish.template === FOOTER){
          this.footer = record;
          this.isFooter = true

        }else if(publish.template === FICHA){
          this.papers.push(record);

        }else if(publish.template === SERVICIOS){
          this.servicios = record;
          this.isServicios = true
        }
      });

      if(this.papers && this.papers.length){
        this.isPapers = true;
      }






    }
  }



}
// end component




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
