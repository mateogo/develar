/**
 * Almacen: Solicitud de Almacen a Vecinos
 */

const whoami =  "models/almacenModel: ";

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const self = this;

const requirenteSch = new Schema({
  id:      { type: String, required: false },
  slug:    { type: String, required: false },
  tdoc:    { type: String, required: false },
  ndoc:    { type: String, required: false },
});
 
const parentSch = new Schema({
    id:      { type: String, required: false },
    type:    { type: String, required: false },
    kit:     { type: String, required: false },
    action:  { type: String, required: false },
    compNum: { type: String, required: false },
});


const atendidoSch = new Schema({
    id:      { type: String, required: false },
    slug:    { type: String, required: false },
    sector:  { type: String, required: false },
});

const itemAlmacenSch = new Schema({
    productId: { type: String, required: true },
    isKit:     { type: Number, required: true, default:0 },
    code:      { type: String, required: true },
    name:      { type: String, required: true },
    slug:      { type: String, required: false },
    ume:       { type: String, required: true },
    qty:       { type: Number, required: true },
});


/**
 * Creación de un Schema
 * @params
 */
const almacenSch = new Schema({
    compPrefix:  { type: String, required: true  },
    compName:    { type: String, required: true  },
    compNum:     { type: String, required: true  },
    personId:    { type: String, required: true  },
    parentId:    { type: String, required: false },
    kitEntrega:  { type: String, required: false },
    qty:         { type: Number, required: false },
    deposito:    { type: String, required: true  },
    tmov:        { type: String, required: false },
    fecomp_tsa:  { type: String, required: false },
    fecomp_txa:  { type: String, required: false },
    action:      { type: String, required: true  },
    slug:        { type: String, required: false },
    description: { type: String, required: false },
    sector:      { type: String, required: false },
    estado:      { type: String, required: false },
    avance:      { type: String, required: false },
    ts_alta:     { type: Number, required: false },
    ts_fin:      { type: Number, required: false },
    ts_prog:     { type: Number, required: false },
    parent:      { type: parentSch,     required: false },
    requeridox:  { type: requirenteSch, required: false },
    atendidox:   { type: atendidoSch,   required: false },
    entregas:    [ itemAlmacenSch ],

});


almacenSch.pre('save', function (next) {
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

  if(query['personId']){
      q["personId"] = query['personId'];
  }

  if(query['compNum']){
      q["compNum"] = query['compNum'];
  }

  if(query['action']){
      q["action"] = query['action'];
  }

  if(query['avance']){
      q["avance"] = query['avance'];
  }

  if(query['sector']){
      q["sector"] = query['sector'];
  }

  if(query['estado']){
      q["estado"] = query['estado'];
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
const Record = mongoose.model('Remitosalmacen', almacenSch, 'remitosalmacen');



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
    console.dir(query);
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
