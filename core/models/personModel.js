/**
 * Person model
 */
/**
 * Load module dependencies
 */

const whoami =  "models/personModel: ";

const mongoose = require('mongoose');

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

//var hw = encrypt("hello world")
// outputs hello world
//console.log(hw);
//console.log(decrypt(hw));

 

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


const personSch = new mongoose.Schema({
    displayName:    { type: String, required: true },
    persontags:     { type: String, required: false },
    personType:     { type: String, required: false, default: 'fisica' },
    email:          { type: String, required: false },
    locaciones:     [ addressSch ],
    messages:       [ notif_messageSch ],
});

personSch.pre('save', function (next) {
    console.log('[%s] pre-save', whoami)
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
    console.log('[%s] findAll',whoami);
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
            console.log('[%s] findByID ERROR() argument [%s]', whoam, iarguments.length);
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

    console.dir(regexQuery)
    console.dir(data)
    
    console.log('Person ready to FindONE ');

    Person.findOne(regexQuery).then(token =>{
        console.log('Person FindONE then: [%s]', (token && token.displayName))
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
    console.dir(regexQuery)

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


/**
 * Sign up a new person
 * @param person
 * @param cb
 * @param errcb
 */
exports.create = function (person, errcb, cb) {
    delete person._id;

    Person.create(person, function(err, entity) {
        if (err){
            console.log('[%s] validation error as validate() argument ',whoami)
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};
