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
    profesional:    { type: String, required: false },

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

const ACTIVO = 'activo'


solinternacionSch.pre('save', function (next) {
    return next();
});

// internacionHelper: serviciosOptList
const capacidades = [
    {val: 'UTI',            etario: 1, target: 'intensivos',           ord: '1.1', label: 'UTI'           },
    {val: 'UTIP',           etario: 2, target: 'intensivos',           ord: '1.2', label: 'UTIP'          },
    {val: 'UTIN',           etario: 3, target: 'intensivos',           ord: '1.3', label: 'UTIN'          },
    {val: 'UTE',            etario: 1, target: 'intensivos',           ord: '1.4', label: 'UTE'           },
    {val: 'UCO',            etario: 1, target: 'intensivos',           ord: '1.5', label: 'UCO'           },
    {val: 'CIRUGIA',        etario: 1, target: 'otros',                ord: '2.7', label: 'INT-CIRUGÍA'   },
    {val: 'INTERNACION',    etario: 1, target: 'intermedios',          ord: '2.1', label: 'INT-GENERAL'   },
    {val: 'PEDIATRIA',      etario: 2, target: 'intermedios',          ord: '2.2', label: 'INT-PEDIATRÍA' },
    {val: 'NEONATOLOGIA',   etario: 3, target: 'intermedios',          ord: '2.3', label: 'INT-NEO'       },
    {val: 'MATERNIDAD',     etario: 1, target: 'otros',                ord: '2.4', label: 'MATERNIDAD'    },
    {val: 'TRAUMATOLOGIA',  etario: 1, target: 'otros',                ord: '2.5', label: 'INT-TRAUMATO'  },
    {val: 'CLINICA',        etario: 1, target: 'minimos',              ord: '2.6', label: 'CLÍNICA MÉDICA'},
    {val: 'AISLAMIENTO',    etario: 1, target: 'aislamiento',          ord: '4.1', label: 'AISLAMIENTO'  },
    {val: 'CONSULEXT',      etario: 1, target: 'ambulatorios',         ord: '5.1', label: 'CONS-EXT'     },
    {val: 'GUARDIA',        etario: 1, target: 'ambulatorios',         ord: '5.2', label: 'GUARDIA'      },
];


// internacionHelper: capacidadesOptList
const capacidadesOptList = [
    {val: 'intensivos',    label: 'CUIDADOS INTENSIVOS'   , code: 'UTI'  , slug: 'C.INTENSIVOS'  },
    {val: 'intermedios',   label: 'CUIDADOS INTERMEDIOS'  , code: 'UTE'  , slug: 'C.INTERMED' },
    {val: 'otros',         label: 'OTROS SERVICIOS'       , code: 'OTROS' , slug: 'OTROS'},
    {val: 'minimos',       label: 'CUIDADOS MÍNIMOS'      , code: 'CMÍN' , slug: 'C.MÍNIMOS'},
    {val: 'aislamiento',   label: 'AISLAMIENTO PREVENTIVO', code: 'AISL' , slug: 'AISLAMIENTO'   },
    {val: 'ambulatorios',  label: 'SERVICIO AMBULATORIO'  , code: 'GUAR' , slug: 'AMBULATORIO'   },

];

const estadosPeriferiaOptList = [ 
    {val: 'transito',     ord: '1.1', label: 'Tránsito'    },
    {val: 'admision',     ord: '1.2', label: 'Admisión'    },
    {val: 'traslado',     ord: '1.3', label: 'Traslado'    },
    {val: 'externacion',  ord: '1.4', label: 'Externación' },
    {val: 'salida',       ord: '1.5', label: 'Salida'      },
];

function buildQuery(query){

  let q = {};
  if(query['estado']){
      q["estado"] = query['estado'];
  }

  if(query['servicio']){
      q["internacion.estado"] = "servicio";
      q["internacion.servicio"] = query['servicio'];
  }

  if(query['feDesde']){
      let feDesde = parseInt(query['feDesde_ts'], 10);
      let feHasta = parseInt(query['feHasta_ts'], 10);

      q["transitos.fe_ts"] = {$gte: feDesde , $lt: feHasta};

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

  // busco solicitudes alocadas en cierto locationId
  if(query['locationId']){
      q["estado"] = ACTIVO;
      q["internacion.locId"] = query['locationId'];
  }

  // busco solicitudes en el pool
  if(query['queue']){
      q["queue"] = query['queue'];
  }

  if(query['triageservicio']){
      q["triage.servicio"] = query['triageservicio'];
  }

  if(query['triagetarget']){
      q["triage.target"] = query['triagetarget'];
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
  internacionToken['locCode'] =   internacionToken['locCode']   || spec['locCode'];
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
  internacionToken['locCode'] =   spec['locCode']   ? spec['locCode']   : internacionToken['locCode']
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
  solicitud.queue = 'alocado';
  solicitud.ts_umodif = today.getTime();

  let internacion_from  =  Object.assign({}, solicitud.internacion.toObject());


  solicitud.internacion =  updateInternacion(solicitud, spec);

  let internacion_target = Object.assign({}, solicitud.internacion.toObject());


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
  let nominalList;

  locaciones.fetchAvailability({}, 
    function(err){
    },

    function(list){
      nominalList = addAcumulators(list);

      consolidarOcupacion(nominalList, errcb, cb)
    })
}

function addAcumulators(list){
  let nominalList;

  nominalList = list.map(t => {
    capacidad = sumcapacity(t.servicios);

    let disponible = {};
    capacidadesOptList.forEach(token => {
      let ocupado = {
        total: 0,
        adu: 0,
        ped: 0,
        neo: 0
      }


      disponible[token.val] = {
        capacidad: capacidad[token.val],
        ocupado: ocupado
      }
    })
    t.disponible = disponible;

    let periferia = {};
    estadosPeriferiaOptList.forEach(token => {
      let acumPeriferia = capacidadesOptList.map(t => {
        
        let capacidad = {}
        capacidad['type'] = t.val;
        capacidad['code'] = t.label;
        capacidad['ocupado'] = 0;
        
        return capacidad;
      })

      periferia[token.val] = acumPeriferia;
    })
    t.periferia = periferia;

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



const queueOptList = [
    {val: 'pool',       ord: '1.1', label: 'pool'     },
    {val: 'transito',   ord: '1.2', label: 'transito' },
    {val: 'alocado',    ord: '1.3', label: 'alocado'  },
    {val: 'salida',     ord: '1.4', label: 'salida' },
    {val: 'baja',       ord: '1.5', label: 'baja'     },
]

function contabilizarOcupacionGeneral(solicitudes, list){
  let master = {};

  solicitudes.forEach(solicitud => {
    if(solicitud.queue === 'pool'){
      sumarPool(solicitud, list, master)

    }else if(solicitud.queue === 'transito') {
      sumarTransito(solicitud, list, master)


    }else if(solicitud.queue === 'alocado' || solicitud.queue === 'salida') {
      let internacion = solicitud.internacion;
      if(internacion && internacion.estado === 'servicio'){
        sumarAlocado(solicitud, list , master)
      }else {
        sumarAlocadoPeriferia(solicitud, list, master);
      }

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

  acumCapacidadPool(solicitud.triage.servicio, token)
}

function acumCapacidadPool(key, token){
  let tipo = capacidades.find(t => t.val === key);
  if(tipo){
    token.disponible[tipo.target].ocupado += 1

  }
}


function sumarTransito(solicitud, list, master){
  let internacion = solicitud.internacion;
  if(internacion){
    if(!master[internacion.locId]){
      token = fetchLocacionFromList(internacion.locId, list, master)

    }else {
      token = master[internacion.locId];
    }
    console.log('READY to sumar Transito: [%s] [%s]', internacion.estado, solicitud.compNum)

    acumPeriferia(internacion.estado, solicitud, token)
    acumCapacidad(solicitud.triage.servicio, token)
  }
}

function sumarAlocadoPeriferia(solicitud, list, master){
  let internacion = solicitud.internacion;
  if(internacion){
    if(!master[internacion.locId]){
      token = fetchLocacionFromList(internacion.locId, list, master)

    }else {
      token = master[internacion.locId];
    }
 
    acumPeriferia(internacion.estado, solicitud, token)
    if(['admision', 'servicio', 'traslado'].indexOf(internacion.servicio) !== -1){
      acumCapacidad(internacion.servicio, token)
    }
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

function acumPeriferia(key, solicitud,  token){
  let servicio = (solicitud.internacion && solicitud.internacion.servicio) || (solicitud.triage && solicitud.triage.servicio);
  let tipo = capacidades.find(t => t.val === servicio);
  let target = (tipo && tipo.target) || 'intermedios'
  console.log('acumPeriferia: key[%s] servicio[%s]  target[%s] ', key, servicio, target)
  console.dir(token.periferia)

  let periferia = token.periferia[key];


  let periferia_target = periferia.find(t => t['type'] === target)
  if(periferia_target){
    periferia_target['ocupado'] += 1;
  } else {
    console.log('Error acum Periferia: [%s]', target);
  }

}

function acumOcupacion(key, token){
  let item = token.servicios.find(t => t.type === key)
  item.ocupado += 1

}


function acumCapacidad(key, token){
  let tipo = capacidades.find(t => t.val === key);
  if(tipo){
                          token.disponible[tipo.target].ocupado['total'] += 1
    if(tipo.etario === 1) token.disponible[tipo.target].ocupado['adu']   += 1;
    if(tipo.etario === 2) token.disponible[tipo.target].ocupado['ped']   += 1;
    if(tipo.etario === 3) token.disponible[tipo.target].ocupado['neo']   += 1;

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
    let capa = {
      total: 0,
      adu: 0,
      ped: 0,
      neo: 0
    }
    capacidad[token.val] = capa;
  })

  if(servicios && servicios.length){

    servicios.reduce((capacidad, token) => {
      let tipo = capacidades.find(t => t.val === token.type);
      if(tipo){
        capacidad[tipo.target]['total'] += token.nominal;

        if(tipo.etario === 1) capacidad[tipo.target]['adu'] += token.nominal;
        if(tipo.etario === 2) capacidad[tipo.target]['ped'] += token.nominal;
        if(tipo.etario === 3) capacidad[tipo.target]['neo'] += token.nominal;

      }
      return capacidad;

    }, capacidad);

  }
  return capacidad;
}
