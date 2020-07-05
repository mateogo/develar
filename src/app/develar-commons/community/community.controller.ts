import { Injectable }    from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { Observable ,  Subject ,  BehaviorSubject, of }      from 'rxjs';



import { devutils }  from '../../develar-commons/utils';
import { Tag }       from '../../develar-commons/develar-entities';
import { User }      from '../../entities/user/user';

import { SharedService } from '../../develar-commons/shared-service';
import { DaoService }    from '../../develar-commons/dao.service';
import { UserService }   from '../../entities/user/user.service';

import { Community, CommunityBase, CommunityTable, CommunityUserRelation, communityModel } from './community.model';

const whoami = 'community.controller';

const newEntityConfirm = {
  width:  '330px',
  height: '300px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    caption:'Alta de nueva entidad',
    title: 'Confirme la acción',
    body: 'Se dará de alta: ',
    accept:{
      action: 'accept',
      label: 'Aceptar'
    },
    cancel:{
      action: 'cancel',
      label: 'Cancelar'
    }
  }
};

function initCommunityForSave(model: Community, basedata: CommunityBase, user: User): Community {
  model = communityModel.updateBaseData(model, basedata);
  model.userId = user._id;
  return model;
};



@Injectable()
export class CommunityController {

  private _tags: Tag[] = [];

  private community: Community;
  private communityId;
  private emitCommunityRecord = new Subject<Community>();
  private readonly recordtype = 'community'

  private communitybase: CommunityBase;  
  
  private communityUserList: CommunityUserRelation[] = [];
  private communityList: Community[] = [];
  private emitCommunityTable = new BehaviorSubject<CommunityTable[]>([]);
  private _selectionModel: SelectionModel<CommunityTable>
  private _tableActions: Array<any> = communityModel.tableActionOptions;


  constructor(
    private daoService:  DaoService,
    private snackBar:    MatSnackBar,
    private userService: UserService,
    private sharedSrv:   SharedService ) { 
  }

  findById<T>(type:string, modelId: string):Promise<T>{
    return this.daoService.findById<T>(type, modelId)
      .then(response => {
        if(response){
          this.manageResponse(type, response);
        }
        return response as T
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  }

  findByQuery<T>(type:string, query: any){
    return this.daoService.search<Community>(type, query);
  }

  fetchByQuery<T>(type:string, url:string, query: any){
    this.daoService.fetch<CommunityUserRelation>(type, url, query).subscribe(list => {

      this.communityUserList = list;
      this.loadCommunityList(list);
      this.updateTableData();
    })
  }

  updateTableData(){
    let tableData = communityModel.buildCommunityTable(this.communityUserList);
    this.emitCommunityTable.next(tableData);
  }

  manageResponse(type, response){
    this.initCommunityData(response);
  }


  /*****************
    community COMMUNITY
  *****************/
  get modelListener():Subject<Community>{
    return this.emitCommunityRecord;
  }

  initController(model: Community, modelId: string){
    if(model){
      this.initCommunityData(model);

    }else if(modelId){
      this.findById<Community>(this.recordtype, modelId);

    }else{
      this.initNewModel()
    }
  }

  initNewModel(){
    this.initCommunityData(communityModel.initNew('','',null,null));
  }

  initCommunityData(entity: Community){
    this.community = entity;
    this.communityId = this.community._id;
    this.communitybase = communityModel.getBaseData(this.community);
    this.emitCommunityRecord.next(this.community);
  }

  // ****** Search ******************
  searchBySlug(slug): Observable<Community[]>{
    if(!slug.trim()){
      return of<Community[]>([]);
    }
    return this.daoService.search<Community>(this.recordtype, {slug: slug})
  }

  // ****** SAVE ******************
  saveRecord(){
    this.community = initCommunityForSave(this.community, this.basicData, this.userService.currentUser);
    if(this.communityId){
      return this.daoService.update<Community>(this.recordtype, this.communityId, this.community).then((model) =>{
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });


    }else{
      return this.daoService.create<Community>(this.recordtype, this.community).then((model) =>{
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });

    }
  }

  saveUserRelation(userRelation: CommunityUserRelation){
      return this.daoService.userCommunity<CommunityUserRelation>(this.recordtype, userRelation).then((model) =>{
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });

  }

  updateRecord(token: Community){
    this.community = token;
    this.communityId = token._id;
    this.saveRecord();

  }

  cloneItemRecord(){
      this.community = initCommunityForSave(this.community, this.basicData, this.userService.currentUser);
      return this.daoService.create<Community>(this.recordtype, this.community).then((model) =>{
              this.openSnackBar('Grabación nuevo registro exitoso id: ' + model._id, 'cerrar');
              return model;
            });
  }

  fetchUserRelatedCommunities(userId: string){
    let query = {userId: userId};
    return this.daoService.fetch<CommunityUserRelation>(this.recordtype, 'fetchusers', query);
  }

  fetchUserCommunities(){
    if(!this.userService.currentUser._id) return ;

    let query = {userId: this.userService.currentUser._id};
    this.fetchByQuery<CommunityUserRelation>(this.recordtype, 'fetchusers', query);
  }

  /*****************
    communityBasicData COMMUNITY-BASIC-DATA
  *****************/
  get basicData(){
    return this.communitybase;
  }

  /*****************
    Utils
  *****************/
  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {
      duration: 3000,

    });

    snck.onAction().subscribe((e)=> {
    })
  }

  set tags(tags:Tag[]){
    this._tags = tags;
  }

  changePageTitle(title){
    setTimeout(()=>{
      this.sharedSrv.emitChange(title);
    },1000)
  }

  buildCommonData(list: Community[]): Community{
    if(list.length === 1) return list[0];

    let memo: Community = Object.assign({}, list[0]);
    let keys = Object.keys(memo);

    memo = list.reduce((memo, item) =>{
      keys.forEach(key => {
        if( memo[key] !== item[key]) {
          if(typeof memo[key] == "number" ) memo[key] = 0;
          else if( memo[key] instanceof Array) memo[key] = [];
          else if(memo[key] instanceof Object) memo[key] = {};
          else memo[key] = "";
        }

      })
      return memo;
    }, memo);
    return memo;
  }

  actualNewData(edited: Community){
    let base = {};
    Object.keys(edited).forEach(key =>{
      if(edited[key]) base[key] = edited[key];
    })
    return base;
  }

  updateCommonData(actual: Community, edited){
    Object.assign(actual, edited);
    return actual;
  }

  // used by community-selector, needs proper userId
  searchQuery(slug){
    let q = {};

    if(slug){
      q['slug'] = slug;
    }

    q['userId'] = this.userService.currentUser._id;

    return q;
  }

  loadCommunityList(list: CommunityUserRelation[]){
    let tokens = list.map((item:CommunityUserRelation) => item.communityId)
    let query = {communities : tokens};
    this.findByQuery(this.recordtype, query).subscribe(communities =>{
      this.communityList = communities;
    })

  }




  /*****************
    Table Community
  *****************/
  get tableDataSource(): BehaviorSubject<CommunityTable[]>{
    return this.emitCommunityTable;
  }

  get selectionModel(): SelectionModel<CommunityTable>{
    return this._selectionModel;
  }

  set selectionModel(selection: SelectionModel<CommunityTable>){
    this._selectionModel = selection;
  }

  get tableActions(){
    return this._tableActions;
  }
  
  updateCommunityList(item ):void{
    let entity: Community = this.communityList.find((token:any) => token._id === item._id);
    if(entity){
      entity.slug = item.slug;
    }
  }

  addCommunityToList(){
    // let token = graphUtilities.cardGraphFromCommunity('product', this.communityList, this.milestone);
    // token.predicate = this.predicate;
    // this.communityList.unshift(token);
    // return token;
  }

  fetchSelectedList():Community[]{
    let list = this.filterSelectedList();
    return list;
  }

  changeCurrentCommunity(){
    let token = this.filterSelectedList()[0];
    this.userService.changeCurrentCommunity(token);
  }

  changeUserCommunity(user:User, community: Community){
    this.userService.changeUserCommunity(user, community);
  }

  filterSelectedList():Community[]{
    let list: Community[];
    let selected = this.selectionModel.selected as any;

    list = this.communityList.filter((token: any) =>{
      return selected.find(tableItem => (token._id === tableItem.communityId));
    });

    return list;
  }
  
  currentPublicUrl(){
    let urlPath = this.userService.currentUser.communityUrlpath || 'develar';
    return urlPath;
  }



}
