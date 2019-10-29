import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

//import { Observable } from 'rxjs';

import { SiteMinimalController } from '../../minimal.controller';
import { RecordCard } from '../../recordcard.model';


@Component({
  selector: 'porfolio-carrousel-page',
  templateUrl: './portfolio-carrousel-page.component.html',
  styleUrls: ['./portfolio-carrousel-page.component.scss']
})
export class PortfolioCarrouselPageComponent implements OnInit {
  @Input() cardSize: string = "100%"
  @Input() destaque: string = "destaque1";

  private templ = "portfolio";
  private stempl = "carrousel1";
  public linkText = "Ver galería"

  private cRows = 2;
  private cCol = 3;
  private cLimit = 6;
  public hasCarrousel = false;
  public hasLinkTo = false;
  public carrouseles: Array<PortfolioCarrousel> = [];

  public isUserAdmin = false;

  public unBindList = [];

  private token: string;

  public isPortfolios = false;
  public portfolios: RecordCard[] = [];



  constructor(
  		private minimalCtrl: SiteMinimalController,
    	private router: Router,
    	private route: ActivatedRoute,
  	) { }


  ngOnInit() {
    var first = true;

    this.route.url.subscribe(url=> {

      //this.token = this.route.snapshot.paramMap.get('id');
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

    let sscrp1 = this.minimalCtrl.fetchPublishingRecords(this.templ, this.stempl).subscribe(records => {
      this.sortProperly(records);
      this.renderHomePage(records);
    });

    this.unBindList.push(sscrp1);
  }

  searchPage(e){
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/trabajan/red'])

  }

  renderHomePage(records: RecordCard[]){
  	this.buildCarrousel(records);
  	if(this.carrouseles.length){
  		this.hasCarrousel = true;
      this.hasLinkTo = true;
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

  buildCarrousel(records:RecordCard[]){
  	if(!(records && records.length)) return;
  	let samples = Math.floor(records.length / this.cLimit) * this.cLimit;
  	this.carrouseles = [];

  	records.forEach((token, index) =>{
  		let td = index % this.cLimit;
  		let base = Math.floor(index / this.cLimit);
    	this.buildArray(this.carrouseles, token, base);


  	});
  	this.fillLastRow(this.carrouseles, this.cLimit)
  	//this.test(this.carrouseles);


  }

  private buildArray(list: PortfolioCarrousel[], elem:RecordCard, base: number){
  	let token = this.buildCarrouselToken(elem);

  	if(!list[base]){
  		list[base] = new PortfolioCarrousel(base, 'PortfolioCarrousel');
  	}

  	list[base].tokens.push(token);

  }

	private buildCarrouselToken(token: RecordCard ){
		return new CarrouselToken(token.mainimage, '',token.slug, token.subtitle)

	}

	private fillLastRow(list: PortfolioCarrousel[], limit: number){
		let index = 0;
		if(list && list.length){
			let last = list.length;
			let row = list[last-1];
			if(!(row && row.tokens.length)) return;
			if(row.tokens.length === limit) return;
			for(let i = 0; i<limit ; i++){
				if(!row.tokens[i]) {
					row.tokens[i] = list[0].tokens[index];
					index +=1;
				}
    	}
	
		}
	}

}



class CarrouselToken {
	imgUrl: string;
	target: string;
	slug: string;
	subtitle: string;
	constructor(url, target,slug, subt){
		this.imgUrl = url;
		this.target = target;
		this.slug = slug;
		this.subtitle = subt;
	}
}

class PortfolioCarrousel {
	serial: number;
	slug: string;
	tokens: Array<CarrouselToken>;
	constructor(i?,s?){
		this.serial = i || 0;
		this.slug = s || '';
		this.tokens = [];
	}
}
