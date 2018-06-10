import { User } from '../entities/user/user';
import { devutils } from '../develar-commons/utils';

export class Actor  {
	userId: string = "";
	username: string = "";
	usermail: string = "";
	role: string = "";
	constructor(id, name, mail, role){
		this.userId = id;
		this.username = name;
		this.usermail = mail;
		this.role = role;
	}
}

export class MessageData {
	content: string = "";
	fe: number = 0;
	actors: Array<Actor> = [];
	constructor(data?){
		if(data){
			this.content = data.content || "";
			this.fe = data.fe || 0;
			this.actors = data.actors || [];
		}
	}

}
function extractActors(role:string, actors: Array<Actor>){
	let alist = "";
	if(actors && actors.length){
		let list = actors.filter(actor => actor.role === role).map(actor => actor.username + " <" + actor.usermail + ">");
		alist = list.join('; ');		
	}
	return alist;
}

export class MessageToPrint {
	content: string = "";
	fe: number = 0;
	feTxt: string = "";
	actors: Array<Actor> = [];
	from: string = "";
	to: string = "";
	role: string = "";
	username: string = "";
	numUsers: number = 0;

	constructor(data?){
		if(data){
			this.content = data.content || "";
			this.fe = data.fe || 0;
			this.feTxt = devutils.txFromDate(new Date(data.fe));
			this.actors = data.actors || [];
			this.from = extractActors('from',  data.actors);
			this.to = extractActors('to', data.actors);
			this.role = data.role || "";
			this.username = data.username || "";
			this.numUsers = data.numUsers || 0;

		}
	}

}


export class Conversation {
	id: string;
	_id: string;

	content: string = "";
	creatorId: string = "";
	slug: string = "";
	fe: number = 0;

	ts_server: number = 0;
	fe_lastmsj: number = 0;

	type: string = "";
	topic: string = "general";

	fe_expir: number = 0;
	isArchive: boolean = false;
	messages: Array<MessageData> = [];
}

export interface UserMessage {
	messageId: string;
	content: string;
	fe: number;
	actors: Array<Actor>;
	user_role: string;
}

export class UserConversation {
	id: string;
	_id: string;

	//pk: 
	conversationId: string = "";
	userId: string = "";
	content: string = "";
	fe: number = 0;

	last_message: UserMessage;

	role: string = "";

	hasRead: boolean = false;
	isArchive: boolean = false;
	isInInbox: boolean = true;
	folder: string = "inbox";
	importance: number = 2;
	isPinned: boolean = false;
	fe_expir: number = 0;

	constructor(data?){
		if(data){
			//ToDo
		}
	}

}

export class MessageToken {
	id: string;
	_id: string;

	isNewConversation: boolean = true;
	conversationId: string = "";
	userId: string = "";
	content: string = "";
	slug: string = "";
	fe: number = 0;
	usermail: string = "";
	username: string = "";

	hasRead: boolean = false;
	isArchive: boolean = false;
	isInInbox: boolean = true;
	folder: string = "inbox";
	importance: number = 2;
	isPinned: boolean = false;
	fe_expir: number = 0;

	type: string = "";
	topic: string = "general";

	fetxt: string = "";
	actors: Array<Actor> = [];

	constructor(data?){
		if(data){

			this.conversationId = data.conversationId || "";
			if(this.conversationId){
				this.isNewConversation = false;
			}
			this.userId = data.userId || "";
			this.content = data.content || "";
			this.fe = data.fe || 0;
			this.fetxt = devutils.txFromDate(new Date(data.fe));
			//this.last_message = data.last_message || "";

			this.hasRead = data.hasRead || false;
			this.isArchive = data.isArchive || false;
			this.isInInbox = data.isInInbox;
			this.folder = data.folder || "";
			this.importance = data.importance || 2;
			this.isPinned = data.isPinned || false;
			this.fe_expir = data.fe_expir || 0;

			if(data.last_message){
				this.actors = data.last_message.actors || [];
			}
		}
	}
}

/***
	conversationId: string = "";
	userId: string = "";
	content: string = "";
	fe: number = 0;

	last_message: UserMessage;

	role: string = "";

	hasRead: boolean = false;
	isArchive: boolean = false;
	isInInbox: boolean = true;
	folder: string = "inbox";
	importance: number = 2;
	isPinned: boolean = false;
	fe_expir: number = 0;

          


**/



export interface ConversationTable{
  fetxt:   string;
  fe:      number;
  to:      string;
  from:    string;
  slug:    string;

  topic:   string ;
  type:    string ;
}

function actorsList(data, match_role){
	let lmsj:UserMessage = data.last_message;
	let actors:Actor[] = lmsj.actors;
	let list = "";

	if(actors && actors.length){
		list = actors.reduce((list, actor) => {

			if(match_role === actor.role) return list + actor.username + "; "
			else return list;

		}, list );
		return list;

	}else{
		return 'sin datos';
	}
}

class ConversationTableData implements ConversationTable {
  _id: string = "";
  conversationId = "";

  fetxt:   string;
  fe:      number;
  to:      string;
  from:    string;
  slug:    string;
  folder:  string;

  topic:   string ;
  type:    string ;

  editflds = [0,0,0,0,0,0,0,0]

  constructor(data: any){
    this._id =   data._id;
    this.conversationId = data.conversationId;
		this.fetxt = devutils.txFromDate(new Date(data.fe));
		this.fe =    data.fe;
		this.to =    actorsList(data, 'to');
		this.from =  actorsList(data, 'from');
		this.slug =  data.last_message.content;
		this.topic = data.topic;
		this.type =  data.type;
		this.folder = data.folder;
  }
}


// Table Data
const entityTableActions = [ 
      {val: 'no_definido',   label: 'Seleccione opción',    slug:'Seleccione opción' },
      {val: 'editone',       label: 'Editar registro',      slug:'editone' },
      {val: 'navigate',      label: 'Navegar comunidad',    slug:'Cambiar a esta comunidad' },
]

function _initNewMessageToken(data?): MessageToken{
	let msj = new MessageToken(data);
	return msj;
}

function _initNewUserConversation(data?): UserConversation{
	let msj = new UserConversation(data);
	return msj;
}

function _messageFromConversation(umsj: UserConversation): MessageToken{
	let msj: MessageToken;
	msj = new MessageToken(umsj);
	return msj;
}

function _messagesFromConversation(conv: Conversation): Array<MessageToPrint>{
	let messages: Array<MessageToPrint> = [];
	let list = conv.messages;

	if(!list || !list.length) return messages;

	list.forEach(msj => {
		messages.push(new MessageToPrint(msj)) ;
	})

	return messages;
}

/**************
Public API
************/
class NotificationModel {

	initNewMessageToken(data?): MessageToken{
		return _initNewMessageToken(data);
	}

	initNewUserConversation(data?): UserConversation{
		return _initNewUserConversation(data);
	}

	buildMessageFromConversation(umsj: UserConversation): MessageToken{
		return _messageFromConversation(umsj)
	}

	buildMessageListFromConversation(conv: Conversation): Array<MessageToPrint>{
		return _messagesFromConversation(conv)
	}

	actorsToPrint(role:string, actors: Actor[]):string {
		return extractActors(role, actors);
	}


  get tableActionOptions(){
    return entityTableActions;
  }

  buildCommunityTable(usr_convlist: Array<UserConversation>): ConversationTable[]{
    let list: Array<ConversationTable>;

    list = usr_convlist.map(item => {
      let token = new ConversationTableData(item);
      return token;
    });

    return list;
  }


}


export const notificationModel = new NotificationModel();
