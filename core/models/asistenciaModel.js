/**
 * Asistencia: Solicitud de Asistencia a Vecinos
 */

const whoami =  "models/asistenciaModel: ";

const mongoose = require('mongoose');

// necesarios para el proceso de importación
const config = require('../config/config')
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const utils = require('../services/commons.utils');
const person = require('./personModel');

const Schema = mongoose.Schema;

const self = this;

const requirenteSch = new Schema({
  id:      { type: String, required: false },
  slug:    { type: String, required: false },
  tdoc:    { type: String, required: false },
  ndoc:    { type: String, required: false },
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

/**
 * Creación de un Schema
 * @params
 */
const asistenciaSch = new Schema({
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
});


asistenciaSch.pre('save', function (next) {
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

  if(query['avance']){
      q["avance"] = query['avance'];
  }

  if(query['estado']){
      q["estado"] = query['estado'];
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


/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Record = mongoose.model('Asistencia', asistenciaSch, 'asistencias');



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

async function insertAlimentosToDB (asistencia){

  //console.dir(JSON.stringify(asistencia));
  await asistencia.save();

}

const isThisYear = function(fechaPHP){
  let currentYear = false;

  if(fechaPHP.getFullYear() === 2019) currentYear = true;

  return currentYear;
}

const buildObservacion = function(token){
  let obsList = token.observaciones;
  let obsText = "[Id: " + token.entrega.id + '] ';
  if(!obsList && !obsList.length) return obsText;

  obsList.forEach(t =>{
    let tx = ''

    if(t.text !== "NULL"){
      tx = t.ts + ':: ' + t.text + '  '
    }

    obsText = obsText + tx;
  })

  return obsText;
}

const buildAlimentos = function (token, num, isLast) {
  let observacion = buildObservacion(token);
  let avance = ' ' //ToDo verificar lista de avance
  let fechaPHP = token.entrega.f_entrega;
  //console.log('buildAlimentos: [%s]', fechaPHP);
  let fechaDate = utils.parsePHPDateStr(fechaPHP);
  let projectedDate = utils.parsePHPDateStr(fechaPHP);

  let requeridox = {
    id: token.person._id,
    slug: token.person.displayName,
    tdoc: token.person.tdoc,
    ndoc: token.person.ndoc
  }

  let modalidad = {
    type:"ALIM-ESTANDAR",
    periodo: "UNICO",
    freq: "mensual",
    qty: 1,
    fe_txd: utils.dateToStr(fechaDate),
    fe_txh: utils.dateToStr(fechaDate),
    observacion: observacion
  }

  if(isLast){
    if(isThisYear(fechaDate)){
      modalidad.periodo = "12M";
      modalidad.fe_txh = utils.dateToStr(utils.projectedDate(projectedDate, 0, 12));
    }
  }


  let asistencia = new Record({
    compPrefix:  "SOL",
    compName:    "S/Asistencia",
    compNum:     num,
    idPerson:    token.person._id,
    fecomp_tsa:  fechaDate.getTime(),
    fecomp_txa:  utils.dateToStr(fechaDate),
    action:      "alimentos",
    slug:        "dato migrado",
    description: observacion,
    sector:      "alimentos",
    estado:      isLast ? "activo" : "cumplido",
    avance:      "entregado",
    ts_alta:     utils.parsePHPTimeStamp(token.entrega.ts),
    ts_fin:      utils.parsePHPTimeStamp(token.entrega.ts),
    ts_prog:     utils.parsePHPTimeStamp(token.entrega.ts),
    requeridox:  requeridox,
    atendidox:   null,
    modalidad:   modalidad,
    encuesta:    null
  })
  return asistencia;

}

const insertMasterData = function (master){
  let serialNum = 100000;
  for(let token in master){
    serialNum += 1;
    compNum = serialNum + "";

    let asistencia = buildAlimentos(master[token], compNum);
    insertAlimentosToDB(asistencia);

  }

}

const insertDataFromPerson = function(tree){
  let serialNum = 100000;
  let isLast = false;

  for(let pid in tree){
    let tokens = tree[pid];

    if(tokens && tokens.length){

      tokens.forEach((t,i) => {
        serialNum += 1;
        compNum = serialNum + "";
        isLast = (i === tokens.length - 1 ? true : false);


        let asistencia = buildAlimentos(t, compNum, isLast);
        insertAlimentosToDB(asistencia);

      })
    }
  }
}

const reviewMasterData = function (tree, master){
  let beneficiarios = {};
  console.log('ReviewMasterData')
  for(let token in master){
    let record = master[token];
    if(beneficiarios[record.brownPersonId]){
      beneficiarios[record.brownPersonId].push(record);

    }else{
      beneficiarios[record.brownPersonId] = [record];

    }
  }
  return beneficiarios;
}

const populateMasterAlimento = function(person_tree, master, alimento){


  let obs_token = {id: alimento.id9, text: alimento.text, ts: alimento.timestamp13};
  
  if(master[alimento.id4]){
      let obs = master[alimento.id4].observaciones;
      if(obs && obs.length){
        obs.push(obs_token);

      }else{
        master[alimento.id4].observaciones = [ obs_token ];
      }

  }else {
    let token = {};
    if(person_tree[alimento.id]){
      token.person = person_tree[alimento.id];
      token.idbrown = alimento.id4;
      token.brownPersonId = alimento.id
      token.entrega = {
        id: alimento.id4,
        solicitante: alimento.solicitante,
        estado: alimento.estado,
        ts:  alimento.timestamp,
        f_entrega: alimento.fecha_entrega
      }

      token.observaciones = [{id: alimento.id9, text: alimento.text, ts: alimento.timestamp13}]
      master[alimento.id4] = token;

    }else{
      console.log('AUXILIO: NO encuentro persona!!! [%s]', alimento.id)
    }

  }
}

const processEachAlimento = function(tree, master, token){
    let data = token.column,
        alimento = {};

    data.forEach((el,index)=>{
        if(!alimento[el.$.name]){
            alimento[el.$.name] = el._;
        }else{
            alimento[el.$.name + index] = el._;

        }
    });
    // console.dir(alimento);
    // console.log('---------------------------');
    populateMasterAlimento(tree, master, alimento);
}


const processAlimentos = function(tree, data, errcb, cb){
    let table = data.database.table;

    const alimentosMaster = {};

    table.forEach((token, index) => {
        processEachAlimento(tree, alimentosMaster, token);

    });

    //console.dir(alimentosMaster);
    let beneficiarios = reviewMasterData(tree, alimentosMaster);
    cb({process: "ok"});
    //insertMasterData(alimentosMaster);
    insertDataFromPerson(beneficiarios);

}


const processArchive = function(tree, req, errcb, cb){
    console.log('******  processARCHIVE to BEGIN ********')
    //const arch = path.join(config.rootPath, 'public/migracion/alimentos/alimentos.xml');
    const arch = path.join(config.rootPath, 'www/dsocial/migracion/alimentos/alimentos.xml');
    console.log('******  processARCHIVE OK ********')


    function toLowerCase(name){
        return name.toLowerCase();
    }

    function toUpperCase(name){
        return name.toUpperCase();
    }


    let parser = new xml2js.Parser();

    console.log('Ready to begin PROCESS: [%s]', arch);
    fs.readFile(arch, function( err, data){
        if(err){
            console.dir(err);

        }else{
            parser.parseString(data, 

            function(err, jdata){
                if(err){
                    console.log('error*************')
                    console.dir(err);

                }else{
                    console.log('Parser OK');
                    processAlimentos(tree, jdata, errcb, cb);
                }
            });
        }
    });


}



function buildInverteTree(req, errcb, cb){
  person.buildInvertedTree().then(personTree => {
    if(personTree){
      console.log('PersonTree CREATED')
      //console.dir(personTree);
    }
    processArchive(personTree, req, errcb, cb)


  })




}

//http://localhost:8080/api/asistencias/importalimentos
/**
 * Sign up a new person
 * @param person
 * @param cb
 * @param errcb
 */
exports.importalimentos = function (req, errcb, cb) {
    //console.log('Import @496')

    buildInverteTree(req, errcb, cb);

};
