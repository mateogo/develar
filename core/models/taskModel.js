/**
 * Tasks
 */

const whoami =  "models/taskModel: ";

const mongoose = require('mongoose');

const config = require('../config/config')

const path = require('path');

const utils = require('../services/commons.utils');

const Schema = mongoose.Schema;

const self = this;

const auditSch = new Schema({
  userId:      { type: String,   required: false },
  username:    { type: String,   required: false },
  ts_alta:     { type: Number,   required: false },
});

const parentEntitySch = new Schema({
  entityType:   { type: String, required: false },
  entityId:     { type: String, required: false },
  entitySlug:   { type: String, required: false },
  entityTag:    { type: String, required: false },
});

const beneficiarioSch = new Schema({
  personId:   { type: String, required: false },
  slug:       { type: String, required: false },
  tdoc:       { type: String, required: false },
  ndoc:       { type: String, required: false },
  telefono:   { type: String, required: false },
  locacion:   { type: String, required: false },
  locacionx:  { type: String, required: false },
  barrio:     { type: String, required: false },
  city:       { type: String, required: false },
  sexo:       { type: String, required: false },
  fenac:      { type: String, required: false },
  edad:       { type: String, required: false },
  nombre:     { type: String, required: false },
  apellido:   { type: String, required: false },
});


const followUpSch = new Schema({
  status:  { type: String,   required: true },
  slug:    { type: String,   required: true },
  audit:   { type: auditSch, required: false },
});

const parentSch = new Schema({
  entityType:  { type: String,   required: true },
  entityId:    { type: String,   required: true },
  entitySlug:  { type: String,   required: false },
});


// todo
const asignadoSch = new Schema({
  secretaria:  { type: String,   required: false },
  secgtor:     { type: String,   required: false },
  action:      { type: Number,   required: false },
});

const fileSch = new Schema({
  id:        { type: String,   required: false },
  name:      { type: String,   required: false },
  size:      { type: String,   required: false },
  extension: { type: String,   required: false },
});

const comentarioSch = new Schema({
  slug:       { type: String,   required: true },
  audit:      { type: auditSch, required: true },
});


/**
 * Creación de un Schema
 * @params
 */
const taskSch = new Schema({
    type:          { type: String, required: false },
    compNum:       { type: String, required: false },
    compName:      { type: String, required: false },
    modulo:        { type: String, required: false },

    fe_alta:       { type: String, required: false },
    fe_alta_ts:    { type: Number, required: false },
    ts_umod:       { type: Number, required: false },
    is_pinned:     { type: Boolean, required: false },

    fe_vto:        { type: String, required: false },
    fe_vto_ts:     { type: Number, required: false },
    fe_cierre:     { type: String, required: false },
    fe_cierre_ts:  { type: Number, required: false },

    estado:        { type: String, required: false },
    avance:        { type: String, required: false },
    asignado:      { type: String, required: false },

    requerimiento: { type: String, required: false },
    observacion:   { type: String, required: false },

    beneficiario:  { type: beneficiarioSch, required: false },
    parent:        { type: parentSch,   required: false },
    audit:         { type: auditSch,    required: false },
    followUp:      { type: followUpSch, required: false },

});


taskSch.pre('save', function (next) {
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
const Record = mongoose.model('Task', taskSch, 'tasks');


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



