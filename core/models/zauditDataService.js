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

