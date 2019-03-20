/**
 * Person model
 */
/**
 * Load module dependencies
 */

const whoami =  "models/personModel: ";

const mongoose = require('mongoose');

const recordCardModel = require('../models/recordcardModel.js');


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


 

/**
 * Creación de un Schema
 */

const addressSch = new mongoose.Schema({
    slug:        {type: String,  required: true,  defalut: ''},
    description: {type: String,  required: false, defalut: ''},
    isDefault:   {type: Boolean, required: false, defalut: false},
    addType:     {type: String,  required: false, defalut: 'principal'},
    street1:     {type: String,  required: false, defalut: ''},
    street2:     {type: String,  required: false, defalut: ''},
    city:        {type: String,  required: false, defalut: ''},
    state:       {type: String,  required: false, defalut: ''},
    statetext:   {type: String,  required: false, defalut: ''},
    zip:         {type: String,  required: false, defalut: ''},
    country:     {type: String,  required: false, defalut: 'AR'},
    lat:         {type: Number,  required: false, defalut: -34.59},
    lng:         {type: Number,  required: false, defalut: -58.41}
})

const notif_messageSch = new mongoose.Schema({
    type:       {type: String,  required: false, defalut: 'webmessage'},
    from:       {type: String,  required: false, defalut: ''},
    fe:         {type: Number,  required: false, defalut: 0},
    content:    {type: String,  required: true,  defalut: ''},
})

const recordCardSch = new mongoose.Schema({
    slug:         {type: String,  required: false, defalut: ''},
    subtitle:     {type: String,  required: false, defalut: ''},
    cardId:       {type: String,  required: false, defalut: ''},
    topic:        {type: String,  required: false, defalut: ''},
    cardType:     {type: String,  required: false, defalut: ''},
    cardCategory: {type: String,  required: false, defalut: ''},
});

const userSch = new mongoose.Schema({
    userid:       {type: String,  required: false, defalut: ''},
    username:     {type: String,  required: false, defalut: ''},
})



const personSch = new mongoose.Schema({
    displayName:    { type: String, required: true },
    persontags:     { type: String, required: false },
    personType:     { type: String, required: false, default: 'fisica' },
    email:          { type: String, required: false },
    locacion:       { type: String, required: false },
    nombre:         { type: String, required: false },
    apellido:       { type: String, required: false },
    tdoc:           { type: String, required: false },
    ndoc:           { type: String, required: false },
    tprofesion:     { type: String, required: false },
    especialidad:   { type: String, required: false },
    ambito:         { type: String, required: false },
    user:           { type: userSch, required: false },
    communitylist:  { type: Array,   required: false },
    locaciones:     [ addressSch ],
    messages:       [ notif_messageSch ],
    fichas:         [ recordCardSch ]
});

personSch.pre('save', function (next) {
    return next();
});





// Define person mongoose model
/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Person = mongoose.model('Persona', personSch, 'personas');



/////////   CAPA DE SERVICIOS /////////////
/////////     API DEL USUARIO ///////////
/**
 * Retrieve all personas
 * @param cb
 * @param errcb
 */
exports.findAll = function (errcb, cb) {
    Person.find(function(err, persons) {
        if (err) {
            errcb(err);
        }else{
            cb(persons);
        }
    });
};


/**
 * find by ID
 * @param person
 * @param cb
 * @param errcb
 */
exports.findById = function (id, errcb, cb) {

    Person.findById(id, function(err, entity) {
        if (err){
            //console.log('[%s] findByID ERROR() argument [%s]', whoami, iarguments.length);
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};


function buildQuery(query){
    let q = {};

    if(query.displayName){
        q["displayName"] = {"$regex": query.displayName, "$options": "i"};
    }

    if(query.email){
        q["email"] = query.email;
    }

    if(query.tdoc){
        q["tdoc"] = query.tdoc;
    }

    if(query.ndoc){
        q["ndoc"] = query.ndoc;
    }
    return q;
}



/**
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */
exports.upsert = function (req, errcb, cb) {
    let regexQuery = buildQuery(req.query);
    let data = req.body;

    Person.findOne(regexQuery).then(token =>{
        if(!token) token = new Person();
        token = updateData(token, data);
        token.save().then(err => {
            cb(token);
        });
    });




};

function updateData(model, data){
    if(data.displayName) model.displayName = data.displayName;
    if(data.email)  model.email = data.email;
    if(data.locacion) model.locacion = data.locacion;
    if(data.persontags)  model.persontags = data.persontags;
    if(data.messages && data.messages.length){
      model.messages.push(data.messages[0]);
    }

    return model;
}

/**
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */
exports.findByQuery = function (query, errcb, cb) {
    let regexQuery = buildQuery(query);

    Person.find(regexQuery, function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
            errcb(err);
        }else{
            cb(entities);
        }
    });
};



/**
 * Upddate a new person
 * @param person
 * @param cb
 * @param errcb
 */
exports.update = function (id, person, errcb, cb) {

    Person.findByIdAndUpdate(id, person, function(err, entity) {
        if (err){
            console.log('[%s]validation error as validate() argument ', whoami)
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};

const createNewRecordcarRelation = function (person, errcb, cb){
    const ficha = person.fichas[0];
    const id = person._id;

    recordCardModel.createRecordCardFromPerson(ficha, person,
        function(err, recordCard){
            if(err){
                console.log('[%s]createRecordardFromPerson error ', whoami)
                err.itsme = whoami;
                errcb(err);

            }else{
                ficha.cardId = recordCard._id;

                Person.findByIdAndUpdate(id, person, function(err, entity) {
                    if (err){
                        console.log('[%s] person update error  in createNewRecordardRelation', whoami)
                        err.itsme = whoami;
                        errcb(err);
                    
                    }else{
                        cb(entity);
                    }
                });
            }
        });

}


const createNewPerson = function(person, errcb,cb){
    // FASE-1: Alta de la Persona
    Person.create(person, function(err, entity) {
        if (err){
            console.log('[%s] validation error as validate() argument ',whoami)
            err.itsme = whoami;
            errcb(err);
        
        }else{
            if(entity.fichas && entity.fichas.length){
                createNewRecordcarRelation(entity, errcb, cb)

            }else{

                cb(entity);
            }
        }
    });
}


// const newPersonFromUser = function(user, cb){
//     let person = initPersonFromUser(user);

//     person.save().then(err => {
//         cb(person);
//     });
// }

const initPersonFromUser = function(user ){
    let person = new Person();

    person.displayName = user.username;
    person.personType = 'fisica'
    person.email = user.email;
    person.tdoc = 'DNI';
    person.ndoc = '';
    person.ambito = 'cliente';
    person.user = {
        userid: user._id,
        username: user.username
    }
    return person;
}

const updatePersonFromUser = function(person, user){
    person.user = {
        userid: user._id,
        username: user.username
    }
    return person;
}

exports.createPersonFromUser = function(user, cb){
    let personByEmail = buildQuery({email: user.email});

    Person.findOne(personByEmail).then(token =>{
        if(!token) token = initPersonFromUser(user);
        token = updatePersonFromUser(token, user);
        token.save().then(err => {
            cb(token);
        });
    });    
}



/**
 * Sign up a new person
 * @param person
 * @param cb
 * @param errcb
 */
exports.create = function (person, errcb, cb) {
    delete person._id;

    createNewPerson(person, errcb, cb);


};
