/**
 * Asistencia: Solicitud de Asistencia a Vecinos
 */

const whoami =  "models/asistenciaModel: ";

const mongoose = require('mongoose');

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

const alimentoSch = new Schema({
    type:        { type: String, required: false },
    fe_tsd:      { type: String, required: false },
    fe_tsh:      { type: String, required: false },
    fe_txd:      { type: String, required: false },
    fe_txh:      { type: String, required: false },
    freq:        { type: String, required: false },
    qty:         { type: String, required: false },
    observacion: { type: String, required: false },
})

const encuestaSch = new Schema({
    id:           { type:String, required: false },
    fe_visita:    { type:String, required: false },
    fe_visita_ts: { type:String, required: false },
    locacionId:   { type:String, required: false },
    ruta:         { type:String, required: false },
    trabajador:   { type:String, required: false },
    trabajadorId: { type:String, required: false },
    preparacion:  { type:String, required: false },
    estado:       { type:String, required: false },
    avance:       { type:String, required: false },
    evaluacion:   { type:String, required: false },
})

/**
 * Creación de un Schema
 * @params
 */
const asistenciaSch = new Schema({
    compPrefix:  { type: String, required: true },
    compName:    { type: String, required: true },
    compNum:     { type: String, required: true },
    idPerson:    { type: String, required: true },
    fecomp_tsa:  { type: String, required: false },
    fecomp_txa:  { type: String, required: false },
    action:      { type: String, required: true },
    slug:        { type: String, required: false },
    description: { type: String, required: false },
    sector:      { type: String, required: false },
    estado:      { type: String, required: false },
    avance:      { type: String, required: false },
    ts_alta:     { type: Number, required: false },
    ts_fin:      { type: Number, required: false },
    ts_prog:     { type: Number, required: false },
    requeridox:  { type: requirenteSch, required: false },
    atendidox:   { type: atendidoSch,   required: false },
    modalidad:   { type: alimentoSch,   required: false },
    encuesta:    { type: encuestaSch,   required: false },
});


asistenciaSch.pre('save', function (next) {
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


  return q;
}


/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Record = mongoose.model('Asistencia', asistenciaSch, 'asistencias');



/////////   CAPA DE SERVICIOS /////////////

/**
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */
exports.upsertNext = function (query, errcb, cb) {
    let regexQuery = buildQuery(query);

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
    console.log('*********************************')
    let regexQuery = buildQuery(query)

    console.dir(regexQuery);

    Record.find(regexQuery, function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);
        }else{
          console.log('findByQuery: [%s]', entities && entities.length)
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
