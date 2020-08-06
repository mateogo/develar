/**
 * Person model
 */
/**
 * Load module dependencies
 */

const whoami =  "models/personModel: ";

const mongoose = require('mongoose');

const recordCardModel = require('../models/recordcardModel.js');

// necesarios para el proceso de importación
const config = require('../config/config')
const fs = require('fs');
const path = require('path');
const utils = require('../services/commons.utils');

const xml2js = require('xml2js');
const csv = require('csvtojson')
const asisprevencion = require('../models/asisprevencionModel.js');


/**
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
**/

 

/**
 * Creación de un Schema
 */


const oficiosSch = new mongoose.Schema({
    tdato:         {type: String, required: false,  default: "formal"},
    tocupacion:    {type: String, required: false,  default: "empleadx"},
    ocupacion:     {type: String, required: false,  default: "Empleado"},
    lugar:         {type: String, required: false,  default: ""},
    qdiasmes:      {type: String, required: false,  default: ""},
    remuneracion:  {type: Number, required: false,  default: ""},
    ume_remun:     {type: String, required: false,  default: ""},
    estado:        {type: String, required: false,  default: ""},
    desde:         {type: String, required: false,  default: ""},
    hasta:         {type: String, required: false,  default: ""},
    comentario:    {type: String, required: false,  default: ""},
});

const assetSch = new mongoose.Schema({
    entity:      {type: String, required: false,  default: ""},
    displayAs:   {type: String, required: false,  default: ""},
    predicate:   {type: String, required: false,  default: ""},
    slug:        {type: String, required: false,  default: ""},
    description: {type: String, required: false,  default: ""},
    avatar:      {type: Number, required: false,  default: ""},
    entityId:    {type: String, required: false,  default: ""},

});


const businessSch = new mongoose.Schema({
    nombre:      {type: String, required: true,  default: ""},
    apellido:    {type: String, required: false, default: ""},
    tdoc:        {type: String, required: false, default: ""},
    ndoc:        {type: String, required: false, default: ""},
    fenac:       {type: Number, required: false, default: 0 },
    fenactx:     {type: String, required: false, default: ""},
    ecivil:      {type: String, required: false, default: ""},
    email:       {type: String, required: false, default: ""},
    phone:       {type: String, required: false, default: ""},
    nestudios:   {type: String, required: false, default: ""},
    tocupacion:  {type: String, required: false, default: ""},
    ocupacion:   {type: String, required: false, default: ""},
    ingreso:     {type: String, required: false, default: ""},
    hasOwnPerson:{type: Boolean, required: false, default: false},
    personId:    {type: String, required: false, default: ""},
    vinculo:     {type: String, required: true,  default: ""},
    estado:      {type: String, required: false, default: ""},
    desde:       {type: String, required: false, default: ""},
    hasta:       {type: String, required: false, default: ""},
    comentario:  {type: String, required: false, default: ""},
    assets:      [ assetSch ]
});

const familySch = new mongoose.Schema({
    nombre:      {type: String, required: true,  default: ""},
    apellido:    {type: String, required: false, default: ""},
    tdoc:        {type: String, required: false, default: ""},
    ndoc:        {type: String, required: false, default: ""},
    sexo:        {type: String, required: false, default: ""},
    telefono:    {type: String, required: false, default: ""},

    fenac:       {type: Number, required: false, default: 0 },
    fenactx:     {type: String, required: false, default: ""},
    vinculo:     {type: String, required: false,  default: ""},
    estado:      {type: String, required: false, default: ""},

    hasOwnPerson:{type: Boolean, required: false, default: false},
    personId:    {type: String, required: false, default: ""},
    nucleo:      {type: String, required: false, default: ""},


    ecivil:      {type: String, required: false, default: ""},
    nestudios:   {type: String, required: false, default: ""},
    ocupacion:   {type: String, required: false, default: ""},
    tocupacion:  {type: String, required: false, default: ""},
    ingreso:     {type: String, required: false, default: ""},
    desde:       {type: String, required: false, default: ""},
    hasta:       {type: String, required: false, default: ""},
    comentario:  {type: String, required: false, default: ""},
});

const encuestaSch = new mongoose.Schema({
    id_address:   {type: String, required: false, default: ''},
    id_person:    {type: String, required: false, default: ''},

    street1:     {type: String,  required: false, defalut: ''}, //OjO
    city:        {type: String,  required: false, defalut: ''},
    barrio:      {type: String,  required: false, defalut: ''},

    estado:       {type: String, required: false, default: 'activo'},
    ferel:        {type: String, required: false, default: ''},
    fereltxt:     {type: String, required: false, default: ''},
    tsocial:      {type: String, required: false, default: ''},

    tipoviv:      {type: String, required: false, default: ''},
    domterreno:   {type: String, required: false, default: ''}, // tenencia    
    aniosresid:   {type: Number, required: false, default: 0 },
    qvivxlote:    {type: Number, required: false, default: 0 }, //cant_modulos
    qhabitantes:  {type: Number, required: false, default: 0 }, //habitantes OjO
    matviv:       {type: String, required: false, default: ''},
    techoviv:     {type: String, required: false, default: ''},
    pisoviv:      {type: String, required: false, default: ''},  //piso
    qdormitorios: {type: Number, required: false, default: 1 }, // habitaciones
    tventilacion: {type: String, required: false, default: ''},
    tcocina:      {type: String, required: false, default: ''},
    ecocina:      {type: String, required: false, default: ''},
    tbanio:       {type: String, required: false, default: ''},
    ebanio:       {type: String, required: false, default: ''},
    tmobiliario:  {type: String, required: false, default: ''},
    emobiliario:  {type: String, required: false, default: ''},
    agua:         {type: String, required: false, default: ''},
    electricidad: {type: String, required: false, default: ''},
    cloaca:       {type: String, required: false, default: ''},
    gas:          {type: String, required: false, default: ''},
    iluminacion:  {type: String, required: false, default: ''},
    observacion:  {type: String, required: false, default: ''},

});

const addressSch = new mongoose.Schema({
    slug:        {type: String,  required: false,  defalut: ''},
    estado:      {type: String,  required: false, defalut: 'activo'},
    description: {type: String,  required: false, defalut: ''},
    isDefault:   {type: Boolean, required: false, defalut: false},
    addType:     {type: String,  required: false, defalut: 'principal'},
    street1:     {type: String,  required: false, defalut: ''},
    street2:     {type: String,  required: false, defalut: ''},
    streetIn:    {type: String,  required: false, defalut: ''},
    streetOut:   {type: String,  required: false, defalut: ''},
    city:        {type: String,  required: false, defalut: ''},
    barrio:      {type: String,  required: false, defalut: ''},
    state:       {type: String,  required: false, defalut: ''},
    statetext:   {type: String,  required: false, defalut: ''},
    zip:         {type: String,  required: false, defalut: ''},
    hasBanio:      {type: Boolean, required: false, defalut: false},
    hasHabitacion: {type: Boolean, required: false, defalut: false},
    estadoviv:     {type: String,  required: false, defalut: 'activa'},
    cualificacionviv: {type: String,  required: false, defalut: 'buena'},
    encuesta:    {type: encuestaSch, required: false},
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


const contactDataSch = new mongoose.Schema( {
    tdato:       { type: String, required: true },
    data:        { type: String, required: true },
    type:        { type: String, required: false },
    slug:        { type: String, required: false },
    isPrincipal: { type: String, required: false },
});

const saludSch = new mongoose.Schema( {
    type:       { type: String, required: true },
    tproblema:  { type: String, required: true },
    problema:   { type: String, required: false },
    fecha:      { type: String, required: false},
    fe_ts:      { type: Number, required: false },
    lugaratencion: { type: String, required: false },
    slug:       { type: String, required: false },
});

//type: ingreso|auh|plan|osocial
const coberturaSch = new mongoose.Schema({
    type:          { type: String, required: true },
    tingreso:      { type: String, required: true },
    slug:          { type: String, required: false },
    fecha:         { type: String, required: false },
    fe_ts:         { type: Number, required: false },
    estado:        { type: String, required: false, default: 'pendiente' },
    monto:         { type: Number, required: false },
    observacion:   { type: String, required: false }
});

const permisosSch = new mongoose.Schema({
    type:             { type: String,  required: false},  
    slug:             { type: String,  required: false},  
    observacion:      { type: String,  required: false},  
    isTramitacionMAB: { type: Boolean, required: false},  
    expedidopor:      { type: String,  required: false},  
    fechaexpe:        { type: String,  required: false},  
    tramitacionURL:   { type: String,  required: false},  
    tramitacionNro:   { type: String,  required: false},  
    fechavigencia:    { type: String,  required: false},  
    fechavigencia_ts: { type: Number,  required: false},  
    estado:           { type: String,  required: false},  

})

const habilitacionesSch = new mongoose.Schema({
    type:             { type: String,  required: false},  
    slug:             { type: String,  required: false},  
    observacion:      { type: String,  required: false},  
    isTramitacionMAB: { type: Boolean, required: false},  
    expedidopor:      { type: String,  required: false},  
    fechaexpe:        { type: String,  required: false},  
    tramitacionURL:   { type: String,  required: false},  
    tramitacionNro:   { type: String,  required: false},  
    fechavigencia:    { type: String,  required: false},  
    fechavigencia_ts: { type: Number,  required: false},  
    estado:           { type: String,  required: false},  

})



const personSch = new mongoose.Schema({
    displayName:    { type: String, required: true },
    idbrown:        { type: String, required: false },
    grupo_familiar: { type: Number, required: false },
    isImported:     { type: Boolean, required: false, default: false },
    personType:     { type: String, required: false, default: 'fisica' },

    email:          { type: String, required: false },
    locacion:       { type: String, required: false },

    nombre:         { type: String, required: false },
    apellido:       { type: String, required: false },
    tdoc:           { type: String, required: false },
    ndoc:           { type: String, required: false },
    cuil:           { type: String, required: false },
    alerta:         { type: String, required: false },

    facetas:        { type: Array,  required: false },
    tprofesion:     { type: String, required: false },
    especialidad:   { type: String, required: false },
    ambito:         { type: String, required: false },
    nestudios:      { type: String, required: false },
    followUp:       { type: String, required: false },

    nacionalidad:   { type: String, required: false },
    fenac:          { type: Number, required: false },
    fenactx:        { type: String, required: false },
    ecivil:         { type: String, required: false },
    sexo:           { type: String, required: false },

    ts_alta:        { type: Number, required: false },
    ts_umodif:      { type: Number, required: false },
    estado:         { type: String, required: false, default: 'activo'},


    user_alta:        { type: String, required: false },
    user_umodif:      { type: String, required: false },

    persontags:     { type: Array, required: false },
    user:           { type: userSch, required: false },
    communitylist:  { type: Array,   required: false },
    contactdata:    [ contactDataSch ],
    oficios:        [ oficiosSch ],
    locaciones:     [ addressSch ],
    familiares:     [ familySch ],
    integrantes:    [ businessSch ],
    salud:          [ saludSch ],
    cobertura:      [ coberturaSch ],
    messages:       [ notif_messageSch ],
    ambiental:      [ encuestaSch ],
    fichas:         [ recordCardSch ],
    permisos:       [ permisosSch],
    habilitaciones: [ habilitacionesSch],
    assets:         [ assetSch ]
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



exports.getRecord = function(){
  return Person;
}


/////////   CAPA DE SERVICIOS /////////////
/////////     API DEL USUARIO ///////////
/**
 * Retrieve all personas
 * @param cb
 * @param errcb
 */
exports.findAll = function (errcb, cb) {
    Person.find().lean().exec(function(err, persons) {
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

            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};

exports.fetchById = function(id){
    return Person.findById(id);
}

exports.fetchByRelatives = function(id){
    let query = {
        'familiares.personId': id
    }
    return Person.find(query);
}

exports.fetchByAddress = function(id, address){
    let query = {
        '_id': {$ne: id},
        'locaciones.street1':  {"$regex": address.street1, "$options": "i"},
        'locaciones.city': address.city,
    }
    return Person.find(query);
}



function buildQuery(query){
    let q = {estado: {$not: {$in: [ 'baja', 'bajaxduplice' ]} }  };

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

    if(query.facetas){
        q["facetas"] = query.facetas;
    }

    if(query.userId){
        q["user.userid"] = query.userId;
    }

    if(query.familiar){
        q['familiares.personId'] = query.familiar;
    }

    if(query.mismalocacion){
        q['_id'] = {$ne: query.personId};
        q['locaciones.street1'] =  {"$regex": query.street1, "$options": "i"};
        q['locaciones.city'] = query.city;

    }

    if(query.list){

        let ids = query.list.split(',');
        let new_ids = ids.map(t => mongoose.Types.ObjectId(t));
        q["_id"] = { $in: new_ids}
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

    Person.find(regexQuery).lean().exec(function(err, entities) {
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
    validatePersonBeforeUpdate(person)

    Person.findByIdAndUpdate(id, person, { new: true }, function(err, entity) {
        if (err){
            console.log('[%s]validation error as validate() argument ', whoami)
            err.itsme = whoami;
            errcb(err);
        
        }else{
            updateRelatedEntities(entity)
            checkForPersonToPersonRelation(entity);
            cb(entity);
        }
    });

};

function validatePersonBeforeUpdate(person){

    let familiares = person.familiares;
    if(familiares && familiares.length){
        let filtered = familiares.filter(fam => (fam.nombre && fam.apellido && fam.vinculo));
        person.familiares = filtered
    }

    let locaciones = person.locaciones;
    if(locaciones && locaciones.length){
        let filtered = locaciones.filter(token => (token.street1 && token.city));
        person.locaciones = filtered
    }

}

function updateRelatedEntities(entity){
    if(entity){
        asisprevencion.findAsistenciaFromPerson(entity).then(asis =>{
            if(asis){
                asis.ndoc = entity.ndoc;
                asis.tdoc = entity.tdoc;
                asis.sexo = entity.sexo

                let requerido = asis.requeridox;
                if(requerido){
                    requerido.slug = entity.displayName;
                    requerido.tdoc = entity.tdoc;
                    requerido.ndoc = entity.ndoc;
                    requerido.fenac = entity.fenactx;

                }
                let contactdata = entity.contactdata;
                if(contactdata && contactdata.length){
                    asis.telefono = asis.telefono ? asis.telefono : contactdata[0].data;
                }

                asisprevencion.updateAsistenciaFromPerson(asis);
            }
        })
    }
}


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

                Person.findByIdAndUpdate(id, person, { new: true }, function(err, entity) {
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
                checkForPersonToPersonRelation(entity);

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

function checkForPersonToPersonRelation(sourcePerson){
    let promiseArray = [];

    // let fakePromise = new Promise((resolve, reject) => {
    //                                 setTimeout(resolve, 1000, {displayName: 'foo'});
    //                             });
    // promiseArray.push(fakePromise);

    if(sourcePerson && sourcePerson.integrantes && sourcePerson.integrantes.length){
        updateBusinessMembers(sourcePerson, promiseArray);
        updateSourcePerson(sourcePerson, promiseArray);
    }
    if(sourcePerson && sourcePerson.familiares && sourcePerson.familiares.length){
        updateFamilyMembers(sourcePerson, promiseArray);
        updateSourcePerson(sourcePerson, promiseArray);
    }

}

function updateSourcePerson(sourcePerson, promiseArray){
    Promise.all(promiseArray).then(values => {

        let id = sourcePerson.id;

        Person.findByIdAndUpdate(id, sourcePerson, { new: true }).then( token =>{
            //c onsole.log('SourcePerson UPDATED: [%s] [%s]',token.displayName, token.familiares[0].personId);
        })

    })


}

function updateBusinessMembers(sourcePerson, promiseArray){
    let businessMembers = sourcePerson.integrantes || [];

    businessMembers.forEach((member, index) => {
        if(member.hasOwnPerson){
            promiseArray.push(updateRelatedPersonMember('integrantes', sourcePerson, member, index));
        }
    })
}

function updateFamilyMembers(sourcePerson, promiseArray){
    let familyMembers = sourcePerson.familiares || [];

    familyMembers.forEach((member, index) => {
        if(member.hasOwnPerson){
            promiseArray.push(updateRelatedPersonMember('familiares', sourcePerson, member, index));
        }
    })
}


function addFaceta(facetas, token){
    facetas = facetas || [];
    let index = facetas.indexOf(token);
    if(index === -1) facetas.push(token);
    return facetas;
}

async function updateVinculoPerson(resolve, person, member, key){
    updatePersonFromVinculo(person, member, key);

    await Person.findByIdAndUpdate(person.id, person, { new: true }).exec();
    resolve(true);
    return null;
}

async function createVinculoPerson(resolve, key, sourcePerson, member, index){
    let nueva_person = initNewPerson(member);
    updatePersonFromVinculo(nueva_person, member, key);

    return await Person.create(nueva_person).then(person =>{
        if(person){
            sourcePerson[key][index].personId = person.id;
        }
        resolve(true);
        return person;
    })
}

function updateRelatedPersonMember(key, sourcePerson, member, index){
    let query;
    let personQuery;
    let via;

    let promise = new Promise((resolve, reject)=> {
        if(member.personId){

            personQuery = Person.findById(member.personId).exec();
            personQuery.then(tperson => {
                if(tperson){
                    return updateVinculoPerson(resolve, tperson, member, key)

                }else{
                    return createVinculoPerson(resolve, key, sourcePerson, member, index)
                }
            })
        }else {
            query = buildQuery({
                tdoc: member.tdoc,
                ndoc: member.ndoc
            });

            personQuery = Person.findOne(query).exec()

            personQuery.then(tperson =>{

                if(tperson){
                    member.personId = tperson.id;
                    return updateVinculoPerson(resolve, tperson, member, key)

                }else{
                    return createVinculoPerson(resolve, key, sourcePerson, member, index)
                }
            })
        }
    })

    return promise;
}


function initNewPerson(member){
    let person = new Person();
    let today = Date.now();
    person.isImported = false;
    person.cuil = '';
    person.facetas = [];
    person.ts_alta = today;
    person.ts_umodif = today;

    return person;
}

function updatePersonFromVinculo(tperson, member, key){
    tperson.nombre = member.nombre;
    tperson.apellido = member.apellido;
    
    if(!tperson.displayName ){
        tperson.displayName = member.apellido + ', ' + member.nombre;
    }

    tperson.tdoc = member.tdoc;
    tperson.ndoc = member.ndoc;
    tperson.fenactx = member.fenactx || tperson.fenactx;
    tperson.fenac = member.fenac ||tperson.fenac || utils.dateNumFromTx(tperson.fenactx);
    tperson.ecivil = member.ecivil || tperson.ecivil;
    
    tperson.nestudios = member.nestudios || tperson.nestudios;
    tperson.tprofesion = member.tocupacion || tperson.tprofesion;
    tperson.especialidad = member.ocupacion|| tperson.especialidad;

    if(key === 'integrantes'){
        tperson.email = member.email || tperson.email;
        tperson.phone = member.phone || tperson.phone;
        tperson.assets = updateMemberAssetsArray(tperson.assets, member.assets);

        if(member.vinculo === "seguridad"){
            tperson.facetas = addFaceta(tperson.facetas, member.vinculo);
        }

    } else if(key === 'familiares') {
        tperson.facetas = addFaceta(tperson.facetas, 'familiar');
    }

    return tperson;
}

function updateMemberAssetsArray(target, source){
    if(source && source.length){
        if(!(target && target.length)) return source;
        source.forEach(asset => {
            if(!assetAlreadyInArray(asset, target)) target.push(asset)
        });
        crossCheckAssetInArray(target, source);
        return target;

    } else {
        if(target && target.length) source.assets = target.assets;
        return target;
    }
}

function crossCheckAssetInArray(target, source){
    target.forEach(asset => {
            if(!assetAlreadyInArray(asset, source)) source.push(asset)
    });
}


function assetAlreadyInArray(asset, target){
    return target.find(t => t.entityId === asset.entityId)
}


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
        token.save().then(t => {
            cb(token);
        }).catch(err => {console.log(err);});
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
    
    validatePersonBeforeUpdate(person);

    createNewPerson(person, errcb, cb);


};

/************* MIGRACIÓN BEGINS ***************/
//http://localhost:8080/api/persons/import
const estadoCivil = [
        {val: 'solterx',       brown:'Soltero/a',         },
        {val: 'casadx',        brown:'Casado/a',         },
        {val: 'divorciadx',    brown:'Divorciado/a',         },
        {val: 'conviviendx',   brown:'Concubinato',         },
        {val: 'viudx',         brown:'Viudo/a',         },
        {val: 'otra',          brown:'otra',         },
];

const sexoOptList = [
    {val: 'M',        brown: 'Masculino', label: 'Masculino',     slug:'Masculino' },
    {val: 'F',        brown: 'Femenino', label: 'Femenino',      slug:'Femenino' },
    {val: 'GAP',      brown: 'Auto percibido', label: 'Auto percibido',slug:'Auto percibido' },
];

const nacionalidadOptList = [
    {val: 'AR',          brown: 'Argentino',     slug:'Argentino' },
    {val: '_EXT',        brown: 'Extranjero ',   slug:'Extranjero' },
    {val: '_NAT',        brown: 'Naturalizado ', slug:'Naturalizado' },

];


const ciudadesBrown = [
    {val: 'no_definido',         cp:'1800', label: 'Seleccione opción',brown:'Seleccione opción' },
    {val: 'adrogue',             cp:'1846', label: 'Adrogué ',   brown:'adrogué' },
    {val: 'burzaco',             cp:'1852', label: 'Burzaco ',   brown:'burzaco' },
    {val: 'calzada',             cp:'1847', label: 'Rafael Calzada ',   brown:'calzada' },
    {val: 'claypole',            cp:'1849', label: 'Claypole',   brown:'claypole' },
    {val: 'donorione',           cp:'1850', label: 'Don Orione', brown:'orione' },
    {val: 'glew',                cp:'1856', label: 'Glew',       brown:'glew' },
    {val: 'longchamps',          cp:'1854', label: 'Longchamps', brown:'longchamps' },
    {val: 'malvinasargentinas',  cp:'1846', label: 'Malvinas Argentinas',brown:'argentinas' },
    {val: 'marmol',              cp:'1845', label: 'J.Mármol',   brown:'rmol' },
    {val: 'ministrorivadavia',   cp:'1852', label: 'Ministro Rivadavia',brown:'rivadavia' },
    {val: 'solano',              cp:'1846', label: 'San Fco Solano',   brown:'solano' },
    {val: 'sanjose',             cp:'1846', label: 'San José',   brown:'san jos' },
];

const ciudadesTalimentar = [
    {val: 'no_definido',         cp:'1800', label: 'Seleccione opción',  brown:'Seleccione opción' },
    {val: 'adrogue',             cp:'1846', label: 'Adrogué ',           brown:'adrogu' },
    {val: 'burzaco',             cp:'1852', label: 'Burzaco ',           brown:'burzaco' },
    {val: 'calzada',             cp:'1847', label: 'Rafael Calzada ',    brown:'calzada' },
    {val: 'claypole',            cp:'1849', label: 'Claypole',           brown:'claypole' },
    {val: 'donorione',           cp:'1850', label: 'Don Orione',         brown:'orione' },
    {val: 'glew',                cp:'1856', label: 'Glew',               brown:'glew' },
    {val: 'longchamps',          cp:'1854', label: 'Longchamps',         brown:'longchamps' },
    {val: 'malvinasargentinas',  cp:'1846', label: 'Malvinas Argentinas',brown:'argentinas' },
    {val: 'marmol',              cp:'1845', label: 'J.Mármol',           brown:'rmol' },
    {val: 'ministrorivadavia',   cp:'1852', label: 'Ministro Rivadavia', brown:'rivadavia' },
    {val: 'solano',              cp:'1846', label: 'San Fco Solano',     brown:'solano' },
    {val: 'sanjose',             cp:'1846', label: 'San José',           brown:'san jos' },
];



const barriosOptList = {
  adrogue: [
    {val: 'adrogue',    label: 'Adrogué Ctro' },
    {val: 'vattuone',   label: 'Vattuone'     },
  ],

  burzaco: [
    {val: 'burzaco',    label: 'Burzaco Ctro' },
    {val: 'elhornero',    label: 'El Hornero' },
    {val: 'lapilarica',    label: 'La Pilarica' },
    {val: 'elcanario',    label: 'El Canario' },
    {val: 'barriolindo',    label: 'Barrio Lindo' },
    {val: 'lacumbre',    label: 'La Cumbre' },
    {val: 'arzano',    label: 'Arzano' },
    {val: 'elencuentro',    label: 'El Encuentro' },
    {val: 'betharran',    label: 'Betharrán' },
    {val: 'lalucy',    label: 'La Lucy' },
    {val: 'solis',    label: 'Solís' },
    {val: 'sanpablo',    label: 'San Pablo' },
    {val: 'almafuerte',    label: 'Almafuerte' },
    {val: 'elrecuerdo',    label: 'El Recuerdo' },
    {val: 'laciudadoculta',    label: 'La Ciudad Oculta' },
    {val: 'laprimavera',    label: 'La Primavera' },
    {val: 'donalejandro',    label: 'Don Alejandro' },
    {val: 'lacarlota',    label: 'La Carlota' },
    {val: 'sakura',    label: 'Sakura' },
    {val: 'eltriangulo',    label: 'El Triángulo' },
    {val: 'viplastic',    label: 'Viplastic' },
    {val: 'parqueroma',    label: 'Parque Roma' },
    {val: 'ibañez',    label: 'Ibañez' },
    {val: 'sanjuandecorimayo',    label: 'San Juan de Corimayo' },
    {val: 'parquedecorimayo',    label: 'Parque Corimayo' },
    {val: 'corimayo',    label: 'Corimayo' },
    {val: 'primerajunta',    label: 'Primera Junta' },
    {val: 'lasrosas',    label: 'Las Rosas' },
    {val: 'elgaucho',    label: 'El Gaucho' },
    {val: 'lomasdeburzaco',    label: 'Lomas de Burzaco' },
    {val: 'luzyfuerza',    label: 'Luz y Fuerza' },
  ],

  calzada: [
    {val: 'calzada',    label: 'Calzada Ctro' },
    {val: '14denoviembre',    label: '14 de Noviembre' },
    {val: '2deabril',    label: '2 de Abril' },
    {val: 'sangeronimo',    label: 'San Gerónimo' },
    {val: 'asuncion',    label: 'Asunción' },
    {val: 'zabala',    label: 'Zabala' },
    {val: 'sanjavier',    label: 'San Javier' },
  ],

  claypole: [
    {val: 'claypole',    label: 'Claypole Centro' },
    {val: 'laesther',    label: 'La Esther' },
    {val: 'elcastillo',    label: 'El Castillo' },
    {val: 'donorione',    label: 'Don Orione' },
    {val: 'suther',    label: 'Suther' },
    {val: 'martinfierro',    label: 'Martín Fierro' },
    {val: 'cerrito',    label: 'Cerrito' },
    {val: 'conjhabitdonorione',    label: 'Conj Habit Don Orione' },
    {val: 'sideco',    label: 'Sideco' },
    {val: 'eltriangulo',    label: 'El Triángulo' },
    {val: 'lajovita',    label: 'La Jovita' },
    {val: 'lastunas',    label: 'Las Tunas' },
    {val: 'horizonte',    label: 'Horizonte' },
    {val: 'santaclara',    label: 'Santa Clara' },
    {val: 'barrioparque',    label: 'Barrio Parque' },
    {val: 'eltrebol',    label: 'El Trébol' },
    {val: 'saenz',    label: 'Sáenz' },
    {val: 'medallamilagrosa',    label: 'Medalla Milagrosa' },
    {val: 'pintemar',    label: 'Pintemar' },
    {val: 'sanlucas',    label: 'San Lucas' },
    {val: 'marianomoreno',    label: 'Mariano Moreno' },
    {val: 'monteverde',    label: 'Monteverde' },
    {val: 'sanluis',    label: 'San Luis' },
  ],

  donorione: [
    {val: 'donorione',    label: 'Don Orione' },
  ],

  glew: [
    {val: 'glew',    label: 'Glew Centro' },
    {val: 'gorriti',    label: 'Gorriti' },
    {val: 'uocra',    label: 'UOCRA' },
    {val: 'parqueroma',    label: 'Parque Roma' },
    {val: 'progreso',    label: 'Progreso' },
    {val: 'cotepa',    label: 'Cotepa' },
    {val: 'eltrebol',    label: 'El Trébol' },
    {val: 'losalamos',    label: 'Los Alamos' },
    {val: 'quintacastillo',    label: 'Quinta del Castillo' },
    {val: 'upcn',    label: 'UPCN' },
    {val: 'telepostal',    label: 'Telepostal' },
    {val: 'losaromos',    label: 'Los Aromos' },
    {val: 'ipona',    label: 'Ipona' },
    {val: 'villaparís',    label: 'Villa París' },
    {val: 'amancay',    label: 'Amancay' },
    {val: 'altosdeglew',    label: 'Los Altos de Glew' },
    {val: 'supa',    label: 'Supa' },
    {val: 'almafuerte',    label: 'Almafuerte' },
    {val: 'kanmar',    label: 'Kanmar' },
  ],

  longchamps: [
    {val: 'longchamps',    label: 'Longchamps Centro' },
    {val: 'rayodesol',    label: 'Rayo de Sol' },
    {val: 'ampliacionsantarita',    label: 'Ampl. Santa Rita' },
    {val: 'santarita',    label: 'Santa Rita' },
    {val: 'jorgenewber',    label: 'Jorge Newber' },
    {val: 'lacarmen',    label: 'La Carmen' },
    {val: 'ferroviario',    label: 'Ferroviario' },
    {val: 'losfrutales',    label: 'Los Frutales' },
    {val: 'santaadela',    label: 'Santa Adela' },
    {val: 'camporamos',    label: 'Campo Ramos' },
    {val: 'doñasol',    label: 'Doña Sol' },
    {val: 'santamaria',    label: 'Santa María' },
    {val: 'sakura',    label: 'Sakura' },
    {val: 'laesperanza',    label: 'La Esperanza' },
    {val: 'eltriángulo',    label: 'El Triángulo' },
    {val: 'longchampseste',    label: 'Longchamps Este' },
    {val: 'casasblancas',    label: 'Casas Blancas' },
    {val: 'amutun1',    label: 'Amutun 1' },
    {val: 'amutun2',    label: 'Municipal' },
    {val: 'municipal',    label: 'Amutun 2' },
    {val: 'losstud',    label: 'Los Stud' },
    {val: 'donluis',    label: 'Don Luis' },
    {val: 'villaparis',    label: 'Villa París' },
    {val: 'amancay',    label: 'Amancay' },
  ],

  malvinasargentinas: [
    {val: 'malvinasargentinas',    label: 'Malvinas Argentinas' },
    {val: 'elcanario',    label: 'El Canario' },
    {val: 'barriolindo',    label: 'Barrio Lindo' },
    {val: 'lomaverde',    label: 'Loma Verde' },
    {val: 'elencuentro',    label: 'El Encuentro' },
    {val: 'betharran',    label: 'Betharrán' },
   ],

  marmol: [
    {val: 'marmol',    label: 'Mármol Ctro' },
    {val: 'martinarin',    label: 'Martín Arín' },
    {val: 'arca',    label: 'Arca' },
   ],

  ministrorivadavia: [
    {val: 'ministrorivadavia',    label: 'Ministro Rivadavia Ctro' },
    {val: 'tsuji',    label: 'Tsuje' },
    {val: 'parquerivadavia',    label: 'Parque Rivadavia' },
    {val: 'lujan',    label: 'Luján' },
    {val: 'gralbelgrano',    label: 'Gral Belgrano' },
    {val: 'lospinos',    label: 'Los Pinos' },
    {val: 'gendarmeria',    label: 'Gendarmería' },
  ],
  solano: [
    {val: 'solano',    label: 'Solano' },
    {val: 'nuevapompeya',    label: 'Nueva Pompeya' },
    {val: 'loschalet',    label: 'Los Chalet' },
    {val: 'loseucaliptus',    label: 'Los Eucaliptus' },
    {val: 'losmonoblock',    label: 'Los Monoblock' },
    {val: 'lastunas',    label: 'Las Tunas' },
    {val: 'zabala',    label: 'Zabala' },
    {val: 'villalaura',    label: 'Villa Laura' },
    {val: 'guadalupe',    label: 'Guadalupe' },
    {val: 'santacatalina',    label: 'Santa Catalina' },
    {val: 'sangustin',    label: 'San Agustín' },
    {val: 'lomasdesolano',    label: 'Las Lomas de Solano' },
    {val: 'santaisabel',    label: 'Santa Isabel' },

  ],
  sanjose: [
    {val: 'sanjose',    label: 'San José Ctro' },
    {val: 'tierradejerusalen',    label: 'Tierra de Jerusalén' },
    {val: '27demarzo',    label: '27 de marzo' },
    {val: 'sanmarcos',    label: 'San Marcos' },
    {val: 'lagloria',    label: 'La Gloria' },
    {val: '8denoviembre',    label: '8 de Noviembre' },
    {val: 'sanramon',    label: 'San Ramón' },
    {val: '8dediciembre',    label: '8 de Diciembre' },
    {val: 'latablada',    label: 'La Tablada' },
    {val: 'evita',    label: 'Evita' },
    {val: 'puertoargentino',    label: 'Puerto Argentino' },
    {val: 'launion',    label: 'La Unión' },
    {val: 'sanagustin',    label: 'San Agustín' },
    {val: 'virgendelujan',    label: 'Vírgen de Luján' },
    {val: 'elombu',    label: 'El Ombú' },
  ],

};

const nivelEstudios = [
    {val: 'primario',       brown: 'Primario',          slug:'Primario' },
    {val: 'primariox',      brown: 'Primario incompleto',          slug:'Primario (incompleto)' },
    {val: 'secundario',     brown: 'Secundario',        slug:'Secundario' },
    {val: 'secundariox',    brown: 'Secundario incompleto',    slug:'Secundario (incompleto)' },
    {val: 'terciario',      brown: 'Terciario',         slug:'Terciario' },
    {val: 'terciariox',     brown: 'Terciario incompleto',     slug:'Terciario (incompleto)' },
    {val: 'universitario',  brown: 'Universitario',     slug:'Universitario' },
    {val: 'universitariox', brown: 'Universitario incompleto', slug:'Universitario (incompleto)' },
    {val: 'posgrado',       brown: 'Posgrado',          slug:'Posgrado' },
    {val: 'posgradox',      brown: 'Posgrado incompleto',      slug:'Posgrado (incompleto)' },
    {val: 'doctorado',      brown: 'Doctorado',         slug:'Doctorado' },
    {val: 'doctoradox',     brown: 'Doctorado incompleto',     slug:'Doctorado (incompleto)' },
    {val: 'noposee',        brown: 'Analfabeto',              slug:'No Posee' },
    {val: 'otra',           brown: 'Otra',              slug:'Otra' },
];


const tipos_viv = [
        {val: 'interno',      type:'interno', label: 'Interno' },
        {val: 'externo',      type:'interno', label: 'Externo' },
        {val: 'otro',         type:'interno', label: 'Otro' },

        {val: 'cocinagas',     type:'cocina',  label: 'A gas'  },
        {val: 'cocinaelec',    type:'cocina',  label: 'Eléctrica' },
        {val: 'anafe',         type:'cocina',  label: 'Anafe'  },
        

        {val: 'insuficiente', type:'suficiente',  label: 'Insuficiente'  },
        {val: 'basico',       type:'suficiente',  label: 'Básico' },
        {val: 'suficiente',   type:'suficiente',  label: 'Suficiente'  },
        
        {val: 'propio',       type:'terreno', btype:'tenencia' ,brown: 'Propia' },
        {val: 'alquilado',    type:'terreno', btype:'tenencia' ,brown: 'Alquilada' },
        {val: 'cedido',       type:'terreno', btype:'tenencia' ,brown: 'Cedida' },
        {val: 'usurpada',     type:'terreno', btype:'tenencia' ,brown: 'Usurpada' },
        {val: 'sindocum',     type:'terreno', btype:'tenencia' ,brown: 'SinDocum' },
        {val: 'credhipo',     type:'terreno', btype:'tenencia' ,brown: 'Crédito Hipot' },

        {val: 'casa',         type:'tvivienda', label: 'Casa' }, 
        {val: 'depto',        type:'tvivienda', label: 'Departamento' },
        {val: 'casilla',      type:'tvivienda', label: 'Casilla' },
        {val: 'otro',         type:'tvivienda', label: 'Otro' },

        {val: 'chapa',        type:'mvivienda', btype:'paredes_ext', brown: 'Chapa' },
        {val: 'adobe',        type:'mvivienda', btype:'paredes_ext', brown: 'Adobe' },
        {val: 'ladrillo',     type:'mvivienda', btype:'paredes_ext', brown: 'Ladrillos' },
        {val: 'madera',       type:'mvivienda', btype:'paredes_ext', brown: 'Madera' },
        {val: 'otro',         type:'mvivienda', btype:'paredes_ext', brown: 'Otros' },

        {val: 'mampos',       type:'techo', btype:'techo', brown: 'Mampostería' },//techo
        {val: 'chapacarton',  type:'techo', btype:'techo', brown: 'Chapa Cartón' },
        {val: 'chapafibrocemento',   type:'techo', btype:'techo', brown: 'Chapa Fibrocemento' },
        {val: 'chapazinc',    type:'techo', btype:'techo', brown: 'Chapa Zinc' },
        {val: 'chapa',        type:'techo', btype:'techo', brown: 'chapa' },
        {val: 'madera',       type:'techo', btype:'techo', brown: 'madera' },
        {val: 'tejas',        type:'techo', btype:'techo', brown: 'tejas' },
        {val: 'otro',         type:'techo', btype:'techo', brown: 'otro' },

        {val: 'mosaico',      type:'piso', btype:'piso', brown: 'Mosaico' },
        {val: 'cemento',      type:'piso', btype:'piso', brown: 'Cemento' },
        {val: 'ceramico',     type:'piso', btype:'piso', brown: 'Cerámicos' },
        {val: 'ladrillo',     type:'piso', btype:'piso', brown: 'Ladrillo' },
        {val: 'tierra',       type:'piso', btype:'piso', brown: 'Tierra' },
        {val: 'otro',         type:'piso', btype:'piso', brown: 'Otro' },

        {val: 'red',          type:'agua', btype:'agua', brown: 'Red' },
        {val: 'pozo',         type:'agua', btype:'agua', brown: 'Aljibe' },
        {val: 'bombaelectrica', type:'agua', btype:'agua', brown: 'Motobombeador' },
        {val: 'bombamanual',    type:'agua', btype:'agua', brown: 'Bomba manual' },
        {val: 'otro',         type:'agua', btype:'agua', brown: 'Otro' },

        {val: 'red',          type:'electricidad', btype:'luz', brown: 'Eléctrica' },
        {val: 'colgado',      type:'electricidad', btype:'luz', brown: 'Colgado' },
        {val: 'otro',         type:'electricidad', btype:'luz', brown: 'Otro' },

        {val: 'cloaca',       type:'cloaca', btype:'desague', brown: 'Cloaca' },
        {val: 'pozociego',    type:'cloaca', btype:'desague', brown: 'Pozo Negro' },
        {val: 'otro',         type:'cloaca', btype:'desague', brown: 'Otro' },

        {val: 'red',          type:'gas', btype:'gas', brown: 'Gas de Red' },
        {val: 'envasado',     type:'gas', btype:'gas', brown: 'Gas de Garrafa' },
        {val: 'otro',         type:'gas', btype:'gas', brown: 'otro' },

        {val: 'bueno',          type:'calificacion',  btype:'estado', brown: 'Bueno'  },
        {val: 'regular',        type:'calificacion',  btype:'estado', brown: 'Regular'  },
        {val: 'malo',           type:'calificacion',  btype:'estado', brown: 'Malo'  },



];


const optList = {
    estadocivil: estadoCivil,
    sexo: sexoOptList,
    city: ciudadesBrown,
    cityalimentar: ciudadesTalimentar,
    nacionalidad: nacionalidadOptList,
    barrio: barriosOptList,
    estudios: nivelEstudios,
}

const translate = function(type, value){
    if(!value) return '';
    let token = optList[type].find(t => t.brown === value);
    if(token) return token.val;
    else return value;
}

const normalize = function(type, value){
    if(!value) return '';
    let token = optList[type].find(t => value.indexOf(t.brown) !== -1);

    if(token) return token.val;
    else return value;
}
const normalizeSubData = function(type, subtype, value){
    let list = optList[type][subtype];

    if(value && list) {
        let token = list.find(t => t.val === value);
        if(token) return token.val;
    }
    return value;
}

const hasEncuesta = function(token){
    let hasEncuesta = false;
    if(token.id45 && token.id45!=="NULL"){
        hasEncuesta = true;
    }

    return hasEncuesta;
}
const getAddress = function(person){
    let address = person && person.locaciones && person.locaciones[0];
    if(!address){
        address = {
            street1: 'sin dato',
            city: 'sin dato',
            barrio: 'sin dato'
        }
    }
    return address;
}

const translateEncuesta = function(type, value){
    if(!value) return '';
    let token = tipos_viv.find(t => t.btype=type && t.brown === value);
    if(token) return token.val;
    else return value;
}

const ventilacionType = function(value){
    if(value === 'Bueno') return 'adecuado';
    if(value === 'Malo' || value ==="Regular")return 'inadecuado';

    return '';
}

const cocinaType = function(cocina, heladera){
    if(cocina === 'Si' && heladera === "Si") return 'bueno';
    if(cocina === 'No' || heladera === "No") return 'regular';

    return 'malo';
}

const banioType = function(banio){
    if(!banio || banio === "NULL") return '';
    if(banio === 'Otro') return 'otro';

    if(banio.indexOf('Interno')!== -1) return 'interno';
    return 'externo';
}

const banioEval = function(baniera, lavatorio, ducha, grifo){
    if(baniera==="Si" && lavatorio==="Si" && ducha==="Si" ) return 'completo';
    if(lavatorio==="Si" && ducha==="Si" ) return 'basico';
    return 'incompleto';
}


    // street1:     {type: String,  required: false, defalut: ''}, //OjO
    // city:        {type: String,  required: false, defalut: ''},
    // barrio:      {type: String,  required: false, defalut: ''},
/**
    tenencia:[domterreno] [terreno]=> Alquilada, Cedida, NULL, Propia, Usurpada
    tipo: [???] Compartido, Unifamiliar
    sup_terreno|sup_edificada: no está en uso
    cant_modulos:[qvivxlote]? 1, 2, 3  
    habitaciones:[qdormitorios] 1,2, 3, 4, 5
    habitantes:       1-10 numerico
    paredes_ext
    paredes_int
    agua:[agua]  [agua]=> Aljibe, Bomba manual, Motobombeador, NULL, Otro, Red
    luz:[electricidad]
    gas:[gas]
    banio:[interno]
    baniera/lavatorio/grifo/ducha: No, Si
    desague:[cloaca]
    cocina/heladera
    iluminacion/ventilacion:[tventilacion]/estado:[calificacion]
    observacion


*/

/********

    id_address:   {type: String, required: false, default: ''},
    id_person:    {type: String, required: false, default: ''},
    street1:     {type: String,  required: false, defalut: ''}, //OjO
    city:        {type: String,  required: false, defalut: ''},
    barrio:      {type: String,  required: false, defalut: ''},
    estado:       {type: String, required: false, default: 'activo'},

    ferel:        {type: String, required: false, default: ''},
    fereltxt:     {type: String, required: false, default: ''},
    tsocial:      {type: String, required: false, default: ''},

    tipoviv:      {type: String, required: false, default: ''},
    domterreno:   {type: String, required: false, default: ''}, // tenencia    
    aniosresid:   {type: Number, required: false, default: 0 },
    qvivxlote:    {type: Number, required: false, default: 0 }, //cant_modulos
    matviv:       {type: String, required: false, default: ''},
    techoviv:     {type: String, required: false, default: ''},
    pisoviv:      {type: String, required: false, default: ''},  //piso
    qdormitorios: {type: Number, required: false, default: 1 }, // habitaciones
    tventilacion: {type: String, required: false, default: ''},
    tcocina:      {type: String, required: false, default: ''},
    ecocina:      {type: String, required: false, default: ''},
    tbanio:       {type: String, required: false, default: ''},
    ebanio:       {type: String, required: false, default: ''},
    tmobiliario:  {type: String, required: false, default: ''},
    emobiliario:  {type: String, required: false, default: ''},
    agua:         {type: String, required: false, default: ''},
    electricidad: {type: String, required: false, default: ''},
    cloaca:       {type: String, required: false, default: ''},
    gas:          {type: String, required: false, default: ''},




*******/




const buildEncuesta = function(person, token){
    let ambiental = [];
    let encuesta = {};

    if(!hasEncuesta(token)){
        return;
    }

    let address = getAddress(person);

    encuesta.id_address = '';
    encuesta.id_person = '';
    encuesta.street1 = address.street1;
    encuesta.city = address.city;
    encuesta.barrio = address.barrio;

    encuesta.estado = "activo";

    encuesta.ferel = Date.now();
    encuesta.fereltxt = '31/10/2019';
    encuesta.tsocial = 'dato migrado';

    encuesta.tipoviv = "casa";

    encuesta.domterreno = translateEncuesta('tenencia', token.tenencia);
    encuesta.aniosresid = 0;

    encuesta.qvivxlote = (token.cant_modulos === "NULL" || !token.cant_modulos) ? 0 : parseInt(token.cant_modulos, 10);
    encuesta.qhabitantes = (token.habitantes === "NULL" || !token.habitantes) ? 0 : parseInt(token.habitantes, 10);

    encuesta.matviv = translateEncuesta('paredes_ext', token.paredes_ext);
    encuesta.techoviv = translateEncuesta('techo', token.techo);
    encuesta.pisoviv = translateEncuesta('piso', token.piso);

    encuesta.qdormitorios = (token.habitaciones === "NULL" || !token.habitaciones) ? 0 : parseInt(token.habitaciones, 10);
    encuesta.tventilacion = ventilacionType(token.ventilacion);
    encuesta.tcocina = '';
    encuesta.ecocina = cocinaType(token.cocina, token.heladera);
    encuesta.tbanio = banioType(token.banio);
    encuesta.ebanio = banioEval(token.baniera, token.lavatorio, token.ducha, token.grifo)
    encuesta.tmobiliario = '';
    encuesta.emobiliario = '';
    encuesta.agua = translateEncuesta('agua', token.agua); 
    encuesta.electricidad = translateEncuesta('luz', token.luz); 
    encuesta.cloaca = translateEncuesta('desague', token.desague); 
    encuesta.gas = translateEncuesta('gas', token.gas); 
    encuesta.iluminacion = translateEncuesta('estado', token.iluminacion);
    encuesta.observacion = token['observaciones72'];

    ambiental.push(encuesta);
    person.ambiental = ambiental;

}

/*******

            <column name="grupo_familiar">14196</column>
            <column name="tenencia">Usurpada</column>
            <column name="tipo">Unifamiliar</column>
            <column name="sup_terreno">NULL</column>
            <column name="sup_edificada">NULL</column>
            <column name="cant_modulos">1</column>
            <column name="habitaciones">3</column>
            <column name="habitantes">4</column>
            <column name="piso">NULL</column>
            <column name="techo">NULL</column>
            <column name="paredes_ext">NULL</column>
            <column name="paredes_int">NULL</column>
            <column name="agua">Motobombeador</column>
            <column name="luz">Eléctrica</column>
            <column name="gas">Gas de Red</column>
            <column name="banio">Interno con descarga de agua</column>
            <column name="baniera">NULL</column>
            <column name="lavatorio">NULL</column>
            <column name="ducha">NULL</column>
            <column name="grifo">NULL</column>
            <column name="desague">NULL</column>
            <column name="cocina">NULL</column>
            <column name="heladera">NULL</column>
            <column name="estado">NULL</column>
            <column name="ventilacion">NULL</column>
            <column name="iluminacion">NULL</column>
            <column name="observaciones"></column>



*******/

/*****
    type:          { type: String, required: true, default: false },
    tingreso:      { type: String, required: true, default: 'noposee'},
    slug:          { type: String, required: false },
    monto:         { type: Number, required: false },
    observacion:   { type: String, required: false }
****/

const buildDatosIngresos = function(person, token){

    let ingresosList = [];
    let ingreso1, ingreso2, ingreso3, ingreso4, ingreso5, ingreso6;
    let beneficiosTxt = token.beneficios ? token.beneficios.toLowerCase() : '';
    let _testIngresos = parseInt(token.ingresos, 10);
    let montoIngresos = 0;
    if(!isNaN(_testIngresos)){
        montoIngresos = _testIngresos;
    }



    let no_beneficios = ['no', 'aduce no recibir', 'infiere no', 'infiere no percibir', 'infiere no percibir', 'aduce no poseer', 'no posee', 'NULL']

    if(token.ingresos){
        ingreso1 = {
            type: 'ingreso',
            tingreso: 'ingreso',
            slug: 'ingreso manifestado',
            monto: montoIngresos,
            estado: 'activa',
            fecha: '',
            fe_ts: 0,
            observacion: token.ingresos
        }
        ingresosList.push(ingreso1);
    }

    if(token.obra_social === 'Si'){
        ingreso2 = {
            type: 'cobertura',
            tingreso: 'osocial',
            slug: token.obra_social_cual,
            monto: 0,
            estado: 'activa',
            fecha: '',
            fe_ts: 0,
            observacion: ''
        }
        ingresosList.push(ingreso2);
    }

    if( beneficiosTxt && no_beneficios.indexOf(beneficiosTxt) === -1) {

        let claves = ['pensi', 'auh', 'plan'];

        if(beneficiosTxt.indexOf('pensi') !== -1 ){
            ingreso3 = {
                type: 'pension',
                tingreso: 'pension',
                slug: token.beneficios,
                monto: 0,
                estado: 'activa',
                fecha: '',
                fe_ts: 0,
                observacion: ''
            }
            ingresosList.push(ingreso3);
        } 

        if(beneficiosTxt.indexOf('auh') !== -1 ){
            ingreso4 = {
                type: 'auh',
                tingreso: 'auh',
                slug: token.beneficios,
                monto: 0,
                estado: 'activa',
                fecha: '',
                fe_ts: 0,
                observacion: ''
            }
            ingresosList.push(ingreso4);
        }

        if(beneficiosTxt.indexOf('plan') !== -1 ){
            ingreso5 = {
                type: 'asisprovincial',
                tingreso: 'plan',
                slug: token.beneficios,
                monto: 0,
                estado: 'activa',
                fecha: '',
                fe_ts: 0,
                observacion: ''
            }
            ingresosList.push(ingreso5);
        }

        if(!claves.find(t => beneficiosTxt.indexOf(t) !== -1 )){
            ingreso6 = {
                type: 'otros',
                tingreso: 'otros',
                slug: token.beneficios,
                monto: 0,
                observacion: ''
            }
            ingresosList.push(ingreso6);
        }

    }

    if(ingresosList.length){

        person.cobertura = ingresosList;
    }else{
        person.cobertura = [];
    }

}


const buildDatosSanitarios = function(person, token){
    let salud = [];
    let enfermedad, discapacidad;

    if(token.padece_enfermedad === "Si"){
        enfermedad = {
            type: 'enfermedad',
            tproblema: 'inespecifica',
            problema: token.especifique_enfermedad,
            lugaratencion: token.lugar_atencion,
            slug: '',
        }
        salud.push(enfermedad);
    }

    if(token.tiene_discapacidad === "Si"){
        discacidad = {
            type: 'discapacidad',
            tproblema: 'inespecifica',
            problema: token.especifique_discapacidad || '',
            lugaratencion: token.lugar_atencion,
            slug: '',
        }
        salud.push(discacidad);
    }

    person.salud = salud;

    /**
    lugar_atencion
    tenfermedad? enfermedad
    tdiscapacidad? discapacidad

        type:       { type: String, required: true },
    tproblema:  { type: String, required: true },
    problema:   { type: String, required: false },
    slug:       { type: String, required: false },


    ***/

}



/**
    tipo de cobertura médica: no; os, prepaga, pami, 
    prestador:


boolean: obra_social
obra_social_cual

lugar_atencion

boolean: padece_enfermedad
especifique_enfermedad

boolean: tiene_discapacidad
especifique_discapacidad

beneficios



**/

const buildDatosContacto = function(person, token){
    let datos = [], dato;
    if(token.telefono){
        dato = {
            tdato:       "TEL",
            data:        token.telefono,
            type:        "PER",
            slug:        "",
            isPrincipal: true,
        }
        datos.push(dato);
    }

    if(token.telefono_celular){
        dato = {
            tdato:       "CEL",
            data:        token.telefono_celular,
            type:        "PER",
            slug:        "",
            isPrincipal: true,
        }
        datos.push(dato);
    }

    if(token.email){
        dato = {
            tdato:       "CEL",
            data:        token.email,
            type:        "PER",
            slug:        "",
            isPrincipal: true,
        }
        datos.push(dato);
    }
    person.contactdata = datos;

}
/*** 
    tdato:       { type: String, required: true },
    data:        { type: String, required: true },
    type:        { type: String, required: false },
    slug:        { type: String, required: false },
    isPrincipal: { type: String, required: false },


***/


const buildLocaciones = function(person, token){
    let locaciones = [];
    let city = normalize ('city', (token.localidad ? token.localidad.toLowerCase() : ''));
    let barrio = token.barrio ? token.barrio.toLowerCase() : '';

    let locacion = {
        "slug": "domicilio informado",
        "description": "",
        "isDefault": true,
        "addType": "principal",
        "street1": token.calle + ' ' + token.numero,
        "street2": "",
        "streetIn": token.entre1,       
        "streetOut": token.entre2,
        "city": city,
        "state": "buenosaires",
        "statetext": "Brown",
        "zip": token.codigo_postal || '',
        "country": "AR",
        "estado": "activo",
        "barrio": normalizeSubData('barrio', city, barrio),

    }

    locaciones.push(locacion);
    person.locaciones = locaciones;
}

/***
"_id": "5d23c753675a3f0818fa6552",
"slug": "dirección en el DNI",
"description": "",
"isDefault": true,
"addType": "dni",
"street1": "Borges 1234",
"street2": "",
"city": "burzaco",
"state": "buenosaires",
"statetext": "Brown",
"zip": "1852",
"country": "AR",
"estado": "activo",
"barrio": "lapi
**/

const buildCoreData = function(person, token){
    let nombre = token.nombre;
    let apellido = token.apellido;
    let fenac = utils.parsePHPDateStr(token.fecha_nacimiento);
    let gf = parseInt(token.grupo_familiar46, 10);

    person.idbrown = token.id;
    person.isImported = true;



    if(!isNaN(gf)){
        person.grupo_familiar = gf;
    }else{
        person.grupo_familiar = 0;
    }

    person.displayName = apellido + ', ' + nombre;

    personType = 'fisica';
    person.email = token.email;
    person.locacion = token.calle + ' ' + token.numero + ' ' + token.locacion;
    person.nombre = token.nombre;
    person.apellido = token.apellido;
    person.tdoc = token.documento_tipo;
    person.ndoc = token.documento_nro;
    person.cuil = token.cuil;

    person.fenac = fenac.getTime();
    person.fenactx = utils.dateToStr(fenac);

    person.ts_alta = utils.parsePHPTimeStamp(token.timestamp);
    person.ts_umodif = person.ts_alta;

    person.ecivil = translate('estadocivil', token.estado_civil) ;
    person.sexo = translate('sexo', token.sexo) ;

    person.nestudios = translate('estudios',token.estudios);
    person.persontags = [];
    person.tprofesion = token.profesion;
    person.especialidad = token.ocupacion;
    person.ambito = token.observaciones;
    person.nacionalidad = translate('nacionalidad',token.nacionalidad);

    // person.locaciones = token. ;
    // person.familiares = token. ;
    // person.user = token. ;
    // person.communitylist = token. ;
    // person.contactdata = token. ;
    // person.oficios = token. ;
}

/****
    tprofesion:     { type: String, required: false },
    especialidad:   { type: String, required: false },
    ambito:         { type: String, required: false },
    user:           { type: userSch, required: false },
    communitylist:  { type: Array,   required: false },
    contactdata:    [ contactDataSch ],
    oficios:        [ oficiosSch ],
    nacionalidad:   { type: String, required: false },
    fenac:          { type: Number, required: false },
    fenactx:        { type: String, required: false },
    nestudios:      { type: String, required: false },
    ecivil:         { type: String, required: false },
    sexo:           { type: String, required: false },
    locaciones:     [ addressSch ],
    familiares:     [ familySch ],

    messages:       [ notif_messageSch ],
    fichas:         [ recordCardSch ]



****/
async function saveRecord(person, master){
    if(master[person.idbrown]){
        person._id = master[person.idbrown];

        await Person.findByIdAndUpdate(person._id, person, { new: true }).exec();

    }else{
        if(person.idbrown){
            master[person.idbrown] = person._id;
        }

        await person.save();
    }

}

const insertImportedPerson = function(token, master){
    let person = new Person();

    buildCoreData(person, token);
    buildLocaciones(person, token);
    buildDatosContacto(person, token);
    buildDatosSanitarios(person, token);
    buildDatosIngresos(person, token);
    buildEncuesta(person, token);

    saveRecord(person, master);
}

/*****
{ id: '1',

  referente: 'NULL',
  referente_otro: undefined,
  grupo_familiar: 'NULL',
  vinculo: undefined,

  id_sintys: 'NULL',
  miembro_inicial: 'NULL',
  id15: '1',
  persona: '1',

  lugar_nacimiento_prov: 'MENDOZA',
  lugar_nacimiento_loc: 'MENDOZA',

  telefono: undefined,
  telefono_celular: '011-15-50558278',
  email: undefined,

  estado_civil: 'NULL',
  estudios: 'NULL',
  otros: undefined,
  profesion: undefined,
  ocupacion: undefined,
  ingresos: undefined,
  obra_social: 'NULL',
  obra_social_cual: undefined,
  lugar_atencion: undefined,
  observaciones: 'NULL',
  padece_enfermedad: 'NULL',
  especifique_enfermedad: undefined,
  tiene_discapacidad: 'Si',
  especifique_discapacidad: 'ACOMP_MOTORA',
  beneficios: 'AUH',
  id45: 'NULL',
  grupo_familiar46: 'NULL',
  tenencia: 'NULL',
  tipo: 'NULL',
  sup_terreno: 'NULL',
  sup_edificada: 'NULL',
  cant_modulos: 'NULL',
  habitaciones: 'NULL',
  habitantes: 'NULL',
  piso: 'NULL',
  techo: 'NULL',
  paredes_ext: 'NULL',
  paredes_int: 'NULL',
  agua: 'NULL',
  luz: 'NULL',
  gas: 'NULL',
  banio: 'NULL',
  baniera: 'NULL',
  lavatorio: 'NULL',
  ducha: 'NULL',
  grifo: 'NULL',
  desague: 'NULL',
  cocina: 'NULL',
  heladera: 'NULL',
  estado: 'NULL',
  ventilacion: 'NULL',
  iluminacion: 'NULL' }

****/

const processOnePerson = function(token, master){
    let data = token.column,
        person = {};

    data.forEach((el,index)=>{
        if(!person[el.$.name]){
            person[el.$.name] = (el._ === 'NULL') ? '' : el._;
        }else{
            person[el.$.name + index] = (el._ === 'NULL') ? '' : el._;

        }

    });

    insertImportedPerson(person, master);


}

const processImportedPersons = function(data, errcb, cb){
    let table = data.database.table;
    const personMaster = {};

    table.forEach((token, index) => {
        processOnePerson(token, personMaster);

    });




}


const processArchive = function(req, errcb, cb){
    const arch = path.join(config.rootPath, 'www/dsocial/migracion/persona/persona.xml');
    //const arch = path.join(config.rootPath, 'public/migracion/persona/persona.xml');


    function toLowerCase(name){
        return name.toLowerCase();
    }

    function toUpperCase(name){
        return name.toUpperCase();
    }


    let parser = new xml2js.Parser();

    fs.readFile(arch, function( err, data){
        if(err){
            console.dir(err);

        }else{
            parser.parseString(data, 

            function(err, jdata){
                if(err){
                    console.log('error*************')
                    console.dir(err);

                }else{
                    cb({result: "ok"})
                    processImportedPersons(jdata, errcb, cb);

                }
            });
        }
    });


}


async function saveAlimentarRecord(person, master){
    if(master[person.ndoc]){

        await Person.findByIdAndUpdate(person._id, {alerta: person.alerta, cobertura: person.cobertura}, { new: true }).exec();

    }else{

        await person.save();
    }

}

function saveSaludRecord(person, master){
    if(master[person.ndoc]){

        Person.findByIdAndUpdate(person._id, {alerta: person.alerta, cobertura: person.cobertura}, { new: true }).then( person =>  {
            if(person && person._id){
                //c onsole.log('UPDATAED: Person [%s] [%s]', person._id, person.displayName);
            }
        })

    }else{

        person.save().then(person =>{
            if(person && person._id){
                //c onsole.log('CREATED: Person [%s] [%s]', person._id, person.displayName);
            }

        })
    }

}

const buildAlimentarCoreData = function(person, token){
    person.grupo_familiar = 0;

    person.displayName = token.displayName;
    let nombres = person.displayName.split(' ');
    let nombre = nombres && nombres.length && nombres[0];

    let apellido = nombres.reduce((acum, t, index) => {
        if(index === 0 ) return "";
        else return acum + " " + t;
    },"");

    personType = 'fisica';
    person.isImported = true;
    person.idbrown = "TALIMENTAR";
    person.alerta = 'Recibe TARJETA ALIMENTAR Club Calzada - Enero 2020 - Día: ' + token.dia + ' - Hora: ' + token.hora;
    person.locacion = token.calle + ' ' + token.callenro + ' ' + token.city;
    person.nombre = nombre;
    person.apellido = apellido;

    person.tdoc = 'DNI';
    person.ndoc = token.ndoc;
    person.cuil = token.ncuil;


    person.ts_alta = Date.now();
    person.ts_umodif = person.ts_alta;

    // person.locaciones = token. ;
    // person.familiares = token. ;
    // person.user = token. ;
    // person.communitylist = token. ;
    // person.contactdata = token. ;
    // person.oficios = token. ;
}
const buildSaludCoreData = function(person, token){
    // familyref
    // dniref
    // telefono

    person.grupo_familiar = 0;
    person.apellido = token.apellido
    person.nombre = token.nombre

    person.displayName = person.apellido + ', ' + person.nombre;

    personType = 'fisica';

    person.isImported = true;

    person.idbrown = "20140421-11:31";
    person.alerta = token.alerta;
    person.locacion = token.street1 + ' ' + token.city;

    person.tdoc = 'DNI';
    person.ndoc = token.ndoc;
    //person.cuil = token.ncuil;


    person.ts_alta = Date.now();
    person.ts_umodif = person.ts_alta;

    let contactdata = {
        tdato: 'CEL',
        data: token.telefono || 'sin dato',
        type:  'PER',
        slug: 'dato importado de excel',
        isPrincipal: true,

    }
    person.contactdata = [ contactdata]

    // person.locaciones = token. ;
    // person.familiares = token. ;
    // person.user = token. ;
    // person.communitylist = token. ;
    // person.contactdata = token. ;
    // person.oficios = token. ;
}
//http://localhost:8080/api/persons/saludimport
const buildSaludLocaciones = function(person, token){
    let locaciones = [];
    let city = token.city;
    let barrio =  '';

    let locacion = {
        "slug": "domicilio informado",
        "description": "Importado de excell",
        "isDefault": true,
        "addType": "principal",
        "street1": token.street1 || 'sin dato',
        "street2": "",
        "streetIn": "",       
        "streetOut": "",
        "city": city || 'extradistrito',
        "state": "buenosaires",
        "statetext": "Brown",
        "zip": '',
        "country": "AR",
        "estado": "activo",
        "barrio": "",

    }

    locaciones.push(locacion);
    person.locaciones = locaciones;
}

const buildAlimentarLocaciones = function(person, token){
    let locaciones = [];
    let city = normalize ('cityalimentar', (token.city ? token.city.toLowerCase() : ''));
    let barrio =  '';

    let locacion = {
        "slug": "domicilio informado",
        "description": "Informado por Tarjeta Alimentar",
        "isDefault": true,
        "addType": "principal",
        "street1": token.calle + ' ' + token.callenro,
        "street2": "",
        "streetIn": "",       
        "streetOut": "",
        "city": city,
        "state": "buenosaires",
        "statetext": "Brown",
        "zip": '',
        "country": "AR",
        "estado": "activo",
        "barrio": "",

    }

    locaciones.push(locacion);
    person.locaciones = locaciones;
}


const buildAlimentarCobertura = function(person, token){
    let ingreso4 = {
        type: 'auh',
        tingreso: 'talimentar',
        slug: 'Tarjeta ALIMENTAR entrega prevista: ' + token.dia + ' ' + token.hora,
        monto: 0,
        estado: 'pendiente',
        fecha: '',
        fe_ts: 0,
        observacion: ''
    }

    let ingresosList = token.cobertura || [];
    ingresosList.push(ingreso4);
    person.cobertura = ingresosList;

}




const processOneAlimentarPerson = function(token, master){
    let person = new Person();

    if(master[token.ndoc]){
        person._id = master[token.ndoc]._id;
    }

    buildAlimentarCoreData(person, token);
    buildAlimentarLocaciones(person, token);
    buildAlimentarCobertura(person, token);

    saveAlimentarRecord(person, master);
}


const processOneSaludPerson = function(token, master){
    // contactref: 1: peron  2: familiares
    let person = new Person();

    if(master[token.ndoc]){
        person._id = master[token.ndoc]._id;
    }

    if(token.familyref === "1" || token.familyref === 1){
        //con sole.log('Es PERSON FULL [%s] [%s]', token.apellido, token.nombre)
    }else if(token.familyref === "2" || token.familyref === 2){
        //co nsole.log('Es FAMILIAR / CONTACTO  [%s] [%s]', token.apellido, token.nombre)
    }else {
        //c onsole.log('NO TENGO DATO DE SI ES PERSON [%s]', token.familyref)
    }

    buildSaludCoreData(person, token);
    buildSaludLocaciones(person, token);


    saveSaludRecord(person, master);
}


const processAlimentarPersons = function(personArray, personMaster, errcb, cb){

    let existentes = 0;
    personArray.forEach((token, index) => {

        if(personMaster[token.ndoc]){

            existentes += 1;

        }else {

        }   
        processOneAlimentarPerson(token, personMaster);

    });


}

const processSaludPersons = function(personArray, personMaster, errcb, cb){

    let existentes = 0;
    personArray.forEach((token, index) => {

        if(personMaster[token.ndoc]){

            existentes += 1;

        }else {

        }   
        processOneSaludPerson(token, personMaster);

    });


}

const processAlimentarArchive = function(master, req, errcb, cb){
    //deploy
    //const arch = path.join(config.rootPath, 'www/salud/migracion/personas/personasImportCsv.csv');

    // local
    const arch = path.join(config.rootPath,        'public/migracion/personas/personasImportCsv.csv');

    function toLowerCase(name){
        return name.toLowerCase();
    }

    function toUpperCase(name){
        return name.toUpperCase();
    }

    csv({delimiter: ';'})
    .fromFile(arch)
    .then((persons) => {
                    
        processAlimentarPersons(persons, master, errcb, cb)
        cb({result: "ok"})

    });
}


const processSaludArchive = function(master, req, errcb, cb){
    //deploy
    const arch = path.join(config.rootPath, 'www/salud/migracion/personas/personasImportCsv.csv');

    // local
    //const arch = path.join(config.rootPath,        'public/migracion/personas/personasImportCsv.csv');

    function toLowerCase(name){
        return name.toLowerCase();
    }

    function toUpperCase(name){
        return name.toUpperCase();
    }

    csv({delimiter: ','})
    .fromFile(arch)
    .then((persons) => {

        processSaludPersons(persons, master, errcb, cb)
                    
        //processAlimentarPersons(persons, master, errcb, cb)
        cb({result: "ok"})

    });
}

//http://localhost:8080/api/persons/alimentar

/**
 * Proceso de importación PERSONAS de SALDU
 * @param person
 * @param cb
 * @param errcb
 */
exports.saludImport = function (req, errcb, cb) {

    let promise = new Promise((resolve, reject)=> {
        Person.find(null, '_id displayName tdoc ndoc cobertura').lean().then(persons => {
            let master = {};
            persons.forEach(p => {
                master[p.ndoc] = {
                    _id: p._id,
                    tdoc: p.tdoc,
                    ndoc: p.ndoc,
                    displayName: p.displayName,
                    cobertura: p.cobertura
                }

            })
            resolve(master);

        });
    });

    promise.then(master => {

        processSaludArchive(master, req, errcb, cb);

    })        


};



//http://localhost:8080/api/persons/import

/**
 * Sign up a new person
 * @param person
 * @param cb
 * @param errcb
 */
exports.import = function (req, errcb, cb) {

    processArchive(req, errcb, cb);

};


exports.updateLocacion = function(personId, locacion){
    updateLocacionToken(personId, locacion);

}

//todoaca
async function updateLocacionToken(personId, nlocacion){
    let person = await Person.findById(personId).exec();
    if(person){
        let vlocacion = person.locaciones && person.locaciones.length && person.locaciones[0];
        if(!vlocacion){
            person.locaciones = [ nuevoRegistroLocacion(nlocacion) ]

        }else {
            updateRegistroLocacion(vlocacion, nlocacion)
        }

        await person.save();    

    }
}

function updateRegistroLocacion(vlocacion, nlocacion){
    vlocacion.street1  = nlocacion.street1;
    vlocacion.city  = nlocacion.city;
    vlocacion.cp  = nlocacion.cp;
    vlocacion.lat  = nlocacion.lat;
    vlocacion.lng  = nlocacion.lng;
  
}

function nuevoRegistroLocacion(nlocacion){
    let locacion = Object.assign({}, nlocacion);
    locacion.desription = 'Alta por Epidemiología';
    locacion.estado = 'activo';
    locacion.isDefault = true;
    locacion.addType = 'principal';
    locacion.country = 'AR';
    return locacion;
}

/****

    slug:        {type: String,  required: false,  defalut: ''},
    estado:      {type: String,  required: false, defalut: 'activo'},
    description: {type: String,  required: false, defalut: ''},
    isDefault:   {type: Boolean, required: false, defalut: false},
    addType:     {type: String,  required: false, defalut: 'principal'},
    street1:     {type: String,  required: false, defalut: ''},
    street2:     {type: String,  required: false, defalut: ''},
    streetIn:    {type: String,  required: false, defalut: ''},
    streetOut:   {type: String,  required: false, defalut: ''},
    city:        {type: String,  required: false, defalut: ''},
    barrio:      {type: String,  required: false, defalut: ''},
    state:       {type: String,  required: false, defalut: ''},
    statetext:   {type: String,  required: false, defalut: ''},
    zip:         {type: String,  required: false, defalut: ''},
    estadoviv:   {type: String,  required: false, defalut: 'activa'},
    cualificacionviv: {type: String,  required: false, defalut: 'buena'},
    encuesta:    {type: encuestaSch, required: false},
    country:     {type: String,  required: false, defalut: 'AR'},
    lat:         {type: Number,  required: false, defalut: -34.59},
    lng:         {type: Number,  required: false, defalut: -58.41}

***/



exports.buildIdTree = function(){
    let promise = new Promise((resolve, reject)=> {
        Person.find(null, '_id displayName fenac fenactx sexo tdoc ndoc locaciones').lean().then(persons => {
            let master = {};
            persons.forEach(p => {
                master[p._id] = {
                    _id: p._id,
                    tdoc: p.tdoc,
                    ndoc: p.ndoc,
                    fenac: p.fenac,
                    fenactx: p.fenactx,
                    sexo: p.sexo,
                    displayName: p.displayName,
                    locaciones: p.locaciones
                }

            })
            resolve(master);

        })
    });
    return promise;
}

exports.buildInvertedTree = function(){
    let promise = new Promise((resolve, reject)=> {
        Person.find(null, '_id displayName idbrown tdoc ndoc').lean().then(persons => {
            let master = {};
            persons.forEach(p => {
                if(p.idbrown){
                    master[p.idbrown] = {
                        _id: p._id,
                        tdoc: p.tdoc,
                        ndoc: p.ndoc,
                        displayName: p.displayName
                    }
                }

            })
            resolve(master);

        })


    });



    return promise;
}


exports.buildInvertedTreeForContactData = function(){
    let promise = new Promise((resolve, reject)=> {
        Person.find(null, '_id displayName tdoc ndoc contactdata').lean().then(persons => {
            let master = {};
            persons.forEach(p => {
                if(p.ndoc){
                    master[p.ndoc] = {
                        _id: p._id,
                        tdoc: p.tdoc,
                        ndoc: p.ndoc,
                        displayName: p.displayName,
                        contactdata: p.contactdata
                    }
                }

            })
            resolve(master);

        })


    });



    return promise;
}


//!ALT_Covid password en https://comunidad.cuidarnos.com/s/global-search/%20(%20SOMELLERA%201930%20)%20%20OR%20%20(%2033546345659%20)%20


//db.personas.updateOne({ndoc: '49740447'}, {$pull:  {familiares: {_id: ObjectId("5ebc7770c4a3e454f4118880")}}   })

// https://www.eldestapeweb.com/opinion/amado-boudou/-suenan-los-androides-con-salarios-pequenos--202051621160
//Good tests kill flawed theories, we remain alive to guess again 


// Some philosophers fail to distinguish propositions from judgments; … But in the real world it is more important that a proposition be interesting than that it be true.

// The importance of truth is that it adds to interest.

// ~ Alfred North Whitehead
