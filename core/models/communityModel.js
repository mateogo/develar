/**
 * Community: items de producto (insumo, resultado, objetivo, etc.)
 */
const whoami =  "models/communityModel: ";
const mongoose = require('mongoose');

const userRelation = require('../services/usercommunityService');
const tagModel = require('./tagModel');

const { URL } = require('url');
const path = require('path');
const config = require('../config/config');

const Schema = mongoose.Schema;
const self = this;

/**
 * Creación de un Schema
 * @params
 */
const assetListSch = new Schema({
    id:   String,
    path: String,
    slug: String,
    mimetype: String
});

const communitySch = new Schema({
  code:        { type: String, required: true },
  displayAs:   { type: String, required: true },
  slug:        { type: String, required: false },
  name:        { type: String, required: false },
  description: { type: String, required: false },

  urlpath:     { type: String, required: true },
  eclass:      { type: String, required: false },
  etype:       { type: String, required: false },

  userId:      {type: String, required: true},

  estado:      { type: String, required: true },

  parents:     [String],
  tagstr:      String,
  taglist:     [String],

  assets:     [assetListSch],
  perms:      { owner: [String], persons: [String], other: [String] }

});

function buildQuery(query){
    let q = {};

    if(query['slug']){
      q["slug"] = {"$regex": query.slug, "$options": "i"};
    }

    if(query['urlpath']){
      q["urlpath"] = query['urlpath'];
    }

    if(query['eclass']){
      q["eclass"] = query['eclass'];
    }

    if(query['communities']){
      q['_id'] =  { $in: query['communities'].split(',') };
    }


    if(query["_id"]){
        q["_id"] = {$in: query["_id"].split(',')};
    }

    return q;
}


communitySch.pre('save', function (next) {
    return next();
});


/*******************************/
//  Actualiza relación TAG-COMUNIDAD
/*******************************/
function updateTags(model){
    if(model.taglist && model.taglist.length){
        tagModel.tagRelationFrom('community', 'tag', model);
    }
}



/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Record = mongoose.model('Community', communitySch, 'communities');


/////////   CAPA DE SERVICIOS /////////////
/**
 * Retrieve all records
 * @param errcb
 * @param cb
 */
exports.findAll = function (errcb, cb) {
    Record.find().lean().exec(function(err, entities) {
        if (err) {
            errcb(err);
        }else{
            cb(entities);
        }
    });
};

/**
 * Retrieve records from query /search/?name=something
 * @param query
 * @param errcb
 * @param cb
 */
exports.findByQuery = function (query, errcb, cb) {
    let regexQuery = buildQuery(query);

    Record.find(regexQuery).lean().exec(function(err, entities) {
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
 * @param errcb
 * @param cb
 */
exports.findById = function (id, errcb, cb) {

    Record.findById(id, function(err, entity) {
        if (err){
            console.log('findByID ERROR() ARGUMENT 125 [%s]', arguments.length);
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
            console.log('validation error as validate() argument ');
            err.itsme = whoami;
            errcb(err);
        }else{
            // Actualizar relación TAGS

            updateTags(entity);

            // Actualizar relación COMUNIDAD-USUARIO
            userRelation.updateFromCommunity(entity, function(err, token ){
              if(err){
                console.log('error actualizando relación user-community', err)
                err.itsme = whoami;
                errcb(err);

              }else{
                cb(entity);
              }
            });

        }
    });

};





/**
 * Create a new record
 * @param record
 * @param errcb
 * @param cb
 */
exports.create = function (record, errcb, cb) {
    delete record._id;

    Record.create(record, function(err, entity) {
        if (err){
            console.log('validation error as validate() argument [%s]')
            err.itsme = whoami;
            errcb(err);
        
        }else{
            // Actualizar relación TAGS
            updateTags(entity);

            // Actualizar relación COMUNIDAD-USUARIO
            userRelation.updateFromCommunity(entity, function(err, token ){
              if(err){
                console.log('error creando relación user-community', err)
                err.itsme = whoami;
                errcb(err);
              }else{
                cb(entity);
              }

            });
        }
    });

};
