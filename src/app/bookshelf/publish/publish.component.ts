import { Component, OnInit, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Subject ,  Observable ,  BehaviorSubject } from 'rxjs';

import { devutils } from '../../develar-commons/utils';
import { PublicationConfig, cardHelper }    from '../recordcard';

@Component({
  selector: 'publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {
  @Input()
  set model(entity: PublicationConfig){
    this._model = entity;
  }
  get model(){
  	this.formSubmit()
    return this._model;
  }

  @Input()
    set openeditor(val){ this._openEditor = val;}
    get openeditor(){ return this._openEditor;}

  @Output() publishEmitter = new EventEmitter<PublicationConfig>();

  private _model: PublicationConfig;

	public form: FormGroup;
  public _openEditor: boolean = false;

  private templateList = [];
  private topicList:Array<string>;

  private scopeList = [];
  private scopes = [];

  private destaqueList = [];
  private destaques = [];

  private fromTxt: string = "";
  private toTxt: string = "";

  @HostListener('mouseleave') onMouseLeave() {
      this.promoteData();
  }

  @HostListener('blur') onBlur() {
      this.promoteData();
  }

  constructor(
  	private fb: FormBuilder,
  	) { 

    this.form = this.fb.group({
      slug:    [null],
			scope: [null,   Validators.compose([Validators.required])],
			toPublish: [null,   Validators.compose([Validators.required])],
			dateFrom: [null,   Validators.compose([Validators.required])],
			dateTo: [null,   Validators.compose([Validators.required])],
      destaque: [null],
      publishOrder: [null],
			template: [null],
    });

    this.templateList = cardHelper.templateList;
    this.scopeList = cardHelper.scopeList;
    this.destaqueList = cardHelper.destaqueList;

  }

  ngOnInit() {
    //console.log('********* publish componente INIT: [%s]', this._model.slug);
  	this._model = cardHelper.buildPublishToken(this._model)

  	this.formReset(this._model);

  }

  formReset(model:PublicationConfig){
  	//console.dir(model);
    this.toTxt = devutils.txFromDate(new Date(model.dateTo));
    this.fromTxt = devutils.txFromDate(new Date(model.dateFrom));

    if(model.topics && model.topics.length){
      this.topicList = model.topics;

    }else{
      this.topicList = [];
    }
    //console.log('form reset: topicList: [%s]', this.topicList.length);

  	this.form.reset({
      slug: model.slug,
      scope: model.scope,
			toPublish: model.toPublish,
      destaque: model.destaque,
			dateFrom: this.fromTxt,
			dateTo: this.toTxt ,
      publishOrder: model.publishOrder,
			template: model.template
  	})

    if(model.toPublish) this._openEditor = true;
  }

  formSubmit(){
		let fvalue = this.form.value;
		this._model.slug = fvalue.slug;
		this._model.scope = fvalue.scope;
		this._model.toPublish = fvalue.toPublish;
    this._model.destaque = fvalue.destaque;
    this._model.publishOrder = fvalue.publishOrder;

    let dateFrom = devutils.dateFromTx(fvalue.dateFrom);
    let dateTo = devutils.dateFromTx(fvalue.dateTo);

		this._model.dateFrom = dateFrom ? dateFrom.getTime() : 0
		this._model.dateTo = dateTo ? dateTo.getTime() : 0
 
		this._model.topics = this.topicList;
		this._model.template = fvalue.template;
		return this._model;
  }

  editCancel(){
    this._openEditor = false;
  }

	onSubmit(){
		console.log('onSubmit');
	}

  // ****** PROMOTE ******************
  promoteData(){
    this._model = this.formSubmit();
    //console.log('promoteData [%s] [%s]',this._model.slug, this._model.template );
    this.publishEmitter.next(this._model);
  }


  templateChange(tpl){
  	//console.log('Select Change: [%s]', tpl)
  }

  scopeChange(scope){
  	//console.log('Select scope change: [%s]', scope)
  }

  destaqueChange(scope){
    //console.log('Select scope change: [%s]', scope)
  }

  addTopicos(topics: Array<string>){
  	//console.log('addTopicos: [%s]', topics.length)
    if(topics && topics.length){
      this.topicList = topics;
    }
  }

  publishChange(e){
    //console.log('publish Change: [%s] [%s]', e, this.form.controls['toPublish'].value);
    this.openeditor = this.form.controls['toPublish'].value
  }

  dateRangeChange(){
    //console.log('dateRangeChange:  [%s] to: [%s]', this.form.controls['dateFrom'].value, this.form.controls['dateTo'].value);
    let dateFrom = devutils.dateFromTx(this.form.controls['dateFrom'].value);
    let dateTo = devutils.dateFromTx(this.form.controls['dateTo'].value);

    this.fromTxt = dateFrom ? dateFrom.toString() : 'Desde Inválida ';
    this.toTxt =   dateTo ?   dateTo.toString() :   'Hasta: Inválida ';
  }

}
