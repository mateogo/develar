import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';

import { RecordCardService } from '../bookshelf.service';

import { CardGraph, graphUtilities }       from '../cardgraph.helper';
import { RecordCard, SubCard, cardHelper } from '../recordcard';
import { NotePiece } from '../../develar-commons/noteeditor/note-model';

import { gldef } from '../../develar-commons/develar.config';

const BROWSE = 'lista';

@Component({
  selector: 'cardnoteeditor',
  templateUrl: './cardnoteeditor.component.html',
  styleUrls: ['./cardnoteeditor.component.scss']
})
export class CardnoteeditorComponent implements OnInit {
	@Input() customalign: string = 'center';
  @Input() title: string;
  @Input() isAdmin = false;

  public content: Array<NotePiece>;

  private currentModel: RecordCard;
  public currentSubcardList;

  @Input()
  set model(entity: RecordCard){
    entity.carrousel = cardHelper.buildCarrousel(entity.slug, entity, 0);
    this.currentModel = entity;
  }
  get model(){
    return this.currentModel;
  }

  @Input()
  set relatedcards(models: SubCard[]){
    console.log('Set SubCard models:[%s]', models.length);
    this.initSubCardData(models);
    this.currentSubcardList = models;
  }
  get relatedcards(){
    return this.currentSubcardList;
  }

  // ver modelinteraction
  
	private modelId: string;
	//private model: RecordCard;
  private models: RecordCard[];
  private personList: CardGraph[];
  private tagList: Array<string>;
  public openEditor = false;


  constructor(
  		private route: ActivatedRoute,
      private cardService: RecordCardService,
      private router: Router
  	) {

  }

  fetchCurrentCard(id){
    console.log('unicardview fetchcurrentcard: [%s]', id)

    this.modelId = id;
    this.cardService.getRecordCard(this.modelId)
      .then(entity => {
        if(!entity)
          console.log('aiudddaaaa');
        else {
          entity.carrousel = cardHelper.buildCarrousel(entity.slug, entity, 0);
          this.initCardData(entity);
          this.model = entity
        }
      })
      .catch(err => console.log(err));
  }

  ngOnInit() {
    if(!this.model){
      this.fetchCurrentCard(this.route.snapshot.paramMap.get('id'));
    }else{
      this.initCardData(this.model);
    }
  }

  initCardData(entity: RecordCard){
    //this.currentSubcardList = cardHelper.buildRelatedCards(entity);
    //this.initSubCardData(this.currentSubcardList );
    this.modelId = entity._id;
    this.currentSubcardList = entity.relatedcards;

    entity.carrousel = cardHelper.buildCarrousel(entity.slug, entity, 0);
    //this.editContent();

  }

  initSubCardData(smodels: SubCard[]){
    console.log("INIT-sub-CARD-DATA [%s]", smodels.length);
    smodels.forEach(card => {
      card.carrousel = cardHelper.buildCarrousel(card.slug, card, 0);
    });
  }

  goToBrowse(){
    //this.router.navigate(['./' ], {relativeTo: this.route});
    this.router.navigate(['/develar/fichas' ]);
  }

  goToDetail(){
    this.router.navigate(['./', this.modelId ], {relativeTo: this.route});
  }
  editCard(){
    this.router.navigate(['/develar/fichas/editar', this.modelId]);
  }

  editContent(){
    this.content = cardHelper.buildRecordcardDescriptor(this.model);
    this.openEditor = true;
  }

}

