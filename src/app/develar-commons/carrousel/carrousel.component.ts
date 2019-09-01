import { Component, OnInit, Input } from '@angular/core';

const DEFAULT_IMAGE_URL_BASE = "assets/content/";
const DEFAULT_IMAGE_URL_ARRAY = ['card-1.jpg', 'card-2.jpg', 'card-3.jpg'];
const DEFAULT_MAIN = DEFAULT_IMAGE_URL_BASE + DEFAULT_IMAGE_URL_ARRAY[0];

class Carrousel {
	slug: string = "Carrousel";
	mainimage: string = DEFAULT_MAIN;	
	images:  Array<string> = [];
	start: number = 0;
}


@Component({
  selector: 'app-carrousel',
  templateUrl: './carrousel.component.html',
  styleUrls: ['./carrousel.component.scss']
})
export class CarrouselComponent implements OnInit {
	@Input() 
	set carrousel(data: Carrousel){
		this.carrouselHandler.setCarrousel(data);
		this.currentImage = this.carrouselHandler.currentImg;
	}
	get carrousel(): Carrousel {
		return this.carrouselHandler.carrousel;
	}

	@Input() currentImage: string;

	private carrouselHandler: CarrouselHandler;

  constructor() {
  	this. carrouselHandler = new CarrouselHandler(new Carrousel());
  }

	hasMainImage(){
		return this.carrouselHandler.hasMainImage();
	}

	hasCarrousel(){
		return this.carrouselHandler.hasCarrousel();
	}

	showNextImage(e){
		e.preventDefault();
		this.currentImage = this.carrouselHandler.getNextImage();
	}

	showPreviousImage(e){
		e.preventDefault();
		this.currentImage = this.carrouselHandler.getPreviousImage();
	}

  ngOnInit() {
  }
}

export class CarrouselHandler {
	carrousel: Carrousel;

	ilength: number = 0;
	currentIndex: number = 0;
	currentImg: string = "";

	scroll: boolean = true;

	hasMainImage(){
		return (this.carrousel.mainimage || this.ilength) ? true : false;
	}

	hasCarrousel(){
		return this.ilength > 1 ? true : false;
	}

	getNextImage(){
		if(this.currentIndex + 1 < this.ilength){
			this.currentIndex += 1;

		}else if(this.scroll){
			this.currentIndex = 0;
		}

		this.currentImg = this.carrousel.images[this.currentIndex];
		return this.currentImg;
	}

	getPreviousImage(){
		if(this.currentIndex - 1 >= 0){
			this.currentIndex -= 1;

		}else if(this.scroll){
			this.currentIndex = this.ilength - 1;
		}

		this.currentImg = this.carrousel.images[this.currentIndex];
		return this.currentImg;
	}

	initCarrousel(){
		this.currentIndex = this.carrousel.start;
		this.ilength = this.carrousel.images.length;
		if(this.ilength) this.currentImg = this.carrousel.images[this.currentIndex];
		else this.currentImg = this.carrousel.mainimage;
	}

	setCarrousel(carrousel: Carrousel){
		if(!carrousel) carrousel = new Carrousel();
		this.carrousel = carrousel;
		this.initCarrousel();
	}

	constructor(carrousel: Carrousel){
		this.setCarrousel(carrousel);
	}
}
