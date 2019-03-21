import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { RecordCard } from '../recordcard.model';

import { MainMenuItem, SocialMediaItem } from '../menu-helper';
import { MinimalMenuService } from '../minimal-menu.service';
import { gldef } from '../../develar-commons/develar.config';

const BRANDING = 'branding';
const FOOTER = 'footer';


@Component({
  selector: 'top-footer',
  templateUrl: './top-footer.component.html',
  styleUrls: ['./top-footer.component.scss']
})
export class TopFooterComponent implements OnInit {
	@Input() record: RecordCard;

	public mainimage: string = "";
	public bnodes: Array<Footer> = [];
  public fnodes: Array<Footer> = [];
  
  public isModoUNO = false;
  public isModoDOS = true;
  public socialItems: SocialMediaItem[];


  private hasActiveUrlPath = false;
  private actualUrl = "";
  private navigationUrl = "";

  public isHomeView = false;


  constructor(
    private mainMenuService: MinimalMenuService,
    private route: ActivatedRoute,
    private router: Router) {

        mainMenuService.socialListener$.subscribe(
          items => {
            this.socialItems = items;
          }
       );

     }

  ngOnInit() {

    this.route.url.subscribe(url=> {

      this.actualUrl = this.router.routerState.snapshot.url;
      this.actualUrl = this.actualUrl ? this.actualUrl.split('?')[0] : this.actualUrl;

      if(!this.actualUrl || this.actualUrl === "/"){
        this.setupHomeView(true);

      } else {
        this.setupHomeView(false);

      }

    });



  	this.mainimage = this.record.mainimage;

    this.mainMenuService.loadSocialItems(gldef.socialmedia)

  	this.record.relatedcards.forEach(s => {
      let link:string , navigate:string , noLink = true, isFooter = true, isBranding = false;

      if(s.description === "<p><br></p>") s.description = "";

      if(s.linkTo){
        noLink = false;

        if(s.linkTo.indexOf('http') === -1){
          navigate = s.linkTo;
        }else{
          link = s.linkTo;
        }
      }

      if(s.topic == BRANDING){
        console.log('isBranding')
        isBranding = true;
        isFooter = false;
        this.bnodes.push({
          imageUrl: s.mainimage,
          description: s.description,
          linkTo: link,
          type: s.topic,
          isBranding: isBranding,
          isFooter: isFooter,
          navigateTo: navigate,
          noLink: noLink,
          hasImage: !(s.mainimage === "")
        } as Footer)


      }else if (s.topic == FOOTER){
        console.log('isFOOTER')
        isBranding = false;
        isFooter = true;

        this.fnodes.push({
          imageUrl: s.mainimage,
          description: s.description,
          linkTo: link,
          type: s.topic,
          isBranding: isBranding,
          isFooter: isFooter,
          navigateTo: navigate,
          noLink: noLink,
          hasImage: !(s.mainimage === "")
        } as Footer)



      }else{
        this.fnodes.push({
          imageUrl: s.mainimage,
          description: s.description,
          linkTo: link,
          type: s.topic,
          isBranding: isBranding,
          isFooter: isFooter,
          navigateTo: navigate,
          noLink: noLink,
          hasImage: !(s.mainimage === "")
        } as Footer)

      }


  	})
  }

  setupHomeView(isHome){
    if(isHome){
      this.isHomeView = true;

    }else{
      this.isHomeView = false;
    }

  }


}

interface Footer {
	imageUrl: string;
	description: string;
  type: string;
  linkTo: string;
  navigateTo: string;
  noLink: boolean;
  isBranding: boolean;
  isFooter: boolean;
  hasImage: boolean;
}