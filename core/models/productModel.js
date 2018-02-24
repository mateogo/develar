/**
 * Product: producto (insumo, r esultado, objetivo, etc.)
 */

const whoami =  "models/productModel: ";

const mongoose = require('mongoose');

const { URL } = require('url');
const path = require('path');
const config = require('../config/config');

const Schema = mongoose.Schema;


const self = this;

 

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

const assetInProductSch = new Schema({
    id:   String,
    path: String,
    slug: String,
    mimetype: String
});

const productSch = new Schema({
  code:        { type: String, required: true },
  name:        { type: String, required: true },
  slug:        { type: String, required: false },
  description: { type: String, required: false },
  estado:      { type: String, required: true },
  perms:       { owner: [String], persons: [String], other: [String] },

  pclass:      { type: String, required: true },
  ptype:       { type: String, required: false },
  pbrand:      { type: String, required: false },
  pmodel:      { type: String, required: false },
  
  pinventory:  { type: String, required: false },
  pume:        { type: String, required: false },
  pformula:    { type: String, required: false },


  user:        {type: String, required: false},
  userId:      {type: String, required: false},
  parents:     [String],
  persons:     [String],

  tokens:      [String],
  tagstr:       String,
  taglist:     [String],
  assets:    [assetInProductSch]

});

function buildQuery(query){
    let q = {};

    if(query.name){
        q["name"] = {"$regex": query.name, "$options": "i"};
    }

    if(query.slug){
        q["slug"] = {"$regex": query.slug, "$options": "i"};
    }

    return q;
}




productSch.pre('save', function (next) {
    console.log('[%s] pre-save', whoami)
    return next();
});


/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Record = mongoose.model('Product', productSch, 'products');



/////////   CAPA DE SERVICIOS /////////////
/**
 * Retrieve all records
 * @param cb
 * @param errcb
 */
exports.findAll = function (errcb, cb) {
    console.log('[%s] findAll',whoami);
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
    let regexQuery = buildQuery(query);


    Record.find(regexQuery, function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
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
            console.log('[%s] validation error as validate() argument', whoami)
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
            console.log('[%s] validation error as validate() argument ', whoami)
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};
