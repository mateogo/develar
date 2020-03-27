/**
 * Turno: recurso digital de cuerpo presente
 */

const whoami =  "models/turnoModel: ";

const mongoose = require('mongoose');
const Rx = require('rxjs');

const Schema = mongoose.Schema;

const self = this;

const requirenteSch = new Schema({
  id:      { type: String, required: false },
  slug:    { type: String, required: false },
  tdoc:    { type: String, required: false },
  ndoc:    { type: String, required: false },
});
 
const atendidoSch = new Schema({
  id:      { type: String, required: false },
  slug:    { type: String, required: false },
  sector:  { type: String, required: false },
});

const payload = new Schema({
  id:          { type: String, required: false },
  modulo:      { type: String, required: false },
  componente:  { type: String, required: false },
  ruta:        { type: String, required: false },
});

/**
 * Creación de un Schema
 * @params
 */
const turnoSch = new Schema({
  compPrefix:  { type: String, required: true },
  compName:    { type: String, required: true },
  compNum:     { type: String, required: true },
  type:        { type: String, required: true },
  name:        { type: String, required: true },
  sector:      { type: String, required: true },
  letra:       { type: String, required: false },
  peso:        { type: Number, required: false, default: 1 },
  estado:      { type: String, required: false },
  resultado:   { type: String, required: false },
  ts_alta:     { type: Number, required: false },
  ts_fin:      { type: Number, required: false },
  ts_prog:     { type: Number, required: false },
  requeridox:  { type: requirenteSch, required: false },
  atendidox:   { type: atendidoSch, required: false },
  payload:     { type: Number, required: false },
  observacion: { type: String, required: false },
});

turnoSch.pre('save', function (next) {
    return next();
});

const turnosUpdateEmitter = new Rx.Subject();

function buildQuery(query){

  let q = {};
  if(query['compPrefix']){
      q["compPrefix"] = query['compPrefix'];
  }

  if(query['compName']){
      q["compName"] = query['compName'];
  }

  if(query['compNum']){
      q["compNum"] = query['compNum'];
  }

  if(query['type']){
      q["type"] = query['type'];
  }

  if(query['name']){
      q["name"] = query['name'];
  }

  if(query['sector']){
      q["sector"] = query['sector'];
  }

  if(query['letra']){
      q["letra"] = query['letra'];
  }

  if(query['estado']){
      q["estado"] = query['estado'];
  }

  if(query['personId']){
      q["requeridox.id"] = query['personId'];
  }

  if(query['ts_prog']){
      q["ts_prog"] = { $gte: query['ts_prog'] };
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
const Record = mongoose.model('Turno', turnoSch, 'turnos');




exports.turnosUpdateListener = function() {
  return turnosUpdateEmitter;
}



/////////   CAPA DE SERVICIOS /////////////

/**
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */
exports.upsertNext = function (query, errcb, cb) {
    let regexQuery = buildQuery(query);

    Record.find(regexQuery).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);

        }else{
            cb(entities);

        }
    });
};


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

            turnosUpdateEmitter.next({turno: 'update'})
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
