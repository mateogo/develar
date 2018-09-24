import { Component, Input, OnInit } from '@angular/core';
import { RecordCard } from '../recordcard.model';


@Component({
  selector: 'top-footer',
  templateUrl: './top-footer.component.html',
  styleUrls: ['./top-footer.component.scss']
})
export class TopFooterComponent implements OnInit {
	@Input() record: RecordCard;

	public mainimage: string = "";
	public nodes: Array<Footer> = [];

  constructor() { }

  ngOnInit() {
  	this.mainimage = this.record.mainimage;
  	this.record.relatedcards.forEach(s => {
      let link:string , navigate:string , noLink = true;

      if(s.linkTo){
        noLink = false;

        if(s.linkTo.indexOf('http') === -1){
          navigate = s.linkTo;
        }else{
          link = s.linkTo;
        }
      }

  		this.nodes.push({
        imageUrl: s.mainimage,
        description: s.description,
        linkTo: link,
        navigateTo: navigate,
        noLink: noLink,
        hasImage: !(s.mainimage === "")
  		} as Footer)
  	})
  }
}

interface Footer {
	imageUrl: string;
	description: string;
  linkTo: string;
  navigateTo: string;
  noLink: boolean;
  hasImage: boolean;
}