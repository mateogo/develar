/**
 * Asistencia: Prevención de Salud. Secretaría de Salud
 */

const whoami =  "models/asisprevencionModel: ";

const mongoose = require('mongoose');

// necesarios para el proceso de importación
const config = require('../config/config')
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const utils = require('../services/commons.utils');
const person = require('./personModel');
const product = require('./productModel');

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

const alimentoSch = new Schema({
    type:        { type: String, required: false },
    periodo:     { type: String, required: false },
    fe_tsd:      { type: Number, required: false },
    fe_tsh:      { type: Number, required: false },
    fe_txd:      { type: String, required: false },
    fe_txh:      { type: String, required: false },
    freq:        { type: String, required: false },
    qty:         { type: String, required: false },
    observacion: { type: String, required: false },
})

const modalidadSch = new Schema({
    periodo:     { type: String, required: false },
    fe_tsd:      { type: Number, required: false },
    fe_tsh:      { type: Number, required: false },
    fe_txd:      { type: String, required: false },
    fe_txh:      { type: String, required: false },
    freq:        { type: String, required: false },
})

const itempedidoSch = new Schema({
  slug:      { type: String, required: false },
  kitItem:   { type: Number, required: false },
  productId: { type: String, required: false },
  code:      { type: String, required: false },
  name:      { type: String, required: false },
  ume:       { type: String, required: false },
  qty:       { type: Number, required: false },
  punitario: { type: Number, required: false },

})
const novedadSch = new Schema({
    tnovedad:   { type: String,      required: false},
    novedad:    { type: String,      required: false},
    fecomp_txa: { type: String,      required: false},
    fecomp_tsa: { type: Number,      required: false},
    atendidox:  { type: atendidoSch, required: false},
})

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


const pedidoSch = new Schema({
    id:        { type: String, required: false },
    modalidad: { type: modalidadSch, required: false },
    deposito:  { type: String, required: false },
    type:  { type: String, required: false },
    urgencia:  { type: Number, required: false },
    kitId:     { type: String, required: false },
    kitQty:    { type: Number, required: false },
    estado:    { type: String, required: false },
    avance:    { type: String, required: false },
    causa:     { type: String, required: false },
    observacion: { type: String, required: false },
    items:     [ itempedidoSch ]
});


const encuestaSch = new Schema({
    id:           { type:String, required: false },
    fe_visita:    { type:String, required: false },
    fe_visita_ts: { type:String, required: false },
    urgencia:     { type:Number, required: false },
    locacionId:   { type:String, required: false },
    ruta:         { type:String, required: false },
    barrio:       { type:String, required: false },
    city:         { type:String, required: false },
    trabajador:   { type:String, required: false },
    trabajadorId: { type:String, required: false },
    preparacion:  { type:String, required: false },
    estado:       { type:String, required: false },
    avance:       { type:String, required: false },
    evaluacion:   { type:String, required: false },
})

const contextoDenunciaSch = new Schema({
    denunciante: { type: String, required: false },
    dendoc:      { type: String, required: false },
    dentel:      { type: String, required: false },
    inombre:     { type: String, required: false },
    iapellido:   { type: String, required: false },
    islug:       { type: String, required: false },
})

const contextoCovidSch = new Schema({
    hasFiebre:    { type: Boolean, required: false },
    fiebreTxt:    { type: String,  required: false },
    fiebre:       { type: Number,  required: false },
    fiebreRB:     { type: Number,  required: false },


    hasDifRespiratoria: { type: Boolean, required: false },
    hasDolorGarganta:   { type: Boolean, required: false },
    hasTos:       { type: Boolean, required: false },
    sintomas:     { type: String,  required: false },

    hasViaje:     { type: Boolean, required: false },
    hasContacto:  { type: Boolean, required: false },
    hasEntorno:   { type: Boolean, required: false },
    contexto:     { type: String,  required: false },

    esperaMedico: { type: Boolean, required: false },
    vistoMedico:  { type: Boolean, required: false },
    indicacion:   { type: String,  required: false },
    problema:     { type: String,  required: false },

    necesitaSame:    { type: Boolean, required: false },
    EsperaTraslado:  { type: Boolean, required: false },
    estaInternado:   { type: Boolean, required: false },
    estaEnDomicilio: { type: Boolean, required: false },

    hasCOVID:     { type: Boolean, required: false },
    isCOVID:      { type: Boolean, required: false },

});

 


/**
 * Creación de un Schema
 * @params
 */
const asisprevencionSch = new Schema({
    compPrefix:  { type: String, required: true },
    compName:    { type: String, required: true },
    compNum:     { type: String, required: true },
    ndoc:        { type: String, required: false },
    tdoc:        { type: String, required: false },
    edad:        { type: String, required: false },
    sexo:        { type: String, required: false },
    telefono:    { type: String, required: false },
    tipo:        { type: Number, required: false },
    osocial:     { type: String, required: false },
    osocialTxt:  { type: String, required: false },

    idPerson:    { type: String, required: false },
    idbrown:     { type: String, required: false },
    fecomp_tsa:  { type: Number, required: true },
    fecomp_txa:  { type: String, required: true },
    action:      { type: String, required: true },
    slug:        { type: String, required: false },
    description: { type: String, required: false },
    sector:      { type: String, required: false },
    estado:      { type: String, required: false },
    avance:      { type: String, required: false },
    ts_alta:     { type: Number, required: false },
    ts_fin:      { type: Number, required: false },
    ts_prog:     { type: Number, required: false },
    locacion:    { type: locacionSch, required: false }, 
    sintomacovid:{ type: contextoCovidSch, required: false }, 
    denuncia:    { type: contextoDenunciaSch, required: false }, 
    requeridox:  { type: requirenteSch, required: false },
    novedades:   [ novedadSch ],
    atendidox:   { type: atendidoSch,   required: false },
});


asisprevencionSch.pre('save', function (next) {
    return next();
});


function buildQuery(query){

  let q = {};
  if(query['estado']){
      q["estado"] = query['estado'];
  }

  if(query['tdoc']){
      q["tdoc"] = query['tdoc'];
  }

  if(query['ndoc']){
      q["ndoc"] = query['ndoc'];
  }


  if(query['avance']){
      q["avance"] = query['avance'];
  }

  if(!query['avance']){
      q["avance"] = {$ne: 'anulado'};
  }

  if(query['compPrefix']){
      q["compPrefix"] = query['compPrefix'];
  }

  if(query['compName']){
      q["compName"] = query['compName'];
  }

  if(query['idPerson']){
      q["idPerson"] = query['idPerson'];
  }

  if(query['compNum']){
      q["compNum"] = query['compNum'];
  }

  if(query['action']){
      q["action"] = query['action'];

      if(query['action'] === "encuesta"){
        if(query['ruta']) {
          q['encuesta.ruta'] = query['ruta'];
        }
        if(query['trabajadorId']) {
          q['encuesta.trabajadorId'] = query['trabajadorId'];
        }
        if(query['fe_visita']) {
          q['encuesta.fe_visita'] = query['fe_visita'];
        }
        if(query['avance_encuesta']) {
          q['encuesta.avance'] = query['avance_encuesta'];
        }
        if(query['barrio']) {
          q['encuesta.barrio'] = query['barrio'];
        }
        if(query['city']) {
          q['encuesta.city'] = query['city'];
        }
        if(query['urgencia']) {
          q['encuesta.urgencia'] = parseInt(query['urgencia'], 10);
        }

      }
  }

  if(query['sector']){
      q["sector"] = query['sector'];
  }

  let comp_range = [];

  if(query["compNum_d"]){
    comp_range.push( {"compNum": { $gte: query["compNum_d"]} });
  }
    
  if(query["compNum_h"]){
    comp_range.push( {"compNum": { $lte: query["compNum_h"]} });
  }

  if(query["fecomp_ts_d"]){

    comp_range.push( {"fecomp_tsa": { $gte: query["fecomp_ts_d"]} });
  }

  if(query["fecomp_ts_h"]){

    comp_range.push( {"fecomp_tsa": { $lte: query["fecomp_ts_h"]} });
  }

  if(comp_range.length){
    q["$and"] = comp_range;
  }

  if(query['requirenteId']){
      q["requeridox.id"] = query['requirenteId'];
  }



  return q;
}
//estado avance

/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Record = mongoose.model('Asisprevencion', asisprevencionSch, 'asisprevenciones');



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
    let regexQuery = buildQuery(query)

    Record.find(regexQuery)
          .limit(100)
          .lean()
          .sort( '-fecomp_tsa' )
          .exec(function(err, entities) {
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

/**
    compPrefix:  { type: String, required: true },
    compName:    { type: String, required: true },
    compNum:     { type: String, required: true },
    idPerson:    { type: String, required: true },
    fecomp_tsa:  { type: String, required: false },
    fecomp_txa:  { type: String, required: false },
    action:      { type: String, required: true },
    slug:        { type: String, required: false },
    description: { type: String, required: false },
    sector:      { type: String, required: false },
    estado:      { type: String, required: false },
    avance:      { type: String, required: false },
    ts_alta:     { type: Number, required: false },
    ts_fin:      { type: Number, required: false },
    ts_prog:     { type: Number, required: false },
    requeridox:  { type: requirenteSch, required: false },
    atendidox:   { type: atendidoSch,   required: false },
    modalidad:   { type: alimentoSch,   required: false },
    encuesta:    { type: encuestaSch,   required: false },
*/

exports.dashboard = function (errcb, cb) {
    dashboardProcess(cb);
}

const dashboardProcess = function(cb){

    Record.find().lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
            errcb(err);
        }else{
            processDashboardData(entities, cb)
        }
    });
}

const mesLabel = [
  'ENE',
  'FEB',
  'MAR',
  'ABR',
  'MAY',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OCT',
  'NOV',
  'DIC',

]

function processDashboardData(records, cb){

    /***
      token: {
        label:string
        cardinal:number
        slug:slug
      }



    **/
    let master = {
      hoy: {
        label: 'HOY',
        cardinal: 0,
        slug: 'Eventos/día',
        key: ''
      },
      semana: {
        label: 'ESTA SEMANA',
        cardinal: 0,
        slug: 'Eventos/semana',
        key: ''

      },
      meses: [],

      estados: [],

    };
    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(),now.getDate());
    let today_time = today.getTime();
    let semana = utils.buildDateFrameForCurrentWeek(today_time);

    if(records && records.length){


        records.forEach(asistencia => {

            acumBruto(master, asistencia, today, today_time, semana );
            acumAvance(master, asistencia, today, today_time, semana );

        })

        //Trucho OjO
        // master['lunes 20-01'].entregadas  = 1591;
        // master['lunes 20-01'].porciento  = master['lunes 20-01'].entregadas / master['lunes 20-01'].total * 100;

        //master['martes 21-01'].entregadas = 1887;
        //master['martes 21-01'].porciento  = master['martes 21-01'].entregadas / master['martes 21-01'].total * 100;
        cb(master);

    }else{
        cb({error: 'no data'})
    }



}


const acumAvance = function(master, asistencia, today, today_time, semana ){
  let key = asistencia.avance;
  let estados = master.estados;
  let cavance = estados.find(t => t.avance === key);
  if(cavance){
    cavance.token.cardinal +=1;


  }else {
    let  nuevoAvance = {
      avance: key,
      token: {
        label: key,
        cardinal: 1,
        key: key,
        slug: 'Estado actual'
      }
    }
    estados.push(nuevoAvance);
  }

}


const acumBruto = function(master, asistencia, today, today_time, semana ){
  //console.log(semana.semd.getTime(), asistencia.fecomp_txa, asistencia.fecomp_tsa, semana.semh.getTime());

  console.log('tx[%s] asis[%s] today[%s] [%s][%s]',asistencia.fecomp_txa,asistencia.fecomp_txa, today_time, asistencia.fecomp_tsa === today_time,asistencia.fecomp_tsa == today_time);
  if(asistencia.fecomp_tsa === today_time){
    master.hoy.cardinal +=1;

  }

  if(asistencia.fecomp_tsa >= semana.semd.getTime() && asistencia.fecomp_tsa <= semana.semh.getTime()){
    master.semana.cardinal +=1;

  }
  acumMes(master, asistencia, today, today_time, semana )


}

const acumMes = function(master, asistencia, today, today_time, semana ){
  let key = today.getFullYear()+':'+today.getMonth();
  let meses = master.meses;
  let mes = meses.find(t => t.mes === key);
  if(mes){
    mes.token.cardinal +=1;


  }else {
    let  nuevoMes = {
      mes: key,
      token: {
        label: mesLabel[today.getMonth()],
        cardinal: 1,
        key: asistencia.avance,
        slug: 'Eventos/mes'
      }
    }
    meses.push(nuevoMes);
  }


}


const isThisYear = function(fechaPHP){
  let currentYear = false;

  if(fechaPHP.getFullYear() === 2019) currentYear = true;

  return currentYear;
}

const isDeprecated = function(fechaPHP){
  let isDeprecated = false;

  if(fechaPHP.getFullYear() <= 2018) isDeprecated = true;

  return isDeprecated;
}

const buildObservacion = function(token){
  let obsList = token.observaciones;
  let obsText = "[Id: " + token.entrega.id + '] ';
  if(!obsList && !obsList.length) return obsText;

  obsList.forEach(t =>{
    let tx = ''

    if(t.text !== "NULL"){
      tx = t.ts + ':: ' + t.text + ' / '
    }

    obsText = obsText + tx;
  })

  return obsText;
}




function buildInverteTree(req, errcb, cb){
  person.buildInvertedTree().then(personTree => {
    if(personTree){
      //console.dir(personTree);
    }
    processArchive(personTree, req, errcb, cb)
  });
}


