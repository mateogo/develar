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




/******OJO SET-UP ONLU *************/
//createInitialData();
/*******************/



/************** zona de trabajo +*******************/
/*********  GESTION DE REGISTROS   ****************/
/************** **********************************/
exports.createInitialData = function (){
  function fetchInitialData(){
    if(false) {
      return  [
      {recurso: 'burzaco', dow: 1, hora: 11, slug: 'DEL BURZACO 11:00hs' },
      {recurso: 'burzaco', dow: 1, hora: 12, slug: 'DEL BURZACO 12:00hs' },
      {recurso: 'burzaco', dow: 1, hora: 13, slug: 'DEL BURZACO 13:00hs' },
      {recurso: 'burzaco', dow: 2, hora: 11, slug: 'DEL BURZACO 11:00hs' },
      {recurso: 'burzaco', dow: 2, hora: 12, slug: 'DEL BURZACO 12:00hs' },
      {recurso: 'burzaco', dow: 2, hora: 13, slug: 'DEL BURZACO 13:00hs' },
      {recurso: 'burzaco', dow: 3, hora: 11, slug: 'DEL BURZACO 11:00hs' },
      {recurso: 'burzaco', dow: 3, hora: 12, slug: 'DEL BURZACO 12:00hs' },
      {recurso: 'burzaco', dow: 3, hora: 13, slug: 'DEL BURZACO 13:00hs' },
      {recurso: 'burzaco', dow: 4, hora: 11, slug: 'DEL BURZACO 11:00hs' },
      {recurso: 'burzaco', dow: 4, hora: 12, slug: 'DEL BURZACO 12:00hs' },
      {recurso: 'burzaco', dow: 4, hora: 13, slug: 'DEL BURZACO 13:00hs' },
      {recurso: 'burzaco', dow: 5, hora: 11, slug: 'DEL BURZACO 11:00hs' },
      {recurso: 'burzaco', dow: 5, hora: 12, slug: 'DEL BURZACO 12:00hs' },
      {recurso: 'burzaco', dow: 5, hora: 13, slug: 'DEL BURZACO 13:00hs' },

      // claypole
      {recurso: 'claypole', dow: 1, hora: 9 ,  slug: 'DEL CLAYPOLE 9:00hs'},
      {recurso: 'claypole', dow: 1, hora: 10 , slug: 'DEL CLAYPOLE 10:00hs'},
      {recurso: 'claypole', dow: 1, hora: 11 , slug: 'DEL CLAYPOLE 11:00hs'},
      {recurso: 'claypole', dow: 2, hora: 9 ,  slug: 'DEL CLAYPOLE 9:00hs'},
      {recurso: 'claypole', dow: 2, hora: 10 , slug: 'DEL CLAYPOLE 10:00hs'},
      {recurso: 'claypole', dow: 2, hora: 11 , slug: 'DEL CLAYPOLE 11:00hs'},
      {recurso: 'claypole', dow: 3, hora: 9 ,  slug: 'DEL CLAYPOLE 9:00hs'},
      {recurso: 'claypole', dow: 3, hora: 10 , slug: 'DEL CLAYPOLE 10:00hs'},
      {recurso: 'claypole', dow: 3, hora: 11 , slug: 'DEL CLAYPOLE 11:00hs'},
      {recurso: 'claypole', dow: 4, hora: 9 ,  slug: 'DEL CLAYPOLE 9:00hs'},
      {recurso: 'claypole', dow: 4, hora: 10 , slug: 'DEL CLAYPOLE 10:00hs'},
      {recurso: 'claypole', dow: 4, hora: 11 , slug: 'DEL CLAYPOLE 11:00hs'},
      {recurso: 'claypole', dow: 5, hora: 9 ,  slug: 'DEL CLAYPOLE 9:00hs'},
      {recurso: 'claypole', dow: 5, hora: 10 , slug: 'DEL CLAYPOLE 10:00hs'},
      {recurso: 'claypole', dow: 5, hora: 11 , slug: 'DEL CLAYPOLE 11:00hs'},

      // donorione
      {recurso: 'donorione', dow: 1, hora: 11, slug: 'DEL DON ORIONE 11:00hs' },
      {recurso: 'donorione', dow: 1, hora: 12, slug: 'DEL DON ORIONE 12:00hs' },
      {recurso: 'donorione', dow: 1, hora: 13, slug: 'DEL DON ORIONE 13:00hs' },
      {recurso: 'donorione', dow: 2, hora: 11, slug: 'DEL DON ORIONE 11:00hs' },
      {recurso: 'donorione', dow: 2, hora: 12, slug: 'DEL DON ORIONE 12:00hs' },
      {recurso: 'donorione', dow: 2, hora: 13, slug: 'DEL DON ORIONE 13:00hs' },
      {recurso: 'donorione', dow: 3, hora: 11, slug: 'DEL DON ORIONE 11:00hs' },
      {recurso: 'donorione', dow: 3, hora: 12, slug: 'DEL DON ORIONE 12:00hs' },
      {recurso: 'donorione', dow: 3, hora: 13, slug: 'DEL DON ORIONE 13:00hs' },
      {recurso: 'donorione', dow: 4, hora: 11, slug: 'DEL DON ORIONE 11:00hs' },
      {recurso: 'donorione', dow: 4, hora: 12, slug: 'DEL DON ORIONE 12:00hs' },
      {recurso: 'donorione', dow: 4, hora: 13, slug: 'DEL DON ORIONE 13:00hs' },
      {recurso: 'donorione', dow: 5, hora: 11, slug: 'DEL DON ORIONE 11:00hs' },
      {recurso: 'donorione', dow: 5, hora: 12, slug: 'DEL DON ORIONE 12:00hs' },
      {recurso: 'donorione', dow: 5, hora: 13, slug: 'DEL DON ORIONE 13:00hs' },

      // glew
      {recurso: 'glew', dow: 1, hora: 10, slug: 'DEL GLEW 10:00hs' },
      {recurso: 'glew', dow: 1, hora: 11, slug: 'DEL GLEW 11:00hs' },
      {recurso: 'glew', dow: 1, hora: 12, slug: 'DEL GLEW 12:00hs' },
      {recurso: 'glew', dow: 2, hora: 10, slug: 'DEL GLEW 10:00hs' },
      {recurso: 'glew', dow: 2, hora: 11, slug: 'DEL GLEW 11:00hs' },
      {recurso: 'glew', dow: 2, hora: 12, slug: 'DEL GLEW 12:00hs' },
      {recurso: 'glew', dow: 3, hora: 10, slug: 'DEL GLEW 10:00hs' },
      {recurso: 'glew', dow: 3, hora: 11, slug: 'DEL GLEW 11:00hs' },
      {recurso: 'glew', dow: 3, hora: 12, slug: 'DEL GLEW 12:00hs' },
      {recurso: 'glew', dow: 4, hora: 10, slug: 'DEL GLEW 10:00hs' },
      {recurso: 'glew', dow: 4, hora: 11, slug: 'DEL GLEW 11:00hs' },
      {recurso: 'glew', dow: 4, hora: 12, slug: 'DEL GLEW 12:00hs' },
      {recurso: 'glew', dow: 5, hora: 10, slug: 'DEL GLEW 10:00hs' },
      {recurso: 'glew', dow: 5, hora: 11, slug: 'DEL GLEW 11:00hs' },
      {recurso: 'glew', dow: 5, hora: 12, slug: 'DEL GLEW 12:00hs' },

      // josemarmol
      {recurso: 'josemarmol', dow: 1, hora: 9 , slug: 'DEL JOSÉ MÁRMOL 09:00hs' },
      {recurso: 'josemarmol', dow: 1, hora: 10, slug: 'DEL JOSÉ MÁRMOL 10:00hs' },
      {recurso: 'josemarmol', dow: 1, hora: 11, slug: 'DEL JOSÉ MÁRMOL 11:00hs' },
      {recurso: 'josemarmol', dow: 2, hora: 9 , slug: 'DEL JOSÉ MÁRMOL 09:00hs' },
      {recurso: 'josemarmol', dow: 2, hora: 10, slug: 'DEL JOSÉ MÁRMOL 10:00hs' },
      {recurso: 'josemarmol', dow: 2, hora: 11, slug: 'DEL JOSÉ MÁRMOL 11:00hs' },
      {recurso: 'josemarmol', dow: 3, hora: 9 , slug: 'DEL JOSÉ MÁRMOL 09:00hs' },
      {recurso: 'josemarmol', dow: 3, hora: 10, slug: 'DEL JOSÉ MÁRMOL 10:00hs' },
      {recurso: 'josemarmol', dow: 3, hora: 11, slug: 'DEL JOSÉ MÁRMOL 11:00hs' },
      {recurso: 'josemarmol', dow: 4, hora: 9 , slug: 'DEL JOSÉ MÁRMOL 09:00hs' },
      {recurso: 'josemarmol', dow: 4, hora: 10, slug: 'DEL JOSÉ MÁRMOL 10:00hs' },
      {recurso: 'josemarmol', dow: 4, hora: 11, slug: 'DEL JOSÉ MÁRMOL 11:00hs' },
      {recurso: 'josemarmol', dow: 5, hora: 9 , slug: 'DEL JOSÉ MÁRMOL 09:00hs' },
      {recurso: 'josemarmol', dow: 5, hora: 10, slug: 'DEL JOSÉ MÁRMOL 10:00hs' },
      {recurso: 'josemarmol', dow: 5, hora: 11, slug: 'DEL JOSÉ MÁRMOL 11:00hs' },

      // longchamps
      {recurso: 'longchamps', dow: 1, hora: 10, slug: 'DEL LONGSCHAMPS 10:00hs' },
      {recurso: 'longchamps', dow: 1, hora: 11, slug: 'DEL LONGSCHAMPS 11:00hs' },
      {recurso: 'longchamps', dow: 1, hora: 12, slug: 'DEL LONGSCHAMPS 12:00hs' },
      {recurso: 'longchamps', dow: 2, hora: 10, slug: 'DEL LONGSCHAMPS 10:00hs' },
      {recurso: 'longchamps', dow: 2, hora: 11, slug: 'DEL LONGSCHAMPS 11:00hs' },
      {recurso: 'longchamps', dow: 2, hora: 12, slug: 'DEL LONGSCHAMPS 12:00hs' },
      {recurso: 'longchamps', dow: 3, hora: 10, slug: 'DEL LONGSCHAMPS 10:00hs' },
      {recurso: 'longchamps', dow: 3, hora: 11, slug: 'DEL LONGSCHAMPS 11:00hs' },
      {recurso: 'longchamps', dow: 3, hora: 12, slug: 'DEL LONGSCHAMPS 12:00hs' },
      {recurso: 'longchamps', dow: 4, hora: 10, slug: 'DEL LONGSCHAMPS 10:00hs' },
      {recurso: 'longchamps', dow: 4, hora: 11, slug: 'DEL LONGSCHAMPS 11:00hs' },
      {recurso: 'longchamps', dow: 4, hora: 12, slug: 'DEL LONGSCHAMPS 12:00hs' },
      {recurso: 'longchamps', dow: 5, hora: 10, slug: 'DEL LONGSCHAMPS 10:00hs' },
      {recurso: 'longchamps', dow: 5, hora: 11, slug: 'DEL LONGSCHAMPS 11:00hs' },
      {recurso: 'longchamps', dow: 5, hora: 12, slug: 'DEL LONGSCHAMPS 12:00hs' },

      // malvinas
      {recurso: 'malvinas', dow: 1, hora: 11, slug: 'DEL MALVINAS ARG 11:00hs' },
      {recurso: 'malvinas', dow: 1, hora: 12, slug: 'DEL MALVINAS ARG 12:00hs' },
      {recurso: 'malvinas', dow: 1, hora: 13, slug: 'DEL MALVINAS ARG 13:00hs' },
      {recurso: 'malvinas', dow: 2, hora: 11, slug: 'DEL MALVINAS ARG 11:00hs' },
      {recurso: 'malvinas', dow: 2, hora: 12, slug: 'DEL MALVINAS ARG 12:00hs' },
      {recurso: 'malvinas', dow: 2, hora: 13, slug: 'DEL MALVINAS ARG 13:00hs' },
      {recurso: 'malvinas', dow: 3, hora: 11, slug: 'DEL MALVINAS ARG 11:00hs' },
      {recurso: 'malvinas', dow: 3, hora: 12, slug: 'DEL MALVINAS ARG 12:00hs' },
      {recurso: 'malvinas', dow: 3, hora: 13, slug: 'DEL MALVINAS ARG 13:00hs' },
      {recurso: 'malvinas', dow: 4, hora: 11, slug: 'DEL MALVINAS ARG 11:00hs' },
      {recurso: 'malvinas', dow: 4, hora: 12, slug: 'DEL MALVINAS ARG 12:00hs' },
      {recurso: 'malvinas', dow: 4, hora: 13, slug: 'DEL MALVINAS ARG 13:00hs' },
      {recurso: 'malvinas', dow: 5, hora: 11, slug: 'DEL MALVINAS ARG 11:00hs' },
      {recurso: 'malvinas', dow: 5, hora: 12, slug: 'DEL MALVINAS ARG 12:00hs' },
      {recurso: 'malvinas', dow: 5, hora: 13, slug: 'DEL MALVINAS ARG 13:00hs' },

      //minrivadavia
      {recurso: 'minrivadavia', dow: 1, hora: 10, slug: 'DEL MIN RIVADAVIA 10:00hs' },
      {recurso: 'minrivadavia', dow: 1, hora: 11, slug: 'DEL MIN RIVADAVIA 11:00hs' },
      {recurso: 'minrivadavia', dow: 1, hora: 12, slug: 'DEL MIN RIVADAVIA 12:00hs' },
      {recurso: 'minrivadavia', dow: 2, hora: 10, slug: 'DEL MIN RIVADAVIA 10:00hs' },
      {recurso: 'minrivadavia', dow: 2, hora: 11, slug: 'DEL MIN RIVADAVIA 11:00hs' },
      {recurso: 'minrivadavia', dow: 2, hora: 12, slug: 'DEL MIN RIVADAVIA 12:00hs' },
      {recurso: 'minrivadavia', dow: 3, hora: 10, slug: 'DEL MIN RIVADAVIA 10:00hs' },
      {recurso: 'minrivadavia', dow: 3, hora: 11, slug: 'DEL MIN RIVADAVIA 11:00hs' },
      {recurso: 'minrivadavia', dow: 3, hora: 12, slug: 'DEL MIN RIVADAVIA 12:00hs' },
      {recurso: 'minrivadavia', dow: 4, hora: 10, slug: 'DEL MIN RIVADAVIA 10:00hs' },
      {recurso: 'minrivadavia', dow: 4, hora: 11, slug: 'DEL MIN RIVADAVIA 11:00hs' },
      {recurso: 'minrivadavia', dow: 4, hora: 12, slug: 'DEL MIN RIVADAVIA 12:00hs' },
      {recurso: 'minrivadavia', dow: 5, hora: 10, slug: 'DEL MIN RIVADAVIA 10:00hs' },
      {recurso: 'minrivadavia', dow: 5, hora: 11, slug: 'DEL MIN RIVADAVIA 11:00hs' },
      {recurso: 'minrivadavia', dow: 5, hora: 12, slug: 'DEL MIN RIVADAVIA 12:00hs' },

      //rcalzada
      {recurso: 'rcalzada', dow: 1, hora: 9,  slug: 'DEL RAFAEL CALZADA 09hs'},
      {recurso: 'rcalzada', dow: 1, hora: 10, slug: 'DEL RAFAEL CALZADA 10hs'},
      {recurso: 'rcalzada', dow: 1, hora: 11, slug: 'DEL RAFAEL CALZADA 11hs'},
      {recurso: 'rcalzada', dow: 2, hora: 9,  slug: 'DEL RAFAEL CALZADA 09hs'},
      {recurso: 'rcalzada', dow: 2, hora: 10, slug: 'DEL RAFAEL CALZADA 10hs'},
      {recurso: 'rcalzada', dow: 2, hora: 11, slug: 'DEL RAFAEL CALZADA 11hs'},
      {recurso: 'rcalzada', dow: 3, hora: 9,  slug: 'DEL RAFAEL CALZADA 09hs'},
      {recurso: 'rcalzada', dow: 3, hora: 10, slug: 'DEL RAFAEL CALZADA 10hs'},
      {recurso: 'rcalzada', dow: 3, hora: 11, slug: 'DEL RAFAEL CALZADA 11hs'},
      {recurso: 'rcalzada', dow: 4, hora: 9,  slug: 'DEL RAFAEL CALZADA 09hs'},
      {recurso: 'rcalzada', dow: 4, hora: 10, slug: 'DEL RAFAEL CALZADA 10hs'},
      {recurso: 'rcalzada', dow: 4, hora: 11, slug: 'DEL RAFAEL CALZADA 11hs'},
      {recurso: 'rcalzada', dow: 5, hora: 9,  slug: 'DEL RAFAEL CALZADA 09hs'},
      {recurso: 'rcalzada', dow: 5, hora: 10, slug: 'DEL RAFAEL CALZADA 10hs'},
      {recurso: 'rcalzada', dow: 5, hora: 11, slug: 'DEL RAFAEL CALZADA 11hs'},

      //solano
      {recurso: 'solano', dow: 1, hora: 9,  slug: 'DEL SAN FCO SOLANO 09:00hs' },
      {recurso: 'solano', dow: 1, hora: 10, slug: 'DEL SAN FCO SOLANO 10:00hs' },
      {recurso: 'solano', dow: 1, hora: 11, slug: 'DEL SAN FCO SOLANO 11:00hs' },
      {recurso: 'solano', dow: 2, hora: 9,  slug: 'DEL SAN FCO SOLANO 09:00hs' },
      {recurso: 'solano', dow: 2, hora: 10, slug: 'DEL SAN FCO SOLANO 10:00hs' },
      {recurso: 'solano', dow: 2, hora: 11, slug: 'DEL SAN FCO SOLANO 11:00hs' },
      {recurso: 'solano', dow: 3, hora: 9,  slug: 'DEL SAN FCO SOLANO 09:00hs' },
      {recurso: 'solano', dow: 3, hora: 10, slug: 'DEL SAN FCO SOLANO 10:00hs' },
      {recurso: 'solano', dow: 3, hora: 11, slug: 'DEL SAN FCO SOLANO 11:00hs' },
      {recurso: 'solano', dow: 4, hora: 9,  slug: 'DEL SAN FCO SOLANO 09:00hs' },
      {recurso: 'solano', dow: 4, hora: 10, slug: 'DEL SAN FCO SOLANO 10:00hs' },
      {recurso: 'solano', dow: 4, hora: 11, slug: 'DEL SAN FCO SOLANO 11:00hs' },
      {recurso: 'solano', dow: 5, hora: 9,  slug: 'DEL SAN FCO SOLANO 09:00hs' },
      {recurso: 'solano', dow: 5, hora: 10, slug: 'DEL SAN FCO SOLANO 10:00hs' },
      {recurso: 'solano', dow: 5, hora: 11, slug: 'DEL SAN FCO SOLANO 11:00hs' },

      //sanjose
      {recurso: 'sanjose', dow: 1, hora: 9,  slug: 'DEL SAN JOSÉ 09hs' },
      {recurso: 'sanjose', dow: 1, hora: 10, slug: 'DEL SAN JOSÉ 10hs' },
      {recurso: 'sanjose', dow: 1, hora: 11, slug: 'DEL SAN JOSÉ 11hs' },
      {recurso: 'sanjose', dow: 2, hora: 9,  slug: 'DEL SAN JOSÉ 09hs' },
      {recurso: 'sanjose', dow: 2, hora: 10, slug: 'DEL SAN JOSÉ 10hs' },
      {recurso: 'sanjose', dow: 2, hora: 11, slug: 'DEL SAN JOSÉ 11hs' },
      {recurso: 'sanjose', dow: 3, hora: 9,  slug: 'DEL SAN JOSÉ 09hs' },
      {recurso: 'sanjose', dow: 3, hora: 10, slug: 'DEL SAN JOSÉ 10hs' },
      {recurso: 'sanjose', dow: 3, hora: 11, slug: 'DEL SAN JOSÉ 11hs' },
      {recurso: 'sanjose', dow: 4, hora: 9,  slug: 'DEL SAN JOSÉ 09hs' },
      {recurso: 'sanjose', dow: 4, hora: 10, slug: 'DEL SAN JOSÉ 10hs' },
      {recurso: 'sanjose', dow: 4, hora: 11, slug: 'DEL SAN JOSÉ 11hs' },
      {recurso: 'sanjose', dow: 5, hora: 9,  slug: 'DEL SAN JOSÉ 09hs' },
      {recurso: 'sanjose', dow: 5, hora: 10, slug: 'DEL SAN JOSÉ 10hs' },
      {recurso: 'sanjose', dow: 5, hora: 11, slug: 'DEL SAN JOSÉ 11hs' },

      //cicglew
      {recurso: 'cicglew', dow: 1, hora: 10, slug: 'CIC GLEW 10hs' },
      {recurso: 'cicglew', dow: 1, hora: 11, slug: 'CIC GLEW 11hs' },
      {recurso: 'cicglew', dow: 1, hora: 12, slug: 'CIC GLEW 12hs' },
      {recurso: 'cicglew', dow: 2, hora: 10, slug: 'CIC GLEW 10hs' },
      {recurso: 'cicglew', dow: 2, hora: 11, slug: 'CIC GLEW 11hs' },
      {recurso: 'cicglew', dow: 2, hora: 12, slug: 'CIC GLEW 12hs' },
      {recurso: 'cicglew', dow: 3, hora: 10, slug: 'CIC GLEW 10hs' },
      {recurso: 'cicglew', dow: 3, hora: 11, slug: 'CIC GLEW 11hs' },
      {recurso: 'cicglew', dow: 3, hora: 12, slug: 'CIC GLEW 12hs' },
      {recurso: 'cicglew', dow: 4, hora: 10, slug: 'CIC GLEW 10hs' },
      {recurso: 'cicglew', dow: 4, hora: 11, slug: 'CIC GLEW 11hs' },
      {recurso: 'cicglew', dow: 4, hora: 12, slug: 'CIC GLEW 12hs' },
      {recurso: 'cicglew', dow: 5, hora: 10, slug: 'CIC GLEW 10hs' },
      {recurso: 'cicglew', dow: 5, hora: 11, slug: 'CIC GLEW 11hs' },
      {recurso: 'cicglew', dow: 5, hora: 12, slug: 'CIC GLEW 12hs' },

      //cicburzaco
      {recurso: 'cicburzaco', dow: 1, hora: 11, slug: 'CIC BURZACO 11:00hs' },
      {recurso: 'cicburzaco', dow: 1, hora: 12, slug: 'CIC BURZACO 12:00hs' },
      {recurso: 'cicburzaco', dow: 1, hora: 13, slug: 'CIC BURZACO 13:00hs' },
      {recurso: 'cicburzaco', dow: 2, hora: 11, slug: 'CIC BURZACO 11:00hs' },
      {recurso: 'cicburzaco', dow: 2, hora: 12, slug: 'CIC BURZACO 12:00hs' },
      {recurso: 'cicburzaco', dow: 2, hora: 13, slug: 'CIC BURZACO 13:00hs' },
      {recurso: 'cicburzaco', dow: 3, hora: 11, slug: 'CIC BURZACO 11:00hs' },
      {recurso: 'cicburzaco', dow: 3, hora: 12, slug: 'CIC BURZACO 12:00hs' },
      {recurso: 'cicburzaco', dow: 3, hora: 13, slug: 'CIC BURZACO 13:00hs' },
      {recurso: 'cicburzaco', dow: 4, hora: 11, slug: 'CIC BURZACO 11:00hs' },
      {recurso: 'cicburzaco', dow: 4, hora: 12, slug: 'CIC BURZACO 12:00hs' },
      {recurso: 'cicburzaco', dow: 4, hora: 13, slug: 'CIC BURZACO 13:00hs' },
      {recurso: 'cicburzaco', dow: 5, hora: 11, slug: 'CIC BURZACO 11:00hs' },
      {recurso: 'cicburzaco', dow: 5, hora: 12, slug: 'CIC BURZACO 12:00hs' },
      {recurso: 'cicburzaco', dow: 5, hora: 13, slug: 'CIC BURZACO 13:00hs' },

      ]


    }

    if(true){
      return  [
      //cicburzaco
      {recurso: 'cicburzaco', dow: 1, hora: 9, slug: 'CIC BURZACO 09:00 hs' },
      {recurso: 'cicburzaco', dow: 1, hora: 9, slug: 'CIC BURZACO 09:30 hs' },
      {recurso: 'cicburzaco', dow: 2, hora: 9, slug: 'CIC BURZACO 09:00 hs' },
      {recurso: 'cicburzaco', dow: 2, hora: 9, slug: 'CIC BURZACO 09:30 hs' },
      {recurso: 'cicburzaco', dow: 3, hora: 9, slug: 'CIC BURZACO 09:00 hs' },
      {recurso: 'cicburzaco', dow: 3, hora: 9, slug: 'CIC BURZACO 09:30 hs' },
      {recurso: 'cicburzaco', dow: 4, hora: 9, slug: 'CIC BURZACO 09:00 hs' },
      {recurso: 'cicburzaco', dow: 4, hora: 9, slug: 'CIC BURZACO 09:30 hs' },
      {recurso: 'cicburzaco', dow: 5, hora: 9, slug: 'CIC BURZACO 09:00 hs' },
      {recurso: 'cicburzaco', dow: 5, hora: 9, slug: 'CIC BURZACO 09:30 hs' },

      //burzaco
      {recurso: 'burzaco', dow: 1, hora: 10, slug: 'DEL BURZACO 10:00 hs' },
      {recurso: 'burzaco', dow: 1, hora: 10, slug: 'DEL BURZACO 10:30 hs' },
      {recurso: 'burzaco', dow: 2, hora: 10, slug: 'DEL BURZACO 10:00 hs' },
      {recurso: 'burzaco', dow: 2, hora: 10, slug: 'DEL BURZACO 10:30 hs' },
      {recurso: 'burzaco', dow: 3, hora: 10, slug: 'DEL BURZACO 10:00 hs' },
      {recurso: 'burzaco', dow: 3, hora: 10, slug: 'DEL BURZACO 10:30 hs' },
      {recurso: 'burzaco', dow: 4, hora: 10, slug: 'DEL BURZACO 10:00 hs' },
      {recurso: 'burzaco', dow: 4, hora: 10, slug: 'DEL BURZACO 10:30 hs' },
      {recurso: 'burzaco', dow: 5, hora: 10, slug: 'DEL BURZACO 10:00 hs' },
      {recurso: 'burzaco', dow: 5, hora: 10, slug: 'DEL BURZACO 10:30 hs' },

      // malvinas
      {recurso: 'malvinas', dow: 1, hora: 11, slug: 'DEL MALVINAS ARG 11:00 hs' },
      {recurso: 'malvinas', dow: 1, hora: 11, slug: 'DEL MALVINAS ARG 11:30 hs' },
      {recurso: 'malvinas', dow: 2, hora: 11, slug: 'DEL MALVINAS ARG 11:00 hs' },
      {recurso: 'malvinas', dow: 2, hora: 11, slug: 'DEL MALVINAS ARG 11:30 hs' },
      {recurso: 'malvinas', dow: 3, hora: 11, slug: 'DEL MALVINAS ARG 11:00 hs' },
      {recurso: 'malvinas', dow: 3, hora: 11, slug: 'DEL MALVINAS ARG 11:30 hs' },
      {recurso: 'malvinas', dow: 4, hora: 11, slug: 'DEL MALVINAS ARG 11:00 hs' },
      {recurso: 'malvinas', dow: 4, hora: 11, slug: 'DEL MALVINAS ARG 11:30 hs' },
      {recurso: 'malvinas', dow: 5, hora: 11, slug: 'DEL MALVINAS ARG 11:00 hs' },
      {recurso: 'malvinas', dow: 5, hora: 11, slug: 'DEL MALVINAS ARG 11:30 hs' },


      // claypole
      {recurso: 'claypole', dow: 1, hora: 9 , slug: 'DEL CLAYPOLE 09:00 hs'},
      {recurso: 'claypole', dow: 1, hora: 9 , slug: 'DEL CLAYPOLE 09:30 hs'},
      {recurso: 'claypole', dow: 2, hora: 9 , slug: 'DEL CLAYPOLE 09:00 hs'},
      {recurso: 'claypole', dow: 2, hora: 9 , slug: 'DEL CLAYPOLE 09:30 hs'},
      {recurso: 'claypole', dow: 3, hora: 9 , slug: 'DEL CLAYPOLE 09:00 hs'},
      {recurso: 'claypole', dow: 3, hora: 9 , slug: 'DEL CLAYPOLE 09:30 hs'},
      {recurso: 'claypole', dow: 4, hora: 9 , slug: 'DEL CLAYPOLE 09:00 hs'},
      {recurso: 'claypole', dow: 4, hora: 9 , slug: 'DEL CLAYPOLE 09:30 hs'},
      {recurso: 'claypole', dow: 5, hora: 9 , slug: 'DEL CLAYPOLE 09:00 hs'},
      {recurso: 'claypole', dow: 5, hora: 9 , slug: 'DEL CLAYPOLE 09:30 hs'},

      //minrivadavia
      {recurso: 'minrivadavia', dow: 1, hora: 10, slug: 'DEL MIN RIVADAVIA 10:00 hs' },
      {recurso: 'minrivadavia', dow: 1, hora: 10, slug: 'DEL MIN RIVADAVIA 10:30 hs' },
      {recurso: 'minrivadavia', dow: 2, hora: 10, slug: 'DEL MIN RIVADAVIA 10:00 hs' },
      {recurso: 'minrivadavia', dow: 2, hora: 10, slug: 'DEL MIN RIVADAVIA 10:30 hs' },
      {recurso: 'minrivadavia', dow: 3, hora: 10, slug: 'DEL MIN RIVADAVIA 10:00 hs' },
      {recurso: 'minrivadavia', dow: 3, hora: 10, slug: 'DEL MIN RIVADAVIA 10:30 hs' },
      {recurso: 'minrivadavia', dow: 4, hora: 10, slug: 'DEL MIN RIVADAVIA 10:00 hs' },
      {recurso: 'minrivadavia', dow: 4, hora: 10, slug: 'DEL MIN RIVADAVIA 10:30 hs' },
      {recurso: 'minrivadavia', dow: 5, hora: 10, slug: 'DEL MIN RIVADAVIA 10:00 hs' },
      {recurso: 'minrivadavia', dow: 5, hora: 10, slug: 'DEL MIN RIVADAVIA 10:30 hs' },

      // donorione
      {recurso: 'donorione', dow: 1, hora: 11, slug: 'DEL DON ORIONE 11:00 hs' },
      {recurso: 'donorione', dow: 1, hora: 11, slug: 'DEL DON ORIONE 11:30 hs' },
      {recurso: 'donorione', dow: 2, hora: 11, slug: 'DEL DON ORIONE 11:00 hs' },
      {recurso: 'donorione', dow: 2, hora: 11, slug: 'DEL DON ORIONE 11:30 hs' },
      {recurso: 'donorione', dow: 3, hora: 11, slug: 'DEL DON ORIONE 11:00 hs' },
      {recurso: 'donorione', dow: 3, hora: 11, slug: 'DEL DON ORIONE 11:30 hs' },
      {recurso: 'donorione', dow: 4, hora: 11, slug: 'DEL DON ORIONE 11:00 hs' },
      {recurso: 'donorione', dow: 4, hora: 11, slug: 'DEL DON ORIONE 11:30 hs' },
      {recurso: 'donorione', dow: 5, hora: 11, slug: 'DEL DON ORIONE 11:00 hs' },
      {recurso: 'donorione', dow: 5, hora: 11, slug: 'DEL DON ORIONE 11:30 hs' },




      // longchamps
      {recurso: 'longchamps', dow: 1, hora: 9,  slug: 'DEL LONGCHAMPS 09:00 hs' },
      {recurso: 'longchamps', dow: 1, hora: 9,  slug: 'DEL LONGCHAMPS 09:30 hs' },
      {recurso: 'longchamps', dow: 1, hora: 10, slug: 'DEL LONGCHAMPS 10:00 hs' },
      {recurso: 'longchamps', dow: 2, hora: 9,  slug: 'DEL LONGCHAMPS 09:00 hs' },
      {recurso: 'longchamps', dow: 2, hora: 9,  slug: 'DEL LONGCHAMPS 09:30 hs' },
      {recurso: 'longchamps', dow: 2, hora: 10, slug: 'DEL LONGCHAMPS 10:00 hs' },
      {recurso: 'longchamps', dow: 3, hora: 9,  slug: 'DEL LONGCHAMPS 09:00 hs' },
      {recurso: 'longchamps', dow: 3, hora: 9,  slug: 'DEL LONGCHAMPS 09:30 hs' },
      {recurso: 'longchamps', dow: 3, hora: 10, slug: 'DEL LONGCHAMPS 10:00 hs' },
      {recurso: 'longchamps', dow: 4, hora: 9,  slug: 'DEL LONGCHAMPS 09:00 hs' },
      {recurso: 'longchamps', dow: 4, hora: 9,  slug: 'DEL LONGCHAMPS 09:30 hs' },
      {recurso: 'longchamps', dow: 4, hora: 10, slug: 'DEL LONGCHAMPS 10:00 hs' },
      {recurso: 'longchamps', dow: 5, hora: 9,  slug: 'DEL LONGCHAMPS 09:00 hs' },
      {recurso: 'longchamps', dow: 5, hora: 9,  slug: 'DEL LONGCHAMPS 09:30 hs' },
      {recurso: 'longchamps', dow: 5, hora: 10, slug: 'DEL LONGCHAMPS 10:00 hs' },

      // glew
      {recurso: 'glew', dow: 1, hora: 11, slug: 'DEL GLEW 11:00 hs' },
      {recurso: 'glew', dow: 1, hora: 11, slug: 'DEL GLEW 11:30 hs' },
      {recurso: 'glew', dow: 1, hora: 12, slug: 'DEL GLEW 12:00 hs' },
      {recurso: 'glew', dow: 2, hora: 11, slug: 'DEL GLEW 11:00 hs' },
      {recurso: 'glew', dow: 2, hora: 11, slug: 'DEL GLEW 11:30 hs' },
      {recurso: 'glew', dow: 2, hora: 12, slug: 'DEL GLEW 12:00 hs' },
      {recurso: 'glew', dow: 3, hora: 11, slug: 'DEL GLEW 11:00 hs' },
      {recurso: 'glew', dow: 3, hora: 11, slug: 'DEL GLEW 11:30 hs' },
      {recurso: 'glew', dow: 3, hora: 12, slug: 'DEL GLEW 12:00 hs' },
      {recurso: 'glew', dow: 4, hora: 11, slug: 'DEL GLEW 11:00 hs' },
      {recurso: 'glew', dow: 4, hora: 11, slug: 'DEL GLEW 11:30 hs' },
      {recurso: 'glew', dow: 4, hora: 12, slug: 'DEL GLEW 12:00 hs' },
      {recurso: 'glew', dow: 5, hora: 11, slug: 'DEL GLEW 11:00 hs' },
      {recurso: 'glew', dow: 5, hora: 11, slug: 'DEL GLEW 11:30 hs' },
      {recurso: 'glew', dow: 5, hora: 12, slug: 'DEL GLEW 12:00 hs' },




      // josemarmol
      {recurso: 'josemarmol', dow: 1, hora: 9 , slug: 'DEL JOSÉ MÁRMOL 09:00 hs' },
      {recurso: 'josemarmol', dow: 1, hora: 9 , slug: 'DEL JOSÉ MÁRMOL 09:30 hs' },
      {recurso: 'josemarmol', dow: 2, hora: 9 , slug: 'DEL JOSÉ MÁRMOL 09:00 hs' },
      {recurso: 'josemarmol', dow: 2, hora: 9 , slug: 'DEL JOSÉ MÁRMOL 09:30 hs' },
      {recurso: 'josemarmol', dow: 3, hora: 9 , slug: 'DEL JOSÉ MÁRMOL 09:00 hs' },
      {recurso: 'josemarmol', dow: 3, hora: 9 , slug: 'DEL JOSÉ MÁRMOL 09:30 hs' },
      {recurso: 'josemarmol', dow: 4, hora: 9 , slug: 'DEL JOSÉ MÁRMOL 09:00 hs' },
      {recurso: 'josemarmol', dow: 4, hora: 9 , slug: 'DEL JOSÉ MÁRMOL 09:30 hs' },
      {recurso: 'josemarmol', dow: 5, hora: 9 , slug: 'DEL JOSÉ MÁRMOL 09:00 hs' },
      {recurso: 'josemarmol', dow: 5, hora: 9 , slug: 'DEL JOSÉ MÁRMOL 09:30 hs' },

      //sanjose
      {recurso: 'sanjose', dow: 1, hora: 10, slug: 'DEL SAN JOSÉ 10:00 hs' },
      {recurso: 'sanjose', dow: 1, hora: 10, slug: 'DEL SAN JOSÉ 10:30 hs' },
      {recurso: 'sanjose', dow: 2, hora: 10, slug: 'DEL SAN JOSÉ 10:00 hs' },
      {recurso: 'sanjose', dow: 2, hora: 10, slug: 'DEL SAN JOSÉ 10:30 hs' },
      {recurso: 'sanjose', dow: 3, hora: 10, slug: 'DEL SAN JOSÉ 10:00 hs' },
      {recurso: 'sanjose', dow: 3, hora: 10, slug: 'DEL SAN JOSÉ 10:30 hs' },
      {recurso: 'sanjose', dow: 4, hora: 10, slug: 'DEL SAN JOSÉ 10:00 hs' },
      {recurso: 'sanjose', dow: 4, hora: 10, slug: 'DEL SAN JOSÉ 10:30 hs' },
      {recurso: 'sanjose', dow: 5, hora: 10, slug: 'DEL SAN JOSÉ 10:00 hs' },
      {recurso: 'sanjose', dow: 5, hora: 10, slug: 'DEL SAN JOSÉ 10:30 hs' },

      //solano
      {recurso: 'solano', dow: 1, hora: 11, slug: 'DEL SAN FCO SOLANO 11:00 hs' },
      {recurso: 'solano', dow: 1, hora: 11, slug: 'DEL SAN FCO SOLANO 11:30 hs' },
      {recurso: 'solano', dow: 2, hora: 11, slug: 'DEL SAN FCO SOLANO 11:00 hs' },
      {recurso: 'solano', dow: 2, hora: 11, slug: 'DEL SAN FCO SOLANO 11:30 hs' },
      {recurso: 'solano', dow: 3, hora: 11, slug: 'DEL SAN FCO SOLANO 11:00 hs' },
      {recurso: 'solano', dow: 3, hora: 11, slug: 'DEL SAN FCO SOLANO 11:30 hs' },
      {recurso: 'solano', dow: 4, hora: 11, slug: 'DEL SAN FCO SOLANO 11:00 hs' },
      {recurso: 'solano', dow: 4, hora: 11, slug: 'DEL SAN FCO SOLANO 11:30 hs' },
      {recurso: 'solano', dow: 5, hora: 11, slug: 'DEL SAN FCO SOLANO 11:00 hs' },
      {recurso: 'solano', dow: 5, hora: 11, slug: 'DEL SAN FCO SOLANO 11:30 hs' },

      //rcalzada
      {recurso: 'rcalzada', dow: 1, hora: 9,  slug: 'DEL RAFAEL CALZADA 09:00 hs'},
      {recurso: 'rcalzada', dow: 1, hora: 9,  slug: 'DEL RAFAEL CALZADA 09:30 hs'},
      {recurso: 'rcalzada', dow: 2, hora: 9,  slug: 'DEL RAFAEL CALZADA 09:00 hs'},
      {recurso: 'rcalzada', dow: 2, hora: 9,  slug: 'DEL RAFAEL CALZADA 09:30 hs'},
      {recurso: 'rcalzada', dow: 3, hora: 9,  slug: 'DEL RAFAEL CALZADA 09:00 hs'},
      {recurso: 'rcalzada', dow: 3, hora: 9,  slug: 'DEL RAFAEL CALZADA 09:30 hs'},
      {recurso: 'rcalzada', dow: 4, hora: 9,  slug: 'DEL RAFAEL CALZADA 09:00 hs'},
      {recurso: 'rcalzada', dow: 4, hora: 9,  slug: 'DEL RAFAEL CALZADA 09:30 hs'},
      {recurso: 'rcalzada', dow: 5, hora: 9,  slug: 'DEL RAFAEL CALZADA 09:00 hs'},
      {recurso: 'rcalzada', dow: 5, hora: 9,  slug: 'DEL RAFAEL CALZADA 09:30 hs'},


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

    let capacidad = {
      qty: 30,
      ume: 'KIT-ALIM-STD'
    }

    turno.agenda = 'ALIM:DEL';
    turno.precedence = 0;
    turno.name = 'Cupo de entregas de asis alimentaria directa desde delegaciones';
    turno.slug = token.slug;

    turno.recurso = recurso;
    turno.capacidad = capacidad;
    turno.estado = 'activo';
    turno.vigenciad = utils.parseDateStr('25/03/2020').getTime();
    turno.vigenciah = utils.parseDateStr('25/03/2021').getTime();

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


