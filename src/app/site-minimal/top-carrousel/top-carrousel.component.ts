import { Component, Input, OnInit } from '@angular/core';
import { RecordCard } from '../recordcard.model';


@Component({
  selector: 'top-carrousel',
  templateUrl: './top-carrousel.component.html',
  styleUrls: ['./top-carrousel.component.scss']
})
export class TopCarrouselComponent implements OnInit {
	@Input() record: RecordCard;

	public mainimage: string = "";
	public nodes: Array<About> = [];

  constructor() { }

  ngOnInit() {
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
