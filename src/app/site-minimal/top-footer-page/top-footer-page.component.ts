import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { SiteMinimalController } from '../minimal.controller';
import { RecordCard } from '../recordcard.model';

const FOOTER =    'footer';

@Component({
  selector: 'footer-page',
  templateUrl: './top-footer-page.component.html',
  styleUrls: ['./top-footer-page.component.css']
})
export class TopFooterPageComponent implements OnInit {

  private unBindList = [];
  public isFooter = false;
  public footer: RecordCard;

  constructor(
  	private minimalCtrl: SiteMinimalController){

	}

  ngOnInit() {
  	this.fetchFooterRecords();
  }

  ngOnDestroy(){
    this.unBindList.forEach(x => {x.unsubscribe()});
  }


  fetchFooterRecords(){
		let sscrp1 = this.minimalCtrl.fetchFooterRecords().subscribe(records => {
		  this.renderFooter(records);
		});

		this.unBindList.push(sscrp1);
  }

  renderFooter(records: RecordCard[]){
  	if(records && records.length){
			this.footer = records[0];
			this.isFooter = true
  	}
  }

}
