import { Component, OnInit, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
			template: [null],
    });

    this.templateList = cardHelper.templateList;
    this.scopeList = cardHelper.scopeList;

  }

  ngOnInit() {
    console.log('********* publish componente INIT: [%s]', this._model.slug);
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
    console.log('form reset: topicList: [%s]', this.topicList.length);

  	this.form.reset({
      slug: model.slug,
      scope: model.scope,
			toPublish: model.toPublish,
			dateFrom: this.fromTxt,
			dateTo: this.toTxt ,
			template: model.template
  	})

    if(model.toPublish) this._openEditor = true;
  }

  formSubmit(){
		let fvalue = this.form.value;
		this._model.slug = fvalue.slug;
		this._model.scope = fvalue.scope;
		this._model.toPublish = fvalue.toPublish;
		this._model.dateFrom = devutils.dateFromTx(fvalue.dateFrom).getTime();
		this._model.dateTo = devutils.dateFromTx(fvalue.dateTo).getTime();
 
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
    console.log('promoteData [%s] [%s]',this._model.slug, this._model.template );
    this.publishEmitter.next(this._model);
  }


  templateChange(tpl){
  	console.log('Select Change: [%s]', tpl)
  }
  scopeChange(scope){
  	console.log('Select scope change: [%s]', scope)
  }

  addTopicos(topics: Array<string>){
  	console.log('addTopicos: [%s]', topics.length)
    if(topics && topics.length){
      this.topicList = topics;
    }
  }

  publishChange(e){
    console.log('publish Change: [%s] [%s]', e, this.form.controls['toPublish'].value);
    this.openeditor = this.form.controls['toPublish'].value
  }

  dateRangeChange(){
    console.log('dateRangeChange:  [%s] to: [%s]', this.form.controls['dateFrom'].value, this.form.controls['dateTo'].value),
    this.toTxt = devutils.dateFromTx(this.form.controls['dateTo'].value).toString();
    this.fromTxt = devutils.dateFromTx(this.form.controls['dateFrom'].value).toString();

  }

}
