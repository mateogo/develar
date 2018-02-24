import { Component, OnInit, OnDestroy, Input, Output, OnChanges, HostListener, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { devutils } from '../../../develar-commons/utils';

import { CommunityController }    from '../community.controller';

import { Community, communityModel }    from '../community.model';

const whoami = "community-create "

@Component({
  selector: 'community-create',
  templateUrl: './community-create.component.html',
  styleUrls: ['./community-create.component.scss']
})
export class CommunityCreateComponent implements OnInit, OnChanges, OnDestroy {

	
	public _openEditor: boolean = false;
	private _editable: boolean = true;
  private _editMany: boolean = false;
  private _editorTitle = "Alta nueva Comunidad";
  private _modelSbscrptn;
  private _recordtype = 'community';

	private community: Community;
  private communityId: string;
  private communityEditList: Community[];

  private communities: Community[] = [];


  constructor(
      private communityCtrl: CommunityController,
      private router: Router
    ) { }

  ngOnDestroy(){
    console.log('noOnDestroy')
    this._modelSbscrptn.unsubscribe()

  }

  ngOnChanges(){
    console.log('ngOnChanges;')
  }

  ngOnInit() {
    this.updateTableList();

    this._modelSbscrptn = this.communityCtrl.modelListener.subscribe(entity =>{
      this.initEntityData(entity);
      this.community = entity;
    })

    this.communityCtrl.initController(this.community, this.communityId);



  }

  updateSelCommunities(list: Community[]){
    console.log('updateSelCommunities:[%s]', list.length)
  }

  updateTableList(){
    this.communityCtrl.fetchUserCommunities();
  }

  initEntityData(entity){
    setTimeout(()=>{
      this.updateTableList();
    },1000);
  }

  initToSave(){
  }

  save(target){
    if(this._editMany){
      this.saveMany(target);

    }else{
      this.initToSave()
      this.communityCtrl.saveRecord().then(model =>{
        this.communityId = model._id;
        this.communityCtrl.initController(model, model._id);
      });
    }
  }

  saveMany(target){
    let base = this.communityCtrl.actualNewData(this.community);
    delete base['_id'];

    this.communityEditList.forEach(token =>{
      console.log('forEach: [%s] [%s]', token.slug, token._id);
      token = this.communityCtrl.updateCommonData(token, base);
      //this.community = token;
      this.saveToken(token)
    });
    this.resetEditMany();
  }

  saveToken(entity: Community){
    this.communityCtrl.updateRecord(entity);
  }

  resetEditMany(){
    this.communityCtrl.initController(this.community, this.community._id)
    this._editMany = false;
    this.communityEditList = [];
  }

  saveNew(target){
  	this.initToSave()
		this.communityCtrl.cloneItemRecord().then(entity =>{
			this.communityId = entity._id;
			this.communityCtrl.initController(entity, entity._id);
		});
	}

  openEditor(){
    this.changeEditorTitle();
    this._openEditor = true;
  	return this._openEditor;
  }

  changeType(val){
  }

  editTableSelectedEntityList(){
    console.log('editSelected**************')
    this.communityEditList = this.communityCtrl.fetchSelectedList();
    this.editMany();
  }

  changeCurrentCommunity(){
    console.log('changeCommunity')
    this.communityCtrl.changeCurrentCommunity();
  }

  changeEditorTitle(title?){
    if(!title){
      if(this._editMany){
        this._editorTitle = 'Edición múltiple'; 
      }else{
        this._editorTitle = 'Editando: ' + this.community.slug + ' (' + this.community._id + ')'; 
      }
    }else{
      this._editorTitle = title;
    }
    this.communityCtrl.changePageTitle(this._editorTitle);
  }

  editMany(){
    if(!this.communityEditList || !this.communityEditList.length) return;
    this._editMany = this.communityEditList.length > 1 ? true : false;

    this.community = this.communityCtrl.buildCommonData(this.communityEditList);
    this.communityId = this.community._id;

    this.communityCtrl.initController(this.community, this.communityId);
    this.openEditor();
  }

  actionTriggered(action){
    console.log(`${whoami}  actionTriggered: ${action}`);
    if(action === 'editone')      this.editTableSelectedEntityList();
    if(action === 'navigate')     this.changeCurrentCommunity();
  }

  volver(target:string ){
    if(target === "public"){
      this.router.navigate(['/' + this.communityCtrl.currentPublicUrl()]);


    }
    if(target === 'admin'){
      this.router.navigate(['/']);
    }

  }

}
