import { Component, Input, OnInit } from '@angular/core';
import { RecordCard } from '../recordcard.model';


@Component({
  selector: 'top-branding',
  templateUrl: './top-branding.component.html',
  styleUrls: ['./top-branding.component.scss']
})
export class TopBrandingComponent implements OnInit {
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



// main-image: http://develar.co:4200/download/5a7afe4940fa660c17b4d970
// background: http://develar.co:4200/download/5a7b00a240fa660c17b4d98a
// base azul para logo: http://develar.co:4200/download/5a7b295940fa660c17b4daab

// shadow DOM
//  http://robdodson.me/shadow-dom-css-cheat-sheet/

//using bacground
//  https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Backgrounds_and_Borders/Using_multiple_backgrounds
//  https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Backgrounds_and_Borders

//css reference
//https://developer.mozilla.org/en-US/docs/Web/CSS/

// absolut, relative, sticky ... position
//  https://developer.mozilla.org/en-US/docs/Web/CSS/position

// color value
// https://developer.mozilla.org/en-US/docs/Web/CSS/color_value

//https://fontawesome.com/how-to-use/upgrading-from-4
