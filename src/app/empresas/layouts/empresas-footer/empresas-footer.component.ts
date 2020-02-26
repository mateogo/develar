import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { RecordCard, SubCard } from '../../../site-minimal/recordcard.model';
import { MinimalMenuService } from '../../../site-minimal/minimal-menu.service';

import { EmpresasController } from '../../empresas.controller';

import { gldef } from '../../../develar-commons/develar.config';

const BRANDING = 'branding';
const FOOTER = 'footer';


@Component({
  selector: 'empresas-footer',
  templateUrl: './empresas-footer.component.html',
  styleUrls: ['./empresas-footer.component.scss']
})
export class EmpresasFooterComponent implements OnInit {
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

  private unBindList = [];
  public isFooter = false;
  public footer: RecordCard;



  constructor(
    private mainMenuService: MinimalMenuService,
    private route: ActivatedRoute,
    private minimalCtrl: EmpresasController,
    private router: Router) {

        mainMenuService.socialListener$.subscribe(
          items => {
            this.socialItems = items;
          }
       );

     }

  ngOnInit() {
    this.fetchFooterRecords();

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

  	this.sortProperly(this.record.relatedcards).forEach(s => {
      let link:string , navigate:string , noLink = false, isFooter = true, isBranding = false;

      if(s.description === "<p><br></p>") s.description = "";

      if(s.mainimage){
        noLink = true;
      }

      if(s.linkTo){
        noLink = false;

        if(s.linkTo.indexOf('http') === -1){
          navigate = s.linkTo;
        }else{
          link = s.linkTo;
        }
      }

      if(s.topic == BRANDING && s.cardId !== 'no-print'){
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


      }else if (s.topic == FOOTER && s.cardId !== 'no-print'){
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



      } else if (s.cardId !== 'no-print') {
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

  sortProperly(records: SubCard[]){
    records.sort((fel, sel)=> {
      if(!fel.cardId) fel.cardId = "zzzzzzz";
      if(!sel.cardId) sel.cardId = "zzzzzzz";

      if(fel.cardId < sel.cardId) return -1;
      else if(fel.cardId > sel.cardId) return 1;
      else return 0;
    })
    return records;


  }

  private fetchFooterRecords(){
    let sscrp1 = this.minimalCtrl.fetchFooterRecords().subscribe(records => {
      this.renderFooter(records);
    });

    this.unBindList.push(sscrp1);
  }

  renderFooter(records: RecordCard[]){
    if(records && records.length){
      this.footer = records[0];
      this.isFooter = true
    }
  }


}


interface MainMenuItem {
  title:        string;
  icon:         string;
  active:       boolean;
  groupTitle:   boolean;
  sub:          any;
  routing:      string;
  externalLink: string;
  budge:        string
  budgeColor:   string;
}

interface SocialMediaItem {
  title: string;
  icon: string;
  url: string;
  
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