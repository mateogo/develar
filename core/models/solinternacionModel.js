/**
 * Gestor de Solicitudes hospitalarias 
 */

const whoami =  "models/solinternacionModel: ";

const mongoose = require('mongoose');

// necesarios para el proceso de importación
const config = require('../config/config')
const path = require('path');
const utils = require('../services/commons.utils');
const locaciones = require('./locacionhospModel')

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

const motivoInternacionSch = new Schema({
    afeccion:      { type: String, rquired: false},
    target:        { type: String, rquired: false},
    servicio:      { type: String, rquired: false},
    especialidad:  { type: String, rquired: false},
    slug:          { type: String, rquired: false},

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

    triage:       { type: motivoInternacionSch, required: false },
    internacion:  { type: internacionSch, required: false },
    requeridox:   { type: requirenteSch, required: false },
    atendidox:    { type: atendidoSch,   required: false },

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

  if(query['requirenteId']){
      q["requeridox.id"] = query['requirenteId'];
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
    // DISPATCHER
    if(query && query.process){
      if(query.process === 'fetch:disponible'){
        disponibleInternacion(query, errcb, cb)
        return;

      }else if(query.process === 'allocate:solicitud'){
        allocateSolicitud(query, errcb, cb)
        return;

      }
    }



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



// ALLOCATE SOLICITUD
function allocateSolicitud(spec, errcb, cb){
  let today = new Date();

  Solicitud.findById(spec.solinternacionId).then(solicitud => {
    if(spec.waction === 'pool:transito'){
      transitionPoolTransito(solicitud, spec, today)
      solicitud.save().then(solicitud =>{
        cb(solicitud);

      })
    }
  })

}

/**********************************/
/*****  state transitions ********/
/********************************/
function buildInternacion (solicitud, spec){
  let internacionToken = solicitud.internacion || {};
  internacionToken['locId'] = spec.hospitalId || internacionToken['locId'] || ''
  internacionToken['locSlug'] = internacionToken['locSlug'] || spec['locSlug'];
  internacionToken['locEstado'] = 'transito';
  internacionToken['locServicio'] = spec.servicio;
  internacionToken['locSector'] = spec.sector;
  internacionToken['locPiso'] = spec.piso;
  internacionToken['locHab'] = spec.hab;
  internacionToken['locCama'] = spec.cama
  return internacionToken

}

function buildTransitToken(solicitud, spec, from, target, today, locacion, feprog, slug){
  let transitList = solicitud.transitos || [];
  let transito = {
    transitType: 'pool:internacion',
    estado: 'programado',
    target: target,
    from: from,
    locacion: locacion,
    atendidox: null,
    fe_prog: feprog,
    fe_cumplido: 0,
    fe_ts: today.getTime(),
    slug:  slug
  }
  transitList.push(transito);
  return transitList;
}

function transitionPoolTransito(solicitud, spec, today){
  solicitud.queue = 'transito';
  solicitud.ts_umodif = today.getTime();
  solicitud.internacion = buildInternacion(solicitud, spec);
  solicitud.transitos = buildTransitToken(solicitud, spec, solicitud.internacion, null, today, null, utils.dateToStr(today), 'hellou' );

}




// DISPONIBLE INTERNACION API
function disponibleInternacion(spec, errcb, cb){
  console.log('disponibleInternacion TO BEGIN')
  let nominalList;

  locaciones.fetchAvailability({}, 
    function(err){

    },
    function(list){

      nominalList = list.map(t => {
        capacidad = sumcapacity(t.servicios);
        let disponible = {
          intensivos:{
            capacidad: capacidad['intensivos'],
            ocupado: 0

          },

          intermedios:{
            capacidad: capacidad['intermedios'],
            ocupado: 0

          },

          aislamiento:{
            capacidad: capacidad['aislamiento'],
            ocupado: 0

          },

          ambulatorios:{
            capacidad: capacidad['ambulatorios'],
            ocupado: 0

          },

        }
        t.disponible = disponible;
        return t;

      })

      console.dir(nominalList)
      consolidarOcupacion(nominalList, errcb, cb)

    })


}

function consolidarOcupacion(nominalList, errcb, cb){
  let regexQuery = buildQuery({
          estado: 'activo'})

   Solicitud.find(regexQuery)
          .lean()
          .exec(function(err, entities) {
              if (err) {
                  console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
                  errcb(err);
              }else{
                if(entities && entities.length){
                  contabilizarOcupacionGeneral(entities, nominalList);
                  cb(nominalList);

                }
              }
    });  

}


function contabilizarOcupacionGeneral(solicitudes, list){
  let master = {}
  solicitudes.forEach(solicitud => {
    if(solicitud.queue === 'pool'){
      sumarPool(solicitud, list, master)

    }else if(solicitud.queue === 'transito') {
      sumarTransito(solicitud, list, master)


    }else if(solicitud.queue === 'alocado') {
      sumarAlocado(solicitud, list , master)

    }
  })

}

function sumarPool(solicitud, list, master){
  let token;
  if(!master['pool']){
    token = initMasterPool(list, master)

  }else {
    token = master['pool'];
  }
  token.disponible[solicitud.triage.target].ocupado += 1
}

function fetchLocacionFromList(id, list, master){
  let locacion = list.find(loc => loc.id === id )
  if(locacion){
    master[id] = locacion
  }else{
    //todo
  }
  return locacion;
}

function sumarAlocado(solicitud, list, master){
  let internacion = solicitud.internacion;
  if(internacion){
    if(!master[internacion.id]){
      token = fetchLocacion(list, master)

    }else {
      token = master[internacion.id];
    }
    acumOcupacion(internacion.locServicio, internacion, token)
  }
}


function sumarTransito(solicitud, list, master){
  let internacion = solicitud.internacion;
  if(internacion){
    if(!master[internacion.id]){
      token = fetchLocacion(list, master)

    }else {
      token = master[internacion.id];
    }

    acumOcupacion('TRANSITO', internacion, token)

  }else {
    //todo
  }

}

function acumOcupacion(key, internacion, token){
  let item = token.servicios.find(t => t.type === key)
  item.ocupado += 1

}

function initMasterPool(list, master){
  let token = {
    code: 'pool',
    direccion: '',
    servicios: [],
    disponible: {
          intensivos:{
            capacidad:0,
            ocupado: 0
          },
          intermedios:{
            capacidad: 0,
            ocupado: 0

          },
          aislamiento:{
            capacidad: 0,
            ocupado: 0

          },
          ambulatorios:{
            capacidad: 0,
            ocupado: 0
          },
    }
  }
  master['pool'] = token;
  list.push(token);
  return token;

}



const capacidades = [
    {val: 'UTI',           target: 'intensivos',    ord: '1.1', label: 'UTI'          },
    {val: 'UTE',           target: 'intensivos',    ord: '1.2', label: 'UTE'          },
    {val: 'UCO',           target: 'intensivos',    ord: '1.3', label: 'UCO'          },
    {val: 'INTPREV',       target: 'intermedios',   ord: '1.4', label: 'INT-GENERAL'  },
    {val: 'INTGRAL',       target: 'intermedios',   ord: '1.4', label: 'INT-GENERAL'  },
    {val: 'INTERNACION',   target: 'intermedios',   ord: '1.4', label: 'INT-GENERAL'  },
    {val: 'AISLAMIENTO',   target: 'aislamiento',   ord: '2.1', label: 'AISLAMIENTO'  },
    {val: 'CONSULEXT',     target: 'ambulatorios',       ord: '3.1', label: 'CONS-EXT'     },
    {val: 'CONSEXT',       target: 'ambulatorios',       ord: '3.1', label: 'CONS-EXT'     },
    {val: 'GUARDIA',       target: 'ambulatorios',       ord: '3.2', label: 'GUARDIA'      },
];

function sumcapacity(servicios){

  let capacidad = {
    intensivos: 0,
    intermedios: 0,
    ambulatorios: 0,
    aislamiento: 0
  }

  if(servicios && servicios.length){
    servicios.reduce((capacidad, token) => {
      console.log('reduce: [%s]', token.type)
      let tipo = capacidades.find(t => t.val === token.type);
      if(tipo){
        capacidad[tipo.target] += token.nominal;
      }
      return capacidad;

    }, capacidad);


  }
  return capacidad;
}



