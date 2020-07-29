/**
 * Serial: recurso digital de cuerpo presente
 */

const whoami =  "models/serialModel: ";

const mongoose = require('mongoose');

const { URL } = require('url');
const path = require('path');
const config = require('../config/config');

const storageDir = config.storagePath;

const Schema = mongoose.Schema;


const self = this;

 

/**
 * Creación de un Schema
 * @params
 *  serialId:      link lógico, unívoco dentro de develar, nombre del archivo
 *  path:         link físico, URL del serial
 *  filename:     nombre del objeto, tal como quedó luego de subido al server
 *  slug:         descripción corta
 *  description:  descripción/ comentario/ anotciones del recurso
 *
 *  server:       server
 *  originalname: nombre original
 *  encoding:     encoding
 *  mimetype:     es el mimeType
 *  size:         tamaño
 */


const serialSch = new Schema({
  type:        { type: String, required: true },
  name:        { type: String, required: true },
  tserial:     { type: String, required: true },
  sector:      { type: String, required: true },
  tdoc:        { type: String, required: true },
  letra:       { type: String, required: false },
  anio:        { type: Number, required: false },
  mes:         { type: Number, required: false },
  dia:         { type: Number, required: false },
  estado:      { type: String, required: false },

  punto:       { type: Number, required: false },
  pnumero:     { type: Number, required: false },
  offset:      { type: Number, required: false },
  slug:        { type: String, required: false },
  compPrefix:  { type: String, required: false },
  compName:    { type: String, required: false },
  showAnio:    { type: Boolean, required: false },
  resetDay:    { type: Boolean, required: false },
  fe_ult:      { type: Number, required: false },

});

serialSch.pre('save', function (next) {
    return next();
});

const tserialConfig = [
    {
      tserial: 'pcultural',
      usecase: 'Eventos culturales CCK',
    },
    {
      tserial: 'budget',
      usecase: 'Presupuesto CCK',
    },
    {
      tserial: 'turnodiario',
      usecase: 'turnos que se otorgan en un mostrador a lo largo del día.',
    },
    {
      tserial: 'compcomercial',
      usecase: 'Factura comercial recibida de un proveedor',
    },
    {
      tserial: 'remitoalmacen',
      usecase: 'Remito de entrega de insumo de almacén',
    },
    {
      tserial: 'rol',
      usecase: 'Emisión de Rol de Nocturnidad',
    },
    {
      tserial: 'censo',
      usecase: 'Censo Industrias MAB',
    },
    {
      tserial: 'internacion',
      usecase: 'Solicitud internacion MAB',
    },

]
// uso serialTypeConfit[type]
const serialTypeConfig = {
  turnos: {
    name: ['ayudadirecta'],
    tserial: ['turnodiario'],
    sector: ['regionvi', 'habitat', 'masvida', 'alimentos', 'tsocial', 'nutricion', 'inhumacion', 'terceraedad', 'pensiones', 'familia', 'cimientos', 'direccion' ],
    tdoc: ['turno'],
    letra: ['X'],
    punto: 0,
    pnumero: 1,
    offset: 0,
    compPrefix: 'TUR',
    compName: 'Turno Mostrador',
    showAnio: false,
    resetDay: true,
    createOnTheFly: true,
    slug: 'serial de turnos mostrador de atencion en sede de Desarrollo Social',
  },

  person: {
    name: ['docum'],
    tserial: ['provisorio'],
    sector: ['personas'],
    tdoc: ['identidad'],
    letra: ['X'],
    punto: 0,
    pnumero: 1,
    offset: 100000,
    compPrefix: 'PROV',
    compName: 'Identificación provisoria',
    showAnio: false,
    resetDay: false,
    createOnTheFly: true,
    slug: 'serial para asignar un número de documento provisorio en la atención al público',
  },

  asistencia: {
    name: ['asistencia'],
    tserial: ['sasistencia'],
    sector: ['dsocial'],
    tdoc: ['solicitud'],
    letra: ['X'],
    punto: 0,
    pnumero: 1,
    offset: 100000,
    compPrefix: 'SOL',
    compName: 'S/Asistencia',
    showAnio: false,
    resetDay: false,
    createOnTheFly: true,
    slug: 'serial para numerar las solicitudes de asistencia de Desarrollo social',
  },

  internacion: {
    name: ['solinternacion'],
    tserial: ['solinternacion'],
    sector: ['internacion'],
    tdoc: ['solicitud'],
    letra: ['X'],
    punto: 0,
    pnumero: 1,
    offset: 100000,
    compPrefix: 'SOL',
    compName: 'S/Internacion',
    showAnio: false,
    resetDay: false,
    createOnTheFly: true,
    slug: 'serial para numerar las solicitudes de Internacion Hospitalaria Sec Salud',
  },

  rol: {
    name: ['rolnocturnidad'],
    tserial: ['rol'],
    sector: ['dginspeccion'],
    tdoc: ['despacho'],
    letra: ['X'],
    punto: 0,
    pnumero: 1,
    offset: 100000,
    compPrefix: 'ROL',
    compName: 'R/Nocturnidad',
    showAnio: false,
    resetDay: false,
    createOnTheFly: true,
    slug: 'Emisiónd e Rol de Nocturnidad',
  },

  remitoalmacen: {
    name: ['ayudadirecta'],
    tserial: ['remitoalmacen'],
    sector: ['regionvi', 'materiales', 'masvida', 'alimentos', 'tsocial', 'nutricion', 'inhumacion', 'terceraedad', 'pensiones' ],
    tdoc: ['remito'],
    letra: ['X'],
    punto: 0,
    pnumero: 1,
    offset: 100000,
    compPrefix: 'REM',
    compName: 'R/Entrega',
    showAnio: false,
    resetDay: false,
    createOnTheFly: true,
    slug: 'Serial de vales de entrega almacen DSocial',
  },

  censo: {
    name: ['censoindustrias'],
    tserial: ['censo'],
    sector: ['produccion'],
    tdoc: ['CENSO'],
    letra: ['X'],
    punto: 0,
    pnumero: 1,
    offset: 100000,
    compPrefix: 'CEN',
    compName: 'CENSO/MAB',
    showAnio: false,
    resetDay: false,
    createOnTheFly: true,
    slug: 'Serial de censos industriales - MAB 2020',
  },

  pcultural: {
    name: ['pcultural'],
    tserial: ['pcultural'],
    sector: ['produccion', 'operaciones'],
    tdoc: ['evento'],
    letra: ['X'],
    punto: 0,
    pnumero: 1,
    offset: 100000,
    compPrefix: 'EVENTO',
    compName: 'S/Evento',
    showAnio: false,
    resetDay: false,
    createOnTheFly: true,
    slug: 'Serial de eventos culturales (proyectos culturales pcultural)',
  },


  budget: {
    name: ['budget'],
    tserial: ['budget'],
    sector: ['produccion', 'operaciones'],
    tdoc: ['presupuesto'],
    letra: ['X'],
    punto: 0,
    pnumero: 1,
    offset: 100000,
    compPrefix: 'PRE',
    compName: 'S/Presupuesto',
    showAnio: false,
    resetDay: false,
    createOnTheFly: true,
    slug: 'Serial de presupuestos (budget)',
  }


}

const querySamples = [
     {
       type: 'turnos',
       name: 'ayudadirecta',
       sector: 'alimentos',
       tserial: 'turnodiario',
       tdoc: 'turno',
       letra: 'X',
       punto: '0',
       anio: '2019',
       estado: 'activo'
     },


];

function buildQuery(query){
  // name: nombre del serial
  // tserial:     { type: String, required: true },
  // tdoc:        { type: String, required: true },
  // letra:       { type: String, required: false },
  // anio:        { type: String, required: false },
  // estado:      { type: String, required: true },

  let date = new Date();
  let anio = date.getFullYear();

    let q = {};
    if(query['type']){
        q["type"] = query['type'];
    }

    if(query['name']){
        q["name"] = query['name'];
    }

    if(query['sector']){
        q["sector"] = query['sector'];
    }

    if(query['tserial']){
        q["tserial"] = query['tserial'];
    }

    if(query['tdoc']){
        q["tdoc"] = query['tdoc'];
    }

    if(query['letra']){
        q["letra"] = query['letra'];
    } else {
        q["letra"] = 'X';
    }

    if(query['punto']){
        q["punto"] = parseInt(query['punto'], 10);
    } else {
        q["punto"] = 0;
    }

    if(query['anio']){
        q["anio"] = parseInt(query['anio'], 10);
    } else {
        q["anio"] = anio;
    }

    if(query['estado']){
        q["estado"] = query['estado'];
    }else{
        q["estado"] = 'activo';
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
const Record = mongoose.model('Serial', serialSch, 'seriales');



/////////   CAPA DE SERVICIOS /////////////

/**
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */

exports.getRecord = function(){
  return Record;
}



exports.upsertNext = function (query, errcb, cb) {
    let regexQuery = buildQuery(query);

    Record.find(regexQuery, function(err, entities) {
        if (err) {
            console.log('[%s] upsertNext ERROR: [%s]', whoami, err)
            errcb(err);
        }else{
          if(!entities || entities.length === 0 ){
            if(isPermitedToCreateNewSerial(query)){
              createNewSerial(query, regexQuery, errcb, cb);

            }else{
              errcb({error: 'serial no encontrado'});
            }

            // serial no encontrado


          }else if(entities.length !== 1) {
            errcb({'error': 'Serial univoco no encontrado'});

          } else {
            let serial = entities[0];
            emitNext(serial, cb)
          }

        }
    });
};

function createNewSerial(query, regexQuery, errcb, cb){
  let serial = initNewSerial(query, regexQuery)
  Record.create(serial, function(err, entity) {
    if (err){
        console.log('[%s] CreateNewSerial ERROR ',whoami);
        err.itsme = whoami;
        errcb(err);
    
    }else{
        cb(entity);
    }
  });
}


function initNewSerial(query, regexQuery){
  let baseData = serialTypeConfig[query.type] || {};
  if(!baseData.letra) baseData.letra = ['X'];
  let serial = {};
  let currentDate = new Date();

  serial.type =       query.type;
  serial.name =       query.name;
  serial.tserial =    query.tserial;
  serial.sector =     query.sector;
  serial.tdoc =       query.tdoc;
  serial.letra =      query.letra || baseData.letra[0];
  serial.punto = parseInt(query.punto || '0', 10) || baseData.punto || 0;
  serial.pnumero =    baseData.pnumero;
  serial.offset =     baseData.offset || 0;
  serial.compPrefix = query.compPrefix ||  baseData.compPrefix || 'COMP';
  serial.compName =   query.compName ||  baseData.compName || 'Comprobante';
  serial.showAnio =   baseData.showAnio || false;
  serial.resetDay =   baseData.resetDay || false;
  serial.createOnTheFly =  baseData.createOnTheFly || false;
  serial.anio = currentDate.getFullYear();
  serial.mes =  currentDate.getMonth();
  serial.dia =  currentDate.getDate();
  serial.estado = 'activo';
  serial.slug =   query.slug ||baseData.slug || '';
  serial.fe_ult = currentDate.getTime();
  return serial;
}

function isPermitedToCreateNewSerial(query){
  let ok = false;
  if(query.createOnTheFly) return true;
  
  let baseData = serialTypeConfig[query.type]|| {};
  if(baseData.createOnTheFly) return true;

  return ok;

  //let default = serialConfig[query.]

}

function emitNext(serial, cb){
  if(serial.resetDay){
    verifyIfSameDay(serial);
  }

  updateNext(serial, cb);
}

function updateNext(record, cb){
  record.fe_ult = Date.now();
  record.pnumero +=1;
  let id = record._id;

  Record.findByIdAndUpdate(id, record, {new: true }, function(err, entity) {
      if (err){
          console.log('[%s] findByIdAndUpateError',whoami)
      }else{
        cb(entity);
      }
  });
}

function verifyIfSameDay(serial){
  let date = new Date();
  let actual_anio = date.getFullYear();
  let actual_mes = date.getMonth();
  let actual_dia = date.getDate();
  if(!(actual_anio === serial.anio && actual_mes === serial.mes && actual_dia === serial.dia)){
    serial.pnumero = 0;
    serial.anio = actual_anio;
    serial.mes = actual_mes;
    serial.dia = actual_dia;
  }
}


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
    let regexQuery = buildQuery()

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
//1557026733409
//5cce54a98c4bbf212b2dfa55