import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { SubCard, cardHelper }    from '../recordcard';
import { RecordCardService } from '../bookshelf.service';

@Component({
  selector: 'app-subcardview',
  templateUrl: './subcardview.component.html',
  styleUrls: ['./subcardview.component.scss']
})
export class SubcardviewComponent implements OnInit {
	@Input() model: SubCard;
  @Output() editRelatedCard = new EventEmitter<SubCard>();
  @Output() promoteRelatedCard = new EventEmitter<SubCard>();

  public openSubCardEditor = false;

  constructor() { }

  ngOnInit() {
  }

  editSubcard(e){
  	e.preventDefault();
  	console.log('SubCardView:editSubcard: [%s]', this.model.slug);
    this.openSubCardEditor = true;
  }

  promoteSubcard(e){
  	e.preventDefault();
  	console.log('SubCardView:promoteSubcard: [%s]', this.model.slug);
    this.promoteRelatedCard.emit(this.model);
  }

  cancelEdit(){
    this.openSubCardEditor = false;
  }

  addRelatedCard(smodel:SubCard){
    console.log('subCardView:addRelatedCard [%s]', (this.model === smodel));
    this.editRelatedCard.emit(smodel);
    this.openSubCardEditor = false;
    // smodel.carrousel = cardHelper.buildCarrousel(smodel.slug, smodel, 0);
    // this.openSubCardEditor = false;
    // this.relatedcards.push(smodel);
    // this.showrelatedcards = true;

  }




}
