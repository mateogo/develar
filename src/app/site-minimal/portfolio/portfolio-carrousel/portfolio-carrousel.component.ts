import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


import { Subject } from 'rxjs';

@Component({
  selector: 'portfolio-carrousel',
  templateUrl: './portfolio-carrousel.component.html',
  styleUrls: ['./portfolio-carrousel.component.scss'],
  animations: [
    trigger('heroState', [
      state('inactive', style({
        backgroundColor: '#eee',
        transform: 'scale(1)'
      })),
      state('active',   style({
        backgroundColor: '#cfd8dc',
        transform: 'scale(1.1)'
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ]),
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate(500)
      ]),
      transition('* => void', [
        animate(500, style({transform: 'translateX(100%)'}))
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

  public tokens: Array<CarrouselToken> = [];
  public interval: Subject<boolean> = new Subject();

  public refresh = 0;
  public page = 0;
  private intervalId;

  public trState = {state: 'inactive'};
  public flyState = {state: 'void'};
  public blockState = {state: 'void'};




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
      this.blockState.state = "in";
      this.page = this.page === this.carrouseles.length-1 ? 0 : this.page + 1;
      this.refresh  += 1;
    }

  }

}




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
