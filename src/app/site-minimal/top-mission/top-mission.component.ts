import { Component, Input, OnInit } from '@angular/core';
import { RecordCard } from '../recordcard.model';

@Component({
  selector: 'top-mission',
  templateUrl: './top-mission.component.html',
  styleUrls: ['./top-mission.component.scss']
})
export class TopMissionComponent implements OnInit {
	@Input() record: RecordCard;

  public mainimage: string = "";
  public nodes: Array<Mission> = [];
  public title: string = "";
  public slugStyle = [
    {
      'background-color': '#0645f5'
    },
    {
      'background-color': '#0bc869'
    },
  ]
  public textStyle = [
    {
      'color': '#0645f5'
    },
    {
      'color': '#0bc869'
    },
  ]


  constructor() { }

  ngOnInit() {
    this.title = this.record.excerpt;
  	this.mainimage = this.record.mainimage;
  	this.record.relatedcards.forEach(s => {
  		this.nodes.push({
  			imageUrl: s.mainimage,
  			slug: s.slug,
  			description: s.description,
  		} as Mission)
  	})
  }

}
interface Mission {
	imageUrl: string;
	slug: string
	description: string;
}