import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

import { MatSnackBar, MatSnackBarConfig }           from '@angular/material';
import { MatDialog, MatDialogRef, MatSelectChange } from '@angular/material';

import { DataSource, SelectionModel } from '@angular/cdk/collections';

import { BehaviorSubject ,  Subject ,  Observable, of } from 'rxjs';

import * as io from 'socket.io-client';

import { UpdateEvent } from './sisplan.service';

import { SharedService } from '../develar-commons/shared-service';
import { DaoService }    from '../develar-commons/dao.service';
import { devutils } from '../develar-commons/utils';

import { GenericDialogComponent } from '../develar-commons/generic-dialog/generic-dialog.component';

import { UserService }   from '../entities/user/user.service';

import { Serial }   from '../develar-commons/develar-entities';

import { User }          from '../entities/user/user';
import { Community }     from '../develar-commons/community/community.model';
import { Person }        from '../entities/person/person';

import { Pcultural, PculturalBrowse, PculturalTable } from './pcultural/pcultural.model';
import { Budget, BudgetBrowse, BudgetTable }          from './presupuesto/presupuesto.model';

import { SisplanService, BudgetService } from './sisplan.service';


const CORE = 'core';
const ASSETS = 'assets';
const PCULTURAL_ROUTE = 'pcultural';
const BUDGET_ROUTE = 'budget';

@Injectable({
	providedIn: 'root'
})
export class SisplanController {

  /******* Navigation *******/
  private hasActiveUrlPath = false;
  private actualUrl = "";
  private actualUrlSegments: UrlSegment[] = [];
  private navigationUrl = "";


  /******* User user *******/
  private _productores: User[];
  private userListener: BehaviorSubject<User>;
  private userLoading = false;
  private userx: UserToken = new UserToken();
  public  isUserAdmin = false;

  private userCmty: CommunityToken = new CommunityToken();
  private naviCmty: CommunityToken = new CommunityToken();

  public  onReady = new BehaviorSubject<boolean>(false);

  /******* daoService EndPoints *******/
  private community_type = 'community';
  private pcultural_type = 'pcultural';
  private budget_type =    'budget';
  private serial_type =    'serial';
  private user_type =      'user';
  private person_type =    'person';
 

  /******* Pcultural Table Data *******/
  private _budgetsSelector: BudgetBrowse;

  private currentBudget: Budget;
  private budgetListener = new BehaviorSubject<Budget>(this.currentBudget);
  private emitBudgetsDataSource = new BehaviorSubject<BudgetTable[]>([]);
  private _budgetsSelectionModel: SelectionModel<BudgetTable>
  private budgetsList: Array<Budget> = [];


  /******* Pcultural Table Data *******/
  private _pculturalesSelector: PculturalBrowse;

  private currentPcultural: Pcultural;
  private pculturalListener = new BehaviorSubject<Pcultural>(this.currentPcultural);
  private emitPculturalesDataSource = new BehaviorSubject<PculturalTable[]>([]);
  private _pculturalesSelectionModel: SelectionModel<PculturalTable>
  private pculturalesList: Array<Pcultural> = [];


	constructor(
		private daoService: DaoService,
		private userService: UserService,
    private sharedSrv:   SharedService,
    private dialogService: MatDialog,
    private snackBar:    MatSnackBar,
		) {
    this.userListener = this.userService.userEmitter;

    this.fetchUserByRole('productor:operator').subscribe(tokens => {
      this._productores = tokens || [];
    })

    this.userListener.subscribe(user =>{

      this.userLoading = true;
      this.updateUserStatus(user);
    })



    setTimeout(() => {
    	if(!this.userLoading) this.onReady.next(true)
    }, 1000);
  }



  /***************************/
  /******* Seriales *******/
  /***************************/

 /**
  * obtener serial para Eventos culturles (Pcultural)
  */
  fetchSerialEventos(name, sector, peso): Observable<Serial> {
    let serial: Serial = SisplanService.pculturalSerial(this.pcultural_type, name, sector, peso);
 
    let fecha = new Date();
    serial.anio = fecha.getFullYear();
    serial.mes = fecha.getMonth();
    serial.dia = fecha.getDate();
    return this.daoService.nextSerial<Serial>(this.serial_type, serial);
  }

 /**
  * obtener serial para Eventos culturles (Pcultural)
  */
  fetchSerialBudget(name, sector, peso): Observable<Serial> {
    let serial: Serial = BudgetService.budgetSerial(this.budget_type, name, sector, peso);
 
    let fecha = new Date();
    serial.anio = fecha.getFullYear();
    serial.mes = fecha.getMonth();
    serial.dia = fecha.getDate();
    return this.daoService.nextSerial<Serial>(this.serial_type, serial);
  }

 
   /***********************************/
  /******* Presupuesto Budget ********/
  /**********************************/
  get activeBudget(): Budget{
    return this.currentBudget;
  }

  private updateCurrentBudget(budget: Budget){
    this.currentBudget = budget;
    this.budgetListener.next(this.currentBudget);
  }

  setCurrentBudgetFromId(id: string){
    if(!id) return;
    let fetch$ = this.fetchBudgetById(id);

    fetch$.then(p => {
      this.updateCurrentBudget(p);
    });

    return fetch$

  }

  private fetchBudgetById(id: string): Promise<Budget>{
    return this.daoService.findById<Budget>(this.budget_type, id);
  }


  updatePartialBudget(event: UpdateEvent){

    if(event.token === CORE){
      this.upsertBudgetCore(event.payload._id, event.payload);
    }
  }

  private upsertBudgetCore(id:string, p:any){

    this.daoService.partialUpdate<Budget>(this.budget_type, id, p).then(budget =>{
      this.updateCurrentBudget(budget);
    })

  }
    

  manageBudgetRecord(budget:Budget ): Subject<Budget>{

    let listener = new Subject<Budget>();

    if(this.isNewBudget(budget)){
      this.createBudget(listener, budget);

    }else{
      this.updateBudget(listener, budget);

    }

    return listener;
  }

  private isNewBudget(token:Budget): boolean{
    let isNew = true;

    if(token._id){
      isNew = false;
    }

    return isNew;
  }


  /******* UPDATE BUDGET ********/
  private updateBudget(listener:Subject<Budget>, budget:Budget){
 
    this.initBudgetForUpdate(budget);

    this.upsertBudget(listener, budget);

  }
 
  private initBudgetForUpdate(entity: Budget){

  }

  private upsertBudget(listener: Subject<Budget>,  budget: Budget){

    this.daoService.update<Budget>(this.budget_type, budget._id, budget).then(t =>{
      listener.next(t);
    })

  }

  /******* CREATE BUDGET ********/
  private createBudget(listener:Subject<Budget>, budget: Budget){
    let sector = budget.sector || 'produccion';

    if(!budget.fecomp){
      budget.fecomp = devutils.txFromDate(new Date());

    }else{
      budget.fecomp = devutils.txNormalize(budget.fecomp);
    }

    let dateD = devutils.dateFromTx(budget.fecomp);
    budget.fecomp_ts = dateD ? dateD.getTime() : 0;

    this.fetchSerialBudget(name, sector, 0).subscribe(serial =>{
      budget.compPrefix = serial.compPrefix ;
      budget.compName = serial.compName;
      budget.compNum = (serial.pnumero + serial.offset) + "";
     
      this.insertBudget(listener, budget);
    });
  }

  private insertBudget(listener: Subject<Budget>, token: Budget){

      this.daoService.create<Budget>(this.budget_type, token).then(token =>{
        listener.next(token);
      });
  }



  fetchBudgetByQuery(query:any){
    let listener = new Subject<Budget[]>();
    this.loadBudgetsByQuery(listener, query);
    return listener;
  }

  private loadBudgetsByQuery(listener: Subject<Budget[]>, query){

    this.daoService.search<Budget>(this.budget_type, query).subscribe(list =>{
      if(list && list.length){
        this.budgetsList = list;

      }else{
        this.budgetsList = [];

      }

      listener.next(this.budgetsList);

    })
  }


  // Browse Budget 
  get budgetsSelector():BudgetBrowse{
    if(!this._budgetsSelector) this._budgetsSelector = new BudgetBrowse();
    return this._budgetsSelector;
  }
  
  set budgetsSelector(e: BudgetBrowse){
    this._budgetsSelector = e;
  }


  /*****  Budget TABLE table Table    ****/
  get budgetsDataSource(): BehaviorSubject<BudgetTable[]>{
    return this.emitBudgetsDataSource;
  }

  get budgetsSelectionModel(): SelectionModel<BudgetTable>{
    return this._budgetsSelectionModel;
  }
  set budgetsSelectionModel(selection: SelectionModel<BudgetTable>){
    this._budgetsSelectionModel = selection;
  }

  get budgetTableActions(){
    return SisplanService.getOptionlist('tableactions');
  }

  lookUpBudget(token: BudgetTable): Budget{
    let budget: Budget = this.budgetsList.find(t => t._id === token._id);

    if(!budget) budget = new Budget();
    return budget;
  }

  updateBudgetsTableData(){

    let tableData = BudgetService.buildDataTable(this.budgetsList);
    this.emitBudgetsDataSource.next(tableData);
  }

  updateAvanceBudget(avance, budgetId: string){

    let token = {
      estado : avance === 'anulado' ? 'baja' : 'activo',
      avance: avance
    }
    let promise = this.daoService.update(this.budget_type, budgetId, token);

    promise.then(t =>{
      //todo
    })

    return promise;
  }


  // updateAsistenciaListItem(item ):void{
  //   // let pr: Asistencia = this.asistencia.find((product:any) => product._id === item._id);
  //   // if(pr){
  //   //   pr.pu = item.pu;
  //   //   pr.slug = item.slug;
  //   // }
  // }



  /**********************************/
  /******* Evento PCultural ********/
  /**************************¿*****/
  get activePcultural(): Pcultural{
    return this.currentPcultural;
  }

  private updateCurrentPcultural(pcultural: Pcultural){
    this.currentPcultural = pcultural;
    this.pculturalListener.next(this.currentPcultural);
  }

  setCurrentPculturalFromId(id: string){
    if(!id) return;
    let fetch$ = this.fetchPculturalById(id);

    fetch$.then(p => {
      this.updateCurrentPcultural(p);
    });

    return fetch$

  }

  private fetchPculturalById(id: string): Promise<Pcultural>{
    return this.daoService.findById<Pcultural>(this.pcultural_type, id);
  }


  updatePartialPcultural(event: UpdateEvent){

    if(event.token === CORE){
      this.upsertPculturalCore(event.payload._id, event.payload);
    }
  }

  private upsertPculturalCore(id:string, p:any){

    this.daoService.partialUpdate<Pcultural>(this.pcultural_type, id, p).then(pcultural =>{
      this.updateCurrentPcultural(pcultural);
    })

  }
    

  managePCulturalRecord(pcultural:Pcultural ): Subject<Pcultural>{

    let listener = new Subject<Pcultural>();

    if(this.isNewPcultural(pcultural)){
      this.createPcultural(listener, pcultural);

    }else{
      this.updatePcultural(listener, pcultural);

    }

    return listener;
  }

  private isNewPcultural(token:Pcultural): boolean{
    let isNew = true;

    if(token._id){
      isNew = false;
    }

    return isNew;
  }


  /******* UPDATE PCULTURAL ********/
  private updatePcultural(listener:Subject<Pcultural>, pcultural:Pcultural){
 
    this.initPculturalForUpdate(pcultural);

    this.upsertPcultural(listener, pcultural);

  }
 
  private initPculturalForUpdate(entity: Pcultural){

  }

  private upsertPcultural(listener: Subject<Pcultural>,  pcultural: Pcultural){

    this.daoService.update<Pcultural>(this.pcultural_type, pcultural._id, pcultural).then(t =>{
      listener.next(t);
    })

  }

  /******* CREATE PCULTURAL ********/
  private createPcultural(listener:Subject<Pcultural>, pcultural: Pcultural){
    let sector = pcultural.sector || 'produccion';

    if(!pcultural.fecomp){
      pcultural.fecomp = devutils.txFromDate(new Date());

    }else{
      pcultural.fecomp = devutils.txNormalize(pcultural.fecomp);
    }

    let dateD = devutils.dateFromTx(pcultural.fecomp);
    pcultural.fecomp_ts = dateD ? dateD.getTime() : 0;

    this.fetchSerialEventos(name, sector, 0).subscribe(serial =>{
      pcultural.compPrefix = serial.compPrefix ;
      pcultural.compName = serial.compName;
      pcultural.compNum = (serial.pnumero + serial.offset) + "";
     
      this.insertPcultural(listener, pcultural);
    });
  }

  private insertPcultural(listener: Subject<Pcultural>, token: Pcultural){

      this.daoService.create<Pcultural>(this.pcultural_type, token).then(token =>{
        listener.next(token);
      });
  }



  fetchPculturalByQuery(query:any){
    let listener = new Subject<Pcultural[]>();
    this.loadPculturalsByQuery(listener, query);
    return listener;
  }

  private loadPculturalsByQuery(listener: Subject<Pcultural[]>, query){

    this.daoService.search<Pcultural>(this.pcultural_type, query).subscribe(list =>{
      if(list && list.length){
        this.pculturalesList = list;

      }else{
        this.pculturalesList = [];

      }

      listener.next(this.pculturalesList);

    })
  }


  // public fetchPculturalDashboard(fecharef: Date): Observable<any>{

  //   return this.daoService.fetchAsistenciaDashboard<any>(this.pcultural_type, fecharef.getTime());

  // }

  // Browse Pcultural 
  get pculturalesSelector():PculturalBrowse{
    if(!this._pculturalesSelector) this._pculturalesSelector = new PculturalBrowse();
    return this._pculturalesSelector;
  }
  
  set pculturalesSelector(e: PculturalBrowse){
    this._pculturalesSelector = e;
  }


  /*****  Pcultural TABLE table Table    ****/
  get pculturalesDataSource(): BehaviorSubject<PculturalTable[]>{
    return this.emitPculturalesDataSource;
  }

  get pculturalesSelectionModel(): SelectionModel<PculturalTable>{
    return this._pculturalesSelectionModel;
  }
  set pculturalesSelectionModel(selection: SelectionModel<PculturalTable>){
    this._pculturalesSelectionModel = selection;
  }

  get pculturalTableActions(){
    return SisplanService.getOptionlist('tableactions');
  }

  lookUpPcultural(token: PculturalTable): Pcultural{
    let pcultural: Pcultural = this.pculturalesList.find(t => t._id === token._id);

    if(!pcultural) pcultural = new Pcultural();
    return pcultural;
  }

  updatePculturalesTableData(){

    let tableData = SisplanService.buildDataTable(this.pculturalesList);
    this.emitPculturalesDataSource.next(tableData);
  }

  updateAvancePcultural(avance, pculturalId: string){

    let token = {
      estado : avance === 'anulado' ? 'baja' : 'activo',
      avance: avance
    }
    let promise = this.daoService.update(this.pcultural_type, pculturalId, token);

    promise.then(t =>{
      //todo
    })

    return promise;
  }


  // updateAsistenciaListItem(item ):void{
  //   // let pr: Asistencia = this.asistencia.find((product:any) => product._id === item._id);
  //   // if(pr){
  //   //   pr.pu = item.pu;
  //   //   pr.slug = item.slug;
  //   // }
  // }


  /***************************/
  /******* Person *******/
  /***************************/

  fetchPersonById(id: string): Promise<Person>{
    return this.daoService.findById<Person>(this.person_type, id);
  }


  /***************************/
  /******* Navigation *******/
  /***************************/

  // navigation ROUTER
  navigationRoute(sector): string{
    if(true){  //this.activePcultural
      if(sector === 'produccion'){
        return PCULTURAL_ROUTE;


      }else {
        return PCULTURAL_ROUTE;
      }

    }else {
      if (sector === 'operaciones'){
        return PCULTURAL_ROUTE;

      }else {
        return PCULTURAL_ROUTE;
      }

    }

  }

  actualRoute(snap: string, mRoute: UrlSegment[]){
    this.hasActiveUrlPath = false;
    this.actualUrl = snap;
    this.actualUrlSegments = mRoute;
    this.navigationUrl = this.fetchNavigationUrl(snap, mRoute.toString())
    if(this.navigationUrl) this.hasActiveUrlPath = true;
  }

  private fetchNavigationUrl(snap, urlmodule){
    let urlpath: string = "";

    if(urlmodule){
      urlpath = snap.substr(1, (snap.length - urlmodule.length -2));
      //console.log('url path [%s] [%s]', urlpath ,(snap.length - urlmodule.length -1));
    }else{
      urlpath = snap.substr(1);
    }

    if(urlpath){
      let split = urlpath.split('/') 
      urlpath = split[0];
    }
    return urlpath 
  }


  /***************************/
  /** Notification HELPER ****/
  /***************************/
  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {duration: 3000});

    snck.onAction().subscribe((e)=> {
      //console.log('action???? [%s]', e);
    })
  }


  /***************************/
  /******* USER HELPER *******/
  /***************************/
  loadUserCommunity(){
    if(this.userx.communityId === 'develar') {
      this.userHasNoCommunity();

    }else{
        this.daoService.findById<Community>(this.community_type, this.userx.communityId).then(entity => {

          if(entity){
            this.userx.userCommunity = entity;
            this.userx.hasCommunity = true;
            //
            this.userCmty.data = entity;
            this.userCmty.id = entity._id;
            this.userCmty.isActive = true;
            this.userCmty.isLoading = false;
            this.userCmty.userOwned = true;
            this.userCmty.url = entity.urlpath;
    
            this.pushCommunityFromUser()

          }else{
            this.userHasNoCommunity();
          }

          this.userLoading = false;
          this.onReady.next (true);
        });
      }
  }

  userHasNoCommunity(){
      this.userx.userCommunity = null;
      this.userx.hasCommunity = false;

      this.userCmty.data = null;
      this.userCmty.id = '';
      this.userCmty.isActive = false;
      this.userCmty.isLoading = false;
      this.userCmty.userOwned = false;
      this.userCmty.url = '';

      this.userLoading = false;
      this.onReady.next (true);
  }

  pushCommunityFromUser(){

      Object.assign(this.naviCmty, this.userCmty);
  }

  updateUserStatus(user:User){
    this.userx.id = user._id;
    this.userx.data = user;
    this.userx.isLogged = true;
    this.userx.username = user.username;
    this.userx.email = user.email;
    this.userx.hasCommunity = false;
    this.isUserAdmin = this.userService.isAdminUser();

    if(user.communityId){
      this.userx.communityId = user.communityId
      this.loadUserCommunity()
    }else{
      this.userLoading = false;
      this.onReady.next (true);
    }
  }

  fetchUserByRole(role: string){
    let query = {
      moduleroles: role
    }
    return this.daoService.search<User>(this.user_type, query);

  }

  get productores(): User[]{
    return this._productores;
  }

  buildEncuestadoresOptList(){
    let arr = []
    if(!this._productores) return arr;
    
    this._productores.forEach(x => {
      let t = {
        val: x._id,
        label: x.displayName
      }
      arr.push(t);

    })
    return arr;
  }

  getAuditData(){
    if(! this.userx) return null;

    return {
        userId: this.userx.id,
        username: this.userx.username,
        ts_alta: Date.now()
    }
  }
 

}//END controller


interface OptionList {
  val: string;
  label: string;
  barrio?: string;
  city?: string;
}


class CommunityToken {
  isActive: boolean = false;
  isLoading: boolean = false;
  userOwned: boolean = false;
  renderTopic: string = "";
  id: string = "";
  url: string = "";
  data: Community;
}

class UserToken {
  isLogged: boolean = false;
  hasCommunity: boolean = false;
  username: string = "";
  email:string = "";
  id: string = "";
  communityId: string = "";
  userCommunity: Community;
  data: User;
}
