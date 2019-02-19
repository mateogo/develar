import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { SiteMinimalController } from '../../minimal.controller';
import { RecordCard, BreadcrumbItem } from '../../recordcard.model';

@Component({
  selector: 'post-detail-container',
  templateUrl: './post-detail-container.component.html',
  styleUrls: ['./post-detail-container.component.scss']
})
export class PostDetailContainerComponent implements OnInit {
  @Input() cardSize: string = "100%"

  public unBindList = [];
  public hasModel = false;
  public post: RecordCard;
  public posts: RecordCard[];

  private modelScrptn;

  constructor(
  		private minimalCtrl: SiteMinimalController,
    	private router: Router,
    	private route: ActivatedRoute) { }

  ngOnInit() {

    this.modelScrptn = this.minimalCtrl.recordCardListener.subscribe(model =>{
      this.renderDetailPage(model);
    })


    this.route.url.subscribe(url=> {
      let id = this.route.snapshot.paramMap.get('id')

      this.minimalCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url)

      this.minimalCtrl.fetchRecordCard(null, id);

    });


  }


  renderDetailPage(record){
  	this.post = record;

  	this.hasModel = true;

  }


  ngOnDestroy(){
    this.unBindList.forEach(x => {x.unsubscribe()});
  }

}
