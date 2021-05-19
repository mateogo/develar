#!/usr/bin/env node

/**
 * Module dependencies.
 * usage: DEVELOPMENT: 
 * DEBUG=develar:server PORT=8080 NODE_ENV=development DBASE=saludmab SERVER=http://develar-local.co PUBLIC=/public node core/services/panicScript
 * 
 * usage: PRODUCTION: SALUD
 * DEBUG=develar:server PORT=8081 NODE_ENV=production DBASE=salud SERVER=https://salud.brown.gob.ar PUBLIC=/www/salud node core/services/panicScript
 */

 const config = require('../config/config')
 const mongoose = require(config.dbconnect)(config); 
 const whoami =  "models/panicScript: ";

 
 // necesarios para el proceso de importación
 
 const person = require('../models/personModel');
 const userModel = require('../models/userModel');
 
 const asisprevencion = require('../models/asisprevencionModel.js');

 const fs = require('fs');
 const path = require('path');
 const utils = require('./commons.utils');

 const debug = require('debug')(config.debug);

 const PersonRecord = person.getRecord();
 const AsisprevencionRecord = asisprevencion.getRecord();


 debug('DEBUG STARTED ' );
 debug('PANIC SCRIPT  ' +  config.dbase);


 setTimeout(()=> {
     reviewMigracion();

 }, 1000);
 

function reviewMigracion(){
  const Schema = mongoose.Schema;
  const list = ["10709379", "12535025", "14271735", "14845374", "16190204", "16835530", "17015756", "17541778", "18827910", "20066978", "20640411", "20743447", "23014568", "24235523", "24921676", "25419460", "25430247", "25706791", "28369593", "29052542", "29370385", "29539795", "29823183", "32072772", "32558805", "32653219", "33122488", "33739959", "36274364", "37036776", "37242921", "37358972", "38080869", "38678792", "39269233", "39959604", "40213533", "41190340", "41924259", "42313230", "43034542", "46892129", "93936245", "94003443", "94007114", "900884227"]

  debug('SETUP READY' + list.length);
  patchMigracionMayo18(list);
   
} 

async function patchMigracionMayo18(list){
  let asistencias;
  let deletedAsistencia;
  let deletedPerson;
  debug('iterating START: ')
  for (let index = 0; index < list.length; index ++){
    let query = {
          tdoc: 'DNI',
          ndoc: list[index]
    };

    asistencias = await AsisprevencionRecord.find(query).exec();
    debug('Asis found: ' + list[index] + ': ['+ asistencias.length + ']')

    if(asistencias && asistencias.length>1){
      await deleteDuplicates(asistencias);







    }else {
      debug('NOT DUPlicated ' );

    }


  }

}

async function deleteDuplicates(asistencias){
  let promise = new Promise(async (resolve, reject) => {
    for (let i = 1; i < asistencias.length; i++){
      let personId = asistencias[i].idPerson;
      await AsisprevencionRecord.deleteOne({_id: asistencias[i].id});
      await PersonRecord.deleteOne({_id: personId});
      debug('Deleted ' + personId);
      resolve(true);

    }

  })
  return promise
}
