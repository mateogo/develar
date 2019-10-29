import { Injectable }    from '@angular/core';
import { Observable ,  Subject ,  BehaviorSubject, of }    from 'rxjs';

import { DataSource, SelectionModel } from '@angular/cdk/collections';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { MatDialog, MatDialogRef, MatSelectChange } from '@angular/material';

import { SharedService } from '../develar-commons/shared-service';
import { devutils } from '../develar-commons/utils';
import { DaoService }  from '../develar-commons/dao.service';
import { UserService } from '../entities/user/user.service';
import { User }        from '../entities/user/user';
import { Person }      from '../entities/person/person';


import { RolNocturnidad, Serial, RolNocturnidadItem, RolNocturnidadTableData }    from './timebased.model';

import { TimebasedHelper }   from './timebased-helper';


@Injectable({
  providedIn: 'root'
})

export class TimebasedController {

	// Table 
  private emitRolnocturnidadTable = new BehaviorSubject<RolNocturnidadTableData[]>([]);
  private _selectionkitModel: SelectionModel<RolNocturnidadTableData>
  private _tableActions: Array<any> = TimebasedHelper.getOptionlist('tableactions');

  private _currentPerson: Person;
  public personListener = new BehaviorSubject<Person>(this._currentPerson);

  private rolnocturnidadList: RolNocturnidad[] = [];

  constructor(
      private daoService: DaoService,
      private userService: UserService,
      private sharedSrv:   SharedService,
      private dialogService: MatDialog,
      private snackBar:    MatSnackBar,

  	) { 

  }



  /***************************
    RolNocturnidad
  ************************/
  manageRolNocturnidadRecord(type:string, rolnocturnidad:RolNocturnidad ): Subject<RolNocturnidad>{
    // 
    let listener = new Subject<RolNocturnidad>();

    if(this.isNewToken(rolnocturnidad)){
      this.initNewRolNocturnidad(listener, type, rolnocturnidad);

    }else{
      this.updateRolNocturnidad(listener, type, rolnocturnidad);

    }
    return listener;
  }

  private isNewToken(token:RolNocturnidad): boolean{
    return token._id ? false : true;
  }


  /******* UPDATE ROL NOCTURNIDAD ********/
  private updateRolNocturnidad(rolnocturnidad$:Subject<RolNocturnidad>, type, rolnocturnidad:RolNocturnidad){
 
    this.initRolNocturnidadForUpdate(rolnocturnidad);

    this.upsertRolNocturnidad(rolnocturnidad$, type, rolnocturnidad);

  }
 
  private initRolNocturnidadForUpdate(entity: RolNocturnidad){
    // todo
  }

  private upsertRolNocturnidad(listener: Subject<RolNocturnidad>, type,  rolnocturnidad: RolNocturnidad){
    this.daoService.update<RolNocturnidad>(type, rolnocturnidad._id, rolnocturnidad).then(t =>{
      listener.next(t);
    })
  }

  /******* CREATE ROL NOCTURNIDAD ********/
  private initNewRolNocturnidad(rolnocturnidad$:Subject<RolNocturnidad>, type, rolnocturnidad:RolNocturnidad){
    let sector = rolnocturnidad.sector || 'dginspeccion';
    let name = 'rolnocturnidad';

    if(this.currentPerson) {
      rolnocturnidad.idPerson = this.currentPerson._id;
      rolnocturnidad.requeridox = TimebasedHelper.buildRequirente(this.currentPerson);
    }else {
      rolnocturnidad.idPerson = null;
      rolnocturnidad.requeridox = null;

    }


    let fecomp_date = devutils.dateFromTx(rolnocturnidad.fecomp_txa) ||  new Date();

    rolnocturnidad.fecomp_tsa = fecomp_date.getTime();
    rolnocturnidad.fecomp_txa = devutils.txFromDate(fecomp_date);

    ///OjO ToDo
    let ferol_date = devutils.dateFromTx(rolnocturnidad.ferol_txa) ||  new Date();
    rolnocturnidad.ferol_tsa = ferol_date.getTime();
    rolnocturnidad.ferol_txa = devutils.txFromDate(ferol_date);
    rolnocturnidad.ts_alta = Date.now();

    this.fetchSerialRolNocturnidads().subscribe(serial =>{
      rolnocturnidad.compPrefix = serial.compPrefix ;
      rolnocturnidad.compName = serial.compName;
      rolnocturnidad.compNum = (serial.pnumero + serial.offset) + "";
     
      this.insertRolNocturnidad(rolnocturnidad$, type, rolnocturnidad);
    });
  }

  private insertRolNocturnidad(listener: Subject<RolNocturnidad>,type,  token: RolNocturnidad){
      token.ts_umodif = Date.now();

      this.daoService.create<RolNocturnidad>(type, token).then(t =>{
        listener.next(t);
      });
  }

  fetchRolNocturnidadByPerson(person:Person){
    let query = {
      idPerson: person._id
    }
    return this.daoService.search<RolNocturnidad>('rolnocturnidad', query);
  }


  fetchRolNocturnidadByQuery(query:any): Subject<RolNocturnidad[]>{
    let listener = new Subject<RolNocturnidad[]>();
    this.loadRolNocturnidadsByQuery(listener, query);
    return listener;
  }

  private loadRolNocturnidadsByQuery(listener: Subject<RolNocturnidad[]>, query){

    this.daoService.search<RolNocturnidad>('rolnocturnidad', query).subscribe(list =>{
      this.rolnocturnidadList =  (list && list.length ) ? list : [];
      listener.next(this.rolnocturnidadList);
    })
  }

  fetchSelectedRolNocturnidadList():RolNocturnidad[]{
    let list = this.filterSelectedRolNocturnidadList();
    return list;
  }

  filterSelectedRolNocturnidadList():RolNocturnidad[]{
    let list: RolNocturnidad[];
    let selected = this.selectionkitModel.selected as any;

    list = this.rolnocturnidadList.filter((token: any) =>{
      let valid = selected.find(model => {
        return (model._id === token._id)
      });
      return valid;
    });
    return list;
  }

  /*****************
    PERSON - USER
  *****************/
  get currentPerson(){
    return this._currentPerson;
  }

  fetchPersonByUser(): Observable<Person[]>{
    let user = this.userService.currentUser;
    if(!user) return;
    let query = { userId: user._id };

    this.daoService.search<Person>('person', query).subscribe(persons => {
      if(persons && persons.length){
        this.updateCurrentPerson(persons[0]);
      }
    });
  }

  updateCurrentPerson(person: Person){
    this._currentPerson = person;
    this.personListener.next(this._currentPerson);
  }

  /*****************
    Seriales
  *****************/
 /**
  * obtener serial para Asistencias
  */
  fetchSerialRolNocturnidads(): Observable<Serial> {
    let serial: Serial = TimebasedHelper.rolnocturnidadSerial();
    let fecha = new Date();
    serial.anio = fecha.getFullYear();
    serial.mes = fecha.getMonth();
    serial.dia = fecha.getDate();
    return this.daoService.nextSerial<Serial>('serial', serial);
  }



  /*****************
    Table RolNocturnidadTableData
  *****************/
  refreshTableData(){
    if(this.rolnocturnidadList && this.rolnocturnidadList.length){
      this.updateDataSourceTableData();
    }
  }

  fetchRolnocturnidadDataSource(query: any): Subject<RolNocturnidad[]>{
    let listener = new Subject<RolNocturnidad[]>();
    this.daoService.search<RolNocturnidad>('rolnocturnidad', query).subscribe(list => {
      this.rolnocturnidadList = list;
      this.updateDataSourceTableData();
      listener.next(this.rolnocturnidadList);
    })
    return listener;
  }

  private updateDataSourceTableData(){
    let tableData = TimebasedHelper.buildRolesDataSource(this.rolnocturnidadList);
    this.emitRolnocturnidadTable.next(tableData);
  }


  get tableActions(){
    return this._tableActions;
  }

  get rolnocturnidadDataSource(): BehaviorSubject<RolNocturnidadTableData[]>{
    return this.emitRolnocturnidadTable;
  }

  get selectionkitModel(): SelectionModel<RolNocturnidadTableData>{
    return this._selectionkitModel;
  }

  set selectionkitModel(selection: SelectionModel<RolNocturnidadTableData>){
    this._selectionkitModel = selection;
  }

  addRolNocturnidadToList(){
  }

}
