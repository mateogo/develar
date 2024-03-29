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

const entregaDesdeOptList = [
  {val: 'almacen',      type: 'Galpón',          label: 'Galpón'                    , locacion: 'erezcano',  telefono: '11 2222 3333'},
  {val: 'burzaco',      type: 'delegacion',      label: 'Deleg Burzaco',          locacion:	'9 de Julio y Roca', telefono: '4299-2273'},
  {val: 'claypole',     type: 'delegacion',      label: 'Deleg Claypole',         locacion:	'17 de Octubre 920',         telefono: '4291-1944'},
  {val: 'donorione',    type: 'cic',             label: 'CIC Don Orione',         locacion:	'Río Carcaraña 688 y Av. Eva Perón', telefono: '4268-5419'},
  {val: 'glew',         type: 'delegacion',      label: 'Deleg Glew',             locacion:	'Sarmiento y Alem',          telefono: '(02224)420792'},
  {val: 'josemarmol',   type: 'delegacion',      label: 'Deleg José Marmol',      locacion:	'Bynnon y 20 de Septiembre', telefono: '4291-1066'},
  {val: 'longchamps',   type: 'delegacion',      label: 'Cám Comer Longchamps',locacion:	'Burgward 1030',         telefono: '4293-4299'},
  {val: 'malvinas',     type: 'delegacion',      label: 'Deleg Malvinas Arg',     locacion:	'Policastro 2389',           telefono: '4297-8615'},
  {val: 'minrivadavia', type: 'delegacion',      label: 'Deleg Min Rivadavia',    locacion:	'25 de Mayo y Quiroga',      telefono: '4279-0052'},
  {val: 'rcalzada',     type: 'delegacion',      label: 'Deleg Rafael Calzada',   locacion:	'Guemes 1996',               telefono: '4291-1666'},
  {val: 'solano',       type: 'delegacion',      label: 'Deleg San Fco Solano',   locacion:	'Lirio 423',                 telefono: '4277-5203'},
  {val: 'sanjose',      type: 'delegacion',      label: 'Deleg San José',         locacion:	'Salta 1915',                telefono: '4211-1007'},

  {val: 'secretaria',   type: 'secretaria',      label: 'Secretaría Erézcano',                   locacion:	'Erézcano 1252',               telefono: '4293-4299'},
  {val: 'cicglew',      type: 'cic',             label: 'CIC Glew',      locacion:	'Garibaldi 220, entre Berutti y Lestrade',    telefono: '3740-0875'},
  {val: 'cicburzaco',   type: 'cid',             label: 'CIC Burzaco',   locacion:	'Martín Fierro 750 (y Alsina) - Burzaco', telefono: '4299-2273'},
  {val: 'cicmarmol',    type: 'cic',             label: 'CIC J. Marmol', locacion:	'Frías y San Luis',            telefono: '4291-1066'},
  {val: 'cicmalvinas',  type: 'cic',             label: 'CIC Malvinas',  locacion:	'Pasteur y Lapacho - Malvinas', telefono: '4291-1066'},

  {val: 'regionvi',     type:'Región VI-Lomas',  label: 'Región VI-Lomas' , locacion: 'erezcano',  telefono: '11 2222 3333'},
  {val: 'envio',        type:'Envío domicilio',  label: 'Envío domicilio' , locacion: 'erezcano',  telefono: '11 2222 3333'},

  {val: 'proveedor',    type:'Proveedor',        label: 'Proveedor'       , locacion: 'erezcano',  telefono: '11 2222 3333'},
  {val: 'otro',         type:'Otro',             label: 'Otro'            , locacion: 'erezcano',  telefono: '11 2222 3333'},
  {val: 'no_definido',  type:'Sin selección',    label: 'Sin selección' },
];

function getDepositoLabel(almacen){
  if(!almacen) return 's/dato';
  let token = entregaDesdeOptList.find(t => t.val === almacen);
  return token ? token.label : almacen;
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
    
    if(!query){
      query = {estado: 'activo'}
    }

    fetchMovimientos(query, req, res)

}


function fetchMovimientos(query, req, res){
    let regexQuery = buildQuery(query)


    Record.find(regexQuery).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
            errcb(err);

          }else{
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

    var justCabecera = query.justCabecera === "true";
    console.log('EXCEL BEGIN')

    
    worksheet.addRow(['Movimientos de Almacén']).commit()
    worksheet.addRow(['Fecha emisión', new Date().toString()]).commit()

    worksheet.addRow().commit()
    worksheet.addRow(['Comprobante','Número','Cantidad','Acción','Estado','Avance','Fecha','Comentario','Depósito','T/Mov','T/Kit','Kit','DOC','Documento','Beneficiario/a','Cód','Artículo','Descripción','UME','Cant']).commit();

    remanentes.forEach(row => {
      console.log('row foEach')
      console.dir(row);
        const parent = row.parent || {type: 's/d', kit: 's/d', compNum: 's/d'};

        const requeridox = row.requeridox || {slug: 'Sin beneficiario', tdoc: 's/d', ndoc: 's/d'};

        const entregas = row.entregas
        const personLink = {text: 'Haga clic acá para abrir la ficha del referente', hyperlink: `https://dsocial.brown.gob.ar/alimentar/gestion/atencionsocial/${row.personId}`};
    
        row.deposito = getDepositoLabel(row.deposito);


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
          worksheet.addRow([...basicArr, ...parentArr, ... requeridoxArr, personLink ]).commit()

        }


    })
    worksheet.commit()
    workbook.commit()


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
  
    let fecomp = utils.parseDateStr(remito.fecomp_txa)
    let person = ptree[remito.personId];
    let ciudad = 'ciudad';

    if(person){

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

        processToken(token, master);

      })
    }
  })
  // fin del proceso
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




