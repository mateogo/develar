import { Injectable }    from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { Observable ,  Subject ,  BehaviorSubject }      from 'rxjs';



import { devutils }  from '../../develar-commons/utils';
import { Tag }       from '../../develar-commons/develar-entities';
import { User }      from '../../entities/user/user';

import { SharedService } from '../../develar-commons/shared-service';
import { DaoService }    from '../../develar-commons/dao.service';
import { UserService }   from '../../entities/user/user.service';

import { Person, PersonTable, personModel } from './person';

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


@Injectable()
export class PersonController {

  private person: Person;
  private personId;
  private emitPersonRecord = new Subject<Person>();
  private readonly recordtype = 'person'

  
  private personList: Person[] = [];
  private emitPersonTable = new BehaviorSubject<PersonTable[]>([]);
  private _selectionModel: SelectionModel<PersonTable>
  private _tableActions: Array<any> = personModel.tableActionOptions;

  constructor(
    private daoService:  DaoService,
    private snackBar:    MatSnackBar,
    private userService: UserService,
    private sharedSrv:   SharedService ) { 
  }


  /*****************
    person PERSON
  *****************/
  get modelListener():Subject<Person>{
    return this.emitPersonRecord;
  }

  initController(model: Person, modelId: string){
    if(model){
      this.initPersonData(model);

    }else if(modelId){
      this.findById<Person>(this.recordtype, modelId);

    }else{
      this.initNewModel()
    }
  }

  initNewModel(){
    this.initPersonData(personModel.initNew('',''));
  }

  initPersonData(entity: Person){
    this.person = entity;
    this.personId = this.person._id;
    this.emitPersonRecord.next(this.person);
  }

  // ****** Search ******************
  searchBySlug(slug): Observable<Person[]>{
    return this.daoService.search<Person>(this.recordtype, {slug: slug})
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
        return err;
      });
  }

  findByQuery<T>(type:string, query: any){
    return this.daoService.search<Person>(type, query);
  }

  fetchPersonTableList(type:string, query: any){
  	this.findByQuery<Person>(type, query).subscribe(list => {
  		this.personList = list;
  		this.updateTableData();
  	});

  }

  currentPublicUrl(){
    let urlPath = this.userService.currentUser.communityUrlpath || 'develar';
    return urlPath;
  }


  // fetchByQuery<T>(type:string, url:string, query: any){
  //   this.daoService.fetch<CommunityUserRelation>(type, url, query).subscribe(list => {

  //     this.personList = list;
  //     this.loadCommunityList(list);
  //     this.updateTableData();
  //   })
  // }

  updateTableData(){
    let tableData = personModel.buildPersonTable(this.personList);
    this.emitPersonTable.next(tableData);
  }

  manageResponse(type, response){
    this.initPersonData(response);
  }


  /*****************
    Table Community
  *****************/
  get tableDataSource(): BehaviorSubject<PersonTable[]>{
    return this.emitPersonTable;
  }

  get selectionModel(): SelectionModel<PersonTable>{
    return this._selectionModel;
  }

  set selectionModel(selection: SelectionModel<PersonTable>){
    this._selectionModel = selection;
  }

  get tableActions(){
    return this._tableActions;
  }
  
  updateCommunityList(item ):void{
    let entity: Person = this.personList.find((token:any) => token._id === item._id);
    if(entity){
      entity.displayName = item.displayName;
    }
  }


  fetchSelectedList():Person[]{
    let list = this.filterSelectedList();
    return list;
  }

  filterSelectedList():Person[]{
    let list: Person[];
    let selected = this.selectionModel.selected as any;

    list = this.personList.filter((token: any) =>{
      return (token.email && token.personType === 'fisica' && selected.find(tableItem => (token._id === tableItem._id)));
    });

    return list;
  }

  /*********
  * Create Users from Person List
  ********/
  createUsers(persons: Person[]){
    if(!(persons && persons.length)) return;

    let query = {
      persons: persons,
      user : this.userService.currentUser
    }
    this.daoService.usersFromPersons('user', query).then(resp => {

    })
  }
  
}
