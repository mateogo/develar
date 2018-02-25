import { Component, Input, OnInit } from '@angular/core';
import { RecordCard } from '../recordcard.model';


@Component({
  selector: 'top-servicios',
  templateUrl: './top-servicios.component.html',
  styleUrls: ['./top-servicios.component.scss']
})
export class TopServiciosComponent implements OnInit {
	@Input() record: RecordCard;

	public mainimage: string = "";
	public title: string = "";
	public description: string = "";
	public nodes: Array<Servicios> = [];

  constructor() { }

  ngOnInit() {
  	console.log('destacado INIT BEGIN: [%s] [%s]', this.record.cardCategory, this.record.slug);

  	this.title = this.record.slug;
  	this.description = this.record.description;
  	this.mainimage = this.record.mainimage;

  	this.record.relatedcards.forEach(s => {
  		this.nodes.push({
        title: s.slug,
  			imageUrl: s.mainimage,
  			description: s.description,
        linkTo: s.linkTo || "#",
  		} as Servicios)
  	})
  }

}
interface Servicios {
	imageUrl: string;
	description: string;
  title: string;
  linkTo: string;
}

/***
benchmarking
http://develar.co:4200/download/5a7e2f54ca280f07c28bc34b

branding
http://develar.co:4200/download/5a7e2f54ca280f07c28bc34e

com corp
http://develar.co:4200/download/5a7e2f54ca280f07c28bc351

estrat medios
http://develar.co:4200/download/5a7e2f54ca280f07c28bc354

estrat relacion
http://develar.co:4200/download/5a7e2f55ca280f07c28bc357

estrategia susten
http://develar.co:4200/download/5a7e2f55ca280f07c28bc35a

marketing
http://develar.co:4200/download/5a7e2f55ca280f07c28bc35d

social media
http://develar.co:4200/download/5a7e2f55ca280f07c28bc360



*/

