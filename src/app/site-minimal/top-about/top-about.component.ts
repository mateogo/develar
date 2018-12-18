import { Component, Input, OnInit } from '@angular/core';
import { RecordCard } from '../recordcard.model';


@Component({
  selector: 'top-about',
  templateUrl: './top-about.component.html',
  styleUrls: ['./top-about.component.scss']
})
export class TopAboutComponent implements OnInit {
	@Input() record: RecordCard;

  public mainimage: string = "";
  public nodes: Array<About> = [];
  public title: string = "";

  constructor() { }

  ngOnInit() {
    this.title = this.record.slug;
  	this.mainimage = this.record.mainimage;
  	this.record.relatedcards.forEach(s => {
  		this.nodes.push({
  			imageUrl: s.mainimage,
  			description: s.description,
  		} as About)
  	})
  }

}
interface About {
	imageUrl: string;
	description: string;
}