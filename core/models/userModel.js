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
const Mixed = mongoose.Schema.Types.Mixed;

const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd3v3l4r';

function encrypt(text){
  let cipher = crypto.createCipher(algorithm,password)
  let crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  let decipher = crypto.createDecipher(algorithm,password)
  let dec = decipher.update(text,'hex','utf8')
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
    // Check if password has been changed
    if (!user.isModified('password')) {
        return next();
    }else{
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

    if(query.username){
        q["username"] = {"$regex": query.username, "$options": "i"};
    }

    if(query.email){
        q["email"] = {"$regex": query.email, "$options": "i"};
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

    User.find(regexQuery, function(err, entities) {
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
        moduleroles:    '',
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
    User.find(function(err, users) {
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


//////



