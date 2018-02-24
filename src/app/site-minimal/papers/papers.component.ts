import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { SiteMinimalController } from '../minimal.controller';
import { RecordCard, BreadcrumbItem } from '../recordcard.model';

const HOME_TYPE = 'webresource';
const BRANDING = 'topbranding';
const ABOUT = 'topabout';
const DESTACADO = 'destacado';
const SERVICIOS = 'topservicios';
const CONTACTO = 'topcontacto';
const CARROUSEL = 'carrousel';
const SIDEMENU = 'sidemenu';
const FICHA = 'ficha';

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
  selector: 'papers',
  templateUrl: './papers.component.html',
  styleUrls: ['./papers.component.scss']
})
export class PapersComponent implements OnInit {

  private topic = "";

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

  public isPapers = false;
  public papers: RecordCard[] = [];

  public breadcrumb: BreadcrumbItem[] = breadcrumb;



  constructor(
  		private minimalCtrl: SiteMinimalController,
    	private router: Router,
    	private route: ActivatedRoute,
  	) { }

  ngOnInit() {
  	console.log('Home ngOnInit BEGIN')
  	this.minimalCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url)

    this.buildBreadCrumb();
   
    this.topic = this.fetchTopicFromUrl(this.route.snapshot.url);
      console.log('***************** Papers Component: [%s] ******************', this.topic);
  	
  	this.minimalCtrl.fetchRenderResources(this.topic).subscribe(tokens => {
  		console.log('***************** Home Component ******************')
      console.log('HomeComponent cb  =====>[%s]',tokens.length);
			if(tokens && tokens.length){

        tokens.forEach(record => {
          let publish = record.publish;
          if(publish.template === BRANDING){
            this.topbranding = record;
            this.isTopbranding = true

          }else if(publish.template === ABOUT){
            this.topabout = record;
            this.isTopabout = true

          }else if(publish.template === DESTACADO){
            this.destacado = record;
            this.isDestacado = true

          }else if(publish.template === CONTACTO){
            this.contacto = record;
            this.isContacto = true

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

  	});
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
