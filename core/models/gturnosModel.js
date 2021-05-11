/**
 * Gestor de Turnos GTURNOS gturnos
 */

const whoami =  "models/gturnosModel: ";

const mongoose = require('mongoose');

// necesarios para el proceso de importación
const config = require('../config/config')
const path = require('path');
const utils = require('../services/commons.utils');

const Schema = mongoose.Schema;

const self = this;

const recursoSch = new Schema({
    lugar:     { type: String,  required: false  },
    lugarId:   { type: String,  required: false },

})
const capacidadSch = new Schema({
    qty:     { type: Number,  required: false  },
    ume:     { type: String,  required: false },

})

const requirenteSch = new Schema({
  id:       { type: String, required: false },
  slug:     { type: String, required: false },
  tdoc:     { type: String, required: false },
  ndoc:     { type: String, required: false },
});


const turnoDisponibleSch = new Schema({
    agenda:     { type: String,  required: true  },
    precedence: { type: Number,  default: 0  }, // 0: normal; 1: sobrescribe/excepción

    name:       { type: String,  required: true  },
    slug:       { type: String,  required: true  },

    recurso:    { type: recursoSch, required: true },
    capacidad:  { type: capacidadSch, required: true },

    estado:     { type: String , required: true, default: 'activo'},
    vigenciad:  { type: Number,  required: false, default: 0},
    vigenciah:  { type: Number,  required: false, default: 0},

    tfecha:     { type: Number,  required: true, default: 0}, // 0: puntual 1: rango 2:comprension
    fep_ts:     { type: Number,  required: false, default: 0},
    fed_ts:     { type: Number,  required: false, default: 0},
    feh_ts:     { type: Number,  required: false, default: 0},

    day_of_w:   { type: Number,  required: false, default: 0},
    month_of_y: { type: Number,  required: false, default: 0},
    year:       { type: Number,  required: false, default: 0},

    thorario:   { type: Number,  required: true, default: 3}, // 0: puntual 1: rango 2:hora + duracion

    hora:       { type: Number,  required: false, default: 0},
    horad:      { type: Number,  required: false, default: 0},
    horah:      { type: Number,  required: false, default: 0},
    duracion:   { type: Number,  required: false, default: 30},

})


const turnoInstanceSch = new Schema({
    turnoId:    { type: String,  required: true  },
    agenda:     { type: String,  required: true  },
    slug:       { type: String,  required: false  },

    recurso:    { type: recursoSch, required: true },

    qty:        { type: Number,  required: false  },
    ume:        { type: String,  required: false },

    estado:     { type: String , required: true, default: 'activo'},

    fe_tx:      { type: String,  required: true},
    fe_ts:      { type: Number,  required: true, default: 0},

    hora:       { type: Number,  required: false, default: 0},

    requeridox: { type: requirenteSch, required: true },

})



turnoDisponibleSch.pre('save', function (next) {
    return next();
});


turnoInstanceSch.pre('save', function (next) {
    return next();
});


function buildQuery(query){

  let q = {};
  if(query['estado']){
      q["estado"] = query['estado'];
  }

  if(query['personId']){
      q["requeridox.id"] = query['personId'];
  }


  return q;
}


function buildTurnosDadosQuery(query){
  let q = {
    estado: 'activo'
  };

  if(query['agenda']){
      q["agenda"] = query['agenda'];
  }

  if(query['lugar']){
      q["recurso.lugar"] = query['lugar'];
  }

  if(query['lugarId']){
      q["recurso.lugarId"] = query['lugarId'];
  }

  if(query['fecha']){
      q["fe_ts"] = utils.parseDateStr(query['fecha']).getTime();
  }

  return q;

}

function buildNextTurnoQuery(query){

  let q = {
    estado: 'activo'
  };

  if(query['agenda']){
      q["agenda"] = query['agenda'];
  }

  if(query['lugar']){
      q["recurso.lugar"] = query['lugar'];
  }

  if(query['lugarId']){
      q["recurso.lugarId"] = query['lugarId'];
  }

  // if(query['tfecha']){
  //     q["tfecha"] = parseInt(query['tfecha'], 10);
  // }

  // if(query['fecha']){
  //     q["agenda"] = query['agenda'];

  // }


  return q;
}

const Turno = mongoose.model('Turnosdisponible', turnoDisponibleSch, 'turnosdisponibles');

const Asignado = mongoose.model('Turnoasignado', turnoInstanceSch, 'turnosasignados');

const RecordManager = {
  turno: Turno,
  asignado: Asignado
}


const dowValidate = function (dow, target){
  if(target.tfecha !== 2 ) return true;
   //console.log('filterTurnos dow:[%s] [%s] [%s] [%s]',dow,  target.day_of_w, target.tfecha, dow !== target.day_of_w)
  return !(dow !== target.day_of_w);
}

const fetchTurnos = function(query){

      let regexQuery = buildTurnosDadosQuery(query);
      return Asignado.find(regexQuery);
}

const filterTurnos = function (query, tokens){
 
  resultSet = tokens.filter(t => {
    // busco una fecha en particular
    let ok = true;
    if(query.fecha){
      let target_date = utils.parseDateStr(query.fecha);
      let dow = target_date.getDay();

      return dowValidate(dow, t);
    }

    return ok;
  })
  return resultSet;

}

const validateCupo = function(turnos, asignados, query){

  let filterList = turnos.filter(turno => {
    let qty_asignada = asignados.reduce((qty,asig )=>{

      if(asig.turnoId === turno.id){
        qty += asig.qty
        return qty;        
      }else {
        return qty;
      }

    },0)

    if((qty_asignada + query.qty) > turno.capacidad.qty){
      return false;

    } else {
      return true;
    }
  })

  return filterList;
}

const validateTurnos = function(query, tokens, errcb, cb, count){
  let resultSet = filterTurnos(query, tokens)
  let validateSet = [];

  if(resultSet && resultSet.length){

    fetchTurnos(query).then(list => {

      validateSet = validateCupo(resultSet, list, query);

      cb(validateSet);

    })


  } else {

      cb([])

  }

}

const fetchNextTurno = function (query, errcb, cb) {
    let regexQuery = buildNextTurnoQuery(query);
    let count = 0

    // recupera todos los registros para esa agenda y recurso
    Turno.find(regexQuery, function(err, entities) {
        let resultSet = [];
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);

        }else{
          if(entities && entities.length){
            resultSet = validateTurnos(query, entities, errcb, cb, 0);

          } else {

            cb(resultSet);

          }


        }
    });
  
}


const assignTurno = function(data, turno, err, cb){
  let asig = new Asignado();
  asig.turnoId = turno._id;
  asig.slug = turno.slug;
  asig.agenda = turno.agenda;
  asig.recurso = turno.recurso;
  asig.qty = data.qty;
  asig.ume = turno.capacidad.ume;
  asig.estado = 'activo';
  asig.fe_tx = data.fecha;
  asig.fe_ts = utils.parseDateStr(data.fecha);
  asig.hora = turno.hora;
  asig.requeridox = data.requeridox;

  asig.save().then(tasignado => {
    if(tasignado && cb){
      cb(tasignado);
    }else{
      err({error: 'save error'})
    }


  })

}

const processTurno = function(query, errcb, cb){

  fetchNextTurno(query,
    function(err){

    },
    function(records){
      if(records && records.length && !query.dry){

        let first = records[0];
        assignTurno(query, first,
          function(err){

          },
          function(selectedRecord){
            cb([selectedRecord] || []);
          });

       }else{
         cb(records || []);
       }
    })

}





/////////   API /////////////
exports.processTurno = processTurno
exports.fetchNextTurno = fetchNextTurno;
exports.assignTurno = assignTurno;


/////////   TURNOS DISPONIBLES /////////////
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




/******OJO SET-UP ONLY *************/
//createInitialData();
/*******************/



/************** zona de trabajo +*******************/
/*********  GESTION DE REGISTROS   ****************/
/************** **********************************/
exports.createInitialData = function (){
  function fetchInitialData(){

    if(false){
      return  [

      // donorione Pasa a 12 y 12:30
      {recurso: 'donorione', dow: 1, hora: 12, slug: 'DEL DON ORIONE 12:00 hs' },
      {recurso: 'donorione', dow: 1, hora: 12, slug: 'DEL DON ORIONE 12:30 hs' },
      {recurso: 'donorione', dow: 2, hora: 12, slug: 'DEL DON ORIONE 12:00 hs' },
      {recurso: 'donorione', dow: 2, hora: 12, slug: 'DEL DON ORIONE 12:30 hs' },
      {recurso: 'donorione', dow: 3, hora: 12, slug: 'DEL DON ORIONE 12:00 hs' },
      {recurso: 'donorione', dow: 3, hora: 12, slug: 'DEL DON ORIONE 12:30 hs' },
      {recurso: 'donorione', dow: 4, hora: 12, slug: 'DEL DON ORIONE 12:00 hs' },
      {recurso: 'donorione', dow: 4, hora: 12, slug: 'DEL DON ORIONE 12:30 hs' },
      {recurso: 'donorione', dow: 5, hora: 12, slug: 'DEL DON ORIONE 12:00 hs' },
      {recurso: 'donorione', dow: 5, hora: 12, slug: 'DEL DON ORIONE 12:30 hs' },

      //burzaco
      {recurso: 'burzaco', dow: 1, hora: 12, slug: 'DEL BURZACO 12:00 hs' },
      {recurso: 'burzaco', dow: 1, hora: 12, slug: 'DEL BURZACO 12:30 hs' },
      {recurso: 'burzaco', dow: 2, hora: 12, slug: 'DEL BURZACO 12:00 hs' },
      {recurso: 'burzaco', dow: 2, hora: 12, slug: 'DEL BURZACO 12:30 hs' },
      {recurso: 'burzaco', dow: 3, hora: 12, slug: 'DEL BURZACO 12:00 hs' },
      {recurso: 'burzaco', dow: 3, hora: 12, slug: 'DEL BURZACO 12:30 hs' },
      {recurso: 'burzaco', dow: 4, hora: 12, slug: 'DEL BURZACO 12:00 hs' },
      {recurso: 'burzaco', dow: 4, hora: 12, slug: 'DEL BURZACO 12:30 hs' },
      {recurso: 'burzaco', dow: 5, hora: 12, slug: 'DEL BURZACO 12:00 hs' },
      {recurso: 'burzaco', dow: 5, hora: 12, slug: 'DEL BURZACO 12:30 hs' },

      // malvinas
      {recurso: 'malvinas', dow: 1, hora: 12, slug: 'DEL MALVINAS ARG 12:00 hs' },
      {recurso: 'malvinas', dow: 1, hora: 12, slug: 'DEL MALVINAS ARG 12:30 hs' },
      {recurso: 'malvinas', dow: 2, hora: 12, slug: 'DEL MALVINAS ARG 12:00 hs' },
      {recurso: 'malvinas', dow: 2, hora: 12, slug: 'DEL MALVINAS ARG 12:30 hs' },
      {recurso: 'malvinas', dow: 3, hora: 12, slug: 'DEL MALVINAS ARG 12:00 hs' },
      {recurso: 'malvinas', dow: 3, hora: 12, slug: 'DEL MALVINAS ARG 12:30 hs' },
      {recurso: 'malvinas', dow: 4, hora: 12, slug: 'DEL MALVINAS ARG 12:00 hs' },
      {recurso: 'malvinas', dow: 4, hora: 12, slug: 'DEL MALVINAS ARG 12:30 hs' },
      {recurso: 'malvinas', dow: 5, hora: 12, slug: 'DEL MALVINAS ARG 12:00 hs' },
      {recurso: 'malvinas', dow: 5, hora: 12, slug: 'DEL MALVINAS ARG 12:30 hs' },

      //minrivadavia
      {recurso: 'minrivadavia', dow: 1, hora: 12, slug: 'DEL MIN RIVADAVIA 12:00 hs' },
      {recurso: 'minrivadavia', dow: 1, hora: 12, slug: 'DEL MIN RIVADAVIA 12:30 hs' },
      {recurso: 'minrivadavia', dow: 2, hora: 12, slug: 'DEL MIN RIVADAVIA 12:00 hs' },
      {recurso: 'minrivadavia', dow: 2, hora: 12, slug: 'DEL MIN RIVADAVIA 12:30 hs' },
      {recurso: 'minrivadavia', dow: 3, hora: 12, slug: 'DEL MIN RIVADAVIA 12:00 hs' },
      {recurso: 'minrivadavia', dow: 3, hora: 12, slug: 'DEL MIN RIVADAVIA 12:30 hs' },
      {recurso: 'minrivadavia', dow: 4, hora: 12, slug: 'DEL MIN RIVADAVIA 12:00 hs' },
      {recurso: 'minrivadavia', dow: 4, hora: 12, slug: 'DEL MIN RIVADAVIA 12:30 hs' },
      {recurso: 'minrivadavia', dow: 5, hora: 12, slug: 'DEL MIN RIVADAVIA 12:00 hs' },
      {recurso: 'minrivadavia', dow: 5, hora: 12, slug: 'DEL MIN RIVADAVIA 12:30 hs' },

      // longchamps
      {recurso: 'longchamps', dow: 1, hora: 12,  slug: 'CÁM COMERCIO LONGCHAMPS 12:00 hs' },
      {recurso: 'longchamps', dow: 1, hora: 12,  slug: 'CÁM COMERCIO LONGCHAMPS 12:30 hs' },
      {recurso: 'longchamps', dow: 1, hora: 13,  slug: 'CÁM COMERCIO LONGCHAMPS 13:00 hs' },
      {recurso: 'longchamps', dow: 2, hora: 12,  slug: 'CÁM COMERCIO LONGCHAMPS 12:00 hs' },
      {recurso: 'longchamps', dow: 2, hora: 12,  slug: 'CÁM COMERCIO LONGCHAMPS 12:30 hs' },
      {recurso: 'longchamps', dow: 2, hora: 13,  slug: 'CÁM COMERCIO LONGCHAMPS 13:00 hs' },
      {recurso: 'longchamps', dow: 3, hora: 12,  slug: 'CÁM COMERCIO LONGCHAMPS 12:00 hs' },
      {recurso: 'longchamps', dow: 3, hora: 12,  slug: 'CÁM COMERCIO LONGCHAMPS 12:30 hs' },
      {recurso: 'longchamps', dow: 3, hora: 13,  slug: 'CÁM COMERCIO LONGCHAMPS 13:00 hs' },
      {recurso: 'longchamps', dow: 4, hora: 12,  slug: 'CÁM COMERCIO LONGCHAMPS 12:00 hs' },
      {recurso: 'longchamps', dow: 4, hora: 12,  slug: 'CÁM COMERCIO LONGCHAMPS 12:30 hs' },
      {recurso: 'longchamps', dow: 4, hora: 13,  slug: 'CÁM COMERCIO LONGCHAMPS 13:00 hs' },
      {recurso: 'longchamps', dow: 5, hora: 12,  slug: 'CÁM COMERCIO LONGCHAMPS 12:00 hs' },
      {recurso: 'longchamps', dow: 5, hora: 12,  slug: 'CÁM COMERCIO LONGCHAMPS 12:30 hs' },
      {recurso: 'longchamps', dow: 5, hora: 13,  slug: 'CÁM COMERCIO LONGCHAMPS 13:00 hs' },

      // glew
      {recurso: 'glew', dow: 1, hora: 12, slug: 'DEL GLEW 12:00 hs' },
      {recurso: 'glew', dow: 1, hora: 12, slug: 'DEL GLEW 12:30 hs' },
      {recurso: 'glew', dow: 1, hora: 13, slug: 'DEL GLEW 13:00 hs' },
      {recurso: 'glew', dow: 2, hora: 12, slug: 'DEL GLEW 12:00 hs' },
      {recurso: 'glew', dow: 2, hora: 12, slug: 'DEL GLEW 12:30 hs' },
      {recurso: 'glew', dow: 2, hora: 13, slug: 'DEL GLEW 13:00 hs' },
      {recurso: 'glew', dow: 3, hora: 12, slug: 'DEL GLEW 12:00 hs' },
      {recurso: 'glew', dow: 3, hora: 12, slug: 'DEL GLEW 12:30 hs' },
      {recurso: 'glew', dow: 3, hora: 13, slug: 'DEL GLEW 13:00 hs' },
      {recurso: 'glew', dow: 4, hora: 12, slug: 'DEL GLEW 12:00 hs' },
      {recurso: 'glew', dow: 4, hora: 12, slug: 'DEL GLEW 12:30 hs' },
      {recurso: 'glew', dow: 4, hora: 13, slug: 'DEL GLEW 13:00 hs' },
      {recurso: 'glew', dow: 5, hora: 12, slug: 'DEL GLEW 12:00 hs' },
      {recurso: 'glew', dow: 5, hora: 12, slug: 'DEL GLEW 12:30 hs' },
      {recurso: 'glew', dow: 5, hora: 13, slug: 'DEL GLEW 13:00 hs' },


      //cicburzaco Pasa a 9:30
      // {recurso: 'cicburzaco', dow: 1, hora:  9, slug: 'CIC BURZACO 09:30 hs' },
      // {recurso: 'cicburzaco', dow: 1, hora: 10, slug: 'CIC BURZACO 10:00 hs' },
      // {recurso: 'cicburzaco', dow: 2, hora:  9, slug: 'CIC BURZACO 09:30 hs' },
      // {recurso: 'cicburzaco', dow: 2, hora: 10, slug: 'CIC BURZACO 10:00 hs' },
      // {recurso: 'cicburzaco', dow: 3, hora:  9, slug: 'CIC BURZACO 09:30 hs' },
      // {recurso: 'cicburzaco', dow: 3, hora: 10, slug: 'CIC BURZACO 10:00 hs' },
      // {recurso: 'cicburzaco', dow: 4, hora:  9, slug: 'CIC BURZACO 09:30 hs' },
      // {recurso: 'cicburzaco', dow: 4, hora: 10, slug: 'CIC BURZACO 10:00 hs' },
      // {recurso: 'cicburzaco', dow: 5, hora:  9, slug: 'CIC BURZACO 09:30 hs' },
      // {recurso: 'cicburzaco', dow: 5, hora: 10, slug: 'CIC BURZACO 10:00 hs' },


      //rcalzada
      {recurso: 'rcalzada', dow: 1, hora:  9,  slug: 'DEL RAFAEL CALZADA 09:30 hs'},
      {recurso: 'rcalzada', dow: 1, hora: 10,  slug: 'DEL RAFAEL CALZADA 10:00 hs'},
      {recurso: 'rcalzada', dow: 2, hora:  9,  slug: 'DEL RAFAEL CALZADA 09:30 hs'},
      {recurso: 'rcalzada', dow: 2, hora: 10,  slug: 'DEL RAFAEL CALZADA 10:00 hs'},
      {recurso: 'rcalzada', dow: 3, hora:  9,  slug: 'DEL RAFAEL CALZADA 09:30 hs'},
      {recurso: 'rcalzada', dow: 3, hora: 10,  slug: 'DEL RAFAEL CALZADA 10:00 hs'},
      {recurso: 'rcalzada', dow: 4, hora:  9,  slug: 'DEL RAFAEL CALZADA 09:30 hs'},
      {recurso: 'rcalzada', dow: 4, hora: 10,  slug: 'DEL RAFAEL CALZADA 10:00 hs'},
      {recurso: 'rcalzada', dow: 5, hora:  9,  slug: 'DEL RAFAEL CALZADA 09:30 hs'},
      {recurso: 'rcalzada', dow: 5, hora: 10,  slug: 'DEL RAFAEL CALZADA 10:00 hs'},

      // josemarmol
      {recurso: 'josemarmol', dow: 1, hora:  9 , slug: 'DEL JOSÉ MÁRMOL 09:30 hs' },
      {recurso: 'josemarmol', dow: 1, hora: 10 , slug: 'DEL JOSÉ MÁRMOL 10:00 hs' },
      {recurso: 'josemarmol', dow: 2, hora:  9 , slug: 'DEL JOSÉ MÁRMOL 09:30 hs' },
      {recurso: 'josemarmol', dow: 2, hora: 10 , slug: 'DEL JOSÉ MÁRMOL 10:00 hs' },
      {recurso: 'josemarmol', dow: 3, hora:  9 , slug: 'DEL JOSÉ MÁRMOL 09:30 hs' },
      {recurso: 'josemarmol', dow: 3, hora: 10 , slug: 'DEL JOSÉ MÁRMOL 10:00 hs' },
      {recurso: 'josemarmol', dow: 4, hora:  9 , slug: 'DEL JOSÉ MÁRMOL 09:30 hs' },
      {recurso: 'josemarmol', dow: 4, hora: 10 , slug: 'DEL JOSÉ MÁRMOL 10:00 hs' },
      {recurso: 'josemarmol', dow: 5, hora:  9 , slug: 'DEL JOSÉ MÁRMOL 09:30 hs' },
      {recurso: 'josemarmol', dow: 5, hora: 10 , slug: 'DEL JOSÉ MÁRMOL 10:00 hs' },

      //sanjose
      {recurso: 'sanjose', dow: 1, hora:  9, slug: 'DEL SAN JOSÉ 09:30 hs' },
      {recurso: 'sanjose', dow: 1, hora: 10, slug: 'DEL SAN JOSÉ 10:00 hs' },
      {recurso: 'sanjose', dow: 2, hora:  9, slug: 'DEL SAN JOSÉ 09:30 hs' },
      {recurso: 'sanjose', dow: 2, hora: 10, slug: 'DEL SAN JOSÉ 10:00 hs' },
      {recurso: 'sanjose', dow: 3, hora:  9, slug: 'DEL SAN JOSÉ 09:30 hs' },
      {recurso: 'sanjose', dow: 3, hora: 10, slug: 'DEL SAN JOSÉ 10:00 hs' },
      {recurso: 'sanjose', dow: 4, hora:  9, slug: 'DEL SAN JOSÉ 09:30 hs' },
      {recurso: 'sanjose', dow: 4, hora: 10, slug: 'DEL SAN JOSÉ 10:00 hs' },
      {recurso: 'sanjose', dow: 5, hora:  9, slug: 'DEL SAN JOSÉ 09:30 hs' },
      {recurso: 'sanjose', dow: 5, hora: 10, slug: 'DEL SAN JOSÉ 10:00 hs' },

      //solano
      {recurso: 'solano', dow: 1, hora:  9, slug: 'DEL SAN FCO SOLANO 09:30 hs' },
      {recurso: 'solano', dow: 1, hora: 10, slug: 'DEL SAN FCO SOLANO 10:00 hs' },
      {recurso: 'solano', dow: 2, hora:  9, slug: 'DEL SAN FCO SOLANO 09:30 hs' },
      {recurso: 'solano', dow: 2, hora: 10, slug: 'DEL SAN FCO SOLANO 10:00 hs' },
      {recurso: 'solano', dow: 3, hora:  9, slug: 'DEL SAN FCO SOLANO 09:30 hs' },
      {recurso: 'solano', dow: 3, hora: 10, slug: 'DEL SAN FCO SOLANO 10:00 hs' },
      {recurso: 'solano', dow: 4, hora:  9, slug: 'DEL SAN FCO SOLANO 09:30 hs' },
      {recurso: 'solano', dow: 4, hora: 10, slug: 'DEL SAN FCO SOLANO 10:00 hs' },
      {recurso: 'solano', dow: 5, hora:  9, slug: 'DEL SAN FCO SOLANO 09:30 hs' },
      {recurso: 'solano', dow: 5, hora: 10, slug: 'DEL SAN FCO SOLANO 10:00 hs' },

      // claypole
      {recurso: 'claypole', dow: 1, hora:  9 , slug: 'DEL CLAYPOLE 09:30 hs'},
      {recurso: 'claypole', dow: 1, hora: 10 , slug: 'DEL CLAYPOLE 10:00 hs'},
      {recurso: 'claypole', dow: 2, hora:  9 , slug: 'DEL CLAYPOLE 09:30 hs'},
      {recurso: 'claypole', dow: 2, hora: 10 , slug: 'DEL CLAYPOLE 10:00 hs'},
      {recurso: 'claypole', dow: 3, hora:  9 , slug: 'DEL CLAYPOLE 09:30 hs'},
      {recurso: 'claypole', dow: 3, hora: 10 , slug: 'DEL CLAYPOLE 10:00 hs'},
      {recurso: 'claypole', dow: 4, hora:  9 , slug: 'DEL CLAYPOLE 09:30 hs'},
      {recurso: 'claypole', dow: 4, hora: 10 , slug: 'DEL CLAYPOLE 10:00 hs'},
      {recurso: 'claypole', dow: 5, hora:  9 , slug: 'DEL CLAYPOLE 09:30 hs'},
      {recurso: 'claypole', dow: 5, hora: 10 , slug: 'DEL CLAYPOLE 10:00 hs'},

      ]
    }


    if(true){
        return  [

        // secretaria Cupo 100 Inicia 10:00
        {recurso: 'secretaria', dow: 1, hora: 10, slug: 'SECRETARÍA DESARROLLO SOCIAL 10:00 hs' },
        {recurso: 'secretaria', dow: 1, hora: 10, slug: 'SECRETARÍA DESARROLLO SOCIAL 10:30 hs' },
        {recurso: 'secretaria', dow: 2, hora: 10, slug: 'SECRETARÍA DESARROLLO SOCIAL 10:00 hs' },
        {recurso: 'secretaria', dow: 2, hora: 10, slug: 'SECRETARÍA DESARROLLO SOCIAL 10:30 hs' },
        {recurso: 'secretaria', dow: 3, hora: 10, slug: 'SECRETARÍA DESARROLLO SOCIAL 10:00 hs' },
        {recurso: 'secretaria', dow: 3, hora: 10, slug: 'SECRETARÍA DESARROLLO SOCIAL 10:30 hs' },
        {recurso: 'secretaria', dow: 4, hora: 10, slug: 'SECRETARÍA DESARROLLO SOCIAL 10:00 hs' },
        {recurso: 'secretaria', dow: 4, hora: 10, slug: 'SECRETARÍA DESARROLLO SOCIAL 10:30 hs' },
        {recurso: 'secretaria', dow: 5, hora: 10, slug: 'SECRETARÍA DESARROLLO SOCIAL 10:00 hs' },
        {recurso: 'secretaria', dow: 5, hora: 10, slug: 'SECRETARÍA DESARROLLO SOCIAL 10:30 hs' },
  
        // DEL GLEW // Cambio a partir de 30-Mar-2021 
        {recurso: 'cicglew', dow: 1, hora: 9, slug: 'CEN INTEG COMUNITARIA GLEW 09:00 hs' },
        {recurso: 'cicglew', dow: 1, hora: 9, slug: 'CEN INTEG COMUNITARIA GLEW 09:30 hs' },
        {recurso: 'cicglew', dow: 2, hora: 9, slug: 'CEN INTEG COMUNITARIA GLEW 09:00 hs' },
        {recurso: 'cicglew', dow: 2, hora: 9, slug: 'CEN INTEG COMUNITARIA GLEW 09:30 hs' },
        {recurso: 'cicglew', dow: 3, hora: 9, slug: 'CEN INTEG COMUNITARIA GLEW 09:00 hs' },
        {recurso: 'cicglew', dow: 3, hora: 9, slug: 'CEN INTEG COMUNITARIA GLEW 09:30 hs' },
        {recurso: 'cicglew', dow: 4, hora: 9, slug: 'CEN INTEG COMUNITARIA GLEW 09:00 hs' },
        {recurso: 'cicglew', dow: 4, hora: 9, slug: 'CEN INTEG COMUNITARIA GLEW 09:30 hs' },
        {recurso: 'cicglew', dow: 5, hora: 9, slug: 'CEN INTEG COMUNITARIA GLEW 09:00 hs' },
        {recurso: 'cicglew', dow: 5, hora: 9, slug: 'CEN INTEG COMUNITARIA GLEW 09:30 hs' },

        // CIC Glew Cupo 100 Inicia 11:00 CUPO 200
        {recurso: 'cicburzaco', dow: 1, hora: 11, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 11:00 hs' },
        {recurso: 'cicburzaco', dow: 1, hora: 11, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 11:30 hs' },
        {recurso: 'cicburzaco', dow: 1, hora: 12, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 12:00 hs' },
        {recurso: 'cicburzaco', dow: 1, hora: 12, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 12:30 hs' },
        {recurso: 'cicburzaco', dow: 2, hora: 11, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 11:00 hs' },
        {recurso: 'cicburzaco', dow: 2, hora: 11, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 11:30 hs' },
        {recurso: 'cicburzaco', dow: 2, hora: 12, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 12:00 hs' },
        {recurso: 'cicburzaco', dow: 2, hora: 12, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 12:30 hs' },
        {recurso: 'cicburzaco', dow: 3, hora: 11, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 11:00 hs' },
        {recurso: 'cicburzaco', dow: 3, hora: 11, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 11:30 hs' },
        {recurso: 'cicburzaco', dow: 3, hora: 12, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 12:00 hs' },
        {recurso: 'cicburzaco', dow: 3, hora: 12, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 12:30 hs' },
        {recurso: 'cicburzaco', dow: 4, hora: 11, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 11:00 hs' },
        {recurso: 'cicburzaco', dow: 4, hora: 11, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 11:30 hs' },
        {recurso: 'cicburzaco', dow: 4, hora: 12, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 12:00 hs' },
        {recurso: 'cicburzaco', dow: 4, hora: 12, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 12:30 hs' },
        {recurso: 'cicburzaco', dow: 5, hora: 11, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 11:00 hs' },
        {recurso: 'cicburzaco', dow: 5, hora: 11, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 11:30 hs' },
        {recurso: 'cicburzaco', dow: 5, hora: 12, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 12:00 hs' },
        {recurso: 'cicburzaco', dow: 5, hora: 12, slug: 'UNIDAD DE FORTALECIM FAMILIAR BURZACO 12:30 hs' },
        
        // Don Orione Inicia 13:00 INICIA 13:00 CUPO 150
        {recurso: 'donorione', dow: 1, hora: 14, slug: 'DELEG DON ORIONE 14:00 hs' },
        {recurso: 'donorione', dow: 1, hora: 14, slug: 'DELEG DON ORIONE 14:30 hs' },
        {recurso: 'donorione', dow: 1, hora: 15, slug: 'DELEG DON ORIONE 15:00 hs' },
        {recurso: 'donorione', dow: 2, hora: 14, slug: 'DELEG DON ORIONE 14:00 hs' },
        {recurso: 'donorione', dow: 2, hora: 14, slug: 'DELEG DON ORIONE 14:30 hs' },
        {recurso: 'donorione', dow: 2, hora: 15, slug: 'DELEG DON ORIONE 15:00 hs' },
        {recurso: 'donorione', dow: 3, hora: 14, slug: 'DELEG DON ORIONE 14:00 hs' },
        {recurso: 'donorione', dow: 3, hora: 14, slug: 'DELEG DON ORIONE 14:30 hs' },
        {recurso: 'donorione', dow: 3, hora: 15, slug: 'DELEG DON ORIONE 15:00 hs' },
        {recurso: 'donorione', dow: 4, hora: 14, slug: 'DELEG DON ORIONE 14:00 hs' },
        {recurso: 'donorione', dow: 4, hora: 14, slug: 'DELEG DON ORIONE 14:30 hs' },
        {recurso: 'donorione', dow: 4, hora: 15, slug: 'DELEG DON ORIONE 15:00 hs' },
        {recurso: 'donorione', dow: 5, hora: 14, slug: 'DELEG DON ORIONE 14:00 hs' },
        {recurso: 'donorione', dow: 5, hora: 14, slug: 'DELEG DON ORIONE 14:30 hs' },
        {recurso: 'donorione', dow: 5, hora: 15, slug: 'DELEG DON ORIONE 15:00 hs' },

        // CIC Mármol Cupo 200 Inicia 14:00 CUPO 200
        {recurso: 'cicmarmol', dow: 1, hora: 13, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 13:00 hs' },
        {recurso: 'cicmarmol', dow: 1, hora: 13, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 13:30 hs' },
        {recurso: 'cicmarmol', dow: 1, hora: 14, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 14:00 hs' },
        {recurso: 'cicmarmol', dow: 1, hora: 14, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 14:30 hs' },
        {recurso: 'cicmarmol', dow: 2, hora: 13, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 13:00 hs' },
        {recurso: 'cicmarmol', dow: 2, hora: 13, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 13:30 hs' },
        {recurso: 'cicmarmol', dow: 2, hora: 14, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 14:00 hs' },
        {recurso: 'cicmarmol', dow: 2, hora: 14, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 14:30 hs' },
        {recurso: 'cicmarmol', dow: 3, hora: 13, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 13:00 hs' },
        {recurso: 'cicmarmol', dow: 3, hora: 13, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 13:30 hs' },
        {recurso: 'cicmarmol', dow: 3, hora: 14, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 14:00 hs' },
        {recurso: 'cicmarmol', dow: 3, hora: 14, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 14:30 hs' },
        {recurso: 'cicmarmol', dow: 4, hora: 13, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 13:00 hs' },
        {recurso: 'cicmarmol', dow: 4, hora: 13, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 13:30 hs' },
        {recurso: 'cicmarmol', dow: 4, hora: 14, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 14:00 hs' },
        {recurso: 'cicmarmol', dow: 4, hora: 14, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 14:30 hs' },
        {recurso: 'cicmarmol', dow: 5, hora: 13, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 13:00 hs' },
        {recurso: 'cicmarmol', dow: 5, hora: 13, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 13:30 hs' },
        {recurso: 'cicmarmol', dow: 5, hora: 14, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 14:00 hs' },
        {recurso: 'cicmarmol', dow: 5, hora: 14, slug: 'CEN INTEG COMUNITARIA J. MÁRMOL 14:30 hs' },
        ]
    }

    return []
  }
  
  function insertRecord(token){
    let turno = new Turno();


    let recurso = {
      lugar: 'MUNI',
      lugarId: token.recurso
    }

    // oJo: Longchamps entrega 35/35/30 por día, es el único caso que tiene un excedente de 10 unidades
    //      esto se corrigió por update en la base de datos:
    //      db.turnosdisponibles.updateMany({'recurso.lugarId': 'longchamps', hora: 12},{$set: {'capacidad.qty':35 }})
    //      db.turnosdisponibles.find({'recurso.lugarId': 'longchamps', hora: 12})

    //      db.turnosdisponibles.updateMany({'recurso.lugarId':'claypole', hora:9},{ $set: {'capacidad.qty': 40}  }) // actualiza #5 registros
    //      db.turnosdisponibles.updateMany({'recurso.lugarId':'burzaco', hora:12},{ $set: {'capacidad.qty': 35}  }) // actualiza #10 registros


    let capacidad = {
      qty: 50,
      ume: 'KIT-ALIM-STD'
    }

    turno.agenda = 'ALIM:DEL';
    turno.precedence = 0;
    turno.name = 'Cupo de entregas de asis alimentaria directa desde delegaciones';
    turno.slug = token.slug;

    turno.recurso = recurso;
    turno.capacidad = capacidad;
    turno.estado = 'activo';
    turno.vigenciad = utils.parseDateStr('01/12/2020').getTime();
    turno.vigenciah = utils.parseDateStr('31/12/2021').getTime();

    turno.tfecha = 2;
    turno.fep_ts = 0;
    turno.fed_ts = 0;
    turno.feh_ts = 0;

    turno.day_of_w = token.dow;
    turno.hora = token.hora;
    turno.duracion = 30;
    turno.thorario = 2;

    turno.save().then(entity => {
      console.log('grabación exitosa [%s]: ', entity.slug);
    }).catch(err => {console.log(err);})

  }

  const initial_data = fetchInitialData();



  initial_data.forEach(token =>{
    insertRecord(token);

  })

}


/**
{ "_id" : ObjectId("5f8042e315715608a940049b"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "11696730" } }
{ "_id" : ObjectId("5f8042e715715608a94004e3"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "29018829" } }
{ "_id" : ObjectId("5f80431c15715608a9401203"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "23085683" } }
{ "_id" : ObjectId("5f80435415715608a9401e0b"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "92069115" } }
{ "_id" : ObjectId("5f80439515715608a9402cbc"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "31595274" } }
{ "_id" : ObjectId("5f8043a815715608a9403357"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "20484464" } }
{ "_id" : ObjectId("5f8043d615715608a9403863"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "26283849" } }
{ "_id" : ObjectId("5f80445415715608a9405727"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "95011702" } }
{ "_id" : ObjectId("5f8044e815715608a9408624"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "6185127" } }
{ "_id" : ObjectId("5f80451915715608a9408cb4"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "16049405" } }
{ "_id" : ObjectId("5f80454615715608a9409c9b"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "30027373" } }
{ "_id" : ObjectId("5f80457215715608a940a59e"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "35394492" } }
{ "_id" : ObjectId("5f80459f15715608a940acf1"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "18887009" } }
{ "_id" : ObjectId("5f8046fc15715608a940e971"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "28174758" } }
{ "_id" : ObjectId("5f80472515715608a940f3fe"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "8425310" } }
{ "_id" : ObjectId("5f80478f15715608a9410cf2"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "33119106" } }
{ "_id" : ObjectId("5f8047f815715608a9411f25"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "44691783" } }
{ "_id" : ObjectId("5f80480115715608a9411fff"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "25145640" } }
{ "_id" : ObjectId("5f80483715715608a94126f7"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "20423865" } }
{ "_id" : ObjectId("5f80485a15715608a9412cf9"), "slug" : "DEL DON ORIONE 09:30 hs", "requeridox" : { "ndoc" : "35993618" } }


{ "_id" : ObjectId("5f8043ac15715608a94034ff"), "requeridox" : { "ndoc" : "13322111" } }
{ "_id" : ObjectId("5f8043c115715608a9403632"), "requeridox" : { "ndoc" : "30625133" } }
{ "_id" : ObjectId("5f80472915715608a940f55c"), "requeridox" : { "ndoc" : "16482612" } }
{ "_id" : ObjectId("5f80479b15715608a9410e74"), "requeridox" : { "ndoc" : "30133802" } }
{ "_id" : ObjectId("5f8048dd15715608a9414af4"), "requeridox" : { "ndoc" : "36924076" } }
{ "_id" : ObjectId("5f804c7315715608a941f8bc"), "requeridox" : { "ndoc" : "13460900" } }
{ "_id" : ObjectId("5f804da215715608a9422389"), "requeridox" : { "ndoc" : "11774591" } }
{ "_id" : ObjectId("5f804dd115715608a9422a0e"), "requeridox" : { "ndoc" : "13460069" } }
{ "_id" : ObjectId("5f804efa15715608a9425e5b"), "requeridox" : { "ndoc" : "34355244" } }
{ "_id" : ObjectId("5f805405dd57ef5a8ca6e9f9"), "requeridox" : { "ndoc" : "18734891" } }
{ "_id" : ObjectId("5f80581bdd57ef5a8ca7d428"), "requeridox" : { "ndoc" : "27649250" } }
{ "_id" : ObjectId("5f8058acdd57ef5a8ca7f4ae"), "requeridox" : { "ndoc" : "37180072" } }
{ "_id" : ObjectId("5f805be1dd57ef5a8ca88512"), "requeridox" : { "ndoc" : "17403261" } }
{ "_id" : ObjectId("5f805f70dd57ef5a8ca92cdf"), "requeridox" : { "ndoc" : "46626963" } }
{ "_id" : ObjectId("5f806266dd57ef5a8ca9b4f8"), "requeridox" : { "ndoc" : "12529670" } }
{ "_id" : ObjectId("5f8066fedd57ef5a8caa84b8"), "requeridox" : { "ndoc" : "34614009" } }
{ "_id" : ObjectId("5f8067e5dd57ef5a8caab9f2"), "requeridox" : { "ndoc" : "20119825" } }
{ "_id" : ObjectId("5f806a86dd57ef5a8cab2c81"), "requeridox" : { "ndoc" : "36741243" } }


DNI  TURNOS DE DON ORIONE
11696730  Les salió el turno 9:30
29018829  Les salió el turno 9:30
23085683  Les salió el turno 9:30
92069115  Les salió el turno 9:30
31595274  Les salió el turno 9:30
20484464  Les salió el turno 9:30
26283849  Les salió el turno 9:30
95011702  Les salió el turno 9:30
6185127  Les salió el turno 9:30
16049405  Les salió el turno 9:30
30027373  Les salió el turno 9:30
35394492  Les salió el turno 9:30
18887009  Les salió el turno 9:30
28174758  Les salió el turno 9:30
8425310  Les salió el turno 9:30
33119106  Les salió el turno 9:30
44691783  Les salió el turno 9:30
25145640  Les salió el turno 9:30
20423865  Les salió el turno 9:30
35993618  Les salió el turno 9:30
33202649  Les salió el turno 9:


13322111  Les salió el turno para  el 12/10
30625133  Les salió el turno para  el 12/10
16482612  Les salió el turno para  el 12/10
30133802  Les salió el turno para  el 12/10
36924076  Les salió el turno para  el 12/10
13460900  Les salió el turno para  el 12/10
11774591  Les salió el turno para  el 12/10
13460069  Les salió el turno para  el 12/10
34355244  Les salió el turno para  el 12/10
18734891  Les salió el turno para  el 12/10
27649250  Les salió el turno para  el 12/10
37180072  Les salió el turno para  el 12/10
17403261  Les salió el turno para  el 12/10
46626963  Les salió el turno para  el 12/10
12529670  Les salió el turno para  el 12/10
34614009  Les salió el turno para  el 12/10
20119825  Les salió el turno para  el 12/10
36741243  Les salió el turno para  el 12/10

**/

