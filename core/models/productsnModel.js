/**
 * Productsn: unidades identificadas por s/number de producto
 */

const whoami =  "models/productsnModel: ";

const mongoose = require('mongoose');

const { URL } = require('url');
const path = require('path');
const config = require('../config/config');

const Schema = mongoose.Schema;

const self = this;
 

const productEventSch = new Schema({
    id:          String,
    eventType:   String,
    slug:        String,
    fe:          Number,
    feTxt:       String,
    locationId:  String,
    ownerId:     String,
    ownerName:   String,
    estado:      String
});

const productsnSch = new Schema({
  code:              { type: String, required: true },
  slug:              { type: String, required: false },
  fe:                { type: String, required: false },
  feTxt:             { type: String, required: false },
  productId:         { type: String, required: true },
  productName:       { type: String, required: false },
  actualLocationId:  { type: String, required: false },
  actualOwnerId:     { type: String, required: false },
  actualOwnerName:   { type: String, required: false },
  qt:                { type: String, required: false },
  ume:               { type: String, required: false },
  estado:            { type: String, required: false },
  events:            [ productEventSch ],
});

function buildQuery(query){
    let q = {};

    if(query['slug']){
      q["slug"] = {"$regex": query.slug, "$options": "i"};
    }

    if(query['productId']){
      q["productId"] = query['productId'];
    }

    if(query['actualOwnerId']){
      q["actualOwnerId"] = query['actualOwnerId'];
    }

    return q;
}




productsnSch.pre('save', function (next) {
    return next();
});


/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Record = mongoose.model('Productsn', productsnSch, 'productsn');



/////////   CAPA DE SERVICIOS /////////////
/**
 * Retrieve all records
 * @param cb
 * @param errcb
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
    console.dir(record);

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
