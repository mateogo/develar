/**
 * Antecedente: antecedentes (infracciones) de ciudadano
 */

const whoami =  "models/antecedenteModel: ";

const mongoose = require('mongoose');

const { URL } = require('url');
const path = require('path');
const config = require('../config/config');

const Schema = mongoose.Schema;


const self = this;

 
const imputacionesSch = new Schema({
    tipo:   String,
    asungo: String,
});

const antecedenteSch = new Schema({

  fuenteOrigen:     {type: String, required: true},
  estado_alta:      {type: String, required: true},
  tipo:              {type: String, required: true},
  fe_comp:           {type: String, required: true},
  fe_compTxt:        {type: String, required: true},
  tcomp:             {type: String, required: true},
  ncomp:             {type: String, required: true},
  tinfraccion:       {type: String, required: true},
  finfraccion:       {type: String, required: true},
  fe_infr:           {type: String, required: false},
  fe_infrTxt:        {type: String, required: false},
  lugar:             {type: String, required: false},
  jurisdiccion:      {type: String, required: false},
  dominio:           {type: String, required: false},
  tdoc_titular:      {type: String, required: false},
  ndoc_titular:      {type: String, required: false},
  dato_conductor:    {type: String, required: false},
  tdoc_conductor:    {type: String, required: false},
  ndoc_conductor:    {type: String, required: false},
  nivel_ejecucion:   {type: String, required: false},
  estado_infraccion: {type: String, required: true},
  isFirme:           {type: String, required: true},
  isPaga:            {type: String, required: true},
  fe_resolucion:     {type: String, required: false},
  fe_resolucionTxt:  {type: String, required: false},

  imputaciones: [imputacionesSch]
});

function buildQuery(query){
    let q = {};

    // if(query['slug']){
    //   q["slug"] = {"$regex": query.slug, "$options": "i"};
    // }

    if(query['tdoc_conductor']){
      q["tdoc_conductor"] = query['tdoc_conductor'];
    }
    if(query['ndoc_conductor']){
      q["ndoc_conductor"] = query['ndoc_conductor'];
    }

    return q;
}




antecedenteSch.pre('save', function (next) {
    return next();
});


/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Record = mongoose.model('Antecedente', antecedenteSch, 'antecedentes');



/////////   CAPA DE SERVICIOS /////////////
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
    let regexQuery = buildQuery(query);


    Record.find(regexQuery, function(err, entities) {
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
