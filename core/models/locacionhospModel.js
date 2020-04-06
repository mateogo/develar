/**
 * Gestor de Locaciones hospitalarias 
 */

const whoami =  "models/locacionhospModel: ";

const mongoose = require('mongoose');

// necesarios para el proceso de importación
const config = require('../config/config')
const path = require('path');
const utils = require('../services/commons.utils');

const Schema = mongoose.Schema;

const self = this;

const servicioSch = new Schema({
    srvtype:  { type: String, required: false},
    srvcode:  { type: String, required: false},
    srvorder: { type: String, required: false},
    srvQDisp: { type: Number, required: false},
    srvQMax:  { type: Number, required: false},
    srvIsActive:  { type: Boolean, required: false, default: true},
})

const recursoSh = new Schema({
    rtype:       { type: String, required: false },
    rservicio:   { type: String, required: false },
    piso:        { type: String, required: false },
    sector:      { type: String, required: false },
    sala:        { type: String, required: false },
    code:        { type: String, required: false },
    slug:        { type: String, required: false },
    description: { type: String, required: false },
    estado:      { type: String, required: false },
})







const locacionhospSch = new Schema({
    code:        { type: String,  required: true  },
    type:        { type: String,  required: true  },
    slug:        { type: String,  required: true  },

    description: { type: String,  required: false  },

    fecha_tx:    { type: String,  required: true},
    ts_alta:     { type: Number,  required: true, default: 0},
    ts_umodif:   { type: Number,  required: true, default: 0},
    estado:      { type: String,  required: false  },

    servicios: [servicioSch],
    recursos:  [recursoSh],

})




locacionhospSch.pre('save', function (next) {
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



const Locacion = mongoose.model('Locacionhospitalaria', locacionhospSch, 'locacioneshospitalarias');

const RecordManager = {
 locacion: Locacion,
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

