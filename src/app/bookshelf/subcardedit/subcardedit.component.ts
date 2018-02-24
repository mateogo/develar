import { Component, EventEmitter, OnInit, Input, Output} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { CustomValidators }  from 'ng2-validation';

import { SubCard, cardHelper }    from '../recordcard';
import { RecordCardService } from '../bookshelf.service';

function initForSave(form: FormGroup, model: SubCard): SubCard {
	const fvalue = form.value;

	const entity = model;
	entity.slug = fvalue.slug;
  entity.subtitle = fvalue.subtitle;
  entity.linkTo = fvalue.linkTo;
  entity.cardId = fvalue.cardId;
	entity.description = fvalue.description;
  entity.images = cardHelper.buildImageList(fvalue.images);
  entity.mainimage = fvalue.mainimage;
  entity.cardType = fvalue.cardType;
  entity.topic = fvalue.topic;
  entity.cardCategory = fvalue.cardCategory;

	return entity;
};

@Component({
  moduleId: module.id,
  selector: 'app-subcardedit',
  templateUrl: './subcardedit.component.html',
  styleUrls: ['./subcardedit.component.scss']
})
export class SubcardeditComponent implements OnInit {
	@Input() model: SubCard;
  @Output() addRelatedCard = new EventEmitter<SubCard>();
  @Output() cancelEdit = new EventEmitter<boolean>();

	private pageTitle: string = 'Edición de ficha';
	private modelId: string;
	public cardtypes = cardHelper.subcardTypes;
  public cardcategories = cardHelper.getSubcardCategies(this.cardtypes[1]);

  // valores default para el medium-editor para campo descripción
  public meContent: string = '';
  public mePlaceholder: string = 'Descripción';


	form: FormGroup;



  constructor(
  	private fb: FormBuilder
  	) {
			this.form = this.fb.group({
        cardId:      [null, Validators.compose([Validators.required])],
    		slug:        [null, Validators.compose([Validators.required])],
        subtitle:    [null, Validators.compose([Validators.required])],
        linkTo:      [null ],
    		cardType:    [null ],
        topic:       [null ],
        cardCategory:[null],
    		description: [null, Validators.compose([Validators.required])],
        mainimage:   [null ],
        images:      [null ]
  	  });
      const relatedcards = [cardHelper.initSubCard({slug: 'SUB CONTENIDO'})];
      this.form.setControl('relatedcards', this.fb.array(relatedcards.map(card => this.fb.group(card))));

  }

  ngOnInit() {
		this.form.reset({
	    cardId:       this.model.cardId,
		  slug:         this.model.slug,
	    subtitle:     this.model.subtitle,
      linkTo:       this.model.linkTo,
		  cardType:     this.model.cardType || "subficha",
	    topic:        this.model.topic || "general",
	    cardCategory: this.model.cardCategory || 'documento',
		  description:  this.model.description,
		  mainimage:    this.model.mainimage,
	    images:       cardHelper.buildImageString(this.model.images)
		});
    this.changeCardType(this.model.cardType);
  }

  onSubmit() {
    console.log('subcardEdit:onSubmit: BEGINS');
    this.model = initForSave(this.form, this.model);
    this.addRelatedCard.emit(this.model);
  }

  changeCardType(val){
    console.log('cartType CHANGED [%s]',val);
    this.cardcategories = cardHelper.getSubcardCategies(val)

  }

  cancelEditForm(){
    this.cancelEdit.emit(true);
  }

  descriptionUpdateContent(content){
    console.log("BUBBBBBLED: [%s]", content);
  }


}
