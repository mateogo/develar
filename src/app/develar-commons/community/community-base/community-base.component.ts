import { Component, OnInit, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Community, CommunityBase, communityModel }    from '../community.model';
import { CommunityController }    from '../community.controller';

import { Observable ,  Subject, of }        from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap }   from 'rxjs/operators';

function fetchData(form: FormGroup, model: CommunityBase, tags: Array<string>): CommunityBase {
	const fvalue = form.value;

  model.code   = fvalue.code;
  model.name   = fvalue.name;
  model.displayAs = fvalue.displayAs;
  model.slug    = fvalue.slug;
  model.urlpath = fvalue.urlpath;

  model.eclass  = fvalue.eclass;
  model.etype   = fvalue.etype;
  model.description = fvalue.description;
  model.taglist = tags;
	return model;
};

@Component({
  selector: 'community-base',
  templateUrl: './community-base.component.html',
  styleUrls: ['./community-base.component.scss']
})
export class CommunityBaseComponent implements OnInit {
	@Input()
		get entityBase(){
			return this.entityModel;
		}
		set entityBase(token){
			this.entityModel = token;
      this.tags = token.taglist;
		}
  @Input()
    get openeditor(){ return this._openEditor;}
    set openeditor(val){ this._openEditor = val;}
  @Input() entityId;
  @Input() entityName;
  @Input() editable: boolean = true;

  @Output() updateEntity = new EventEmitter<Community>();

	pageTitle: string = 'Datos básicos producto';


	public form: FormGroup;


  private _modelSbscrptn;

  public _openEditor = false;
  // text editor 
  public meContent: string = '';
  public mePlaceholder: string = 'Descripción';

  private status = false;

  // Passed by component injection
  private entityModel: CommunityBase;

  // Internal component model
  private communityBase: CommunityBase;

  private tags = [];
  
  private classOptionList = [];
  private typeOptionList = [];

  private searchTerms = new Subject<string>();
  public fetchedEntities: Observable<Community[]>;


	private community: Community;
  private communityId: string;
  private communityEditList: Community[];
  public communitySlug = "";




  @HostListener('mouseleave') onMouseLeave() {
      this.promoteData();
  }

  @HostListener('blur') onBlur() {
      this.promoteData();
  }

  constructor(
  	private fb: FormBuilder,
    private communityCtrl: CommunityController
  	) { 
    this.form = this.fb.group({
      code:        [null,  Validators.compose([Validators.required])],
      name:        [null,  Validators.compose([Validators.required])],
      slug:        [null,  Validators.compose([Validators.required])],
      urlpath:     [null,  Validators.compose([Validators.required])],
      displayAs:   [null,  Validators.compose([Validators.required])],
      eclass:      [null,  Validators.compose([Validators.required])],
      etype:       [null],
      description: [null],
    });
  }

  ngOnInit() {
    this.classOptionList = communityModel.getClassList();
    this.typeOptionList  = communityModel.getTypeList(this.classOptionList[0]);

    // possible passed throught @input()
    this.communityBase = this.entityBase;
    this.communityId = this.entityId;
    this.communitySlug = this.entityName;

    this._modelSbscrptn = this.communityCtrl.modelListener.subscribe(entity =>{
      this.initComponentData(entity);
    })

    this.communityCtrl.initController(this.community, this.entityId);


    this.fetchedEntities = this.searchTerms

      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(t => t && t.length >2 && !(/[^a-z0-9,ñ\s]+/ig.test(t))),
        switchMap(term => this.communityCtrl.searchBySlug(term))
      );


      // .debounceTime(300)
      // .distinctUntilChanged()
      // .switchMap(term => term
      //   ? this.communityCtrl.searchBySlug(term)
      //   : Observable.of<Community[]>([]))
      // .catch(error => {
      //   return Observable.of<Community[]>([]);
      // });
  }

  initComponentData(entity: Community){
		this.community = entity;
		this.communityId = entity._id;

		this.communityBase = this.communityCtrl.basicData;
		this.communitySlug = this.communityBase.slug || this.entityName;
		this.setTypeOptionList(this.communityBase.eclass);
    this.tags = this.communityBase.taglist;

		this.updateEntity.emit(this.community);

		this.formReset(this.communityBase);
  }

  formReset(model){
    this.form.reset({
      code:      model.code,
      name:      model.name,
      slug:      model.slug,
      urlpath:   model.urlpath,
      displayAs: model.displayAs,
      etype:     model.etype,
      eclass:    model.eclass,
      description: model.description,
    })
  }

  /*********  SAVE & ?? **********/
  save(target:string){
    this.promoteData();
    this.communityCtrl.saveRecord().then(model =>{
      this.continueEditing(model);
    })
  }

  continueEditing(model){
    this.communityCtrl.initController(model, model._id);
  }
  
  saveNew(target){
    this.promoteData();
    this.communityCtrl.cloneItemRecord().then(model =>{
      this.continueEditing(model);
    });
  }




  // ****** PROMOTE ******************
  promoteData(){
    this.communityBase = fetchData(this.form, this.communityBase, this.tags);
  }
  // ******  END PROMOTE ******************


  search(term){
    this.searchTerms.next(term)
  }

  selectEntity(token){
    if(token){
      this.communityCtrl.initController(token, token._id);
    }
  }

  addTags(tags){
    this.communityBase.taglist = tags;
    this.tags = tags;
  }

  editToken(){
    if(this._openEditor){
      this.promoteData();
    }
    this._openEditor = !this._openEditor;
  }

  descriptionUpdateContent(content){
  }


  changeClass(val){
  	this.setTypeOptionList(val);
  }

  setTypeOptionList(val){
    if(val) this.typeOptionList = communityModel.getTypeList(val);
  }

  changeType(val){
  }

}
