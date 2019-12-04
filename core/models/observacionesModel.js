/**
 * Observaciones
 */

const whoami =  "models/observacionModel: ";

const mongoose = require('mongoose');

const config = require('../config/config')
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const utils = require('../services/commons.utils');
const person = require('./personModel');



const Schema = mongoose.Schema;

const self = this;

const auditSch = new Schema({
  userId:      { type: String,   required: false },
  username:    { type: String,   required: false },
  ts_alta:     { type: Number,   required: false },
});

const parentSch = new Schema({
  entityType:  { type: String,   required: true },
  entityId:    { type: String,   required: true },
  entitySlug:  { type: String,   required: false },
});

const comentarioSch = new Schema({
  slug:       { type: String,   required: true },
  audit:      { type: auditSch, required: true },
});

const fileSch = new Schema({
  id:        { type: String,   required: false },
  name:      { type: String,   required: false },
  size:      { type: String,   required: false },
  extension: { type: String,   required: false },
});

/**
 * Creación de un Schema
 * @params
 */
const observacionSch = new Schema({
    type:        { type: String,    required: true },
    fe_tx:       { type: String,    required: true },
    fe_ts:       { type: Number,    required: true },
    ts_umod:     { type: Number,    required: true },
    is_pinned:   { type: Boolean,   required: false, default: false },
    observacion: { type: String,    required: true },
    parent:      { type: parentSch, required: false },
    audit:       { type: auditSch,  required: false },
    file:        { type: fileSch,   required: false },
    comentarios: [ comentarioSch ],

});


observacionSch.pre('save', function (next) {
    return next();
});


function buildQuery(query){

  let q = {};

  if(query['entityType']){
      q["parent.entityType"] = query['entityType'];
  }

  if(query['entityId']){
      q["parent.entityId"] = query['entityId'];
  }

  return q;
}


/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Record = mongoose.model('Observacion', observacionSch, 'observaciones');


/**
 * Retrieve all records
 * @param cb
 * @param errcb
 */
exports.findAll = function (errcb, cb) {
    Record.find(function(err, entities) {
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
    let regexQuery = buildQuery(query)

    Record.find(regexQuery, function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
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

    Record.findById(id, function(err, entity) {
        if (err){
            console.log('[%s] findByID ERROR() argument [%s]', whoami, arguments.length);
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};


/**
 * Upddate a new record
 * @param id
 * @param record
 * @param cb
 * @param errcb
 */
exports.update = function (id, record, errcb, cb) {

    Record.findByIdAndUpdate(id, record, { new: true } ,function(err, entity) {
        if (err){
            console.log('[%s] validation error as validate() argument [%s]',whoami)
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};

/**
 * Sign up a new record
 * @param record
 * @param cb
 * @param errcb
 */
exports.create = function (record, errcb, cb) {
    delete record._id;

    Record.create(record, function(err, entity) {
        if (err){
            console.log('[%s] validation error as validate() argument ',whoami);
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};




/*****************************************/
/*      Importación Sistema Anterior    */
/***************************************/
exports.importobservaciones = function (req, errcb, cb) {
    console.log('Import @OBSERVACIONES  ')
    //ToDo: ojo SQL que traiga también las pendientes

    buildTreeForObservaciones(req, errcb, cb);

};

function buildTreeForObservaciones(req, errcb, cb){
  person.buildInvertedTree().then(personTree => {
    if(personTree){
      console.log('PersonTree CREATED')
      //console.dir(personTree);
      processObservationArchive(personTree, req, errcb, cb)
    }

  });
}

function processObservationArchive(person_tree, req, errcb, cb){
    console.log('******  processARCHIVE to BEGIN ********')
    //const arch = path.join(config.rootPath,    'public/migracion/observaciones/observaciones.xml');
    const arch = path.join(config.rootPath, 'www/dsocial/migracion/observaciones/observaciones.xml');
    console.log('******  processARCHIVE OK ********')

    function toLowerCase(name){
        return name.toLowerCase();
    }

    function toUpperCase(name){
        return name.toUpperCase();
    }

    let parser = new xml2js.Parser();

    console.log('Ready to begin PROCESS: [%s]', arch);
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
                    console.log('Parser OK');
                    processObservacionesRecords(person_tree, jdata, errcb, cb);
                }
            });
        }
    });
}

function processObservacionesRecords(person_tree, data, errcb, cb){
    let table = data.database.table;

    const observacionesMaster = {};

    table.forEach((token, index) => {
        processEachObservacion(person_tree, observacionesMaster, token);

    });


    cb({process: "ok"});


}

function processEachObservacion(person_tree, master, token){
    let data = token.column,
        record = {};

    data.forEach((el,index)=>{
        if(!record[el.$.name]){
            record[el.$.name] = el._;
        }else{
            record[el.$.name + index] = el._;

        }
    });
    // console.dir(record);
    // console.log('---------------------------');
    populateMasterObservacion(person_tree, master, record);
}

const populateMasterObservacion = function(person_tree, master, record){

  /****
    const auditSch = new Schema({
      userId:      { type: String,   required: true },
      username:    { type: String,   required: true },
      ts_alta:     { type: Number,   required: true },
    });

    const parentSch = new Schema({
      entityType:  { type: String,   required: true },
      entityId:    { type: String,   required: true },
      entitySlug:  { type: String,   required: false },
    });

    const comentarioSch = new Schema({
      slug:       { type: String,   required: true },
      audit:      { type: auditSch, required: true },
    });


    const observacionSch = new Schema({
        type:        { type: String,    required: true },
        fe_tx:       { type: String,    required: true },
        fe_ts:       { type: Number,    required: true },
        ts_umod:     { type: Number,    required: true },
        is_pinned:   { type: Boolean,   required: false, default: false },
        observacion: { type: String,    required: true },
        parent:      { type: parentSch, required: false },
        audit:       { type: auditSch,  required: false },
        comentarios: [ comentarioSch ],
    });

  ****/

  let parent = {};
  let file = {};
  let audit = {};
  let person_master = person_tree[record.persona];
  let fe_ts = utils.parsePHPTimeStamp(record.timestamp);
  let fe = new Date(fe_ts);
  let fe_tx = utils.dateToStr(fe);

  if(person_master){
    // parent
    parent.entityType = 'person';
    parent.entityId = person_master._id;
    parent.entitySlug = person_master.displayName;

    audit.userId = 0 ;
    audit.username = 'Dato migrado - Fecha: ' + record.timestamp;
    audit.ts_alta = fe_ts;

    if(record.file !== 'NULL'){
      file.id = record.file;
      file.name = record.name;
      file.size = record.size;
      file.extension = record.extension;
    }
    
    let observacion = new Record({
            type:       'general',
            fe_tx:       fe_tx,
            fe_ts:       fe_ts,
            ts_umod:     fe_ts,
            is_pinned:   false,
            observacion: record.text || 'S/D' ,
            parent:      parent,
            audit:       audit,
            comentarios: [],
    });

    insertObservacionToDB(observacion);




  }else{
    console.log('AUXILIO: NO encuentro persona!!! [%s]', record.id)
  }





}

async function insertObservacionToDB (observacion){

  //console.dir(JSON.stringify(observacion));
  await observacion.save();

}




