import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { SiteMinimalController } from '../minimal.controller';
import { RecordCard } from '../recordcard.model';

const HOME_TYPE = 'webresource';
const BRANDING =  'topbranding';
const ABOUT =     'topabout';
const ABOUTLR =   'topaboutlr';
const MISSION =   'topmission';
const DESTACADO = 'destacado';
const SERVICIOS = 'topservicios';
const CONTACTO =  'topcontacto';
const CARROUSEL = 'topcarrousel';
const SIDEMENU =  'sidemenu';
const FICHA =     'ficha';
const FOOTER =    'footer';
const PORTFOLIO = 'portfolio';
const REGISTRO =  'regcomercio';
const SEGURIDAD = 'regpersonas';

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

  public isTopmission = false;
  public topmission: RecordCard;

  public isDestacado = false;
  public destacado: RecordCard;

  public isServicios = false;
  public servicios: RecordCard;

  public isRegistro = false;
  public registro: RecordCard;

  public isPersonalSeguridad = false;
  public personalSeguridad: RecordCard;

  public isContacto = false;
  public contacto: RecordCard;

  public showProductos = false;

  public isFooter = true;
  public footer: RecordCard;

  public isPosts = true;

  public isPapers = false;
  public papers: RecordCard[] = [];

  private showPortfolioComponent = false;
  public isPortfolios = false;
  public portfolios: RecordCard[] = [];
  public portfolioCardSize = '100%';


  public isPortfolioCarrousel = true;

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
        
        if(publish.template === BRANDING){
          this.topbranding = record;
          this.isTopbranding = true

        }else if(publish.template === CARROUSEL){
          this.topcarrousel = record;
          this.isTopcarrousel = true;

        }else if(publish.template === ABOUT){
          this.topabout = record;
          this.isTopabout = true

        }else if(publish.template === ABOUTLR){
          this.topaboutlr = record;
          this.isTopaboutlr = true

        }else if(publish.template === MISSION){
          this.topmission = record;
          this.isTopmission = true

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

        }else if(publish.template === PORTFOLIO){
          if(this.showPortfolioComponent){
            this.portfolios.push(record);
          }

        }else if(publish.template === REGISTRO){
          this.registro = record;
          this.isRegistro = true;

        }else if(publish.template === SEGURIDAD){
          this.personalSeguridad = record;
          this.isPersonalSeguridad = true;

        }else if(publish.template === SERVICIOS){
          this.servicios = record;
          this.isServicios = true
        }
      });

      if(this.papers && this.papers.length){
        this.isPapers = true;
      }

      if(this.portfolios && this.portfolios.length){
        this.sortProperly(this.portfolios);
        this.isPortfolios = true;
      }

    }
  }

  sortProperly(records){
    records.sort((fel, sel)=> {
      if(!fel.publish.publishOrder) fel.publish.publishOrder = "zzzzzzz";
      if(!sel.publish.publishOrder) sel.publish.publishOrder = "zzzzzzz";

      if(fel.publish.publishOrder<sel.publish.publishOrder) return -1;
      else if(fel.publish.publishOrder>sel.publish.publishOrder) return 1;
      else return 0;
    })


  }

}

