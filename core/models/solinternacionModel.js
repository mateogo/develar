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
  tdoc:     { type: String, required: false },
  ndoc:     { type: String, required: false },
  nombre:   { type: String, required: false },
  apellido: { type: String, required: false },
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
    locId:          { type: String, required: false },
    locSlug:        { type: String, required: false },
    locCode:        { type: String, required: false },

    slug:           { type: String, required: false },
    description:    { type: String, required: false },

    transitoId:    { type: String, required: false },

    estado:        { type: String, required: false },
    servicio:      { type: String, required: false },
    sector:        { type: String, required: false },
    piso:          { type: String, required: false },
    hab:           { type: String, required: false },
    camaCode:      { type: String, required: false },
    camaSlug:      { type: String, required: false },
    recursoId:     { type: String, required: false },
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
    transitType:   { type: String, required: false },
    afeccion:      { type: String, rquired: false},
    target:        { type: String, rquired: false},
    servicio:      { type: String, rquired: false},
    especialidad:  { type: String, rquired: false},
    slug:          { type: String, rquired: false},
    description:   { type: String, rquired: false},

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

const capacidades = [
    {val: 'UTI',           target: 'intensivos',    ord: '1.1', label: 'UTI'          },
    {val: 'UTE',           target: 'intensivos',    ord: '1.2', label: 'UTE'          },
    {val: 'UCO',           target: 'intensivos',    ord: '1.3', label: 'UCO'          },
    {val: 'INTPREV',       target: 'intermedios',   ord: '1.4', label: 'INT-GENERAL'  },
    {val: 'INTGRAL',       target: 'intermedios',   ord: '1.4', label: 'INT-GENERAL'  },
    {val: 'INTERNACION',   target: 'intermedios',   ord: '1.4', label: 'INT-GENERAL'  },
    {val: 'PEDIATRICA',    target: 'pediatrica',    ord: '3.1', label: 'INT-PEDIÁTRICA' },
    {val: 'AISLAMIENTO',   target: 'aislamiento',   ord: '2.1', label: 'AISLAMIENTO'  },
    {val: 'CONSULEXT',     target: 'ambulatorios',  ord: '3.1', label: 'CONS-EXT'     },
    {val: 'CONSULEXT',     target: 'ambulatorios',  ord: '3.1', label: 'CONS-EXT'     },
    {val: 'GUARDIA',       target: 'ambulatorios',  ord: '3.2', label: 'GUARDIA'      },
];

const serviciosOptList = [
    {val: 'UTI',           target: 'intensivos',           ord: '1.1', label: 'UTI'          },
    {val: 'UTE',           target: 'intensivos',           ord: '1.2', label: 'UTE'          },
    {val: 'UCO',           target: 'intensivos',           ord: '1.3', label: 'UCO'          },
    {val: 'INTERNACION',   target: 'intermedios',          ord: '2.1', label: 'INT-GENERAL'  },
    {val: 'PEDIATRICA',    target: 'pediatrica',           ord: '3.1', label: 'INT-PEDIÁTRICA' },
    {val: 'AISLAMIENTO',   target: 'aislamiento',          ord: '4.1', label: 'AISLAMIENTO'  },
    {val: 'CONSULEXT',     target: 'ambulatorios',         ord: '5.1', label: 'CONS-EXT'     },
    {val: 'GUARDIA',       target: 'ambulatorios',         ord: '5.2', label: 'GUARDIA'      },
];

const capacidadesOptList = [
    {val: 'intensivos',    label: 'CUIDADOS INTENSIVOS'     },
    {val: 'intermedios',   label: 'CUIDADOS INTERMEDIOS'    },
    {val: 'pediatrica',    label: 'ATENCIÓN PEDIÁTRICA'     },
    {val: 'aislamiento',   label: 'AISLAMIENTO PREVENTIVO'  },
    {val: 'ambulatorios',  label: 'SERVICIO AMBULATORIO'    },
];


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
exports.updateProcess = updateInternacionWorkFlow;
exports.fetchMasterAllocator = lookUpAvailability;

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


// ALLOCATE in SERVICE
function allocateSolicitudInService(spec, errcb, cb){
  let today = new Date();

  Solicitud.findById(spec.solinternacionId).then(solicitud => {
    if(spec.waction === 'transito:servicio'){
      transitionTransitoFacility(solicitud, spec, today)
      solicitud.save().then(solicitud =>{
        cb(solicitud);

      })
    }
  })

}


// ALLOCATE in TRANSIT
function allocateSolicitudInTransit(spec, errcb, cb){
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
function lookUpAvailability(query, errcb, cb){
  disponibleInternacion(query, errcb, cb)
}

function updateInternacionWorkFlow(query, errcb, cb){
    // DISPATCHER
    console.log('PROCESS COVID TO BEGIN')
    console.dir(query);

    if(query && query.process){
      if(query.process === 'allocate:solicitud'){
        allocateSolicitudInTransit(query, errcb, cb)

      }else if(query.process === 'enter:facility'){
        allocateSolicitudInService(query, errcb, cb)

      }
    }

}


function buildInternacion (solicitud, spec){
  let internacionToken = solicitud.internacion || {};

  internacionToken['locId'] =     spec.hospitalId || internacionToken['locId'] || '';
  internacionToken['locSlug'] =   internacionToken['locSlug']   || spec['locSlug'];
  internacionToken['estado'] =    internacionToken['estado']    || spec['estado'];
  internacionToken['servicio'] =  internacionToken['servicio']  || spec['servicio'];

  internacionToken['sector'] =    internacionToken['sector']    || spec['sector'];
  internacionToken['piso'] =      internacionToken['piso']      || spec['piso'];
  internacionToken['hab'] =       internacionToken['hab']       || spec['hab'];
  internacionToken['camaCode'] =  internacionToken['camaCode']  || spec['camaCode'];
  internacionToken['camaSlug'] =  internacionToken['camaSlug']  || spec['camaSlug'];
  internacionToken['recursoId'] = internacionToken['recursoId'] || spec['recursoId'];

  return internacionToken

}

function updateInternacion (solicitud, spec){
  let internacionToken = solicitud.internacion;
  if(!internacionToken) return;

  internacionToken['locId'] =     spec.hospitalId   ? spec.hospitalId   : internacionToken['locId']
  internacionToken['locSlug'] =   spec['locSlug']   ? spec['locSlug']   : internacionToken['locSlug']
  internacionToken['estado'] =    spec['estado']    ? spec['estado']    : internacionToken['estado']
  internacionToken['servicio'] =  spec['servicio']  ? spec['servicio']  : internacionToken['servicio']
 
  internacionToken['sector'] =    spec['sector']    ? spec['sector']    : internacionToken['sector']
  internacionToken['piso'] =      spec['piso']      ? spec['piso']      : internacionToken['piso']
  internacionToken['hab'] =       spec['hab']       ? spec['hab']       : internacionToken['hab']
  internacionToken['camaCode'] =  spec['camaCode']  ? spec['camaCode']  : internacionToken['camaCode']
  internacionToken['camaSlug'] =  spec['camaSlug']  ? spec['camaSlug']  : internacionToken['camaSlug']
  internacionToken['recursoId'] = spec['recursoId'] ? spec['recursoId'] : internacionToken['recursoId']

  return internacionToken

}


function buildTransitToken(solicitud, spec, from, target, locacion){
  let transitList = solicitud.transitos || [];
  let transito = {
    transitType: spec.transitType, //'pool:internacion',
    estado:      spec.estado || 'programado',
    target:      target,
    from:        from,
    locacion:    locacion,
    atendidox:    null,
    fe_prog:      spec.fe_prog,
    fe_cumplido:  spec.fe_cumplido,
    slug:         spec.slug,
    fe_ts:        spec.today.getTime(),
  }
  transitList.push(transito);
  return transitList;
}

/**** 
    let spec = {
      process: 'allocate:solicitud',
      waction: 'pool:transito',

      solinternacionId: solicitudId,
      hospitalId:  hospId,
      servicio: servicio,

    }
*/
function transitionPoolTransito(solicitud, spec, today){
  solicitud.queue = 'transito';
  solicitud.ts_umodif = today.getTime();
  solicitud.internacion = buildInternacion(solicitud, spec);

  spec.today = today;
  spec.transitType = spec.transitType ? spec.transitType : spec.waction
  spec.slug =       spec.slug       ? spec.slug : 'Locación de internacion asignada';
  spec.estado =     spec.estado     ? spec.estado : 'programado';
  spec.fe_prog =    spec.fe_prog    ? spec.fe_prog : utils.dateToStr(spec.today);
  let internacion_target = Object.assign({}, solicitud.internacion);

  solicitud.transitos = buildTransitToken(solicitud, spec, null, internacion_target, null);

}

function transitionTransitoFacility(solicitud, spec, today){
  console.log('transition-2-facility BEGIN ***********************')
  solicitud.queue = 'alocado';
  solicitud.ts_umodif = today.getTime();

  let internacion_from  =  Object.assign({}, solicitud.internacion.toObject());
  console.dir(internacion_from)
  console.log('transition-2-facility BEGIN ***********************')


  solicitud.internacion =  updateInternacion(solicitud, spec);

  let internacion_target = Object.assign({}, solicitud.internacion.toObject());
  console.dir(internacion_target)


  spec.today = new Date();
  spec.transitType = spec.transitType ? spec.transitType : spec.waction;
  spec.slug =       spec.slug       ? spec.slug :       'Locación de internacion asignada';
  spec.estado =     spec.estado     ? spec.estado :     'alocado';
  spec.fe_prog =    spec.fe_prog    ? spec.fe_prog :    utils.dateToStr(spec.today);

  solicitud.transitos = buildTransitToken(solicitud, spec, internacion_from, internacion_target, null);
}




/**********************************/
/*****  master allocator ********/
/********************************/
function disponibleInternacion(spec, errcb, cb){
  console.log('disponibleInternacion TO BEGIN')
  let nominalList;

  locaciones.fetchAvailability({}, 
    function(err){
    },

    function(list){
      nominalList = addAcumulators(list);

      console.dir(nominalList)
      consolidarOcupacion(nominalList, errcb, cb)
    })
}

function addAcumulators(list){
  let nominalList;



  nominalList = list.map(t => {
    capacidad = sumcapacity(t.servicios);

    let disponible = {};
    capacidadesOptList.forEach(token => {
      disponible[token.val] = {
        capacidad: capacidad[token.val],
        ocupado: 0
      }
    })

    t.disponible = disponible;
    return t;

  })
  return nominalList;
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

                }else{
                  cb(nominalList);

                }

              }
    });  

}


function contabilizarOcupacionGeneral(solicitudes, list){
  let master = {};
  console.log('Contabilizar: oferta:[%s] demanda:[%s]', list && list.length, solicitudes && solicitudes.length);

  solicitudes.forEach(solicitud => {
    console.log('ACUMULAR SOLICITUDES [%S]', solicitud.queue)
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
  console.log('sumar POOL [%s]', solicitud.compNum);
  console.dir(token);

  acumCapacidad(solicitud.triage.servicio, token)
}


function sumarTransito(solicitud, list, master){
  let internacion = solicitud.internacion;
  if(internacion){
    if(!master[internacion.locId]){
      token = fetchLocacionFromList(internacion.locId, list, master)

    }else {
      token = master[internacion.locId];
    }

    acumOcupacion('TRANSITO', token)
    acumCapacidad(solicitud.triage.servicio, token)
  }
}


function sumarAlocado(solicitud, list, master){
  let internacion = solicitud.internacion;
  if(internacion){
    if(!master[internacion.locId]){
      token = fetchLocacionFromList(internacion.locId, list, master)

    }else {
      token = master[internacion.locId];
    }
 
    acumOcupacion(internacion.servicio, token)
    acumCapacidad(internacion.servicio, token)
  }
}


function acumOcupacion(key, token){
  let item = token.servicios.find(t => t.type === key)
  item.ocupado += 1

}

function acumCapacidad(key, token){
  let tipo = capacidades.find(t => t.val === key);
  if(tipo){
    token.disponible[tipo.target].ocupado += 1
  }
}

//helpers
function fetchLocacionFromList(id, list, master){
  let locacion = list.find(loc => loc.id === id )

  if(locacion){
    master[id] = locacion
  }else{
    //todo
  }
  return locacion;
}

function initMasterPool(list, master){
  let disponible = {};

  capacidadesOptList.forEach(token => {
    disponible[token.val] = {
      capacidad: 0,
      ocupado: 0
    }
  })

  let token = {
    id:   'pool',
    code: 'pool',
    direccion: '',
    servicios: [],
    disponible: disponible
  }
  master['pool'] = token;
  list.push(token);
  return token;

}

function sumcapacity(servicios){
  let capacidad = {};

  capacidadesOptList.forEach(token => {
    capacidad[token.val] = 0;
  })

  if(servicios && servicios.length){

    servicios.reduce((capacidad, token) => {
      let tipo = capacidades.find(t => t.val === token.type);
      if(tipo){
        capacidad[tipo.target] += token.nominal;
      }
      return capacidad;

    }, capacidad);

  }
  return capacidad;
}
