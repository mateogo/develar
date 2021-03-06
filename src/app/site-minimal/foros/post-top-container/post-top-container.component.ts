import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { SiteMinimalController } from '../../minimal.controller';
import { RecordCard, BreadcrumbItem } from '../../recordcard.model';

@Component({
  selector: 'post-top-container',
  templateUrl: './post-top-container.component.html',
  styleUrls: ['./post-top-container.component.scss']
})
export class PostTopContainerComponent implements OnInit {
  @Input() cardSize: string = "100%";
  @Input() destaque: string = "destaque1";


  public unBindList = [];
  public hasTopPosts = false;
  public posts: RecordCard[];
  public isDestaque1 = false;
  public isDestaque2 = true;
  public isDestaque3 = true;


  constructor(
  		private minimalCtrl: SiteMinimalController,
    	private router: Router,
    	private route: ActivatedRoute) { }

  ngOnInit() {

    var first = true;
    if(this.destaque === 'destaque1'){
      this.isDestaque1 = true;
      this.isDestaque2 = false;
      this.isDestaque3 = false;
    }

   if(this.destaque === 'destaque2'){
      this.isDestaque1 = false;
      this.isDestaque2 = true;
      this.isDestaque3 = false;
    }

   if(this.destaque === 'destaque3'){
      this.isDestaque1 = false;
      this.isDestaque2 = false;
      this.isDestaque3 = true;
    }

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




  }

  initHomePage(){
    let sscrp1 = this.minimalCtrl.fetchTopPostsRecords(this.destaque).subscribe(records => {
      this.sortProperly(records);
      this.renderHomePage(records);
    });


    this.unBindList.push(sscrp1);


  }

  navigateDetailView(model:RecordCard){
    this.router.navigate(["/notas/navegar", model._id])

  }

  modelListener(token: RecordCard){
    this.navigateDetailView(token);

  }


  renderHomePage(records){
  	if(records && records.length){
  		this.posts = records;
  		this.hasTopPosts = true;

  	}

  }


  sortProperly(records){
  	if(!records || !records.length) return;

    records.sort((fel, sel)=> {
      if(!fel.publish.publishOrder) fel.publish.publishOrder = "zzzzzzz";
      if(!sel.publish.publishOrder) sel.publish.publishOrder = "zzzzzzz";

      if(fel.publish.publishOrder<sel.publish.publishOrder) return -1;
      else if(fel.publish.publishOrder>sel.publish.publishOrder) return 1;
      else return 0;
    })

  }


  ngOnDestroy(){
    this.unBindList.forEach(x => {x.unsubscribe()});
  }

}
