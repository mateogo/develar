import { Component, Input, OnInit } from '@angular/core';
import { RecordCard } from '../recordcard.model';


@Component({
  selector: 'top-aboutlr',
  templateUrl: './top-aboutlr.component.html',
  styleUrls: ['./top-aboutlr.component.scss']
})
export class TopAboutlrComponent implements OnInit {
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
