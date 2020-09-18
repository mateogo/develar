/**
 * Asistencia: Solicitud de Asistencia a Vecinos
 */

const whoami =  "models/asistenciaModel: ";

const mongoose = require('mongoose');

// necesarios para el proceso de importación
const config = require('../config/config')

const path = require('path');
const utils = require('../services/commons.utils');

const asisprevencion = require('./asisprevencionModel.js');


const Schema = mongoose.Schema;

const self = this;

const N_HAB_00 = 'NUC-HAB-00'

const AsisprevencionRecord = asisprevencion.getRecord();


/******************************************************************/
/***** REGENERAR  asisprevenciones.infeccion.mdiagnostico    *****/
/****************************************************************/
exports.metodoDiagnostico = function(errcb, cb){
  let regexQuery = {
    isVigilado: true,
    avance: {$ne: 'anulado'},
    'infeccion.isActive': true,
    'infeccion.actualState': {$in: [0,1,2,3,4,5,6]}
  }

  AsisprevencionRecord.find(regexQuery)
    .lean()
    .exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);

        }else{
          if(entities && entities.length ){

            let count = entities.length;
            processExecutor(entities, errcb, cb);

            cb({actualizados: count});

          }else{
            cb({error: 'no entities'})
          }
        }
  });
}

/***** EXECUTOR: recorre todos los registros  *****/
function processExecutor(movimientos, errcb, cb){
  console.log('PRCESS EXECUTOR BEGIN ********* [%s]', movimientos && movimientos.length);
  let today = new Date();
  let outerCount = 0;
  let shoudBeAltaCount = 0;
  let notCovidCount = 0;

  let contador = {
      noconfirmado: 0,
      laboratorio: 0,
      nexo: 0,
      clinica: 0,
      descartado: 0,
  }

  movimientos.forEach(asis => {
    //if(outerCount > 500 ) return;
    
    let infection = asis.infeccion;
    if(infection && infection.isActive === true){
      reviewInfection(asis, infection);
      processInfection(asis, infection);

      if(shouldBeAltaEpidemiologica(asis, infection, today)) {
        shoudBeAltaCount += 1;
        let report = `TIENE CONDICIONES DE ALTA: ${asis.ndoc}: ${infection.mdiagnostico} actualState: ${infection.actualState} avance: ${infection.avance} `;
        console.log(report);
      }

      updateAsisprevencionInfection(asis, infection);
      contador[infection.mdiagnostico] += 1;
      outerCount += 1;

    }else {
      notCovidCount += 1;
    }

  });

  console.log('PROCESO CONCLUIDO: [%s]', outerCount);
  console.log('No procesados: [%s]', notCovidCount);
  console.log('En condiciones de ALTA EPIDEMIOL: [%s]', shoudBeAltaCount);
  console.dir(contador);
}

/***** REVIEW: chequea el estado del registro  *****/
function reviewInfection(asis, infection){
  if(isActiveCovid(infection)){
    checkFechaInicio(asis, infection);
    checkFechaConfirma(asis, infection);


  }


}


/***** EXECUTOR: procesa UN CASO  *****/
function processInfection(asis, infection){
  if(isMonitoreo(infection)){
    infection.mdiagnostico = 'noconfirmado';
    return;
  }

  if(isDescartado(infection)){
    infection.mdiagnostico = 'descartado';
    return;
  }

  if(hasLaboratorio(asis, infection)){
    infection.mdiagnostico = 'laboratorio';
    return;
  }

  if(isImportedFromSisa(asis, infection)){
    if(infection.avance === 'nexo'){
      infection.mdiagnostico = 'nexo';
    }else {
      infection.mdiagnostico = 'laboratorio';
    }

    return;
  }

  if(isInternado(infection)){
    infection.mdiagnostico = 'laboratorio';
    return;    
  }

  infection.mdiagnostico = 'nexo';


}



function updateAsisprevencionInfection(asistencia, infection){
  let hasLab = hasLaboratorio(asistencia, infection);
  let report = `${asistencia.ndoc}: ${infection.mdiagnostico} idbrown:${asistencia.idbrown} hasLab:${hasLab} actualState: ${infection.actualState} avance: ${infection.avance} `
  console.log(report);
  let token = {infeccion: infection};
  if(!asistencia._id) return;
  AsisprevencionRecord.findByIdAndUpdate(asistencia._id, token).exec();
}


/******************************/
/*****     HELPERS       *****/
/****************************/
function isDescartado(infection){
  return infection.actualState === 2;
}

function isMonitoreo(infection){
  return infection.actualState === 6;
}

function isActiveCovid(infection){
  return infection.actualState === 1;
}

function isSospechoso(infection){
  return infection.actualState === 0;
}

function hasBeenCovid(infection){
  return (infection.actualState === 1 || infection.actualState === 4 || infection.actualState === 5); // covid/fallecido/alta
}

function isInternado(infection){
  return infection.isInternado
}

function shouldBeAltaEpidemiologica(asis, infection, today){
  if(infection.actualState !== 1) return false;
  if(infection.isInternado) return false;
  if( ['asintomatico', 'sintomatico', 'bueno' ].indexOf(infection.sintoma) === -1) return false;

  let fecharef = infection.fets_inicio || infection.fets_confirma;
  let delta = today.getTime() - fecharef;
  if(fecharef > 1000 * 60 * 60 * 24 * 10 ) return true;

}


function isImportedFromSisa(asis, infection){
  if(!asis.idbrown) return false;
  if(asis.idbrown.startsWith('sisa')) return true;
  return false;
}

function hasLaboratorio(asistencia, infection){
  let labs = asistencia.muestraslab;
  let validlabs;

  function _validRange(lab, ref, lab){
    if(!ref || !lab) return false;
    let delta = ref - lab
    if(delta < 0){
      if(lab.resultado === 'confirmada') return true;
      else return false; // el laboratorio es posterior a fecha covid, puede ser para confirmar alta;
    } 

    if(delta > 1000 * 60 * 60 * 24 * 15){
      return false; // el lab tiene más de 15 días de antelación al caso
    }

    if(lab.resultado === 'confirmada' || lab.resultado === 'pendiente') return true;
    else return false;
  }
  
  if(labs && labs.length){
    let fecharef = infection.fets_confirma || infection.fets_inicio;

    validlabs = labs.filter(lab => {
      if(lab.isActive && lab.estado === 'presentada'){
        return _validRange(lab, fecharef, lab.fets_toma);

      }else {
        return false;
      }
    })

    if(validlabs && validlabs.length){
      return true;

    }else {
      return false;

    }


  }else {
    return false;
  }

}




/******************************/
/*****     REPAIR       *****/
/****************************/
function checkFechaInicio(asis, infection){
  if(infection.fe_inicio){
    if(!infection.fets_inicio){
      infection.fets_inicio = utils.dateNumFromTx(infection.fe_inicio);
      if(!infection.fets_inicio) markErrorsInRecord('error#101: mal fets_inicio', infection)
    }

  }else if(infection.fe_confirma){
    infection.fe_inicio = infection.fe_confirma;
    infection.fets_inicio = utils.dateNumFromTx(infection.fe_inicio);
    if(!infection.fets_inicio) markErrorsInRecord('error#102: sin fe_inicio ni fe_confirma', infection)
  }

}

function checkFechaConfirma(asis, infection){
  if(infection.fe_confirma){
    if(!infection.fets_confirma){
      infection.fets_confirma = utils.dateNumFromTx(infection.fe_confirma);
      if(!infection.fets_confirma) markErrorsInRecord('error#103: mal fets_confirma', infection)
    }

  }else if(infection.fe_inicio){
    infection.fe_confirma = infection.fe_inicio;
    infection.fets_confirma = utils.dateNumFromTx(infection.fe_confirma);
    if(!infection.fets_confirma) markErrorsInRecord('error#104: sin fe_inicio ni fe_confirma', infection)
  }

}



/******************************/
/*****     MARK ERRORS   *****/
/****************************/

function markErrorsInRecord(errorTxt, infection){
  infection.slug = infection.slug + ' :: ' + errorTxt;
}

