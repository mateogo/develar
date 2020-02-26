/**
 * Censo Industrias 2020 Secretaría de Producción - MAB
 */

const whoami =  "models/censoindustriaModel: ";

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const self = this;

const empresaSch = new Schema({
  empresaId:        { type: String, required: false },
  slug:             { type: String, required: false },
  tdoc:             { type: String, required: false },
  ndoc:             { type: String, required: false },

});

const responsableSch = new Schema({
  responsableId:    { type: String, required: false },
  slug:             { type: String, required: false },
  tdoc:             { type: String, required: false },
  ndoc:             { type: String, required: false },

});

const estadoCensoSch = new Schema({
  estado:           { type: String, required: false },
  navance:          { type: String, required: false },
  isCerrado:        { type: Boolean, required: false },
  ts_alta:          { type: Number, required: false },
  ts_umodif:        { type: Number, required: false },
  fecierre_txa:     { type: String, required: false },
  fecierre_tsa:     { type: Number, required: false },
  cerradoPor:       { type: responsableSch, required: false },
})

const censoDataSch = new Schema({
  codigo:          { type: String, required: false, default: 'censo:industrias:2020:00'},
  type:            { type: String, required: false, default: 'censo:anual'},
  anio:            { type: Number, required: false, default:  2020},
  q:               { type: String, required: false, default: 'q1'},
  sector:          { type: String, required: false, default: 'produccion'},
  slug:            { type: String, required: false, default: 'Censo Industrias - MAB 2020'},
});


/**************************/
/**   CENSO INDUSTRIAS  **/
/************************/
const censoindustriaSch = new Schema({
    compPrefix:    { type: String, required: false},
    compName:      { type: String, required: false},
    compNum:       { type: String, required: false},
    action:        { type: String, required: false},
    sector:        { type: String, required: false},
    fecomp_txa:    { type: String, required: false},
    fecomp_tsa:    { type: Number, required: false},
    empresa:       { type: empresaSch,     required: false},
    responsable:   { type: responsableSch, required: false},
    estado:        { type: estadoCensoSch, required: false},
    censo:         { type: censoDataSch,   required: false},
});


censoindustriaSch.pre('save', function (next) {
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

  if(query['compNum']){
      q["compNum"] = query['compNum'];
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
const Record = mongoose.model('Censoindustria', censoindustriaSch, 'censoindustrias');


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
            console.log('[%s] upsertNext ERROR: [%s]', whoami, err)
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
    console.dir(regexQuery);

    Record.find(regexQuery).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);
        }else{
          console.log('fetched: [%s]', entities && entities.length);
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

