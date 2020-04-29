/**
 * Asistencia: Prevención de Salud. Secretaría de Salud
 */

const whoami =  "models/integracioncovidModel: ";

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

const eventocovidSch = new Schema({
  tipo:         { type: String,  required: false }, // tipo_datosmedicos_OptList
  medico:       { type: String,  required: false },
  afectado:     { type: String,  required: false },
  dni_afectado: { type: String,  required: false },
  telefono:     { type: String,  required: false },
  recurso:      { type: String,  required: false }, // recursoOptList recurso solicitado
  lugar:        { type: String,  required: false },
  descripcion:  { type: String,  required: false },
})

const datoscontactoSch = new Schema({
  dato_contacto: { type: String,  required: false },
  descripcion:   { type: String,  required: false }, // si es teléfono, mail, o si es telefono de pariente
})

const addressSch = new Schema({
  calle_numero: { type: String,  required: false },
  ciudad:       { type: String,  required: false },
  entre_calles: { type: String,  required: false },
})

const evolucionSch = new Schema({
  sentido:     { type: String,  required: false },
  descripcion: { type: String,  required: false },
  indicacion:  { type: String,  required: false },
})

const datosMedicoSch = new Schema({
  tipo:        { type: String,  required: false },
  descriptor:  { type: String,  required: false },
  valor:       { type: String,  required: false },
  descripcion: { type: String,  required: false },
})

const afectadoSch = new Schema({
  nombre:     { type: String,  required: false },
  apellido:   { type: String,  required: false },
  sexo:       { type: String,  required: false }, // F:femenino ; M:masculino
  fecha_nac:  { type: String,  required: false },
})

/**
 * Creación de un Schema
 * @params
 */
const integracioncovidSch = new Schema({
    id_conversacion:   { type: String, required: true },
    evento_tipo:       { type: String, required: true }, // eventoTipoOptList
    conversacion_tipo: { type: String, required: true }, // conversacionTipoOptList

    id_conversante:  { type: String, required: false },
    id_brown:        { type: String, required: false }, // id de persona en Brown-SALUD
    dni_afectado:    { type: String, required: false },
    estado_afectado: { type: String, required: false }, // estado_afectadoOptList
    situacion_afectado: { type: String, required: false }, // situacion_afectadoOptList
    telefono:        { type: String, required: false },
    relacion:        { type: String, required: false }, // relacionOptList


    datos_contacto: [ datoscontactoSch ],
    datos_medicos:  [ datosMedicoSch ],
    evolucion:      { type: evolucionSch,   required: false },
    evolucion:      { type: evolucionSch,   required: false },
    direccion:      { type: addressSch,     required: false },
    datos_afectado: { type: afectadoSch,    required: false },
    evento_covid:   { type: eventocovidSch, required: false },


    time_stamp:    { type: Number, required: false },
    estado:        { type: String, required: false },
});


integracioncovidSch.pre('save', function (next) {
    return next();
});


const recursoOptList = [
  { val: 'cama',          label: 'Requiere una cama de internación'    },
  { val: 'respirador',    label: 'Requiere un respirador' },
  { val: 'aislamiento',   label: 'Requiere locación de aislamiento'  },
  { val: 'laboratorio',   label: 'Requiere una toma de laboratorio'  },

];


const tipo_datosmedicos_OptList = [ // tipifica el dato médico
  { val: 'signo',        label: 'Signo médico (fiebre, presión arterial, etc.)'    },
  { val: 'sintoma',      label: 'Síntoma descripto' },
  { val: 'contexto',     label: 'Contexto epidemiológico (viajó/ contacto con infectado/ etc.)'  },
  { val: 'morbilidad',   label: 'Aspectos de salud derivados de la infección'  },
  { val: 'comorbilidad', label: 'Aspectos de salud pre-existentes'  },
  { val: 'otro',         label: 'Otro'  },
  { val: 'sindato',      label: 'Sin dato'  },
];

const estado_afectadoOptList = [ // tipifica el estado del afectado
  { val: 'posible',    label: 'Posible caso COVID'    },
  { val: 'sospechoso', label: 'Sospechoso COVID (espera muestra laboratorio)' },
  { val: 'infectado',  label: 'COVID confirmado'  },
  { val: 'descartado', label: 'Descartado'  },
  { val: 'alta',       label: 'Dado de alta'  },
  { val: 'sindato',    label: 'Sin dato'  },
];

const situacion_afectadoOptList = [ // tipifica el estado general del afectado
  { val: 'asintomatico',  label: 'Sin síntomatología ' },
  { val: 'internado',     label: 'Internado' },
  { val: 'aislamiento',   label: 'Cumpliendo aislamiento' },
  { val: 'endomicilio',   label: 'En domicilio' },
  { val: 'sindato',       label: 'Sin dato'  },
];

const eventoTipoOptList = [ // tipifica la novedad reportada por el ROBOT
  { val: 'parte_afectado', label: 'Parte/ novedad del afectado'    },
  { val: 'datos_afectado', label: 'Datos maestros del afectado' },
  { val: 'evento_covid',   label: 'Reporte de evento covid'  },
];

const conversacionTipoOptList = [
  { val: 'evolucion',     label: 'Describe evolucion afectado'    },
  { val: 'actualizacion', label: 'Actualización de datos maestros' },
  { val: 'cita',          label: 'Evento cita: se pacta un encuentro'  },
  { val: 'traslado',      label: 'Evento traslado: se pacta un traslado'  },
  { val: 'laboratorio',   label: 'Evento laboratorio: se pacta una práctica de laboratorio'  },
  { val: 'resultado',     label: 'Evento resultado: Se informa un resultado' },
];

const evento_conversacion_typeRelation = {
  parte_afectado: [
    { val: 'evolucion',     label: 'Describe evolucion afectado'    },
  ],

  datos_afectado: [
    { val: 'actualizacion', label: 'Actualización de datos maestros' },
  ],

  evento_covid: [
    { val: 'traslado',      label: 'Evento traslado: se pacta un traslado'  },
    { val: 'laboratorio',   label: 'Evento laboratorio: se pacta una práctica de laboratorio'  },
    { val: 'resultado',     label: 'Evento resultado: Se informa un resultado' },
  ],
}




const relacionOptList = [ // relación entre conversante y afectado
  { val: 'afectado',      label: 'Afectado' }, // el conversante es el propio afectado
  { val: 'familiar',      label: 'Familiar de' },
  { val: 'medico',        label: 'Médico de' },
  { val: 'representante', label: 'Representante de' },
  { val: 'conocido',      label: 'Conocido de' },
  { val: 'otro',          label: 'Otra relación de' },
];

function buildQuery(query){

  let q = {};

  // busco un registro en particular
  if(query['asistenciaId']){
      q["asistenciaId"] = query['asistenciaId'];
      return q;
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
const Record = mongoose.model('Integracioncovid', integracioncovidSch, 'integracionescovid');



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
    // c onsole.log('find ASISPREVENCION ************')
    console.dir(regexQuery);

    if(regexQuery && regexQuery.asistenciaId){
      Record.findById(regexQuery.asistenciaId, function(err, entity) {
          if (err){
              console.log('[%s] findByID ERROR() argument [%s]', whoami, arguments.length);
              err.itsme = whoami;
              errcb(err);
          
          }else{
              cb([ entity ]);
          }
      });


    }else{
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

    }

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


function initForUpdate(record){
  let ts = Date.now();
  record.time_stamp = ts;
  record.estado = 'recibido';
}

function lookUpPerson(record, errcb, cb){
  




}


/**
 * Sign up a new record
 * @param record
 * @param cb
 * @param errcb
 */
exports.create = function (record, errcb, cb) {
    delete record._id;
    console.dir(record);
    initForUpdate(record);

    lookUpPerson(record, errcb, cb)



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
