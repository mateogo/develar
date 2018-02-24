import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute }   from '@angular/router';

import { RecordCardService } from '../bookshelf.service';
import { RecordCard, SubCard, cardHelper, ShowCards } from '../recordcard';

@Component({
  selector: 'app-showview',
  templateUrl: './showview.component.html',
  styleUrls: ['./showview.component.scss']
})
export class ShowviewComponent implements OnInit {
  private currentModelOffset = 0;
  public currentModelTitle: string;
	private currentCard: RecordCard;
  private currentRelatedCards: Array<SubCard>;
	public topics:Array<string>;

  private models: RecordCard[];
	private modelId: string;
	private model: RecordCard;
	public show: ShowCards;

  constructor(
  		private route: ActivatedRoute,
      private cardService: RecordCardService,
      private router: Router
  	) { }

  ngOnInit() {
    if(!this.model){
      this.fetchCurrentCard(this.route.snapshot.paramMap.get('id'));
    }else{
      this.initShow(this.model);
    }
  }

  fetchCards() {
    this.cardService.getRecordCards()
      .then(entities => {
        if(!entities)
          console.log('aiudddaaaa');
        else {
          this.models = entities;
        }
      })
      .catch(err => console.log(err));
  }

  fetchCurrentCard(id){
    this.modelId = id;
    this.cardService.getRecordCard(this.modelId)
      .then(entity => {
        if(!entity)
          console.log('aiudddaaaa');
        else {
          this.model = entity
    			this.initShow(this.model);
        }
      })
      .catch(err => console.log(err));
  }

  goToBrowse(){
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  initShow(model: RecordCard){
  	this.show = cardHelper.buildShowFromModel(model);
  	this.show.initTopicShow(this.show.topicNames[0]);

  	this.currentModelTitle = this.show.openingcard.slug;
  	this.currentCard = this.show.openingcard;
    this.currentRelatedCards = this.currentCard.relatedcards;
  	this.topics = this.show.topicNames;
  }

  showNextCard(e){
    e.preventDefault();
    this.currentCard = this.show.getNextCard();
    this.currentRelatedCards = this.currentCard.relatedcards;
  }

  showPreviousCard(e){
    e.preventDefault();
    this.currentCard = this.show.getPreviousCard();
    this.currentRelatedCards = this.currentCard.relatedcards;
  }

  open(event) {
    let clickedComponent = event.target.closest('.nav-item');
    let items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
    clickedComponent.classList.add('opened');
  }

  close(event) {
    let clickedComponent = event.target.closest('.nav-item');
    let items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
  }
  changeTopic(event, topic){
  	this.close(event);
  	this.show.initTopicShow(topic);
  	this.currentModelTitle = this.show.card.slug;
  	this.currentCard = this.show.card;
    this.currentRelatedCards = this.currentCard.relatedcards;

  }

}
