import { Injectable } from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { BehaviorSubject ,  Subject ,  Observable, of} from 'rxjs';

import { SharedService } from '../develar-commons/shared-service';
import { DaoService } from '../develar-commons/dao.service';
import { UserService } from '../entities/user/user.service';

import { User } from '../entities/user/user';

import { UserConversation, MessageToken, Actor, notificationModel, ConversationTable, Conversation, MessageToPrint } from './notification.model';

function buildNewMessage(token: MessageToken , user: User, actors: Actor[] ): MessageToken  {
  token.userId = user._id;
  token.usermail = user.email;
  token.username = user.username;

  token.isNewConversation = true;
  token.isArchive = false;
  token.isInInbox = true;
  token.folder = 'sent';
  token.importance = 2;
  token.isPinned = false;
  token.slug = token.content.substr(1,30);
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
  console.log('initMessageAnswer')
  console.dir(token);

  token.isNewConversation = false;
  token.isArchive = false;
  token.isInInbox = true;
  token.folder = 'sent';
  token.slug = token.content.substr(1,30);
  token.fe = Date.now();
  token.fe_expir = token.fe;
  token.actors = actors;
  return token;
};


@Injectable()
export class NotificationController {

  private readonly recordtype = 'notification'

  private message: MessageToken;
  private messageId;
  private emitMessage = new Subject<MessageToken>();

  private usrconv: UserConversation;
  private usrconvId;
  private emitUserconv = new Subject<UserConversation>();

  private cnvrstn: Conversation;
  private cnvrstnList: Array<MessageToPrint>;
  private cnvrstnId;
  private emitCnvrstn = new Subject<MessageToPrint[]>();



  //table browse
  private userconversationList: UserConversation[] = [];
  private emitConversationTable = new BehaviorSubject<ConversationTable[]>([]);
  private _selectionModel: SelectionModel<ConversationTable>
  private _tableActions: Array<any> = notificationModel.tableActionOptions;



	constructor(
		private daoService: DaoService,
    private sharedSrv:   SharedService,
    private snackBar:    MatSnackBar,
		private userService: UserService,
		) {}

  // INIT USER CONVERSATION
  get userconversationListener():Subject<UserConversation>{
    return this.emitUserconv;
  }

  initUserConversation(entity: UserConversation, entityId: string){
    console.log('notification initMessage');
    if(entity){
      this.usrconv = entity;
      this.emitMessageConversationToken();

    }else if(entityId){
      this.findById(this.recordtype, entityId);

    }else{
      this.initNewUserConversation()
    }
  }

  private initNewUserConversation(){
    this.usrconv = notificationModel.initNewUserConversation();
    console.log('initNewUserConversation' );
    this.emitMessageConversationToken();
  }

  private emitMessageConversationToken(){
    this.emitUserconv.next(this.usrconv);
    this.buildMessageTokenFromConversation(this.usrconv);
  }
  /// END



  // INIT CONVERSATION CONTENT
  get conversationListener():Subject<MessageToPrint[]>{
    return this.emitCnvrstn;
  }
  get currentConversation():Conversation{
    return this.cnvrstn;
  }

  buildMessageListFromConversation(conv: Conversation){
    console.log('build message conversation BEGIN')
    this.cnvrstn = conv;
    this.cnvrstnList = notificationModel.buildMessageListFromConversation(conv);
    this.emitConversationToken();
  }

	initConversationList(conversationId: string){
		console.log('initConversationList');

    this.daoService.findById<Conversation>(this.recordtype, conversationId)
      .then((response: Conversation) => {
        if(response){
          this.buildMessageListFromConversation(response);
          return response;
        }
      })
      .catch(err => {
        console.log(err);
        return err;
      });
	}

  private emitConversationToken(){
    this.emitCnvrstn.next(this.cnvrstnList)
  }

  // INIT MESSAGE TOKEN
  get messageListener():Subject<MessageToken>{
    return this.emitMessage;
  }

  buildMessageTokenFromConversation(usrc: UserConversation){
    console.log('build message conversation BEGIN')
    this.message = notificationModel.buildMessageFromConversation(usrc);
    this.messageId = this.message._id;
    this.emitMessageToken();
  }

  initMessageEdit(message: MessageToken, messageId: string){
    console.log('notification initMessage');
    if(message){
      this.message = message;
      this.emitMessageToken();

    }else if(messageId){
      this.findById(this.recordtype, messageId);

    }else{
      this.initNewMessage()
    }
  }

  private initNewMessage(){
    this.message = notificationModel.initNewMessageToken({content: ''});
    console.log('initNewMessage [%s]', this.message.content);
    this.emitMessageToken();
  }

  private emitMessageToken(){
    this.emitMessage.next(this.message)

  }

  cancelMessageEditing(){
    this.initNewMessage();
  }


  //// END


  findById(type:string, modelId: string):Promise<MessageToken>{
    return this.daoService.findById<MessageToken>('message', modelId)
      .then((response: MessageToken) => {
        if(response){
          this.message = response;
          this.emitMessageToken();
        }
        return response

      })
      .catch(err => {
        console.log(err);
        return err;
      });
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

  saveMessageToken(message:MessageToken, actors:Array<Actor>){
    if(message.isNewConversation) this.saveNewMessage(message, actors);
    else this.updateMessage(message, actors);
  }

  saveNewMessage(message:MessageToken, actors:Array<Actor>){
      console.log('save NEW message')
  	this.message = buildNewMessage(message, this.userService.currentUser, actors);
  	this.daoService.create<MessageToken>(this.recordtype, this.message).then(msj => {
  		console.log('iajuuuuuuu......');
  		this.initNewMessage();
  	})
  }

  updateMessage(message:MessageToken, actors:Array<Actor>){
      console.log('update EXISTING message')
    this.message = initMessageAnswer(message, this.userService.currentUser, actors);
    this.daoService.create<MessageToken>(this.recordtype, this.message).then(msj => {
      console.log('iajuuuuuuu......');
      this.initNewMessage();
    })
  }

  cloneItemRecord(message:MessageToken, actors:Array<Actor>){
      this.message = buildNewMessage(message, this.userService.currentUser, actors);
      return this.daoService.create<MessageToken>(this.recordtype, this.message).then((model) =>{
              this.openSnackBar('Grabación nuevo registro exitoso id: ' + model._id, 'cerrar');
              return model;
            });
  }

  /**********************************
    Table Browse: UserConversation
  **********************************/
  findByQuery<T>(type:string, query: any){
    return this.daoService.search<UserConversation>(type, query);
  }

  fetchUserConversatinos(){
    if(!this.userService.currentUser._id) return ;

    let query = {userId: this.userService.currentUser._id};
    this.fetchByQuery<UserConversation>(this.recordtype, 'userconversation', query);
  }


  fetchByQuery<T>(type:string, url:string, query: any){
    this.daoService.fetch<UserConversation>(type, url, query).subscribe(list => {

      this.userconversationList = list;
      this.updateTableData();
    })
  }

  updateTableData(){
    let tableData = notificationModel.buildCommunityTable(this.userconversationList);
    this.emitConversationTable.next(tableData);
  }


  get tableDataSource(): BehaviorSubject<ConversationTable[]>{
    return this.emitConversationTable;
  }

  get selectionModel(): SelectionModel<ConversationTable>{
    return this._selectionModel;
  }

  set selectionModel(selection: SelectionModel<ConversationTable>){
    console.log('selection Model from table!!!!')
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

  filterSelectedList():UserConversation[]{
    let list: UserConversation[];
    let selected = this.selectionModel.selected as any;
    console.log('filterSelectedList: [%s]', this.userconversationList.length);

    list = this.userconversationList.filter((token: any) =>{
      return selected.find(tableItem => (token._id === tableItem._id));
    });
    console.log('filter DONE: list:[%s]', list && list.length)

    return list;
  }
  
  /*****************
    Utils
  *****************/
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

  get socket(): SocketIOClient.Socket{
    return this.userService.socket;
  }

  /*****************
    Search
  *****************/
  searchByContent(token): Observable<UserConversation[]>{
    if(!(token && token.trim())){
      return of([] as UserConversation[]);
    }

    let query = {
      content: token,
      userId: this.userService.currentUser._id
    }
    return this.daoService.search<UserConversation>(this.recordtype, query)
  }

}