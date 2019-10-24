/**
 * Asistencia: Solicitud de Asistencia a Vecinos
 */

const whoami =  "models/rolnocturnidadModel: ";

const mongoose = require('mongoose');

const person = require('./personModel');

const Schema = mongoose.Schema;

const self = this;

const requirenteSch = new Schema({
  id:      { type: String, required: false },
  slug:    { type: String, required: false },
  tdoc:    { type: String, required: false },
  ndoc:    { type: String, required: false },
});

const rolnocturnidadItemSch = new Schema({
  idPerson:       { type: String, required: false },
  personDni:      { type: String, required: false },
  personName:     { type: String, required: false },
  personApellido: { type: String, required: false },
  imageId:        { type: String, required: false },
});
 

/**
 * Creación de un Schema
 * @params
 */
const rolnocturnidadSch = new Schema({
    compPrefix:  { type: String, required: true },
    compName:    { type: String, required: true },
    compNum:     { type: String, required: true },

    action:      { type: String, required: true },
    sector:      { type: String, required: false },

    idPerson:    { type: String, required: false },
    requeridox:  { type: requirenteSch, required: false },

    fecomp_tsa:  { type: Number, required: true },
    fecomp_txa:  { type: String, required: true },

    ferol_tsa:   { type: Number, required: true },
    ferol_txa:   { type: String, required: true },
    vigencia:    { type: String, required: true },

    slug:        { type: String, required: false },
    description: { type: String, required: false },
    agentes:     [ rolnocturnidadItemSch ],

    estado:      { type: String, required: false },
    avance:      { type: String, required: false },
    ts_alta:     { type: Number, required: false },
    ts_umodif:   { type: Number, required: false },
});


rolnocturnidadSch.pre('save', function (next) {
    return next();
});


function buildQuery(query){

  let q = {};
  if(query['compPrefix']){
      q["compPrefix"] = query['compPrefix'];
  }

  if(query['compName']){
      q["compName"] = query['compName'];
  }

  if(query['idPerson']){
      q["idPerson"] = query['idPerson'];
  }

  if(query['compNum']){
      q["compNum"] = query['compNum'];
  }

  if(query['action']){
      q["action"] = query['action'];
  }

  if(query['sector']){
      q["sector"] = query['sector'];
  }

  if(query['avance']){
      q["avance"] = query['avance'];
  }

  if(query['estado']){
      q["estado"] = query['estado'];
  }

  let comp_range = [];
  if(query["compNum_d"]){
    comp_range.push( {"compNum": { $gte: query["compNum_d"]} });
  }
    
  if(query["compNum_h"]){
    comp_range.push( {"compNum": { $lte: query["compNum_h"]} });
  }

  if(query["fecomp_ts_d"]){
    comp_range.push( {"fecomp_tsa": { $gte: query["fecomp_ts_d"]} });
  }

  if(query["fecomp_ts_h"]){
    comp_range.push( {"fecomp_tsa": { $lte: query["fecomp_ts_h"]} });
  }

  if(comp_range.length){
    q["$and"] = comp_range;
  }

  if(query['requirenteId']){
      q["requeridox.id"] = query['requirenteId'];
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
const Record = mongoose.model('Rolnocturnidad', rolnocturnidadSch, 'rolnocturnidades');


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


exports.tablero = function(req, errcb, cb) {
  let fe_hasta = new Date();
  let fe_desde = new Date(fe_hasta.getFullYear(), 0, 1);
  let query = {
      fecomp_ts_d: fe_desde.getTime(),
      fecomp_ts_h: fe_hasta.getTime()
    }
  
  let regexQuery = buildQuery(query)
    
  person.buildIdTree().then(pTree =>{
    console.log('BuildPeronTree fullFilled [%s]', regexQuery);
    console.dir(regexQuery);

    Record.find(regexQuery).lean().exec(function(err, entities) {

        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);
        }else{
          console.log('entities [%s]', entities.length)
          procesTableroAsistencia(pTree, entities, fe_hasta, errcb, cb);
        }
    });
  })

}

