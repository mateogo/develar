import { Injectable } from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { BehaviorSubject ,  Subject ,  Observable, of} from 'rxjs';

import { SharedService } from '../develar-commons/shared-service';
import { DaoService } from '../develar-commons/dao.service';
import { UserService } from '../entities/user/user.service';

import { User } from '../entities/user/user';

import { UserConversation, ConversationContext, MessageToken, Actor, notificationModel, ConversationTable, Conversation, MessageToPrint } from './notification.model';

function buildNewMessage(token: MessageToken , user: User, actors: Actor[], context: ConversationContext ): MessageToken  {
  token.userId = user._id;
  token.usermail = user.email;
  token.username = user.username;
  token.context = context;

  token.isNewConversation = true;
  token.isArchive = false;
  token.isInInbox = true;
  token.folder = 'sent';
  token.importance = 2;
  token.isPinned = false;
  token.slug = token.content.substr(1,150);
  token.type = "message";
  token.topic = 'info';
  token.fe = Date.now();
  token.fe_expir = token.fe;
  token.actors = actors;
  //token.fetxt = fvalue.fetxt;
  //token.fe = devutils.dateFromTx(token.fetxt).getTime();
	return token;
};

function initMessageAnswer(token: MessageToken , user: User, actors: Actor[] ): MessageToken  {

  token.isNewConversation = false;
  token.isArchive = false;
  token.isInInbox = true;
  token.folder = 'sent';
  token.slug = token.content.substr(1,150);
  token.fe = Date.now();
  token.fe_expir = token.fe;
  token.actors = actors;
  return token;
};


@Injectable()
export class NotificationController {

  private readonly recordtype = 'notification'

  private messageId;
  private message: MessageToken;
  private emitMessage$ = new Subject<MessageToken>();

  private usrconvId;
  private usrconv: UserConversation;
  private emitUserconv = new Subject<UserConversation>();

  private cnvrstnId;
  private cnvrstn: Conversation;
  
  private emitCnvrstn = new Subject<MessageToPrint[]>();
  private cnvrstnList: Array<MessageToPrint>;


  private cnvrstnContext: ConversationContext;



  //table browse
  private userconversationList: UserConversation[] = [];
  private conversationList: Conversation[] = [];

  private emitConversationTable = new BehaviorSubject<ConversationTable[]>([]);
  private _selectionModel: SelectionModel<ConversationTable>
  private _tableActions: Array<any> = notificationModel.tableActionOptions;



	constructor(
		private daoService: DaoService,
    private sharedSrv:   SharedService,
    private snackBar:    MatSnackBar,
		private userService: UserService,
		) {}


  /*************************/
  /*  USER CONVERSATION   */
  /***********************/

  get userconversationListener():Subject<UserConversation>{
    return this.emitUserconv;
  }


  // Repone una userConversation  by entity o by id; Emite resultado
  initUserConversation(entity: UserConversation, entityId: string){
    if(entity){
      this.usrconv = entity;
      this.emitMessageConversationToken();

    }else if(entityId){
      this.findUserConversationById(entityId);

    }else{
      this.initNewUserConversation()
    }
  }

  private initNewUserConversation(){
    this.usrconv = notificationModel.initNewUserConversation();
    this.emitMessageConversationToken();
  }

  private emitMessageConversationToken(){
    this.emitUserconv.next(this.usrconv);
    this.buildMessageTokenFromConversation(this.usrconv);
  }

  private findUserConversationById(modelId: string):Promise<UserConversation>{
    return this.daoService.findEntityById<UserConversation>(this.recordtype,'userconversation', modelId)
      .then((response: UserConversation) => {
        if(response){
          this.usrconv = response;
          this.emitMessageConversationToken();
          return response;
        }
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  }
  /// END Repone una userConversation

  searchByContent(token): Observable<UserConversation[]>{
    if(!(token && token.trim())){
      return of([] as UserConversation[]);
    }

    let query = {
      content: token,
      userId: this.userService.currentUser._id
    }

    this.addContextDataToQuery(query, this.cnvrstnContext);

    return this.daoService.search<UserConversation>(this.recordtype, query)
  }

  findByQuery<T>(type:string, query: any){
    return this.daoService.search<UserConversation>(type, query);
  }

  fetchUserConversations(context: ConversationContext, restrict?: any){
    let query = {};

    this.cnvrstnContext = context;

    if(this.userService.currentUser._id){
      query['userId'] = this.userService.currentUser._id;
    }

    this.addContextDataToQuery(query, context);


    this.fetchUserConversationByQuery<UserConversation>(this.recordtype, 'userconversation', query, restrict);
  }

  private fetchUserConversationByQuery<T>(type:string, url:string, query: any, restrict?: any){

    this.daoService.fetch<UserConversation>(type, url, query).subscribe(list => {

      this.userconversationList = this.restrictList(list, restrict);
      this.updateTableData();
    })
  }

  private restrictList(list: UserConversation[], restrict: any): UserConversation[]{

    if(restrict && !restrict.clean){

      list = list.filter((t, i)=>{
        let verify = true;
        if(restrict.inbox){
          verify = verify && ( t.folder === "inbox");
        }

        if(restrict.sent){
          verify = verify && ( t.folder === "sent");
        }

        if(restrict.important){
          verify = verify && ( t.importance >= restrict.important);
        }

        return verify;
      });
    }

    return list;
  }

  // TABLE LIST DATA
  private updateTableData(){
    let tableData = notificationModel.buildTableFromUserConversation(this.userconversationList);
    this.emitConversationTable.next(tableData);
  }

  updateUserConversationById(id: string, token:any){
    this.daoService.update(this.recordtype, id, token).then(t =>{
      
    });

  }



  /*************************/
  /*  MessageToPrint      */
  /***********************/

  get conversationListener():Subject<MessageToPrint[]>{
    return this.emitCnvrstn;
  }

  buildMessageListFromConversation(conv: Conversation){
    this.cnvrstn = conv;

    //MessageToPrint[]
    this.cnvrstnList = notificationModel.buildMessageListFromConversation(conv);
    this.emitConversationToken();
  }

  //emits MessageToPrint[]
  private emitConversationToken(){
    this.emitCnvrstn.next(this.cnvrstnList)
  }


  /*************************/
  /*  Conversation      */
  /***********************/
  get currentConversation():Conversation{
    return this.cnvrstn;
  }


  // Repone una conversation list
	initConversationList(conversationId: string){
    this.daoService.findById<Conversation>(this.recordtype, conversationId)
      .then((response: Conversation) => {
        if(response){
          this.buildMessageListFromConversation(response);
        }
        return response;
      });
	}

  findConversationById(modelId: string):Promise<Conversation>{
    return this.daoService.findById<Conversation>(this.recordtype, modelId)
      .then((response: Conversation) => {
        if(response){
          this.cnvrstn = response;
        }
        return response
      });
  }

  fetchConversations(context: ConversationContext){
    let query = {};

    this.cnvrstnContext = context;

    if(this.userService.currentUser._id){
      query['userId'] = this.userService.currentUser._id;
    }

    this.addContextDataToQuery(query, context);

    this.daoService.fetch<Conversation>(this.recordtype, 'conversation', query).subscribe(list => {

      this.conversationList = list;
      this.buildTableDataFromConversation();
    })

    //this.fetchByQuery<Conversation>(this.recordtype, 'conversation', query);
  }

  private buildTableDataFromConversation(){
    let tableData = notificationModel.buildTableFromConversation(this.conversationList);
    this.emitConversationTable.next(tableData);
  }




  /*************************/
  /*  MessageToken        */
  /***********************/
  get messageListener():Subject<MessageToken>{
    return this.emitMessage$;
  }

  initMessageEdit(message: MessageToken){
    if(message){
      this.message = message;
      this.emitMessageToken();

      // }else if(messageId){
      //   //????
      //this.findById(this.recordtype, messageId);

    }else{
      this.initNewMessage()
    }
  }

  private buildMessageTokenFromConversation(usrc: UserConversation){
    this.message = notificationModel.buildMessageFromConversation(usrc);
    this.messageId = this.message._id;
    this.emitMessageToken();
  }

  private initNewMessage(){
    this.message = notificationModel.initNewMessageToken({content: ''});
    this.emitMessageToken();
  }

  private emitMessageToken(){
    //Subject<MessageToken>
    this.emitMessage$.next(this.message)
  }

  cancelMessageEditing(){
    this.initNewMessage();
  }

  saveMessageToken(message:MessageToken, actors:Array<Actor>, context: ConversationContext){
    if(message.isNewConversation) this.saveNewMessage(message, actors, context);
    else this.updateMessage(message, actors, context);
  }

  saveNewMessage(message:MessageToken, actors:Array<Actor>, context: ConversationContext){
    this.message = buildNewMessage(message, this.userService.currentUser, actors, context);

    this.daoService.create<MessageToken>(this.recordtype, this.message).then(msj => {
      this.initNewMessage();
    })
  }

  updateMessage(message:MessageToken, actors:Array<Actor>, context: ConversationContext){
    this.message = initMessageAnswer(message, this.userService.currentUser, actors);

    this.daoService.create<MessageToken>(this.recordtype, this.message).then(msj => {
      this.initNewMessage();
    })
  }

  cloneItemRecord(message:MessageToken, actors:Array<Actor>, context: ConversationContext){
      this.message = buildNewMessage(message, this.userService.currentUser, actors, context);
      return this.daoService.create<MessageToken>(this.recordtype, this.message).then((model) =>{
              this.openSnackBar('Grabación nuevo registro exitoso id: ' + model._id, 'cerrar');
              return model;
            });
  }


  /*************************/
  /*  Utils               */
  /***********************/


  /**********************************
    Table Browse: UserConversation
  **********************************/

  get tableDataSource(): BehaviorSubject<ConversationTable[]>{
    return this.emitConversationTable;
  }

  get selectionModel(): SelectionModel<ConversationTable>{
    return this._selectionModel;
  }

  set selectionModel(selection: SelectionModel<ConversationTable>){
    this._selectionModel = selection;
  }

  get tableActions(){
    return this._tableActions;
  }
  
  updateEditedDataInTable(item ):void{
    let entity: UserConversation = this.userconversationList.find((token:any) => token._id === item._id);
    if(entity){
      entity.folder = item.folder;
    }
  }

  addCommunityToList(){
    // let token = graphUtilities.cardGraphFromCommunity('product', this.userconversationList, this.milestone);
    // token.predicate = this.predicate;
    // this.userconversationList.unshift(token);
    // return token;
  }

  fetchSelectedList():UserConversation[]{
    let list = this.filterSelectedList();
    return list;
  }

  private filterSelectedList():UserConversation[]{
    let list: UserConversation[];
    let selected = this.selectionModel.selected as any;

    list = this.userconversationList.filter((token: any) =>{
      return selected.find(tableItem => (token._id === tableItem._id));
    });

    return list;
  }
  

  /*****************
    Utils
  *****************/

  addContextDataToQuery(query: any, context: ConversationContext){
    if(!query) query = {};

    if(context){
      if(context.personId){
          query['personId'] = context.personId;
      }

      if(context.asistenciaId){
          query['asistenciaId'] = context.asistenciaId;
      }
    }

    return query;
  }


  buildActorList(userList: Array<User>){
    let actors:Array<Actor> = [];
    let cuser = this.userService.currentUser;

    actors.push( this.buildActorData(cuser._id, cuser.username, cuser.email, 'from'));
    userList.forEach(user => {
      actors.push(this.buildActorData(user._id, user.username, user.email, 'to'));
    })
    return actors;
  }

  buildActorData(id, username, email, role){
    let actor = {
      userId: id,
      username: username,
      usermail: email,
      role: role
    }
    return actor;
  }

  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {
      duration: 3000,

    });

    snck.onAction().subscribe((e)=> {
      //console.log('action???? [%s]', e);
    })
  }

  currentPublicUrl(){
    let urlPath = this.userService.currentUser.communityUrlpath || 'develar';
    return urlPath;
  }

  changePageTitle(title){
    setTimeout(()=>{
      this.sharedSrv.emitChange(title);
    },1000)
  }

  get currentuser(){
    return this.userService.currentUser;
  }

  get socket(): any{
    return this.userService.socket;
  }


}