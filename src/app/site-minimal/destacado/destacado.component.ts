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
	public nodes: Array<Destacado> = [];

  constructor() { }

  ngOnInit() {
  	this.mainimage = this.record.mainimage;
  	this.record.relatedcards.forEach(s => {
  		this.nodes.push({
        title: s.slug,
  			imageUrl: s.mainimage,
  			description: s.description,
        url: s.linkTo
  		} as Destacado)
  	})
  }

}
interface Destacado {
	imageUrl: string;
	description: string;
  url: string;
  title: string;
}