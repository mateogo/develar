/**
 * Almacen: Solicitud de Almacen a Vecinos
 */

const whoami =  "models/almacenModel: ";

const mongoose = require('mongoose');
const utils =    require('../services/commons.utils');
const person =   require('./personModel');
const product =  require('./productModel');
const Excel =    require('exceljs')

const Schema = mongoose.Schema;

const self = this;

const requirenteSch = new Schema({
  id:      { type: String, required: false },
  slug:    { type: String, required: false },
  tdoc:    { type: String, required: false },
  ndoc:    { type: String, required: false },
});
 
const parentSch = new Schema({
    id:      { type: String, required: false },
    type:    { type: String, required: false },
    kit:     { type: String, required: false },
    action:  { type: String, required: false },
    compNum: { type: String, required: false },
});


const atendidoSch = new Schema({
    id:      { type: String, required: false },
    slug:    { type: String, required: false },
    sector:  { type: String, required: false },
});

const itemAlmacenSch = new Schema({
    productId: { type: String, required: true },
    isKit:     { type: Number, required: true, default:0 },
    code:      { type: String, required: true },
    name:      { type: String, required: true },
    slug:      { type: String, required: false },
    ume:       { type: String, required: true },
    qty:       { type: Number, required: true },
});


/**
 * Creación de un Schema
 * @params
 */
const almacenSch = new Schema({
    compPrefix:  { type: String, required: true  },
    compName:    { type: String, required: true  },
    compNum:     { type: String, required: true  },
    personId:    { type: String, required: true  },
    parentId:    { type: String, required: false },
    kitEntrega:  { type: String, required: false },
    qty:         { type: Number, required: false },
    deposito:    { type: String, required: true  },
    tmov:        { type: String, required: false },
    fecomp_tsa:  { type: Number, required: false },
    fecomp_txa:  { type: String, required: false },
    action:      { type: String, required: true  },
    slug:        { type: String, required: false },
    description: { type: String, required: false },
    sector:      { type: String, required: false },
    estado:      { type: String, required: false },
    avance:      { type: String, required: false },
    ts_alta:     { type: Number, required: false },
    ts_fin:      { type: Number, required: false },
    ts_prog:     { type: Number, required: false },
    parent:      { type: parentSch,     required: false },
    requeridox:  { type: requirenteSch, required: false },
    atendidox:   { type: atendidoSch,   required: false },
    entregas:    [ itemAlmacenSch ],

});


almacenSch.pre('save', function (next) {
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

  if(query['personId']){
      q["personId"] = query['personId'];
  }

  if(query['compNum']){
      q["compNum"] = query['compNum'];
  }

  if(query['action']){
      q["action"] = query['action'];
  }

  if(query['avance']){
      q["avance"] = query['avance'];
  }

  if(query['sector']){
      q["sector"] = query['sector'];
  }

  if(query['deposito']){
      q["deposito"] = query['deposito'];
  }

  if(query['estado']){
      q["estado"] = query['estado'];
  }

  if(query['fed']){
    let fed_ts = utils.parseDateStr(query['fed']).getTime();
    q['fecomp_tsa'] = { $gte: fed_ts}

  }

  if(query['feh']){
    let feh_ts = utils.parseDateStr(query['feh']).getTime();
    q['fecomp_tsa'] = { $lte: feh_ts}

  }

  let comp_range = [];
  if(query["fecomp_ts_d"]){
    comp_range.push( {"fecomp_tsa": { $gte: query["fecomp_ts_d"]} });
  }

  if(query["fecomp_ts_h"]){
    comp_range.push( {"fecomp_tsa": { $lte: query["fecomp_ts_h"]} });
  }

  if(comp_range.length){
    q["$and"] = comp_range;
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
const Record = mongoose.model('Remitosalmacen', almacenSch, 'remitosalmacen');



/////////   CAPA DE SERVICIOS /////////////

/**
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */
exports.upsertNext = function (query, errcb, cb) {
    let regexQuery = buildQuery(query);

    Record.find(regexQuery).lean().exec(function(err, entities) {
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
    Record.find().lean().exec(function(err, entities) {
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
    console.dir(query)
    console.log('justCabecera. [%s]', query.justCabecera === "false")


    Record.find(regexQuery).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);
        }else{
          console.log('fetched: [%s]', entities && entities.length);
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

    record.fecomp_tsa = utils.parseDateStr(record.fecomp_txa).getTime();
    record.ts_prog =    Date.now();

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


exports.fetchRemitosByPerson = function(personId){
  let query = {
    personId: personId,
    estado: "activo"
  }

  return Record.find(query).lean();
}

exports.exportarmovimientos = function(query, req, res ){
    console.log('exportar movimientos')
    
    if(!query){
      query = {estado: 'activo'}
    }

    console.log('EXPORT BEGIN *********')
    fetchMovimientos(query, req, res)

}


function fetchMovimientos(query, req, res){
    let regexQuery = buildQuery(query)

    console.dir('FetchMovimientos: buildQuery')
    console.dir(regexQuery);

    Record.find(regexQuery).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
            errcb(err);
        }else{
            console.log('EXPORT MOVIM ok[%s]', entities && entities.length)
            buildExcelStream(entities, query, req, res)
        }
    });



}

function buildExcelStream(remanentes, query, req, res){
    res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="movimientos_almacen.xlsx"',
        'Transfer-Encoding': 'chunked',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res })
    var worksheet = workbook.addWorksheet('movimientos')

    var justCabecera = query.justCabecera === "true"

    
    worksheet.addRow(['Movimientos de Almacén']).commit()
    worksheet.addRow(['Fecha emisión', new Date().toString()]).commit()

    worksheet.addRow().commit()
    worksheet.addRow(['Comprobante','Número','Cantidad','Acción','Estado','Avance','Fecha','Comentario','Depósito','T/Mov','T/Kit','Kit','DOC','Documento','Beneficiario/a','Cód','Artículo','Descripción','UME','Cant']).commit();

    remanentes.forEach(row => {
        const parent = row.parent || {type: 's/d', kit: 's/d', compNum: 's/d'};

        const requeridox = row.requeridox || {slug: 'Sin beneficiario', tdoc: 's/d', ndoc: 's/d'};

        const entregas = row.entregas


        const {compName, compNum, qty, action, estado, avance, fecomp_txa, slug, deposito, tmov} = row;
        let basicArr = [compName, compNum, qty, action, estado, avance, fecomp_txa, slug, deposito, tmov];


        const { type, kit} = parent;
        let parentArr = [ type, kit ];

        const { tdoc, ndoc, slug:name } = requeridox;
        let requeridoxArr = [ tdoc, ndoc, name];

        if(entregas && entregas.length && !justCabecera){
          entregas.forEach(token => {
            const {code, name, slug, ume, qty} = token
            let itemArr = [code, name, slug, ume, qty];

            worksheet.addRow([...basicArr, ...parentArr, ... requeridoxArr, ...itemArr]).commit()

          })

        }else {
          worksheet.addRow([...basicArr, ...parentArr, ... requeridoxArr]).commit()

        }


    })
    worksheet.commit()
    workbook.commit()


}




/**********************************/
/*          TABLERO              */
/********************************/

exports.tablero = function(fecha, errcb, cb) {
  console.log('****** Build TABLERO ALMACEN BEGIN [%s] *******', fecha);

  let time_frame = utils.buildDateFrameForCurrentWeek(fecha);

  let query = {
      fecomp_ts_d: time_frame.begin.getTime(),
      fecomp_ts_h: time_frame.semh.getTime()
    }
  
  let regexQuery = buildQuery(query)

    
  person.buildIdTree().then(pTree =>{

    product.buildIdTree().then(productTree=>{

        Record.find(regexQuery).lean().exec(function(err, entities) {

            if (err) {
                console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
                errcb(err);
            }else{
              procesTableroRemitoalmacen(pTree, productTree, entities, time_frame, errcb, cb);
            }
        });

    })
  })

}

/**********************************/
/*      TABLERO-REMITOALMACEN    */
/********************************/
function procesTableroRemitoalmacen(ptree, productTree, entities, timeframe, errcb, cb){
  let master = {};

  entities.forEach(remito => {
    //console.dir(remito);
    let fecomp = utils.parseDateStr(remito.fecomp_txa)
    //console.log('remito: [%s]  [%s]',remito.fecomp_txa, (remito.fecomp_tsa == fecomp.getTime()));
    let person = ptree[remito.personId];
    // let fenac = 0;
    // let sexo = 'X';
    let ciudad = 'ciudad';

    if(person){
      //console.log('PERSON: [%s]  [%s] [%s] [%s]' , person.displayName, person.fenac, person.fenactx, ("00" + Math.floor(utils.calcularEdad(person.fenac)/10)).substr(-2))
      // fenac = person.fenac || 0;
      // sexo = person.sexo || 'X';
      if(person.locaciones && person.locaciones.length){
        ciudad = person.locaciones[0].city || 'ciudad';
      }
    }else{

      console.log('AIUDAAAAAAAAAAA!!! [%s] [%s]',remito.personId, remito.requeridox.ndoc);
    }

    let base_token = {
      dia: fecomp.getDate(),
      mes: fecomp.getMonth(),
      sem: "00",
      ciudad: ciudad,
      estado: remito.estado,
      avance: remito.avance,
      action: remito.action,
      sector: remito.sector,
      tmov: remito.tmov,
      deposito: remito.deposito,
      cardinal: 1
    };

    let items = remito.entregas;
    if(items && items.length){
      items.forEach(item => {
        let token = Object.assign({}, base_token);
        token.productId = item.productId;
        token.code = item.code;
        token.name = item.name;
        token.ume = item.ume;
        token.qty = item.qty;
        token.pclass = ((productTree && productTree[item.productId]) ? productTree[item.productId].pclass : 'nodefinida');

        token.id = buildTablerTokenId(token, fecomp, timeframe);

        console.log('MasterTree: [%s] SEM:[%s]', token.id, token.name)
        processToken(token, master);

      })
    }
  })
  // fin del proceso
  console.log('TABLER ENDed')
  cb(master);

}


const processToken = function(token, master){
  if(master[token.id]){
    master[token.id].cardinal = master[token.id].cardinal + 1;
    master[token.id].qty = master[token.id].cardinal + token.qty;

  }else{
    master[token.id] = token;
  }
}
/**********************************/
/*   END TABLERO                 */
/********************************/


/**********************************/
/*    TABLERO - HELPERS          */
/********************************/

function buildDateId(token, fecomp, timeframe){
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

function buildTablerTokenId(token, fecomp, timeframe){
  let fechaId = buildDateId(token, fecomp, timeframe);

  let estadoId =   "[" + ("            " + token.estado).substr(-12) + "]"
  let avanceId =   "[" + ("            " + token.avance).substr(-12) + "]"
  let actionId =   "[" + ("            " + token.action).substr(-12) + "]"
  let sectorId =   "[" + ("            " + token.sector).substr(-12) + "]"
  let tmovId =     "[" + ("            " + token.tmov).substr(-12) + "]"
  let depositoId = "[" + ("            " + token.deposito).substr(-12) + "]"
  let item =       "[" + token.productId + "]" 
  return  fechaId + ':' +
          estadoId + 
          avanceId + 
          actionId + 
          sectorId + 
          tmovId + 
          depositoId +
          item ;
}

/**********************************/
/*   END TABLERO - HELPERS       */
/********************************/




