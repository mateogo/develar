/**
 * Gestor de Solicitudes hospitalarias 
 */

const whoami =  "models/solinternacionModel: ";

const mongoose = require('mongoose');

// necesarios para el proceso de importación
const config = require('../config/config')
const path = require('path');
const utils = require('../services/commons.utils');

const Schema = mongoose.Schema;

const self = this;
const requirenteSch = new Schema({
  id:       { type: String, required: false },
  slug:     { type: String, required: false },
  nombre:   { type: String, required: false },
  apellido: { type: String, required: false },
  tdoc:     { type: String, required: false },
  ndoc:     { type: String, required: false },
});
 
const atendidoSch = new Schema({
  id:      { type: String, required: false },
  slug:    { type: String, required: false },
  sector:  { type: String, required: false },
});

const novedadSch = new Schema({
    tnovedad:   { type: String,      required: false},
    novedad:    { type: String,      required: false},
    fecomp_txa: { type: String,      required: false},
    fecomp_tsa: { type: Number,      required: false},
    atendidox:  { type: atendidoSch, required: false},
})

const internacionSch = new Schema({
    locId:         { type: String, required: false },
    locSlug:       { type: String, required: false },
    locEstado:     { type: String, required: false },
    transitoId:    { type: String, required: false },
    locSector:     { type: String, required: false },
    locArea:       { type: String, required: false },
    locPiso:       { type: String, required: false },
    locSala:       { type: String, required: false },
    locCama:       { type: String, required: false },
});

const locacionSch = new Schema({
    slug:      { type: String, required: false},
    street1:   { type: String, required: false},
    streetIn:  { type: String, required: false},
    streetOut: { type: String, required: false},
    city:      { type: String, required: false},
    barrio:    { type: String, required: false},
    lat:       { type: Number, required: false},
    lng:       { type: Number, required: false},
});

const transitoSch = new Schema({
    transitType:  { type: String,         required: false },
    estado:       { type: String,         required: false },
    target:       { type: internacionSch, required: false },
    from:         { type: internacionSch, required: false },
    locacion:     { type: locacionSch,    required: false },
    atendidox:    { type: atendidoSch,    required: false },
    fe_prog:      { type: String,         required: false },
    fe_cumplido:  { type: String,         required: false },
    fe_ts:        { type: Number,         required: false },
    slug:         { type: String,         required: false },

});


/**
 * Creación de un Schema
 * @params
 */
const solinternacionSch = new Schema({
    compPrefix:  { type: String, required: true },  // SOL
    compName:    { type: String, required: true },  // S/Internacion
    compNum:     { type: String, required: true },  // 000000
    tipo:        { type: String, required: false }, // internacion

    prioridad:   { type: Number, required: false }, //[1-3] 

    fecomp_txa:  { type: String, required: true },
    fecomp_tsa:  { type: Number, required: true },

    sector:      { type: String, required: false },
    action:      { type: String, required: true },
    slug:        { type: String, required: false },
    description: { type: String, required: false },

    estado:      { type: String, required: false },
    avance:      { type: String, required: false },
    queue:       { type: String, required: false }, // pool|transito|baja|alocado

    ts_alta:     { type: Number, required: false },
    ts_umodif:   { type: Number, required: false },
    ts_baja:     { type: Number, required: false , default: 0},

    internacion:  { type: internacionSch, required: false },
    requeridox:  { type: requirenteSch, required: false },
    atendidox:   { type: atendidoSch,   required: false },

    novedades:   [ novedadSch ],
    transitos:   [ transitoSch ],

});


solinternacionSch.pre('save', function (next) {
    return next();
});


function buildQuery(query){

  let q = {};
  if(query['estado']){
      q["estado"] = query['estado'];
  }

  if(query['code']){
      q["code"] = query['code'];
  }

  if(query['type']){
      q["type"] = query['type'];
  }

  return q;
}



const Solicitud = mongoose.model('Solinternacion', solinternacionSch, 'solinternaciones');

const RecordManager = {
 solinternacion: Solicitud,
}


/////////   API /////////////

/////////   LOCACIONES /////////////
exports.upsertNext = function (rtype, query, errcb, cb) {
    let Record = RecordManager[rtype];
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

exports.findAll = function (rtype, errcb, cb) {
    let Record = RecordManager[rtype];
    Record.find(function(err, entities) {
        if (err) {
            errcb(err);
        }else{
            cb(entities);
        }
    });
};

exports.findByQuery = function (rtype, query, errcb, cb) {
    let Record = RecordManager[rtype];
    let regexQuery = buildQuery(query)
    console.dir(regexQuery);

    Record.find(regexQuery)
          .limit(100)
          .lean()
          .sort( '-fe_ts' )
          .exec(function(err, entities) {
              if (err) {
                  console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
                  errcb(err);
              }else{
                  cb(entities);
              }
    });
};



exports.findById = function (rtype, id, errcb, cb) {
    let Record = RecordManager[rtype];

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

exports.update = function (rtype, id, record, errcb, cb) {
    let Record = RecordManager[rtype];

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

exports.create = function (rtype, record, errcb, cb) {
    let Record = RecordManager[rtype];
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

