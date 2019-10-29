import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Community, CommunityBase, communityModel, CommunityUserRelation }    from '../community.model';
import { CommunityController }    from '../community.controller';
import { User }      from '../../../entities/user/user';


import { Subject ,  Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap }   from 'rxjs/operators';


function fetchData(form: FormGroup, model: CommunityUserRelation, community: Community, user: User, hasPreviousRelation: boolean): CommunityUserRelation {
	const fvalue = form.value;
  if(!hasPreviousRelation){
    model.communityId = community._id;
    model.userId = user._id;
    model.isOwner = true; 
    model.code = community.code; 
    model.displayAs = community.displayAs;
    model.slug = community.slug;
    model.name = community.name;
    model.urlpath = community.urlpath;
    model.eclass = community.eclass;
    model.etype = community.etype;
    model.estado = community.estado;
  }

  model.roles   = [fvalue.roles];
  model.estado  = fvalue.estado;

	return model;
};

@Component({
  selector: 'community-relation',
  templateUrl: './community-relation.component.html',
  styleUrls: ['./community-relation.component.scss']
})
export class CommunityRelationComponent implements OnInit {
  @Input()
    get openeditor(){ return this._openEditor;}
    set openeditor(val){ this._openEditor = val;}
  @Input() editable: boolean = true;

  @Input() entityId;
  @Input() user: User;

	pageTitle: string = 'Relación Usuario - Comunidad';


	public form: FormGroup;


  private _modelSbscrptn;

  public _openEditor = false;
  


  private searchTerms = new Subject<string>();
  public fetchedEntities: Observable<Community[]>;


	private community: Community;
  private communityId: string;
  public  communitySlug = "";
  public  communityUserList: CommunityUserRelation[] = [];

  public hasUserRelation = false;
  public currentUserRelation: CommunityUserRelation;


  constructor(
  	private fb: FormBuilder,
    private communityCtrl: CommunityController
  	) { 
    this.form = this.fb.group({
      roles:       [null,  Validators.compose([Validators.required])],
      estado:      [null,  Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {

    // possible passed throught @input()
    this.communityId = this.entityId;
    this.fetchUserCommunities(this.user);

    this._modelSbscrptn = this.communityCtrl.modelListener.subscribe(entity =>{
      this.initComponentData(entity);
    })

    this.communityCtrl.initController(this.community, this.communityId);


    this.fetchedEntities = this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(t => t && t.length >2 && !(/[^a-z0-9,ñ\s]+/ig.test(t))),
        switchMap(term => this.communityCtrl.searchBySlug(term))
      )
  }

  initComponentData(entity: Community){
		this.community = entity;
		this.communityId = entity._id;
		this.communitySlug = this.community.slug;
		this.initUserCommRelation(entity);


		this.formReset(this.currentUserRelation);
  }

  initUserCommRelation(entity: Community){
  	this.hasUserRelation = false;
  	this.currentUserRelation = new CommunityUserRelation();

  	this.communityUserList.forEach(rel =>{
  		if(rel.communityId === entity._id){
  			this.hasUserRelation = true;
  			this.currentUserRelation = rel;
  		}
  	})

  }

  formReset(relation){
    this.form.reset({
      roles:      relation.roles.join(';'),
      estado:     relation.estado,
    })
  }

  /*********  SAVE & ?? **********/
  save(target:string){
    this.initForSave();
    this.communityCtrl.saveUserRelation(this.currentUserRelation).then(model =>{
      this.communityCtrl.changeUserCommunity(this.user, this.community);
      this.continueEditing(model);
    })
  }

  continueEditing(model){
    //this.communityCtrl.initController(model, model._id);
  }
  

  fetchUserCommunities(user: User){
  	if(!user) return;
  	this.communityCtrl.fetchUserRelatedCommunities(user._id).subscribe(list => {
      this.communityUserList = list;
    })

  }


  initForSave(){
    this.currentUserRelation = fetchData(this.form, this.currentUserRelation, this.community, this.user, this.hasUserRelation);
  }


  search(term){
    this.searchTerms.next(term)
  }

  selectEntity(token){
    if(token){
      this.communityCtrl.initController(token, token._id);
    }
  }

  editToken(){
    this._openEditor = !this._openEditor;
  }


}
