import { Component, Input, OnInit } from '@angular/core';
import { RecordCard } from '../recordcard.model';
import { Router } from '@angular/router';

import { gldef } from '../../develar-commons/develar.config';

const ALTERNATIVE_LOGO = 'assets/img/' + gldef.logoCompany2;


@Component({
  selector: 'top-branding',
  templateUrl: './top-branding.component.html',
  styleUrls: ['./top-branding.component.scss']
})
export class TopBrandingComponent implements OnInit {
	@Input() record: RecordCard;

  public nodes: Array<About> = [];

  public hasLogoAlt = false;
  public logoAltUrl = ALTERNATIVE_LOGO;

	public mainimage: string = "";
  public hasImage = false;

  public excerpt: string = "";
  public hasExcerpt = false;

  public linkTo: string = "";
  public hasLinkTo = false;
  public linkText: string = "";

  constructor(
    private router: Router){ }

  ngOnInit() {
  	this.record.relatedcards.forEach(s => {
  		this.nodes.push({
        title: s.slug,
  			imageUrl: s.mainimage,
        linkTo: s.linkTo,
        subtitle: s.subtitle,
  			description: s.description,
  		} as About)
  	});

    if(gldef.logoCompany2 && gldef.logoCompany2 !== gldef.logoCompany ){
      this.hasLogoAlt = true;
    }

    this.mainimage = this.record.mainimage;
    this.hasImage = this.mainimage ? true : false;

    if(this.nodes && this.nodes.length){

      this.excerpt = this.nodes[0].description;
      this.linkTo = this.nodes[0].linkTo;
      this.linkText = this.nodes[0].subtitle || 'Enviar';

      this.hasExcerpt = this.excerpt ? true : false;
      this.hasLinkTo = this.linkTo ? true : false;
    }

  }

  contactForm(e){
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/trabajan/info/contacto'])
  }

}

interface About {
	imageUrl: string;
	description: string;
  subtitle: string;
  linkTo: string;
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
