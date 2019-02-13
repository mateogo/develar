import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { SiteMinimalController } from '../../minimal.controller';
import { RecordCard, BreadcrumbItem } from '../../recordcard.model';

const HOME_TYPE = 'webresource';
const BRANDING = 'topbranding';
const ABOUT = 'topabout';
const DESTACADO = 'destacado';
const SERVICIOS = 'topservicios';
const CONTACTO = 'topcontacto';
const TOPPORTFOLIO = 'topportfolio';
const PORTFOLIO = 'portfolio';
const CARROUSEL = 'topcarrousel';
const SIDEMENU = 'sidemenu';
const FICHA = 'ficha';
const FOOTER =    'footer';

const breadcrumb: BreadcrumbItem[] = [
  {
    title: 'Inicio',
    link: '/',
    icon: 'fa fa-home'
  },
  {
    title: 'Comunidad',
    link: '/',
    icon: 'fa fa-user-circle'
  },

];

@Component({
  selector: 'portfolio-page',
  templateUrl: './portfolio-page.component.html',
  styleUrls: ['./portfolio-page.component.scss']
})
export class PortfolioPageComponent implements OnInit {
  @Input() cardSize: string = "100%"

  private topic = "";

	public isTopbranding = false;
  public topbranding: RecordCard;

  public isTopcarrousel = false;
  public topcarrousel: RecordCard;

  public isTopabout = false;
  public topabout: RecordCard;

  public isDestacado = false;
  public destacado: RecordCard;

  public isServicios = false;
  public servicios: RecordCard;

  public isContacto = false;
  public contacto: RecordCard;

  public isTopPortfolio = false;
  public topPortfolio: RecordCard;

  public isPortfolios = false;
  public portfolios: RecordCard[] = [];

  public isFooter = true;
  public footer: RecordCard;

  public isUserAdmin = false;

  public breadcrumb: BreadcrumbItem[] = breadcrumb;

  public unBindList = [];

  private token: string;




  constructor(
  		private minimalCtrl: SiteMinimalController,
    	private router: Router,
    	private route: ActivatedRoute,
  	) { }


  ngOnInit() {
    var first = true;
    setTimeout(() => this.minimalCtrl.setHomeView(false),500);

    this.route.url.subscribe(url=> {

      this.token = this.route.snapshot.paramMap.get('id');
 
      if(first){
        let sscrp2 = this.minimalCtrl.onReady.subscribe(readyToGo =>{

          if(readyToGo && first){
            first = false;

            this.initHomePage();

          }
        })
        this.unBindList.push(sscrp2);
      }else{
        this.initHomePage();
      }

    });




  }

  ngOnDestroy(){
    this.unBindList.forEach(x => {x.unsubscribe()});
  }



  initHomePage(){
    // this.minimalCtrl.actualRoute(snap: string: mRoute: UrlSegmen[])
    this.minimalCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);
    
    this.isTopbranding = false;
    this.isTopcarrousel = false;
    this.isTopabout = false;
    this.isDestacado = false;
    this.isServicios = false;
    this.isContacto = false;
    this.isTopPortfolio = false;
    this.isPortfolios = false;
    this.isFooter = true;



    //******************************************************
    //this.isUserAdmin = this.minimalCtrl.isUserAdmin;

    //Topic
    if(this.token){
      this.topic = this.token;

    }else{
      this.topic = 'portfolio';
    }

    this.minimalCtrl.setPapersTitle();
    

    let sscrp1 = this.minimalCtrl.fetchPortfolioRecords(this.topic).subscribe(records => {
      this.sortProperly(records);
      this.renderHomePage(records);
    });


    this.unBindList.push(sscrp1);

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

  renderHomePage(records: RecordCard[]){
    if(records && records.length){


      records.forEach(record => {

        let publish = record.publish;

        if(publish.template === BRANDING){
          this.topbranding = record;
          this.isTopbranding = true

        }else if(publish.template === CARROUSEL){
          this.topcarrousel = record;
          this.isTopcarrousel = true

        }else if(publish.template === ABOUT){
          this.topabout = record;
          this.isTopabout = true

        }else if(publish.template === DESTACADO){
          this.destacado = record;
          this.isDestacado = true

        }else if(publish.template === CONTACTO){
          this.contacto = record;
          this.isContacto = true

        }else if(publish.template === FOOTER){
          // this.footer = record;
          // this.isFooter = true

        }else if(publish.template === PORTFOLIO){
          this.portfolios.push(record);

        }else if(publish.template === SERVICIOS){
          this.servicios = record;
          this.isServicios = true
        }
      });

      if(this.portfolios && this.portfolios.length){
        this.isPortfolios = true;
      }

    }    
  }



  fetchTopicFromUrl(urls:UrlSegment[]){
    let tokens = urls.length;
    let topic = "";
    if(tokens){
      topic = urls[tokens-1].toString();
    }
    return topic;

  }

  buildBreadCrumb(){
    this.breadcrumb[0].link = this.minimalCtrl.communityRoute;
    this.breadcrumb[1].link = this.minimalCtrl.communityRoute;
  }

}
