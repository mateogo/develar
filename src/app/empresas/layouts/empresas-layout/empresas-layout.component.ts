import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { SharedService }   from '../../../develar-commons/shared-service';

import { EmpresasController } from '../../empresas.controller';

import { RecordCard, SubCard  } from '../../../site-minimal/recordcard.model';

@Component({
  selector:      'empresas-layout',
  templateUrl: './empresas-layout.component.html',
  styleUrls:  ['./empresas-layout.component.scss']
})
export class EmpresasLayoutComponent implements OnInit {
  @Input() openedSidebar: boolean = false;

  pageTitle: any;
  navbarTmpl = 'default-navbar';
  isHomeView$: Observable<boolean>;
  mainimage: string;
  topBrandingCard: RecordCard;
  footerCard: RecordCard;
  nodes: Array<Servicios> = [];


  constructor( 
    private empCtrl: EmpresasController,
    private router: Router,
    private _sharedService: SharedService ) {

    _sharedService.changeEmitted$.subscribe(
      title => {
        this.pageTitle = title;
      }
    );

    this.isHomeView$ = _sharedService.isHomeViewEmitted$;

    if(_sharedService.gldef.mainmenutpl){
       this.navbarTmpl = _sharedService.gldef.mainmenutpl;
    }

  }

  ngOnInit() {
    let query1 = { cardType: 'comercios', cardCategory: 'dashboard'};
    let sscrp1 = this.empCtrl.fetchRecordsByQuery(query1).subscribe(records => {
      if(records && records.length){
        this.topBrandingCard = records[0]
        this.mainimage = this.topBrandingCard.mainimage;
        this.initRelatedCards (this.topBrandingCard);
      }
    });

    let query2 = { cardType: 'webresource', cardCategory: 'footer'};
    let sscrp2 = this.empCtrl.fetchRecordsByQuery(query2).subscribe(records => {
      if(records && records.length){
        this.footerCard = records[0]
      }
    });


  }

  todo(e){
    //ToDo
  }

  gotoHome(e){
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(["/mab/empresas/inicio"]);
  }


  private initRelatedCards(record: RecordCard){
    record.relatedcards.forEach(s => {
      this.buildServiceArray(s);
    })
  }

  private buildServiceArray(s: SubCard){
    this.nodes.push({
      title: s.slug,
      imageUrl: s.mainimage,
      flipImage: this.flipImage(s),
      description: s.description,
      linkTo: (s.linkTo.indexOf('http') !== -1) ? s.linkTo : '',
      navigateTo: (s.linkTo.indexOf('http') === -1) ? s.linkTo : '',
      noLink: s.linkTo ? false: true,
      state: 'inactive'
    } as Servicios)

  }

  private flipImage(s: SubCard): RelatedImage{
    let fimage = s.viewimages.find(t => t.predicate === 'images');
    if(fimage){
      return {
              predicate: fimage.predicate,
              entityId: fimage.entityId,
              url: '/download/' + fimage.entityId,
              slug: fimage.slug
            } as RelatedImage;
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
