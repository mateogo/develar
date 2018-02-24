import { Component, Input, OnInit } from '@angular/core';
import { RecordCard } from '../recordcard.model';


@Component({
  selector: 'destacado',
  templateUrl: './destacado.component.html',
  styleUrls: ['./destacado.component.scss']
})
export class DestacadoComponent implements OnInit {
	@Input() record: RecordCard;

	public mainimage: string = "";
	public nodes: Array<About> = [];

  constructor() { }

  ngOnInit() {
  	console.log('destacado INIT BEGIN: [%s] [%s]', this.record.cardCategory, this.record.slug);
  	this.mainimage = this.record.mainimage;
  	this.record.relatedcards.forEach(s => {
  		this.nodes.push({
        title: s.slug,
  			imageUrl: s.mainimage,
  			description: s.description,
  		} as About)
  	})
  }

}
interface About {
	imageUrl: string;
	description: string;
  title: string;
}