/**
 * Productit: items de producto (insumo, r esultado, objetivo, etc.)
 */

const whoami =  "models/productitModel: ";

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

const productitSch = new Schema({
  code:        { type: String, required: true },
  slug:        { type: String, required: false },

  ptype:       { type: String, required: false },
  pbrand:      { type: String, required: false },
  pmodel:      { type: String, required: false },

  userId:      {type: String, required: true},
  productId:   {type: String, required: true},
  vendorId:    {type: String, required: true},

  parentname:  {type: String, required: false},
  productname: {type: String, required: false},
  vendorurl:   { type: String, required: false },
  vendorpl:    { type: String, required: false },

  pume:        { type: String, required: false },
  pfume:       { type: String, required: false },

  moneda:      { type: String, required: false },
  pu:          { type: String, required: false },

  estado:      { type: String, required: true },

  parents:     [String],

  assets:    [assetInProductSch]

});

function buildQuery(query){
    let q = {};

    if(query['slug']){
      q["slug"] = {"$regex": query.slug, "$options": "i"};
    }

    if(query['productId']){
      q["productId"] = query['productId'];
    }

    return q;
}




productitSch.pre('save', function (next) {
    return next();
});


/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Record = mongoose.model('Productit', productitSch, 'productits');



/////////   CAPA DE SERVICIOS /////////////
/**
 * Retrieve all records
 * @param cb
 * @param errcb
 */
exports.findAll = function (errcb, cb) {
    Record.find().lean().exc(function(err, entities) {
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
 * @param cb
 * @param errcb
 */
exports.findById = function (id, errcb, cb) {

    Record.findById(id, function(err, entity) {
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
 * Upddate a new record
 * @param id
 * @param record
 * @param cb
 * @param errcb
 */
exports.update = function (id, record, errcb, cb) {

    Record.findByIdAndUpdate(id, record, { new: true } ,function(err, entity) {
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
 * Sign up a new record
 * @param record
 * @param cb
 * @param errcb
 */
exports.create = function (record, errcb, cb) {
    delete record._id;

    Record.create(record, function(err, entity) {
        if (err){
            console.log('[%s] validation error as validate() argument', whoami)
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};
