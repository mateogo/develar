/**
 * Parte diario ocupación hospitalaria
 */

const whoami =  "models/ocupacionhospModel: ";

const mongoose = require('mongoose');

const config = require('../config/config')
const path = require('path');
const utils = require('../services/commons.utils');

const Schema = mongoose.Schema;

const self = this;

const ocupacionXServicioSch = new Schema({
    // ocupacionFe:    { type: String, required: false },
    // ocupacionFets:  { type: Number, required: false },
    // ocupacionId:    { type: String, required: false },

    locId:          { type: String, required: false },
    locCode:        { type: String, required: false },
    locType:        { type: String, required: false },

    srvtype:        { type: String, required: false },
    srvcode:        { type: String, required: false },
    srvQDisp:       { type: Number, required: false },
    srvQOcup:       { type: Number, required: false },
    srvPOcup:       { type: Number, required: false },
});


const ocupacionHospitalariaSch = new Schema({
    slug:        { type: String, required: false },
    fecha_tx:    { type: String, required: false },
    fecha_ts:    { type: Number, required: false },
    estado:      { type: String, required: false },
    ts_alta:     { type: String, required: false },
    ts_umodif:   { type: Number, required: false },
    servicios:   [ ocupacionXServicioSch ],
});



ocupacionHospitalariaSch.pre('save', function (next) {
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

  if(query['fecha_tx']){
    q["fecha_ts"] = {$lte: utils.dateNumFromTx(query['fecha_tx'])}
  }

  return q;
}



const OcupacionHospitalaria = mongoose.model('ParteOcupacionHospitalaria', ocupacionHospitalariaSch, 'partesocuphosp');

const RecordManager = {
 parteocupacion: OcupacionHospitalaria,
}


/////////   API /////////////
exports.fetchAvailability = fetchAvailability
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
          .sort( '-fecha_ts' )
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


function fetchAvailability(spec, errcb, cb){

  OcupacionHospitalaria.find().lean().sort({type:-1, code:1}).exec(function(err, entities) {
      if (err) {
          console.log('[%s] fetchAvailability ERROR: [%s]',whoami, err)
          errcb(err);
      }else{
        if(entities && entities.length){
          let recursosNominales = entities.map(loc => {
            let token = {
              id:   loc._id.toString(),
              code: loc.code,
              slug: loc.slug,
              type: loc.type,
              direccion: loc.ubicacion ? loc.ubicacion.street1 + ' ' + loc.ubicacion.city : '',
              servicios: buildServiciosAllocation(loc),
            }
            return token
          })

          cb(recursosNominales)

        }else{
          cb([])
        }

      }
  });
}

const areasOptList = [
    {val: 'TRANSITO',      ord: '4.1', label: 'TRANSITO'     },
    {val: 'TRASLADO',      ord: '4.2', label: 'TRASLADO'     },
    {val: 'ADMISION',      ord: '5.1', label: 'ADMISIÓN'     },
    {val: 'EXTERNACION',   ord: '5.2', label: 'EXTERNACIÓN'  },
];

function initAreas(){
  let areas = areasOptList.map(area => {
      return {
          type:   area.val,
          code:   area.label,          
          nominal:   0,
          adicional:  0,
          ocupado: 0
      }
  })
  return areas;
}

function buildServiciosAllocation(locacion){
  let capacity = []
  let servicios = locacion.servicios
  if(servicios && servicios.length){
    capacity = servicios.map(s =>{
      return {
          type:   s.srvtype,
          code:   s.srvcode,          
          nominal:   s.srvQDisp,
          adicional:   s.srvQMax,
          ocupado: 0
      }

    })
  }

  areasOptList.forEach(area => {
      capacity.push({
          type:   area.val,
          code:   area.label,          
          nominal:   0,
          adicional:  0,
          ocupado: 0
      })
  })


  substractNotAvailable(locacion, capacity);
  return capacity;
}

function substractNotAvailable(locacion, capacity){
  let recursos  = locacion.recursos;
  if(recursos && recursos.length){
    recursos.forEach(token => {
      if(token.estado!== 'activo'){
        let srvCode = token.rservicio;
        let node = capacity.find(t => t.code === srvCode);
        if(node) {
          node.nominal -= 1;
        }

      }
    });
  }
}


