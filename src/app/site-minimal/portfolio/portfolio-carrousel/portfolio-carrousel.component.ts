import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { Subject } from 'rxjs';

const PANEL_HIDDEN = "hidden";
const PANEL_VISIBLE = "visible";

@Component({
  selector: 'portfolio-carrousel',
  templateUrl: './portfolio-carrousel.component.html',
  styleUrls: ['./portfolio-carrousel.component.scss'],
  animations: [
    trigger('zoomOut', [
      state('inactive', style({
        backgroundColor: '#eee',
        transform: 'scale(1)'
      })),
      state('active',   style({
        backgroundColor: '#cfd8dc',
        transform: 'scale(1.1)'
      })),
      transition('inactive => active', animate('400ms ease-in')),
      transition('active => inactive', animate('400ms ease-out'))
    ]),
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      state('void', style({transform: 'translateX(0)'})),
      transition('void => in', [
        style({transform: 'translateX(100%)'}),
        animate(800)
      ])
    ]),
    trigger('blockIn', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate(500)
      ])
    ])
  ]
})
export class PortfolioCarrouselComponent implements OnInit {
	@Input() carrouseles: Array<PortfolioCarrousel> = [];
  private cRows = 2;
  private cCol = 3;
  private cLimit = 6;

  public displayStyle = { "visibility": PANEL_VISIBLE};
  public transitionStyle = { "visibility": PANEL_HIDDEN};

  public tokens: Array<CarrouselToken> = [];
  public interval: Subject<boolean> = new Subject();

  public refresh = 0;
  public page = 0;
  private intervalId;

  public trState = {state: 'inactive'};
  public flyState = {state: 'void'};
  public blockState = {state: 'void'};
  public fly = false;




  constructor() { }

  ngOnInit() {

    this.interval.subscribe(tic => {

      this.showToken();
    })

    this.render(this.interval);
  }


  render(interval: Subject<boolean>){
    this.showToken();
    //interval.next(true);
    this.intervalId = setInterval(function(){
      interval.next(true);
    }, 5000);
  }

  showToken(){
    this.tokens = this.carrouseles[this.page].tokens;

    if(this.tokens && this.tokens.length){
      this.page = this.page === this.carrouseles.length-1 ? 0 : this.page + 1;      
    }
    this.refresh += 1;

    setTimeout(() => {
      this.fly = true;

      setTimeout(() => {
        this.fly = false;

      }, 900)

    }, 100)
  }

}

      // this.displayStyle = { "visibility": PANEL_VISIBLE};
      // this.transitionStyle = { "visibility": PANEL_HIDDEN};
      // this.refresh  = 1;
      // this.trState.state = 'active'

      // setTimeout(() => {
      //   this.trState.state = 'inactive';

      // }, 700)



class CarrouselToken {
	imgUrl: string;
	target: string;
	slug: string;
	subtitle: string;
	constructor(url, target,slug, subt){
		this.imgUrl = url;
		this.target = target;
		this.slug = slug;
		this.subtitle = subt;
	}
}

class PortfolioCarrousel {
	serial: number;
	slug: string;
	tokens: Array<CarrouselToken>;
	constructor(i?,s?){
		this.serial = i || 0;
		this.slug = s || '';
		this.tokens = [];
	}
}
