//--------------------------------------------------------------------
// <copyright file="userModel.js" company="CEPAN">
//     Copyright (c) CEPAN. All rights reserved.
// </copyright>
// <author>Sol Landa - Leonardo Diaz Longhi - Agustin Cassani</author>
//--------------------------------------------------------------------
/**
 * User model
 */
/**
 * Load module dependencies
 */
const whoami =  "models/userModel: ";

const mongoose = require('mongoose');
const mailer = require('../services/sendmail')
const config = require('../config/config');
const person = require('./personModel');

const DOMAIN = config.serverUrl;

const Mixed = mongoose.Schema.Types.Mixed;

const crypto = require('crypto'),
    algorithm = 'aes-256-ctr';

const key = Buffer.from('5ed90daa50a3d7fd1a1ea7a1d7883fc62ccffc49de570ec37eebf05067aa613a', 'hex');
const iv  = Buffer.from('a2e50e8df4c5ad20b6af1269ba2552be', 'hex');



function encrypt(text){
  //let cipher = crypto.createCipheriv(algorithm,password)
  let cipher   = crypto.createCipheriv(algorithm, key, iv);
  let crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}


function decrypt(text){
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}

function comparePasswd (passwd, actualpasswd, cb){
    if(encrypt(passwd) === actualpasswd ){
        cb(false, true);
    }else{
        cb({error: 'passwd erronea '}, false);
    }
}

const googleProfileSch = new mongoose.Schema({
    id:           { type: String, required: false },
    kind:         { type: String, required: false },
    etag:         { type: String, required: false },
    displayName:  { type: String, required: false },
    url:          { type: String, required: false },
    language:     { type: String, required: false },
    gender:       { type: String, required: false },
    name:         { familyName: String, givenName: String},
    image:        { url:String, isDefault: Boolean},
    emails:       [ Mixed ],
    photos:       [ {value: String }],
    cover:        { Mixed },
})

 
/**
 * Creación de un Schema
 */
const userSch = new mongoose.Schema({
    username:       { type: String, required: true },
    provider:       { type: String, default: 'local' },
    providerId:     { type: String, required: false },
    accessToken:    { type: String, required: false },

    email:          { type: String, required: true },
    password:       { type: String, required: true },

    displayName:    { type: String, required: true },
    description:    { type: String, required: false },
    cellphone:      { type: String, required: false },

    communityId:    { type: String, required: false },
    communityUrlpath: { type: String, required: false },
    personId:       { type: String, required: false },
    grupos:         { type: String, required: false },
    roles:          { type: String, required: false },
    modulos:        { type: String, required: false },
    moduleroles:    { type: Array,  required: false },
    language:       { type: String, required: false },
    gender:         { type: String, required: false },


    fealta:         { type: Date,    default: Date.now },
    termscond:      { type: Boolean,required: false },
    estado:         { type: String, required: true },
    navance:        { type: String, required: true },
    localProfile:   { type: Boolean, default: false},
    externalProfile:{ type: Boolean, default: false},

    avatarUrl:      { type: String, required: false },
    googleProfile:  { type: googleProfileSch, required: false},

    verificado:     {
                        mail: Boolean,
                        feaprobado: Number,
                        adminuser: String
                    },

    currentCommunity: {
                        id: String,
                        name: String,
                        slug: String,
                        displayAs: String
                    }

});

userSch.pre('save', function (next) {
    let user = this;
    user.displayName = user.displayName || user.name;
    console.log('UserModel SAVE ********* passwd[%s]', user.isModified('password'));
    if (!user.isModified('password')) {
        return next();

    }else{
        console.log('UserModel SAVE ********* encrypt passwd');
        user.password = encrypt(user.password);
        next();
    }
});


// Compare user passwords
userSch.methods.comparePasswords = function (password, cb) {
    comparePasswd(password, this.password, cb);
};


// Define user mongoose model
/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const User = mongoose.model('Usuario', userSch, 'usuarios');

function buildQuery(query){
    let q = {};

    if(query['username']){
        q["username"] = {"$regex": query.username, "$options": "i"};
    }

    if(query['email']){
        q["email"] = {"$regex": query.email, "$options": "i"};
    }

    if(query['roles']){
      q['moduleroles'] =  { $in: query['roles'].split(',') };
    }

    if(query['moduleroles']){
        q["moduleroles"] = query['moduleroles'];

    }

    if(query['users']){
      let userlist = query['users'].split(',');
      q['_id'] =  {$in: userlist};
    }


    return q;
}

/**
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */
exports.findByQuery = function (query, errcb, cb) {
    let regexQuery = buildQuery(query);
    console.dir(regexQuery)

    User.find(regexQuery).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
            errcb(err);
        }else{
            cb(entities);
        }
    });
};




function initNewLocalUser(user){
    user.provider = 'local';
    user.providerId = '';
    user.accessToken = '';
    user.fealta = Date.now();
    user.language = user.language || 'es';
    user.localProfile = true;
    user.externalProfile = false;
    user.googleProfile = {};

    if(!user.verificado){
        user.verificado = {
            mail:false,
            feaprobado: Date.now(),
            adminuser: ''
        }
    }

    if(!user.currentCommunity){
        user.currentCommunity = {
            id: '',
            name: 'develar',
            slug: 'develar',
            displayAs: 'develar'
        }        
    }
    return user;
}


function normalizeGoogleProfile(profile, accessToken){
    let googleData = {};
    if(profile._json){
        googleData = profile._json;
    }

    let googleMail = null;
    if(profile.emails && profile.emails.length){
        googleMail = profile.emails[0].value;
    }

    let avatarUrl = null;
    if(profile.photos && profile.photos.length){
        avatarUrl = profile.photos[0].value;
    }

    let googleProfile = {
        id:           profile.id,
        kind:         googleData.kind,
        etag:         googleData.etag,
        displayName:  googleData.displayName,
        url:          googleData.url,
        gender:       googleData.gender,

        image:        googleData.image,
        name:         googleData.name,
        emails:       googleData.emails,
        photos:       profile.photos,
        cover:        googleData.cover,
    }

    // console.log('PHOTOS')
    // console.dir(googleProfile.photos)
    // console.log('*****************PHOTOS')
    // console.log('EMAILS')
    // console.dir(googleProfile.emails)
    // console.log('*****************EMAILS')


    let normalizedProfile = {
        provider: 'google',
        providerId: profile.id,
        displayName: profile.displayName,
        email: googleMail,
        avatarUrl: avatarUrl,
        accessToken: accessToken,
        language: googleData.language,
        gender: googleData.gender,
        googleProfile: googleProfile,
    };

    return normalizedProfile;
}

function newGoogleUser(profile){
    let user = new User({
        username:       profile.providerId,
        provider:       profile.provider,
        providerId:     profile.providerId,
        accessToken:    profile.accessToken,
        email:          profile.email,
        password:       'abc1234',
        displayName:    profile.displayName,
        description:    'alta de usuario vía google-login',
        cellphone:      '',
        communityId:    'develar',
        communityUrlpath:  'develar',
        grupos:         '',
        roles:          '',
        modulos:        '',
        moduleroles:    ['core:operador'],
        language:       profile.language,
        gender:         profile.gender,
        termscond:      false,
        estado:         'pendiente',
        navance:        'googleOAuth',
        localProfile:   false,
        externalProfile:true,
        avatarUrl:      profile.avatarUrl,
        googleProfile:  profile.googleProfile,

        verificado:     {
                        mail: false,
                        feaprobado: new Date().getTime(),
                        adminuser: ''
                    },

        currentCommunity: {
                        id: '',
                        name: 'develar',
                        slug: 'develar',
                        displayAs: 'develar'
                    }

    });

    return user;
}

function updateGoogleProfileToExistingUser(user, profile, cb){
    user.provider = profile.provider;
    user.providerId = profile.providerId;
    user.accessToken = profile.accessToken;
    user.externalProfile = true;
    user.language = profile.language;
    user.avatarUrl = profile.avatarUrl;
    user.gender = profile.gender;
    if(user.photos){
        delete user.photos;
    }
    if(user.providerEmails){
        delete user.providerEmails;
    }

    user.googleProfile = profile.googleProfile;

    user.save(function(err){
        if(err){
            console.log('[%s] error al actualizar el profile de google a user existente', whoami);
            cb(err, null);
        }else {
            cb(null, user);
        }
    })
}


function verifyIfExistingUserByEmail(email, profile, cb){
    User.findOne({email: email}, function(err, user) {
        if(err){
            console.log('[%s] error al verificar el mail del google user', whoami);
            cb(err, null);
        }else {
            if(user){
                updateGoogleProfileToExistingUser(user, profile, cb);

            }else{
                saveNewGoogleUser(profile, cb);

            }
        }

    });

}

function saveNewGoogleUser(profile, cb){
    // es un nuevo usuario.. al menos no podemos chequear el mai...
    let user = newGoogleUser(profile);
    user.save(err => {
        if(err){
            console.log('[%s] error al grabar un nuevo usuario google', whoami);
            cb(err, null);
        }else {
            cb(null, user);
        }

    })
}

function initNewGoogleUser(google_profile, accessToken, cb ){
    let providerProfile = normalizeGoogleProfile(google_profile, accessToken);

    if(providerProfile.email){
        verifyIfExistingUserByEmail(providerProfile.email, providerProfile, cb)

    }else{
        saveNewGoogleUser(providerProfile, cb);

    }
}

function updateExistingGoogleUser(user, google_profile, accessToken, cb ){
    if(user.externalProfile){
        //es un usuario existente que ya inicializó los datos del provider
        // solo actualizamos el accessToken
        User.findByIdAndUpdate(user._id, {accessToken: accessToken}, {new: true}, function(err, user){
            cb(null, user)
        });

    }else{
        let providerProfile = normalizeGoogleProfile(google_profile, accessToken);
        updateGoogleProfileToExistingUser(user, providerProfile, cb);
    }

}






/////////   CAPA DE SERVICIOS /////////////
/////////     API DEL USUARIO ///////////
/**
 * Retrieve all usuarios
 * @param cb
 * @param errcb
 */
exports.findAll = function (errcb, cb) {
    User.find().lean().exec(function(err, users) {
        if (err) {
            errcb(err);
        }else{
            cb(users);
        }
    });
};

/**
 * find unique user by email
 */
exports.findOne = function (useremail, cb) {
    User.findOne({email: useremail}, function(err, user) {
        cb(err, user);
    });
};

exports.verifyPassword = function (actualpasswd, testpasswd, cb) {
    comparePasswd(testpasswd, actualpasswd, cb);
};


/**
 * Sign in selected user
 * @param user
 * @param cb
 * @param errcb
 */
exports.login = function (user, errcb, cb) {
    User.findOne({email: user.email}, function(err, user) {
        if (err) {
            errcb(err);

        }else if(!user) {
            errcb({message: whoami + ': email o password incorrecto'});

        }else{
            cb(user);
        }
    });
};

/**
 * Sign up a new user
 * @param user
 * @param cb
 * @param errcb
 */
exports.findById = function (id, errcb, cb) {

    User.findById(id, function(err, entity) {
        if (err){
            console.log('[%s] findByID ERROR() argument [%s]',whoami, arguments.length);
            err.itsme = 'yew i caughtit TOO';
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};


/**

 */
exports.fetchById = function (id, cb) {
    User.findById(id, function(err, entity) {
        cb(err, entity);
    });
};


/**
 * Sign up a new user
 * @param user
 * @param cb
 * @param errcb
 */
exports.update = function (id, user, errcb, cb) { 

    User.findByIdAndUpdate(id, user, { new: true }, function(err, entity) {
        if (err){
            console.log('[%s] validation error as validate() argument ', whoami)
            err.itsme = whoami;
            errcb(err);
        
        }else{
            createPersonFromUser(entity, cb);
        }
    });

};


exports.changePassword = function (id, user, errcb, cb) {

    user.password = encrypt(user.password);
    console.log('UserModel ChangePassword ********* passwd[%s]', user.password);

    User.findByIdAndUpdate(id, user, { new: true }, function(err, entity) {
        if (err){
            console.log('[%s] validation error as validate() argument ', whoami)
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};



/**
 * Sign up a new user
 * @param user
 * @param cb
 * @param errcb
 */
exports.signup = function (user, errcb, cb) {
    delete user._id;
    let luser = initNewLocalUser(user);

    User.create(luser, function(err, entity) {
        if (err){
            console.log('[%s] validation error as validate() argument', whoami)
            err.itsme = whoami;
            errcb(err);
        
        }else{
            createPersonFromUser(entity, cb)
        }
    });

};

const createPersonFromUser = function(user, cb){
    person.createPersonFromUser(user, function(person){
        if(person){
            user.personId = person._id;
            user.save().then(err => {
                cb(user);
            });

        }
    });
}

/**
 * Sign up a new user
 * @param user
 * @param cb
 * @param errcb
 */
exports.populate = function (errcb, cb) {
    let user = {
        email:'pcasasco@gmail.com',
        password: '234566'
    }
    User.create(user, function(err, user) {
        if (err) {
            errcb(err);

        }else{
            cb(user);
        }
    });
};


exports.findByRole = function(roles){
    let query = {moduleroles: {$in: roles}}
    return User.find(query);

}

exports.findOrCreateGoogle = function (profile, accessToken,  cb){
    let id = profile.id;

    User.findOne({providerId: id}, function(err, entity) {

        if(err){ 
            if(cb) cb(err, null);
            return;
        }

        if(!entity){
            // ATENCIÓN: NUEVO USUARIO que se registra vía google
            initNewGoogleUser(profile, accessToken, cb);

        }else{
            // ATENCIÓN: USUARIO EXISTENTE vuelve a loguearse vía google
            updateExistingGoogleUser(entity, profile, accessToken, cb);
        }
    });

};

const userMaster = {
        username:       '',
        provider:       "local",
        providerId:     '',
        accessToken:    '',
        email:          '',
        password:       'abc1234',
        displayName:    '',
        description:    '',
        cellphone:      '',
        communityUrlpath: "simposio-vac-ic-2018",
        communityId:     "5a9c491081ecd02c9001ef83",
        grupos:         '',
        roles:          'operador',
        modulos:        'core',
        moduleroles:    ['core:operador'],
        language:       'es',
        gender:         '',
        termscond:      true,
        estado:         'activo',
        navance:        'approved',
        localProfile:   true,
        externalProfile:false,
        avatarUrl:      '',
        googleProfile:  {
            emails: [],
            photos: [],
        },

        verificado:     {
                        mail: false,
                        feaprobado: new Date().getTime(),
                        adminuser: ''
                    },

        currentCommunity: {
            name: "Simposio Vacunas e Investigación Clínica - Panamá 2018",
            slug: "Simposio Vacunas e Investig Clínica - Panamá 2018",
            displayAs: "Simposio Vacunas e Investig Clínica - Panamá 2018"
        }

    };

const userList = [
    {  username : 'Ana Villareal', 
        email : 'ana.villarreal@cevaxin.com' }
];



exports.createuser = function (errcb, cb) {

    userList.forEach(token =>{
        let user = Object.assign({}, userMaster)
        user.username = token.username;
        user.providerId = token.username;
        user.displayName = token.username;
        user.email = token.email;

        createNewUser(user, errcb, cb);
    })

    cb({altas: userList.length});

};

exports.userFromPerson = function (data, errcb, cb) {
    let personList = data.persons;
    let currentUser = data.user;

    let userTempl = Object.assign({}, userMaster)
    userTempl.communityUrlpath = currentUser.communityUrlpath;
    userTempl.communityId = currentUser.communityId;
    userTempl.currentCommunity = currentUser.currentCommunity;

    personList.forEach(token =>{
        let user = Object.assign({}, userTempl)
        user.username = token.displayName;
        user.providerId = token.displayName;
        user.displayName = token.displayName;
        user.email = token.email;

        createNewUserFromPerson(user, errcb, cb);
    })

    cb({altas: personList.length});



};

function createNewUserFromPerson(newuser, errcb, cb){
    let email = newuser.email;

    User.findOne({email: email}, function(err, user) {
        if(err){
            console.log('[%s] error al verificar el mail del user', whoami);
        }else {
            if(!user){
                createNewUser(newuser, errcb, cb);
            }
        }
    });

}



function createNewUser(user, errcb, cb){

    User.create(user, function(err, entity) {
        if (err){
            console.log('[%s] validation error as validate() argument', whoami)
            err.itsme = whoami;
            errcb(err);
        
        }else{
            if(user){
                //oJo
                //buildUserEmail(user);
            }

        }
    });


}

function buildUserEmail(user){

  let body = buildEmitterMailContent( {
    userName: user.username,
    email: user.email,
    displayName: user.displayName,
    slug: 'Alta de usuario desde Persona',
    description: 'alta de usuario desde persona.',
    community: user.currentCommunity.displayAs
  })

  let opt = {
    from: 'intranet.develar@gmail.com',
    body: body,
    to: user.email,
    prefix: 'app-mail',
    subject: 'Nuevo usuario registrado'
  }

  sendNotificationMail(opt);


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

function buildEmitterMailContent(data){
  const admin_tpl = `
    <p>Estimadx  ${data.displayName}: </p>
    <p>Agradecemos tu registración en el sitio web ${DOMAIN}.</p>
    <p>Al ingresar con tus credenciales tendrás acceso a los recursos de tu comunidad.</p>

    <h2>Tus datos de acceso son:</h2>
   
       <p><strong>URL: </strong> ${DOMAIN}</p>
       <p><strong>Nombre de usuario: </strong> ${data.userName}</p>
       <p><strong>Correo electrónico: </strong> ${data.email}</p>
       <p><strong>Clave de acceso provisoria: </strong> abc1234</p>
       <p><strong>Comunidad: </strong> ${data.community}</p>
       <h4>Estamos atentos por cualquier asistencia que pudieras necesitar.</h4>

      <h4>Equipo de Soporte</h4>


    <h4>Enviado en forma automática, no responder.</h4>
    `;

    return admin_tpl
}


//////

/***
Usage:
  node bytestokey.js CIPHER PASSPHRASE

Example:
  node bytestokey.js aes-128-cbc secret

Prints:
  key: 5ebe2294ecd0e0f08eab7690d2a6ee69
  iv:  26ae5cc854e36b6bdfca366848dea6bb

Now update your code and replace this:

  const cipher = crypto.createCipher('aes-128-cbc', 'secret');

With this:

  const key = Buffer.from('5ebe2294ecd0e0f08eab7690d2a6ee69', 'hex');
  const iv  = Buffer.from('26ae5cc854e36b6bdfca366848dea6bb', 'hex');
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);

Password utilizado para obtener los HASH
    password = 'd3v3l4r';
    node bytestokey.js aes-256-ctr d3v3l4r

**/






