/**
 * Audit Entregas: Audita las entregas de asistencia directa
 * por persona, grupo familiar y domicilio
 */

const whoami =  "models/auditentregasModel: ";

const mongoose = require('mongoose');
const Rxjs = require('rxjs');
const RxjsOperators = require('rxjs/operators');

// necesarios para el proceso de importación
const config = require('../config/config')

const path = require('path');
const utils = require('../services/commons.utils');

const personSrv = require('./personModel');
const remitoSrv = require('./almacenModel');


const Schema = mongoose.Schema;

const self = this;


function buildQuery(query){

  let q = {};

  return q;
}



exports.auditEntregaByPerson = function (personId, errcb, cb) {
  console.log('auditEntregas By Person READY to BEGIN [%s]', personId);

  let personL$ =   new Rxjs.Subject();
  let relativeL$ = new Rxjs.Subject();
  let entregasL$ = new Rxjs.Subject();
  let masterPerson = {};
  let eTokens = [];

  let audit = {
    initTs: Date.now(),
    initTe: Date.now(),
    masterPerson: masterPerson,

  }


  entregasL$.subscribe(
    (eToken) => {
      console.log('EntregasListener eTOKEN')
      eTokens.push(eToken)

    },
    (err) => {console.log('error')},

    ()=>{
      console.log('EntregasListener COMPLETE')
      audit['entregas'] = eTokens;
      audit['initTe'] = Date.now();

      cb(audit)

    }
  )


  personL$.subscribe(pToken => {
    console.log('PersonListener: [%s]', pToken.displayName, pToken.vinculo);
    if(!masterPerson[pToken.personId]){
      masterPerson[pToken.personId] = pToken
      lookUpRemitos(entregasL$,pToken.personId);

      if(pToken.personRole === 'principal'){
        let familiares = pToken.vinculos;
        if(familiares && familiares.length){
          processRelatives(familiares, personL$, masterPerson);

        }

        let locaciones = pToken.locaciones;
        if(locaciones && locaciones.length){
          processAddresses(locaciones, pToken.personId, personL$, masterPerson);
        }

      }


    }else {
      // persona ya procesada

    }


  });

  setTimeout(() => {
    entregasL$.complete()
  }, 1000);


  fetchPersonById(personL$, personId, 'principal');
  fetchRelativesFromPerson(personL$, personId, masterPerson);

}

function processRelatives(familiares, personL$, masterPerson){

  familiares.forEach(relative =>{
    if(relative.hasOwnPerson && !masterPerson[relative.personId]){
      fetchPersonById(personL$, relative.personId, relative.vinculo);
      console.log('Relative hasOwnPerson [%s] [%s]:[%s]', relative.nombre, relative.todc, relative.ndoc);

      //auditRelative(relativeL$, relative, familiares, person, audit, errcb, cb);

    }

  })


}

function processAddresses(locaciones, personId,  personL$, masterPerson){

  locaciones.forEach(locacion =>{
    if(locacion && locacion.street1 && locacion.city){
      fetchPersonsByAddress(locacion, personId, personL$, masterPerson);
    }

  })


}

function fetchPersonsByAddress(locacion, personId, personL$, masterPerson){

  personSrv.fetchByAddress(personId, locacion).then(persons =>{
    if(persons && persons.length){
      let vinculo = 'direccion_similar';
      persons.forEach(person => {
        if(!masterPerson[person._id]){

          let personToken = {
            personId: person._id,
            personDisplayAs: person.displayName,
            personRole: vinculo,
            personTDOC: person.tdoc,
            personNDOC: person.ndoc,
            locaciones: person.locaciones,
            vinculos: person.familiares
          }
          personL$.next(personToken);

        }
      })
    }
  });


}

function fetchRelativesFromPerson(personL$, personId, masterPerson){

  personSrv.fetchByRelatives(personId).then(persons =>{
    if(persons && persons.length){
      let vinculo = 'grupoFamiliar';
      persons.forEach(person => {
        if(!masterPerson[person._id]){

          let personToken = {
            personId: person._id,
            personDisplayAs: person.displayName,
            personRole: vinculo,
            personTDOC: person.tdoc,
            personNDOC: person.ndoc,
            locaciones: person.locaciones,
            vinculos: person.familiares
          }
          personL$.next(personToken);

          let familiares = person.familiares;
          if(familiares && familiares.length){
            processRelatives(familiares, personL$, masterPerson);

          }

        }
      })
    }
  });


}


function fetchPersonById(personL$, personId, vinculo){
  personSrv.fetchById(personId).then(person =>{
    if(person){
      console.log('Person fetched [%s] [%s]', person.displayName, vinculo);
      let personToken = {
        personId: person._id,
        personDisplayAs: person.displayName,
        personRole: vinculo,
        personTDOC: person.tdoc,
        personNDOC: person.ndoc,
        locaciones: person.locaciones,
        vinculos: person.familiares
      }
      personL$.next(personToken);
    }
  });

}


function lookUpRemitos(entregasL$, personId){

    remitoSrv.fetchRemitosByPerson(personId).then(remitos => {
      if(remitos && remitos.length){
        remitos.forEach(remito => {
          console.log('remito entrega ENCONTRADO: [%s] [%s]',remito.fecomp_txa, remito.slug);
          let token = {
            remitoId: remito._id,
            remitoPersonId: remito.personId,
            remitoFecha: remito.fecomp_txa,
            remitoTS: remito.ts_alta,
            remitoNro: remito.compNum,
            remitoAction: remito.action,
            remitoItems: remito.entregas ? remito.entregas.length : 0,
          }
          entregasL$.next(token);
        })
      }
    })

}


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
    console.dir(regexQuery)

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




