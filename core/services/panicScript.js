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
     //reviewMigracion();
     computeUserWorkLoad();

 }, 1000);

 /*************************************************************************************
 * computeUserWorkLoad: usado en mayo-2021 para evaluar la carga de trabajo del usuario
 * usage: DEVELOPMENT: 
 * DEBUG=develar:server PORT=8080 NODE_ENV=development DBASE=saludmab SERVER=http://develar-local.co PUBLIC=/public node core/services/panicScript
 * 
 * usage: PRODUCTION: SALUD
 * DEBUG=develar:server PORT=8081 NODE_ENV=production DBASE=salud SERVER=https://salud.brown.gob.ar PUBLIC=/www/salud node core/services/panicScript
 */
function computeUserWorkLoad(){
  let feref = "19/05/2021"
  let dateFrame = _buildDateFrame(feref);
  _loadAsistencias(dateFrame).then(asistencias => {
    console.log('asistencias: [%s]', asistencias && asistencias.length);
    if(asistencias && asistencias.length){
      processWorkLoad(dateFrame, asistencias);

    }else {
      console.load('todo: no hay asistencias para el períoodo')
    }
  });
}

function processWorkLoad(datef, asistencias){

  let asisMapping = asistencias.map(asis =>{
    return asisMapFunction(asis);
  })

  let userMapping = buildUserMapping(asisMapping);
  console.dir(userMapping);


  _showSample(asisMapping);

}

function asisMapFunction(asis){
  return new MappedAsis(asis)
}

function _showSample(asis){
  let sample = asis.find(t => t.ndoc === '36286721')
  console.dir(sample);
}

function buildUserMapping(asisMapping){
  let umap = new Map();

  asisMapping.forEach(asis => {
    let asignado = (asis.isAsignado && asis.asignadoId) || 'no_asignado';
    if(umap.has(asignado)){
      let token = umap.get(asignado);
      token.qInvestigacion += asis.hasInvestigacion ? 1 : 0;
      token.qllamados += asis.qllamados;
      token.qcontactos += asis.qcontactos;
      token.qcasos += 1;
      token.qcasosSinTel += asis.hasTelefono ? 0 : 1;
      token.qcasosConTel += asis.hasTelefono ? 1 : 0;
      token.qActualState[asis.actualState] += 1;

      
    }else {
      let token = new MappedUser(asis);

      umap.set(asignado, token);

    }
  

  })

  return umap;
}

class MappedUser {
  asignadoId;
  asignadoSlug;
  qInvestigacion = 0;
  qllamados = 0;
  qcontactos = 0;

  qcasos = 1;
  qcasosSinTel = 0;
  qcasosConTel = 0;
  qActualState = [0, 0, 0, 0, 0, 0, 0, 0];

  constructor(asis){
    this.asignadoId = asis.asignadoId;
    this.asignadoSlug = asis.asignadoSlug;
    this.qInvestigacion = asis.hasInvestigacion ? 1 : 0;
    this.qllamados = asis.qllamados;
    this.qcontactos = asis.qcontactos;
    this.qcasosSinTel = asis.hasTelefono ? 0 : 1;
    this.qcasosConTel = asis.hasTelefono ? 1 : 0;    
    this.qActualState[asis.actualState] = 1;

  }



}

class MappedContactos {
  qllamados = 0;
  qcontactos = 0;


}

class MappedAsis {
  asistenciaId;
  ndoc;
  idPerson;
  tdoc;
  sexo;
  edad;
  telefono;
  ndoc;
  requeridox;
  slug;
  hasTelefono = false;
  isAsignado = false;
  asignadoId;
  asignadoSlug;
  qllamados = 0;
  qcontactos = 0;
  fUpSlug; 
  actualState = 7;
  hasInvestigacion = false;
  city;

  constructor(asis){
    this.asistenciaId = asis._id.toString();
    this.ndoc = asis.ndoc;
    this.idPerson = asis.idPerson;
    this.requeridox = asis.requeridox.slug;
    this.tdoc = asis.tdoc;
    this.sexo = asis.sexo;
    this.edad = asis.edad;
    this.telefono = asis.telefono;
    this.ndoc = asis.ndoc;
    this.slug = asis.slug;
    this.hasTelefono = asis.telefono && asis.telefono !== 'sin dato';
    
    let fUp = asis.followUp;
    if(fUp){
      this.isAsignado = fUp.isAsignado;
      this.asignadoId = fUp.asignadoId ;
      this.asignadoSlug = fUp.asignadoSlug ;
      this.qllamados = fUp.qllamados ;
      this.qcontactos = fUp.qcontactos ;
      this.fUpSlug = fUp.slug ;
    }

    let infeccion = asis.infeccion;
    if(infeccion){
      this.actualState = infeccion.actualState ;
    }

    let sintomacovid = asis.sintomacovid;
    if(sintomacovid){
      this.hasInvestigacion = sintomacovid.hasInvestigacion ;
    }

    let locacion = asis.locacion;
    if(locacion){
      this.city = locacion.city ;
    }
  }
}

async function _loadAsistencias(dateFrame){
  let query = {
    estado: 'activo',
    fecomp_tsa: {$gte: dateFrame.tsDesde, $lt: dateFrame.tsHasta},
  };

  return await AsisprevencionRecord.find(query).lean().exec();
}

function _buildDateFrame(feTxt){
  let date = utils.parseDateStr(feTxt);
  let desdeNum = utils.getProjectedDate(date, -10, 0).getTime();
  let hastaNum = utils.dateToNumPlusOne(feTxt);

  let dateFrame = {
    tsHasta:  hastaNum,
    tsDesde: desdeNum,
    txHasta: utils.txFromDateTime(hastaNum),
    txDesde: utils.txFromDateTime(desdeNum),
    dateList: utils.dateTxList(desdeNum, 10)

  }
  console.log('Date Dif : [%s]', (dateFrame.tsHasta - dateFrame.tsDesde)/(1000 * 60 * 60 * 24))
  console.dir(dateFrame);
  return dateFrame;

}



/**
 * FIN: computeUserWorkLoad
 ******************************/


/*******
 * reviewMigracion: usado en mayo-2021 para corregir problema de migración
 */
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
/**
 * FIN: reviewMigracion
 ***************************/
