/**
 * Asistencia: Solicitud de Asistencia a Vecinos
 */

const whoami =  "models/asistenciaModel: ";

const mongoose = require('mongoose');

// necesarios para el proceso de importación
const config = require('../config/config')
const BPromise = require('bluebird');

const path = require('path');
const utils = require('../services/commons.utils');

const person = require('./personModel');

const asistencia = require('./asistenciaModel.js');

const asisprevencion = require('./asisprevencionModel.js');

const Schema = mongoose.Schema;

const self = this;

const N_HAB_00 = 'NUC-HAB-00'

const PersonRecord = person.getRecord();
const AsisRecord = asistencia.getRecord();
const AsisprevencionRecord = asisprevencion.getRecord();


const personItemSch = new Schema({
    personId:      { type: String, required: false },
    displayName:   { type: String, required: false },
    idbrown:       { type: String, required: false },
    asisCount:     { type: Number, required: false },
    contactData:   { type: Number, required: false },
    addressData:   { type: Number, required: false },
    coberturaData: { type: Number, required: false },
    isMaster:      { type: Boolean, required: false, default: false},
});

const personHeaderSch = new Schema({
    code:         { type: String, required: true },
    duplices:     { type: Number, required: true },
    asiscases:    { type: Number, required: false },
    list:         [ personItemSch]
})



const Record = mongoose.model('Duplice', personHeaderSch, 'personduplices');


function buildQuery(query){

  let q = {};
  if(query['estado']){
      q["estado"] = query['estado'];
  }
  return q;
}


/**************************************************************************/
/***** MIGRAR ASIGNADOS *****/
/************************************************************************/
exports.migrarAsignados = function(errcb, cb){
  let regexQuery = {
    isVigilado: true,
    avance: {$ne: 'anulado'}
  }

  AsisprevencionRecord.find(regexQuery)
    .lean()
    .exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);

        }else{
          if(entities && entities.length ){

            let count = reviewAsignacion(entities, errcb, cb);
            cb({actualizados: count});


          }else{
            cb({error: 'no entities'})
          }
        }
  });
}

function reviewAsignacion(movimientos, errcb, cb){
    let count = 0;
    movimientos.forEach(asis => {
      //c onsole.log('forEach [%s]:[%s] [%s] [%s]', index, (index instanceof String), contactMap.get(index), contactMap.has(index))
      let fup = asis.followUp;
      let contactos = asis.contactosEstrechos || 0;

      if(fup && fup.isAsignado && !contactos){
        if(!fup.isContacto && !fup.derivadoId){
          fup.isContacto = true;
          fup.derivadoId = fup.asignadoId;
          fup.derivadoSlug = fup.asignadoSlug;          
        }

        fup.isAsignado = false;
        fup.asignadoId = '';
        fup.asignadoSlug = '';
        updateFollowUp(asis, fup )
        count += 1;

      }

    })

    return count;


}

function updateFollowUp(asistencia, fup){
  let token = {followUp: fup};
  AsisprevencionRecord.findByIdAndUpdate(asistencia._id, token).exec();
}


/**************************************************************************/
/***** CONTACTOS ESTRECHOS - REGENERACIÓN DEL DATO EN ASISPREVENCION *****/
/************************************************************************/
exports.contactsEstrechos = function(errcb, cb){
  let regexQuery = {
    isVigilado: true,
    avance: {$ne: 'anulado'}
  }

  AsisprevencionRecord.find(regexQuery)
    .lean()
    .exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);

        }else{
          if(entities && entities.length ){

            buildCasosPorUsuario(entities, errcb, cb);

          }else{
            cb({error: 'no entities'})
          }
        }
  });
}

function buildCasosPorUsuario(movimientos, errcb, cb){
  let contactosMap = agruparCasosIndices(movimientos);
  let count = sumarCasosPorUsuario(movimientos, contactosMap);
  cb({actualizados: count});
}

function updateContactosEstrechos(asistencia, contactos){
  let token = {contactosEstrechos: contactos};
  AsisprevencionRecord.findByIdAndUpdate(asistencia._id, token).exec();
}


function sumarCasosPorUsuario(movimientos, contactMap){
    let count = 0;
    movimientos.forEach(asis => {
      //c onsole.log('forEach [%s]:[%s] [%s] [%s]', index, (index instanceof String), contactMap.get(index), contactMap.has(index))
        let index = JSON.stringify(asis._id);

        if(contactMap.has(index)){
          updateContactosEstrechos(asis, contactMap.get(index).contactos )
          count += 1;


        }

    })
    return count;

}


function agruparCasosIndices(movimientos){
      let contactosMap = new Map();
      if(movimientos && movimientos.length){

          movimientos.forEach(asis => {

            if(asis.casoIndice && asis.casoIndice.parentId){
              let index = JSON.stringify(asis.casoIndice.parentId)

              if(contactosMap.has(index)){
                contactosMap.get(index).contactos  += 1;

              }else {
                let data = {
                  contactos: 1
                }
                contactosMap.set(index, data)

              }
            }
          });
      }
      return contactosMap;  
}


function pushBackCasosPorUsuario(contactosMap, errcb, cb){
  let returnArray = [];
  for(let value of contactosMap.values()){
    if(value.isAsignado) returnArray.push(value);
  }
  cb(returnArray)

}















/*******************************/
/***** NUCLEO CASO INDICE *****/
/*****************************/
exports.nucleoCasoIndice = function(errcb, cb){
  let regexQuery = {
    isVigilado: true,
    avance: {$ne: 'anulado'}
  }

  AsisprevencionRecord.find(regexQuery)
    .lean()
    .exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);

        }else{
          if(entities && entities.length ){

            entities = processAsistenciasForCasoIndice(entities, errcb, cb);

          }else{
            cb({error: 'no entities'})
          }
        }
  });
}




function processAsistenciasForCasoIndice(entities, errcb, cb){
  console.log('processAsistencias to BEGIN: [%s]', entities.length);
  entities.forEach(asis => {
    if(asis.casoIndice && asis.casoIndice.parentId){
      loadCasoIndiceById(asis );

    }else {
      //console.log('asis sin idPerson: [%s]', asis.id);
    }
  })
  cb({process: 'ok'});
}

function loadCasoIndiceById(asistencia){
  AsisprevencionRecord.findById(asistencia.casoIndice.parentId).then(parentAsis =>{

    if(parentAsis && parentAsis.idPerson){
      loadParentPersonById(parentAsis.idPerson, asistencia);
    }

  })
}

function loadParentPersonById(parentPersonId, asistencia){
  PersonRecord.findById(parentPersonId).then(parentPerson =>{
    if(parentPerson){
      updateCasoIndiceFromParent(asistencia, parentPerson);
    }
  })
}


function updateCasoIndiceFromParent(asistencia, parentPerson){
  let nucleo = findNucleoFromVinculos(asistencia.idPerson, parentPerson)

  if(nucleo){
    updateAsistenciaCasoIndice(asistencia, nucleo)
  }
}

function findNucleoFromVinculos(idTargetPerson, parentPerson){
  let nucleo = N_HAB_00;
  let familiares = parentPerson && parentPerson.familiares

  if(familiares){
    let vinculo = familiares.find(vin => vin.personId === idTargetPerson);
    if(vinculo){
      nucleo = vinculo.nucleo
    }
  }

  return nucleo
}


function updateAsistenciaCasoIndice(asistencia, nucleo){
  let casoindice = asistencia.casoIndice;
  casoindice.nucleo = nucleo
  AsisprevencionRecord.findByIdAndUpdate(asistencia._id, {casoIndice: casoindice}).exec();
}

function findEdadFromPerson(person){
     if(!person.fenactx) return null;
     let value = utils.parseDateStr(person.fenactx)
     if(!value) return null;

     let validAge = utils.calcularEdad(value.getTime());
     return validAge + '';
}




/***** END: NUCLEO CASO INDICE *****/

/*******************************/
/***** PUBLISH EDAD       *****/
/*****************************/
exports.publishEdad = function(errcb, cb){
  let regexQuery = {
    isVigilado: true,
    avance: {$ne: 'anulado'}
  }

  AsisprevencionRecord.find(regexQuery)
    .lean()
    .exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);

        }else{
          if(entities && entities.length ){

            entities = updateEdadFromPerson(entities, errcb, cb);

          }else{
            cb({error: 'no entities'})
          }
        }
  });
}

function updateEdadFromPerson(entities, errcb, cb){
  console.log('Update Edad From Person to BEGIN: [%s]', entities.length);
  entities.forEach(asis => {
    if(asis.idPerson){
      loadPersonById(asis);


    }else {
      console.log('asis sin idPerson: [%s]', asis.id);
    }
  })
  cb({process: 'ok'});
}

function loadPersonById(asistencia){
  PersonRecord.findById(asistencia.idPerson).then(person =>{
    if(person){
      updateAsistencia(asistencia, person);
    }
  })
}

function updateAsistencia(asistencia, person){
  let edad = findEdadFromPerson(person);
  if(edad){
      console.log('[%s] Update Asistencia: [%s] [%s] [%s]', asistencia._id, person.displayName, person.edad, edad);
      updateAsistenciaConEdad(asistencia, edad);

    //update Asistencia
  }else {
      console.log('Edad not found: [%s] [%s]', person.displayName, person.edad);

  }
}

function updateAsistenciaConEdad(asistencia, edad){
  AsisprevencionRecord.findByIdAndUpdate(asistencia._id, {edad: edad}).exec();
}

function findEdadFromPerson(person){
     if(!person.fenactx) return null;
     let value = utils.parseDateStr(person.fenactx)
     if(!value) return null;

     let validAge = utils.calcularEdad(value.getTime());
     return validAge + '';
}

/***** PUBLISH EDAD       *****/


exports.findDuplices = function (errcb, cb) {
    Record.find().lean().exec(function(err, entities) {
        if (err) {
            errcb(err);
        }else{
            cb(entities);
        }
    });
};

exports.processDuplices = function (errcb, cb) {
    Record.find().lean().exec(function(err, entities) {
        if (err) {
            errcb(err);
        }else{
          processListOfDuplices(entities, errcb, cb)
            //cb(entities);
        }
    });
};

function processListOfDuplices(entities, errcb, cb){
  entities.forEach(token => {
    if(token.duplices < 60){
      token.list.forEach(item => {
        if(!item.isMaster){
          changeEstadoToPerson(item);
        }

      })
    }

  })
  cb({process: 'ok'})

}

async function changeEstadoToPerson(token){
  // c onsole.log('ready to insert token:')
  // c onsole.dir(token);
  let estado = {estado: 'bajaxduplice'};
  await PersonRecord.findByIdAndUpdate(token.personId, estado, { new: true })

}


exports.auditPersonDuplices = function (errcb, cb) {
  console.log('AUDIT PERSON DUPLICES TO-BEGIN');
  auditDuplicesFromPerson(errcb, cb);



};






function auditDuplicesFromPerson(errcb, cb ){
  let masterAsistencias = {};
  let masterPerson = {};

  buildAsisInvertedTreeByPerson(masterAsistencias).then(master => {
    if(master){
      masterAsistencias = master;
      console.log('Master ASIS CREATED')
      buildPersonInvertedTree(masterPerson, masterAsistencias).then(masterp => {
        console.log('Master PERSON CREATED')
        evaluateDuplices(masterp, errcb, cb);
        cb({process: 'ok'});

      })
    }else {
      errcb({error: 'no se pudo crear master Asistencias'})
    }
  })

}

function buildAsisInvertedTreeByPerson(master){
  return new Promise(function(resolve, reject){

    AsisRecord.find(null, '_id  idPerson compNum fecomp_txa').lean().then(list => {

      if(list && list.length){
        list.forEach(token => {
          if(token.idPerson){
            if(master[token.idPerson]){
              master[token.idPerson] += 1;

            }else {
              master[token.idPerson] = 1;

            }

          }else {
            console.log('idPerson is null: [%s] [%s]', token._id, token.compNum)
          }
        })
        resolve(master);

      }else {
        reject({error: 'not records found in asistencias'})
      }
    }); // end AsisRecord.find

  }); // end Promise
}




function buildPersonInvertedTree(master, masterasis){
    let promise = new Promise((resolve, reject)=> {
        PersonRecord.find({estado: {$ne: 'bajaxduplice'}}, '_id displayName tdoc ndoc idbrown contactdata locaciones cobertura').lean().then(persons => {
            persons.forEach(p => {
              let key = p.tdoc + ':' + p.ndoc;
              let token = buildPersonToken(p, masterasis);
              if(master[key]){
                master[key].duplices += 1;
                master[key].list.push(token);

              }else {
                master[key] = {
                  duplices: 1,
                  code: key,
                  asiscases: 0,
                  list: [token]
                }

              }

            })
            resolve(master);
        })

    });

    return promise;
}


function buildPersonToken(person, master){
  let token = {
    personId:       person._id,
    displayName:    person.displayName,
    idbrown:        person.idbrown,
    contactData:   (person.contactada && person.contactada.length) || 0,
    addressData:   (person.locaciones && person.locaciones.length) || 0,
    coberturaData: (person.cobertura && person.cobertura.length) || 0,
    asisCount:     (master[person._id] ? master[person._id] : 0),
    isMaster: false
  }

  return token;
}

function evaluateDuplices(master, errcb, cb){
  Object.keys(master).forEach( key => {
    if(master[key].duplices > 1) {
      processDuplicatedPerson(master[key], key);

    }

  })

}

function processDuplicatedPerson(token, key){

  evaluateTokenList(token);

  updateDuplices(token)
}


function evaluateTokenList(token){
  let asiscases = 0;
  let index = 0;
  let ponder = 0;

  token.list.forEach((t, idx) => {
    if(t.asisCount){
      asiscases += 1;
    }
    let value = t.asisCount * 10 + t.contactData +  t.coberturaData;
    if(value > ponder){
       index = idx;
       ponder = value;
    }
  })

  token.asiscases  = asiscases;
  token.list[index].isMaster = true;
}

async function updateDuplices(token){
  // c onsole.log('ready to insert token:')
  // c onsole.dir(token);

  //await PersonRecord.findByIdAndUpdate(person.personId, updateData, { new: true }).exec()
  await Record.create( token )

}

