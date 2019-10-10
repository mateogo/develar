/**
 * UserConversation: producto (insumo, r esultado, objetivo, etc.)
 */

const whoami =  "models/conversationModel: ";

const mongoose = require('mongoose');
const utils = require('../services/commons.utils');
const mailer = require('../services/sendmail')
const userModel = require('./userModel');
const { URL } = require('url');
const path = require('path');
const config = require('../config/config');

const Rx = require('rxjs');
const Schema = mongoose.Schema;


const messageEmitter = new Rx.Subject();

const self = this;
/*************
  roles: from|to|cc|cco
  New Conversation
    Input: MessageToken: content, fe, fetxt, actors
    (a) conversationId is null? convesation_new : conversation_update

    conversation_new:
    (b.00) Determine creatorId; type; topic; verify dates
    (b.01) Init New Conversation
    (b.02) Init Initial MessageData and wrap-it into Conversation
    (b.03) SAVE CONVERSATION, obtain conversationID
    (b.04) CONTINUE at D.00

    conversation_update
    (c.00) Determine conversationId
    (c.01) Load conversationRecord
    (c.02) Init Initial MessageData and push-it into Conversation
    (c.03) SAVE CONVERSATION, obtain conversationID

    update UserConversation
    (d.00) Determine list of actors
    (d.01) FOR EACH ACTOR in ACTORS
    (d.02) fetch_userConversation by userId + conversationId
    (d.03) if(record)
      (d.03.01) THEN: update record
      (d.03.02) ELSE: init new record & Save


input data:
  isNewConversation: boolean = false;
  conversationId: string = "";
  userId: string = "";
  usermail: string = "";
  username: string = "";
  hasRead: boolean = false;
  isArchive: boolean = false;
  isInInbox: boolean = true;
  folder: string = "inbox";
  importance: number = 2;
  isPinned: boolean = false;
  fe_expir: number = 0;

  slug: string = "";
  type: string = "";
  topic: string = "general";

  fetxt: string = "";
  fe: number = 0;
  content: string = "";
  actors: Array<Actor> = [];


*******/
 

/**
 * Creación de un Schema
 * @params
 *  productId:      link lógico, unívoco dentro de develar, nombre del archivo
 *  path:         link físico, URL del product
 *  filename:     nombre del objeto, tal como quedó luego de subido al server
 *  slug:         descripción corta
 *  description:  descripción/ comentario/ anotciones del recurso
 *
 *  server:       server
 *  originalname: nombre original
 *  encoding:     encoding
 *  mimetype:     es el mimeType
 *  size:         tamaño
 */


const actorSch = new Schema({
  userId:   {type:String, required: true},
  username: {type:String, required: true},
  usermail: {type:String, required: true},
  role:     {type:String, required: true},

});

const messageTokenSch = new Schema({
  content: {type: String, required: true},
  fe:      {type: Number, required: true},
  actors:  {type: [actorSch], required: true},

});


const contextSch = new Schema({
  personId:      {type: String, required: false},
  personName:    {type: String, required: false},
  asistenciaId:  {type: String, required: false}
});


const   conversationSch = new Schema({
  creatorId: {type: String, required: true },

  content:   {type: String, required: true },
  context:   {type: contextSch, required: false},
  fe:        {type: Number, required: true },

  slug:      {type: String, required: true },
  ts_server: {type: Number, required: false },
  type:      {type: String, required: false },
  topic:     {type: String, required: false },

  fe_expir:  {type: Number, required: false },
  isArchive: {type: Boolean, required: false },
  messages:  {type: [messageTokenSch], required: true },
});


const userConversationSch = new Schema({
  conversationId: {type: String, required: true},
  userId:         {type: String,  required: true},

  content:        {type: String,  required: true},
  context:        {type: contextSch, required: false},
  fe:             {type: Number,  required: false},

  last_message:   {type: messageTokenSch, required: true},
  role:           {type: String,  required: true},
  hasRead:        {type: Boolean, required: true},
  isInInbox:      {type: Boolean, required: true},
  folder:         {type: String,  required: true},
  importance:     {type: Number,  required: true},
  isPinned:       {type: Boolean, required: false},

  fe_expir:       {type: Number,  required: false},
  isArchive:      {type: Boolean, required: true},
});



function buildQuery(query){
    let q = {};

    if(query.name){
        q["name"] = {"$regex": query.name, "$options": "i"};
    }

    if(query.personId){
      q["context.personId"] = query.personId;
    }

    if(query.asistenciaId){
      q["context.asistenciaId"] = query.asistenciaId;
    }

    if(query.content){
        q["content"] = {"$regex": query.content, "$options": "i"};
    }

    if(query.slug){
        q["slug"] = {"$regex": query.slug, "$options": "i"};
    }


    if(query["userId"]){
        q["userId"] = query["userId"];
    }

    return q;
}


userConversationSch.pre('save', function (next) {
    return next();
});


/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Record = mongoose.model('Uconversation', userConversationSch, 'uconversations');
const Conversation = mongoose.model('Conversation', conversationSch, 'conversations');
const UserConversation = mongoose.model('UserConversation', userConversationSch, 'userconversations');



/////////   CAPA DE SERVICIOS /////////////

/***

<conversations messages:[{ ... actors:[] ....},....]>
     |
     |
     |
    *v*     
<userconversations: userId, conversationId, last_message:{} ....>

*/

/********************************************/
/**        CONVERSATION                     */
/********************************************/
/**
 * Retrieve all Conversations
 * @param cb
 * @param errcb
 */
exports.conversations = function (errcb, cb) {
    Conversation.find().lean().exec(function(err, entities) {
        if (err) {
            errcb(err);
        }else{
            cb(entities);
        }
    });
};

/**
 * find by ID
 * @param id
 * @param cb
 * @param errcb
 */
exports.findById = function (id, errcb, cb) {

    Conversation.findById(id, function(err, entity) {
        if (err){
            console.log('[%s] Conversation findByID ERROR() argument [%s]', whoami, arguments.length);
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};

/**
 * find by ID
 * @param id
 * @param cb
 * @param errcb
 */
exports.findUserConversationById = function (id, errcb, cb) {

    UserConversation.findById(id, function(err, entity) {
        if (err){
            console.log('[%s] UserConversation findByID ERROR() argument [%s]', whoami, arguments.length);
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};

/********************************************/
/**        USER-CONVERSATION               */
/********************************************/

/**
 * Retrieve all  UserConversations
 * @param cb
 * @param errcb
 */
exports.findAll = function (errcb, cb) {
    UserConversation.find().lean().exec(function(err, entities) {
        if (err) {
            errcb(err);
        }else{
            cb(entities);
        }
    });
};

/**
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */
exports.findByQuery = function (query, errcb, cb) {
    let regexQuery = buildQuery(query);

    UserConversation.find(regexQuery).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
            errcb(err);
        }else{
            cb(entities);
        }
    });
};

/** 
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */
exports.findUserConversationByQuery = function (query, errcb, cb) {
    let regexQuery = buildQuery(query);
    console.dir(regexQuery);

    UserConversation.find(regexQuery, function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
            errcb(err);
        }else{
            cb(entities);
        }
    });
};

/** 
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */
exports.findConversationByQuery = function (query, errcb, cb) {
    let regexQuery = buildQuery(query);
    console.dir(regexQuery);

    Conversation.find(regexQuery, function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
            errcb(err);
        }else{
            cb(entities);
        }
    });
};



/** 
 * Retrieve records enviados al usuario y que no haya leido aún.
 * @param cb
 * @param errcb
 * returns promise!!!
 */
exports.fetchNonReadUserConversations = function (usrId) {
    let query = {
      userId: usrId,
      hasRead: false,
      isInInbox: true,
      role: 'to'
    }
    return UserConversation.find(query);
};



/********************************************/
/**        LEGACY VER SI BORRAR            */
/********************************************/


/**
 * Upddate a new record
 * @param id
 * @param record
 * @param cb
 * @param errcb
 */
exports.update = function (id, record, errcb, cb) {

    UserConversation.findByIdAndUpdate(id, record, { new: true } ,function(err, entity) {
        if (err){
            console.log('[%s] validation error as validate() argument', whoami)
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};





/********************************************/
/**        MANAGE CONVERSATION CRUD         */
/********************************************/

exports.userConversationsListener = function() {
  return messageEmitter;
}

/**
 * Crea una notificación del sistema 
 * @pram record.content:string = contenido del mensaje
 * @pram record.fe: number = fecha de emisión
 * @pram record.type: string = tipo de notificación
 * @pram record.form: string, con formato 'webmaster:admin', para buscar usuarios de este tipo
 * @pram record.to: Array<string>, con formato ['webmaster:admin'], para buscar destinatarios

 */
 
exports.emitnotification = function (record, errcb, cb) {
  let token = initNotificationToken(record);
  let userquery = record.to.map(t => t);
  let actors = [];
  userquery.push(record.from);


  userModel.findByRole(userquery).then(users => {
    if(users && users.length){
      actors = buildActors(record, token, users);
      token = addActorsToToken(token, actors);
      sendUsersNotifications(token, actors);
      sendMailToEmitter(token);
      module.exports.create(token, errcb, cb);


    }else{
      errorcb({error: 'no users found'})
    }
  });

}



/**
 * RECIBE un record con la información necesaria para crear/ actualizar una conversación
 * @param record
 * @param cb
 * @param errcb
 */
exports.create = function (record, errcb, cb) {
  if(record.isNewConversation){
    createNewConversation(record, errcb, cb);

  }else{
    updateConversation(record, errcb, cb);
  }

};

/******* UPDATE CONVERSATION       ******/
function updateConversation(record, errcb, cb){
  let msjs;
  Conversation.findById(record.conversationId).then(cver => {
    if(cver){
      // Conversation found!!!
      cver.fe_lastmsj = Date.now();

      msjs = cver.messages;
      if(msjs && msjs.length){
        msjs.push(buildMessageToken(record));
      }else{
        msjs = [buildMessageToken(record)];
      }
      cver.messages = msjs;

      cver.save(err => {
        if(err){
          console.log('error: ', err)

        }else{
          updateUserConversationList(record, cver, errcb, cb);
        }
      })

    }else{
      createNewConversation(record, errcb, cb);
    }

  })

}

/******* CREATE NEW CONVERSATION   ******/
function createNewConversation(record, errcb, cb){

  let conversation = initNewConversation(record);
  let model = new Conversation(conversation);

  model.save(err => {
    if(err){
      errcb(err)

    }else{
      updateUserConversationList(record, model, errcb, cb);
    }
  })

}

/***** helper: init New Conversation *****/
function initNewConversation(record){
  let conversation = {
    content: record.content,
    context: record.context,
    creatorId: record.userId,
    slug: record.content.substr(0, 30),
    fe: record.fe || Date.now(),
    ts_server: Date.now(),
    isArchive: false,
    type: record.type,
    topic: record.topic,
    fe_expir: record.fe_expir,
    messages: [buildMessageToken(record)]
  }

  conversation.fe_lastmsj = conversation.fe;
  return conversation;
}

/***** helper: init New Message *****/
function buildMessageToken(record){
  let msj = {
    content: record.content,
    fe: record.fe || Date.now(),
    actors: record.actors,
  }
  return msj;
}


function extractActors(role, actors){
  let alist = "";
  if(actors && actors.length){
    let list = actors.filter(actor => actor.role === role).map(actor => actor.username + " <" + actor.usermail + ">");
    alist = list.join('; ');    
  }
  return alist;
}

exports.buildMessage = function(userconv){
  if(!userconv.fe){
    userconv
  }
  let msj = {
    content: userconv.content,
    fe: userconv.fe || Date.now(),
    actors: userconv.last_message.actors,
    role: userconv.role,

    feTxt: utils.dateToStr(new Date(userconv.fe)),
    to: extractActors('to', userconv.last_message.actors),
    from: extractActors('from', userconv.last_message.actors)
  };

  return msj;
}


/********************************************/
/**        USER CONVERSATION LIST         */
/********************************************/


function updateUserConversationList(record, conversation, errcb, cb){  
  let conversationId = conversation._id;
  let actors = record.actors;
  let query = {};
  /************* RESPONSE HERE ToDo ***********/
    cb(conversation )
  /********************************************/


  actors.forEach(actor => {
    query = {conversationId: conversationId, userId: actor.userId}

    UserConversation.findOne(query).then(token =>{
      if(token){
        updateUsrConversation(token, conversation, actor, record);

      }else{
        initUsrConversation(conversation, actor, record);

      }
    })

  })
}

/***** helper: init USR CONVERSATION  *****/
function initUsrConversation(conversation, actor, record){
  let msj = buildMessageToken(record);
  let role = actor.role;
  let token = {
    conversationId: conversation._id,
    userId: actor.userId,
    context: conversation.context,
    last_message: msj,
    role: role,
    hasRead: false,
    isInInbox: true,
    fe_expir: record.fe_expir,
    fe: record.fe,
    content: record.content,
    importance: record.importance || 2

  };

  if(role === 'from'){
    token.folder = record.folder ;
    token.isArchive = record.isArchive ;
    token.isPinned = record.isPinned ;
    token.hasRead = true;

  }else {
    token.folder = 'inbox' ;
    token.isArchive = false ;
    token.isPinned = false ;
  }

  let model = new UserConversation(token);
  saveUserConversationRecord(model);

}

/***** helper: update USR CONVERSATION  *****/
function updateUsrConversation(userconv, conversation, actor, record){
  let msj = buildMessageToken(record);
  let role = actor.role;
  userconv.last_message = msj;
  userconv.role = role;
  userconv.hasRead = false ;
  userconv.isInInbox = true ;
  userconv.fe_expir = record.fe_expir ;
  userconv.fe = record.fe;
  userconv.content = record.content;
  userconv.importance = record.importance || 2 ;

  if(role === 'from'){
    userconv.folder = record.folder ;
    userconv.isArchive = record.isArchive ;
    userconv.isPinned = record.isPinned ;
    userconv.hasRead = true;

  }else {
    userconv.folder = 'inbox' ;

  }
  saveUserConversationRecord(userconv);

}
// export class Actor  {
//   userId: string = "";
//   username: string = "";
//   usermail: string = "";
//   role: string = "";
//   constructor(id, name, mail, role){
//     this.userId = id;
//     this.username = name;
//     this.usermail = mail;
//     this.role = role;
//   }
// }

function buildActors(record, token, users){
  let to_string = record.to.join(';');
  let from_string = record.from;

  let actors = [];

  buildActorList('to', to_string, users, actors)
  buildActorList('from', from_string, users, actors)

  return actors;
}

function addActorsToToken(token, actors){
  let sender;
  sender = actors.find(actor => actor.role === 'from');

  if(sender){
    token.userId = sender.userId;
    token.usermail = sender.usermail;
    token.username = sender.username;
  }

  token.actors = actors;
  return token;
}

function buildActorList(role, rolestring, users, actors){
  if(!(users && users.length)) return actors;
  let tokens = users.filter(user => {
    let test = false;

    user.moduleroles.forEach(role => {
      if(rolestring.indexOf(role) !== -1) test = true;
    });
    return test;
  })

  tokens.forEach(user => {
    actors.push({
      userId: user._id,
      username: user.username,
      usermail: user.email,
      role: role,
    });
  });

  return actors;
}


function buildEmitterMailContent(data){
  const admin_tpl = `
    <p>Estimadx  ${data.displayName}: </p>
    <p>Agradecemos tu interés por este espacio.</p>
    <p>Serás contactadx por un miembrx del equipo a la brevedad.</p>

    <h2>Los datos enviados son:</h2>
   
     <p><strong>Nombre del emisor: </strong> ${data.displayName}</p>
     <p><strong>Correo electrónico: </strong> ${data.email}</p>
     <p><strong>Asunto: </strong> ${data.slug}</p>
     <p><strong>Mensaje: </strong> ${data.description}</p>

    <h4>Equipo de Producción</h4>
    <h4>Enviado en forma automática, no responder.</h4>
    `;

    return admin_tpl
}


function sendMailToEmitter (notif){

  let body = buildEmitterMailContent( {
    userName: notif.username,
    email: notif.emitter_email,
    displayName: notif.emitter_name,
    slug: notif.emitter_slug,
    description: notif.emitter_description,
  })

  let opt = {
    from: 'intranet.develar@gmail.com',
    body: body,
    to: notif.emitter_email,
    prefix: 'app-mail',
    subject: 'Nuevo contacto vía Web'
  }

  sendNotificationMail(opt);
}



function sendUsersNotifications (notif, actors){
  if(!(actors && actors.length)) return;

  actors.forEach(actor => {
    if(actor.role === 'to'){

      let body = buildAdminMailContent( {
        userName: actor.username,
        email: notif.emitter_email,
        displayName: notif.emitter_name,
        slug: notif.emitter_slug,
        description: notif.emitter_description,
      })


      let opt = {
        from: 'intranet.develar@gmail.com',
        body: body,
        to: actor.usermail,
        prefix: 'develar',
        subject: 'Nuevo contacto vía Web'
      }


      sendNotificationMail(opt);
    }
  })

}


function buildAdminMailContent(data){
  const admin_tpl = `
    <p>Estimadx  ${data.userName}: </p>
    <p>Un formulario de contacto fue procesado a través del sitio Web</p>
    <p>Ingresando a la opción 'Personas' de la plataform podrás recuperar los datos del emisor</p>

    <h2>Los datos recibidos en el formulario son:</h2>
   
     <p><strong>Nombre del emisor: </strong> ${data.displayName}</p>
     <p><strong>Correo electrónico: </strong> ${data.email}</p>
     <p><strong>Asunto: </strong> ${data.slug}</p>
     <p><strong>Mensaje: </strong> ${data.description}</p>

     <h4>¡¡Favor contactar al usuario dentro de las 24:00hs!!</h4>

    <h4>Equipo de Producción</h4>
    <h4>Enviado en forma automática, no responder.</h4>
    `;

    return admin_tpl
}

function sendNotificationMail(opt){

  let mail = mailer.mailFactory(opt)

  // envía el mail a los usuarios 'marketing:admin'

  mailer.sendMail(mail.content, (err) =>{
    console.log('[%s] error en el envío de mail', whoami);
    console.log('[%s] error: [%s]', whoami. err);


  }, (info)=>{

  })

}


function initNotificationToken(data){
  let nt = {
    isNewConversation:true ,
    conversationId:'' ,
    userId: '' ,
    content:data.content ,
    slug: data.slug ,
    fe: Date.now() ,
    usermail:'' ,
    username: '' ,
    hasRead: false ,
    isArchive: false ,
    isInInbox: true ,
    folder: 'inbox' ,
    importance: data.importance,
    isPinned: false ,
    fe_expir: data.fe_expir|| Date.now(),
    type: data.type,
    topic: data.topic,
    fetxt: '' ,
    emitter_email: data.emitter_email,
    emitter_name: data.emitter_name,
    emitter_slug: data.emitter_slug,
    emitter_description: data.emitter_description,
    actors:[] ,
  }
  return nt;
}

function saveUserConversationRecord(userconv){
  userconv.save(err => {
    if(err){
      console.log('error: ', err)
    }else{
      //
      // emit new user-conversation update/ create
      //
      messageEmitter.next(userconv);
    }
  })

}

