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
const product = require('./productModel');

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

/**
 * Creación de un Schema
 * @params
 */
const asistenciaSch = new Schema({
    compPrefix:  { type: String, required: true },
    compName:    { type: String, required: true },
    compNum:     { type: String, required: true },
    idPerson:    { type: String, required: true },
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
    requeridox:  { type: requirenteSch, required: false },
    novedades:   [ novedadSch ],
    atendidox:   { type: atendidoSch,   required: false },
    modalidad:   { type: alimentoSch,   required: false },
    encuesta:    { type: encuestaSch,   required: false },
    pedido:      { type: pedidoSch,   required: false },
});


asistenciaSch.pre('save', function (next) {
    return next();
});


function buildQuery(query){

  let q = {};
  if(query['estado']){
      q["estado"] = query['estado'];
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
const Record = mongoose.model('Asistencia', asistenciaSch, 'asistencias');

exports.getRecord = function(){
  return Record;
}

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

async function insertAlimentosToDB (asistencia){

  await asistencia.save();

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

const buildAlimentos = function (token, num, isLast) {
  let observacion = buildObservacion(token);
  let avance = ' ' //ToDo verificar lista de avance
  let fechaPHP = token.entrega.f_entrega;
  let fechaDate = utils.parsePHPDateStr(fechaPHP);
  let projectedDate = utils.parsePHPDateStr(fechaPHP);
  let isCurrentYear = isThisYear(fechaDate);

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
    fe_tsd: fechaDate.getTime(),
    fe_tsh: fechaDate.getTime(),
    observacion: observacion
  }

  if(isLast){
    if(isCurrentYear){
      modalidad.periodo = "12M";
      let prjDate = utils.projectedDate(projectedDate, 0, 12);
      modalidad.fe_txh = utils.dateToStr(prjDate);
      modalidad.fe_tsh = prjDate.getTime();
    }
  }


  let asistencia = new Record({
    compPrefix:  "SOL",
    compName:    "S/Asistencia",
    compNum:     num,
    idPerson:    token.person._id,
    fecomp_tsa:  fechaDate.getTime(),
    fecomp_txa:  utils.dateToStr(fechaDate),
    idbrown:     token.idbrown,
    action:      "alimentos",
    slug:        "dato migrado",
    description: observacion,
    sector:      "alimentos",
    estado:      (isLast && isCurrentYear) ? "activo" : "cumplido",
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

// const insertMasterData = function (master){
//   let serialNum = 100000;
//   for(let token in master){
//     serialNum += 1;
//     compNum = serialNum + "";

//     let asistencia = buildAlimentos(master[token], compNum);
//     insertAlimentosToDB(asistencia);

//   }

// }

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

    populateMasterAlimento(tree, master, alimento);
}


const processAlimentos = function(tree, data, errcb, cb){
    let table = data.database.table;

    const alimentosMaster = {};

    table.forEach((token, index) => {
        processEachAlimento(tree, alimentosMaster, token);

    });

    let beneficiarios = reviewMasterData(tree, alimentosMaster);
    cb({process: "ok"});

    insertDataFromPerson(beneficiarios);

}


const processArchive = function(tree, req, errcb, cb){
    //console.log('******  processARCHIVE to BEGIN ********')
    //const arch = path.join(config.rootPath, 'public/migracion/alimentos/alimentos.xml');
    const arch = path.join(config.rootPath, 'www/dsocial/migracion/alimentos/alimentos.xml');
    //console.log('******  processARCHIVE OK ********')


    function toLowerCase(name){
        return name.toLowerCase();
    }

    function toUpperCase(name){
        return name.toUpperCase();
    }


    let parser = new xml2js.Parser();

    fs.readFile(arch, function( err, data){
        if(err){
            console.log(err);

        }else{
            parser.parseString(data, 

            function(err, jdata){
                if(err){
                    console.log('error*************')

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

    }
    processArchive(personTree, req, errcb, cb)
  });
}


//http://localhost:8080/api/asistencias/importalimentos
/**
 * Sign up a new person
 * @param person
 * @param cb
 * @param errcb
 */
exports.importalimentos = function (req, errcb, cb) {
    //ToDo: ojo SQL que traiga también las pendientes

    buildInverteTree(req, errcb, cb);

};

const buildDiaMes = function(token, fecomp, timeframe){
  let fecharef = timeframe.fecharef;
  let fechasem = timeframe.semd;

  let fechaId = fecharef.getFullYear() + '0000';
  let diaId = '00' + token.dia;
  let mesId = '00' + token.mes;
  
  if(token.mes === fechasem.getMonth()){
    if(token.dia === fecharef.getDate()){
      fechaId = fecharef.getFullYear() + mesId.substr(-2) + diaId.substr(-2);
    } else {
      fechaId = fecharef.getFullYear() + mesId.substr(-2) + '00';
    }
  }
  if(timeframe.semd <= fecomp && fecomp <= timeframe.semh){
    fechaId = fechaId + 'SE'
    token.sem = "SE"

  } else {
    fechaId = fechaId + '00'
    token.sem = "00"

  }

  return fechaId;
}



const buildId = function(token, fecomp, timeframe){
  let fechaId = buildDiaMes(token,fecomp, timeframe);
  let edadId = token.edadId;
  let sexoId = token.sexo;
  let estadoId = "[" + ("            " + token.estado).substr(-12) + "]" 
  let avanceId = "[" + ("            " + token.avance).substr(-12) + "]" 
  let actionId = "[" + ("            " + token.action).substr(-12) + "]" 
  let sectorId = "[" + ("            " + token.sector).substr(-12) + "]" 
  return fechaId + ':' + edadId + ':' + sexoId + ':' + estadoId + avanceId + actionId + sectorId;
}

const processToken = function(token, master){
  if(master[token.id]){
    master[token.id].cardinal = master[token.id].cardinal + 1;

  }else{
    master[token.id] = token;
  }
}

// {  "fecomp_txa": { "$exists": true }, "$expr": { "$lt": [ { "$strLenCP": "fecomp_txa" }, 8 ] } }
// TypeError: Cannot read property 'getDate' of null
//     at /home/dsapp/repositorios/develar/core/models/asistenciaModel.js:771:19
//     at Array.forEach (<anonymous>)
//     at procesTableroAsistencia (/home/dsapp/repositorios/develar/core/models/asistenciaModel.js:753:12)
/**********************************/
/*         TABLERO-ASISTENCIA    */
/********************************/
const procesTableroAsistencia = function(ptree, entities, timeframe, errcb, cb){
  let master = {};

  entities.forEach(asistencia => {
    let fecomp = utils.parseDateStr(asistencia.fecomp_txa)

    if(!fecomp){ 

      fecomp = new Date();
      console.log('errror **************************')
      console.log('asistencia: [%s]', asistencia.compNum)
      console.log('errror **************************')

    }

    let person = ptree[asistencia.idPerson];
    let fenac = 0;
    let sexo = 'X';
    let ciudad = 'ciudad';

    if(person){
      fenac = person.fenac || 0;
      sexo = person.sexo || 'X';
      if(person.locaciones && person.locaciones.length){
        ciudad = person.locaciones[0].city || 'ciudad';
      }
    }else{
      console.log('aiuddaaaaaa')
    }

    let token = {
      dia: fecomp.getDate(),
      mes: fecomp.getMonth(),
      sem: "00",
      fenac: fenac,
      ciudad: ciudad,
      sexo: sexo,
      edadId: ("00" + Math.floor(utils.calcularEdad(fenac)/10)).substr(-2),
      estado: asistencia.estado,
      avance: asistencia.avance,
      action: asistencia.action,
      sector: asistencia.sector,
      cardinal: 1
    };

    token.id = buildId(token,fecomp, timeframe);
    processToken(token, master);

  })
  // fin del proceso
  cb(master);


}
/**********************************/
/*          TABLERO              */
/********************************/

exports.tablero = function(fecha, errcb, cb) {
 
  let time_frame = utils.buildDateFrameForCurrentWeek(fecha);

  let query = {
      fecomp_ts_d: time_frame.begin.getTime(),
      fecomp_ts_h: time_frame.semh.getTime()
    }
  
  let regexQuery = buildQuery(query)

    
  person.buildIdTree().then(pTree =>{

    Record.find(regexQuery).lean().exec(function(err, entities) {

        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);
        }else{

          procesTableroAsistencia(pTree, entities, time_frame, errcb, cb);
        }
    });
  })

}

const populateMasterHabitacional = function(person_tree, product_tree, master, record){

  /****
            <column name="id">33109</column>
            <column name="solicitante">87890</column>
            <column name="causa">Otra</column>
            <column name="causa_otra"></column>
            <column name="estado">Entregada</column>
            <column name="fecha_entrega">2019-11-01</column>
            <column name="timestamp">2019-11-01 10:03:20</column>
            <column name="id_07">87890</column>
            <column name="documento_nro">20027011</column>
            <column name="nombre">ENRIQUE </column>
            <column name="apellido">BARAJA</column>
            <column name="id_11">155474</column>
            <column name="file">NULL</column>
            <column name="text">RETIRA PARA EL SR. ARANGEL CRISTIAN JAVIER CON DNI 36.829.100</column>
            <column name="user">0</column>
            <column name="timestamp">2019-11-01 13:59:06</column>
            <column name="solicitud">33109</column>
            <column name="producto">32</column>
            <column name="cantidad">5</column>

  ****/

  let obs_token = {id: record.id11, text: record.text, ts: record.timestamp15};
  let qty = 1;
  let punitario = 0;
  if(record.cantidad && record.cantidad !== 'NULL'){
    qty = parseInt(record.cantidad, 10);
  }
  let name = "";
  let ume = "UN";
  let productId = null;


  if(!record.producto || record.producto === 'NULL' ){
    return;
  }

  if(!product_tree[record.producto]){
  
  }else{
    name =        product_tree[record.producto].name || 'producto genérico';
    ume =         product_tree[record.producto].pume || 'UN';
    productId =  product_tree[record.producto]._id || null;
  }

  let product_token = {
    code: record.producto,
    slug: 'dato migrado', 
    kitItem: 0,
    qty: qty,
    name:       name,
    ume:        ume,
    productId:  productId,
    punitario: punitario,

  };

  if(master[record.id]){
      let obs = master[record.id].observaciones;
      if(obs && obs.length){
        obs.push(obs_token);

      }else{
        master[record.id].observaciones = [ obs_token ];
      }

     let items = master[record.id].items;
      if(items && items.length){
        items.push(product_token);

      }else{
        master[record.id].items = [ product_token ];
      }

  }else {
    let token = {};
    if(person_tree[record.solicitante]){
      token.person = person_tree[record.solicitante];
      token.idbrown = record.id;
      token.brownPersonId = record.solicitante
      token.entrega = {
        id: record.id,
        solicitante: record.solicitante,
        causa: record.causa,
        causa_otra: record.causa_otra,
        estado: record.estado,
        ts:  record.timestamp,
        f_entrega: record.fecha_entrega,
      }

      token.observaciones = [obs_token ]
      token.items = [ product_token ]
      master[record.id] = token;

    }else{

    }

  }
}

const processEachHabitacional = function(person_tree, product_tree, master, token){
    let data = token.column,
        record = {};

    data.forEach((el,index)=>{
        if(!record[el.$.name]){
            record[el.$.name] = el._;
        }else{
            record[el.$.name + index] = el._;

        }
    });

    populateMasterHabitacional(person_tree, product_tree, master, record);
}


const buildHabitacional = function (token, num) {

  let observacion = buildObservacion(token);
  let avance = 'entregado'; //ToDo verificar lista de 
  let estado = 'cumplido';
  let fecha = '01/01/1900';
  let fechaPHP = '01/01/1900';

  if(token.entrega.f_entrega !== 'NULL'){
    fecha = token.entrega.f_entrega;
    fechaPHP = token.entrega.f_entrega;

  }else if(token.entrega.ts && token.entrega.ts !== 'NULL'){
    fecha = token.entrega.ts.substring(0 , 10);
    fechaPHP = fecha;
  }

  let fechaDate = utils.parsePHPDateStr(fechaPHP);
  let projectedDate = utils.parsePHPDateStr(fechaPHP);
  let isCurrentYear = isThisYear(fechaDate);
  let isVencido = isDeprecated(fechaDate);

  let modalidad = {
    periodo: 'UNICO',
    fe_txd: fecha,
    fe_txh: fecha,
    fe_tsd: fechaDate.getTime(),
    fe_tsh: fechaDate.getTime(),
    freq:   'unicavez'
  }

  if(token.entrega.estado === 'Pendiente'){
    if(isVencido){
      avance = 'incumplido';
      estado = 'baja';

    }else{
      avance = 'pendiente';
      estado = 'activo';

    }


  }else if(token.entrega.estado === 'Entregada' || token.entrega.estado === 'NULL'){
    avance = 'entregado';
    estado = 'cumplido'

  }else if(token.entrega.estado === 'Anulada'){
    avance = 'anulado';
    estado = 'baja'

  }

  let requeridox = {
    id: token.person._id,
    slug: token.person.displayName,
    tdoc: token.person.tdoc,
    ndoc: token.person.ndoc
  }

  let pedido = {
    modalidad: modalidad,
    deposito: 'galpon',
    urgencia: 1,
    kitId: null,
    kitQty: 1,
    estado: estado,
    avance: avance,
    causa: token.entrega.causa,
    observacion: token.entrega.causa_otra,
    items: token.items
  }


  let asistencia = new Record({
    compPrefix:  "SOL",
    compName:    "S/Asistencia",
    compNum:     num,
    idPerson:    token.person._id,
    fecomp_tsa:  fechaDate.getTime(),
    fecomp_txa:  utils.dateToStr(fechaDate),
    idbrown:     token.idbrown,
    action:      "habitacional",
    slug:        "dato migrado",
    description: observacion,
    sector:      "tsocial",
    estado:      estado,
    avance:      avance,
    ts_alta:     utils.parsePHPTimeStamp(token.entrega.ts),
    ts_fin:      utils.parsePHPTimeStamp(token.entrega.ts),
    ts_prog:     utils.parsePHPTimeStamp(token.entrega.ts),
    requeridox:  requeridox,
    atendidox:   null,
    modalidad: null,
    pedido:   pedido,
    encuesta:    null
  })
  return asistencia;

}

const insertHabitacionalData = function(person_tree, product_tree, habitacionalMaster){

  let serialNum = 200000;
  let isLast = false;

  for(let pid in habitacionalMaster){

    let token = habitacionalMaster[pid];

    serialNum += 1;
    compNum = serialNum + "";


    let asistencia = buildHabitacional(token, compNum);

    if(asistencia){
      insertAlimentosToDB(asistencia);
    }

  }


}


const processHabitacionalRecords = function(person_tree, product_tree, data, errcb, cb){
    let table = data.database.table;

    const habitacionalMaster = {};

    table.forEach((token, index) => {
        processEachHabitacional(person_tree, product_tree, habitacionalMaster, token);

    });


    cb({process: "ok"});

    insertHabitacionalData(person_tree, product_tree, habitacionalMaster);

}

const processHabitacionalArchive = function(person_tree, product_tree, req, errcb, cb){
    //const arch = path.join(config.rootPath,     'public/migracion/habitacional/habitacional.xml');
    const arch = path.join(config.rootPath,  'www/dsocial/migracion/habitacional/habitacional.xml');


    function toLowerCase(name){
        return name.toLowerCase();
    }

    function toUpperCase(name){
        return name.toUpperCase();
    }


    let parser = new xml2js.Parser();

    fs.readFile(arch, function( err, data){
        if(err){
            console.log(err);

        }else{
            parser.parseString(data, 

            function(err, jdata){
                if(err){
                    console.log('error*************')

                }else{
                    processHabitacionalRecords(person_tree, product_tree, jdata, errcb, cb);
                }
            });
        }
    });


}


function buildHabitacionalTree(req, errcb, cb){
  person.buildInvertedTree().then(personTree => {
    if(personTree){

    }
    product.buildInvertedTree().then(productTree => {
      if(productTree){

      }
      processHabitacionalArchive(personTree, productTree, req, errcb, cb)

    })
  });
}


exports.importhabitacional = function (req, errcb, cb) {

    buildHabitacionalTree(req, errcb, cb);

};

/*************************/
/*        SANITARIA     */
/***********************/

const buildSanitarian = function (token, num) {

  let observacion = buildObservacion(token);
  let avance = 'entregado'; //ToDo verificar lista de 
  let estado = 'cumplido';
  let fecha = '01/01/1900';
  let fechaPHP = '01/01/1900';

  if(token.entrega.f_entrega !== 'NULL'){
    fecha = token.entrega.f_entrega;
    fechaPHP = token.entrega.f_entrega;

  }else if(token.entrega.ts && token.entrega.ts !== 'NULL'){
    fecha = token.entrega.ts.substring(0 , 10);
    fechaPHP = fecha;
  }

  let fechaDate = utils.parsePHPDateStr(fechaPHP);
  let projectedDate = utils.parsePHPDateStr(fechaPHP);

  let isCurrentYear = isThisYear(fechaDate);

  let isVencido = isDeprecated(fechaDate);

  let modalidad = {
    periodo: 'UNICO',
    fe_txd: fecha,
    fe_txh: fecha,
    fe_tsd: fechaDate.getTime(),
    fe_tsh: fechaDate.getTime(),
    freq:   'unicavez'
  }

  if(token.entrega.estado === 'Pendiente'){
    if(isVencido){
      avance = 'incumplido';
      estado = 'baja';

    }else{
      avance = 'pendiente';
      estado = 'activo';

    }


  }else if(token.entrega.estado === 'Entregada' || token.entrega.estado === 'NULL'){
    avance = 'entregado';
    estado = 'cumplido'

  }else if(token.entrega.estado === 'Rechazada'){
    avance = 'rechazado';
    estado = 'baja'

  }else if(token.entrega.estado === 'En Zona VI'){

    if(isVencido){
      avance = 'derivadoVI';
      estado = 'baja';

    }else{
      avance = 'derivadoVI';
      estado = 'activo'
    }

  }else if(token.entrega.estado === 'Incompleta'){
    avance = 'incumplido';
    estado = 'baja'

  }else if(token.entrega.estado === 'Anulada'){
    avance = 'anulado';
    estado = 'baja'

  }else{
    avance = 'anulado';
    estado = 'baja'

  }

  let requeridox = {
    id: token.person._id,
    slug: token.person.displayName,
    tdoc: token.person.tdoc,
    ndoc: token.person.ndoc
  }

  let pedido = {
    modalidad: modalidad,
    deposito: 'galpon',
    urgencia: 1,
    kitId: null,
    kitQty: 1,
    estado: estado,
    avance: avance,
    causa: token.entrega.causa,
    observacion: token.entrega.causa_otra,
    items: token.items
  }


  let asistencia = new Record({
    compPrefix:  "SOL",
    compName:    "S/Asistencia",
    compNum:     num,
    idPerson:    token.person._id,
    fecomp_tsa:  fechaDate.getTime(),
    fecomp_txa:  utils.dateToStr(fechaDate),
    idbrown:     token.idbrown,
    action:      "sanitaria",
    slug:        "dato migrado",
    description: observacion,
    sector:      "tsocial",
    estado:      estado,
    avance:      avance,
    ts_alta:     utils.parsePHPTimeStamp(token.entrega.ts),
    ts_fin:      utils.parsePHPTimeStamp(token.entrega.ts),
    ts_prog:     utils.parsePHPTimeStamp(token.entrega.ts),
    requeridox:  requeridox,
    atendidox:   null,
    modalidad: null,
    pedido:   pedido,
    encuesta:    null
  })
  return asistencia;

}



const insertSanitarianData = function(person_tree, product_tree, sanitarianMaster){

  let serialNum = 300000;
  let isLast = false;

  for(let pid in sanitarianMaster){

    let token = sanitarianMaster[pid];

    serialNum += 1;
    compNum = serialNum + "";


    let asistencia = buildSanitarian(token, compNum);

    if(asistencia){
      insertAlimentosToDB(asistencia);
    }

  }


}



const populateMasterSanitaria = function(person_tree, product_tree, master, record){

  /****
        <column name="id">10081</column>
        <column name="solicitante">37262</column>
        <column name="producto">58</column>
        <column name="especificacion"></column>
        <column name="monto">NULL</column>
        <column name="cantidad">1</column>
        <column name="estado">Entregada</column>
        <column name="fecha_entrega">2012-07-02</column>
        <column name="timestamp">2012-07-02 11:34:57</column>
        <column name="id">37262</column>
        <column name="documento_nro">52583919</column>
        <column name="nombre">MILENA YANINA ANABELA</column>
        <column name="apellido">SANABRIA MONTES</column>
        <column name="id">35725</column>
        <column name="file">NULL</column>
        <column name="text">EMERGENCIA- SE ENTREGAN REQUISITOS PARA EL TRAMITE-</column>
        <column name="user">0</column>
        <column name="timestamp">2012-07-02 11:35:57</column>

  ****/

  let obs_token = {id: record.id13, text: record.text, ts: record.timestamp17};
  let qty = 1;
  let punitario = 0;

  if(record.cantidad && record.cantidad !== 'NULL'){
    qty = parseInt(record.cantidad, 10);
  }
  if(record.monto && record.monto !== 'NULL'){
    punitario = parseInt(record.monto, 10);
  }

  let name = "";
  let ume = "UN";
  let productId = null;
  let especificacion = record.especificacion || '';

  if(!record.producto || record.producto === 'NULL' ){
    return;
  }

  if(!product_tree[record.producto]){
  
  }else{
    name =        product_tree[record.producto].name || 'producto genérico';
    ume =         product_tree[record.producto].pume || 'UN';
    productId =  product_tree[record.producto]._id || null;
  }

  let product_token = {
    code: record.producto,
    slug: 'especificación:  ' + especificacion, 
    kitItem: 0,
    qty: qty,
    name:       name,
    ume:        ume,
    punitario:  punitario,
    productId:  productId,

  };

  if(master[record.id]){
      let obs = master[record.id].observaciones;
      if(obs && obs.length){
        obs.push(obs_token);

      }else{
        master[record.id].observaciones = [ obs_token ];
      }

     let items = master[record.id].items;
      if(items && items.length){
        items.push(product_token);

      }else{
        master[record.id].items = [ product_token ];
      }

  }else {
    let token = {};
    if(person_tree[record.solicitante]){
      token.person = person_tree[record.solicitante];
      token.idbrown = record.id;
      token.brownPersonId = record.solicitante
      token.entrega = {
        id: record.id,
        solicitante: record.solicitante,
        causa: '',
        causa_otra: '',
        estado: record.estado,
        ts:  record.timestamp,
        f_entrega: record.fecha_entrega,
      }

      token.observaciones = [obs_token ]
      token.items = [ product_token ]
      master[record.id] = token;

    }else{
      //console.log('AUXILIO: NO encuentro persona!!! [%s]', record.id)
    }

  }
}


const processEachSanitarian = function(person_tree, product_tree, master, token){
    let data = token.column,
        record = {};

    data.forEach((el,index)=>{
        if(!record[el.$.name]){
            record[el.$.name] = el._;
        }else{
            record[el.$.name + index] = el._;

        }
    });

    populateMasterSanitaria(person_tree, product_tree, master, record);
}

const processSanitarianRecords = function(person_tree, product_tree, data, errcb, cb){
    let table = data.database.table;

    const sanitarianMaster = {};

    table.forEach((token, index) => {
        processEachSanitarian(person_tree, product_tree, sanitarianMaster, token);

    });


    cb({process: "ok"});

    insertSanitarianData(person_tree, product_tree, sanitarianMaster);

}

const processSanitarianArchive = function(person_tree, product_tree, req, errcb, cb){
    //const arch = path.join(config.rootPath,        'public/migracion/sanitaria/sanitaria.xml');
    const arch = path.join(config.rootPath, 'www/dsocial/migracion/sanitaria/sanitaria.xml');

    function toLowerCase(name){
        return name.toLowerCase();
    }

    function toUpperCase(name){
        return name.toUpperCase();
    }

    let parser = new xml2js.Parser();

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
                    processSanitarianRecords(person_tree, product_tree, jdata, errcb, cb);
                }
            });
        }
    });
}


function buildTreeForSanitarian(req, errcb, cb){
  person.buildInvertedTree().then(personTree => {
    if(personTree){

    }
    product.buildInvertedTree().then(productTree => {
      if(productTree){

      }
      processSanitarianArchive(personTree, productTree, req, errcb, cb)

    })
  });
}


exports.importsanitaria = function (req, errcb, cb) {

    buildTreeForSanitarian(req, errcb, cb);

};




