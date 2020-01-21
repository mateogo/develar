/**
 * Beneficiario tarjeta ALIMENTAR model
 */
/**
 * Load module dependencies
 */

const whoami =  "models/alimentarModel: ";


// necesarios para el proceso de importación
const config = require('../config/config')
const fs = require('fs');
const path = require('path');
const utils = require('../services/commons.utils');

const csv = require('csvtojson')


const master = {};


const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const self = this;

const datosTarjetaSch = new Schema({
  ndoc:     { type: String, required: true },
  cuil:     { type: String, required: false },
  displayName: { type: String, required: false },
  prov:     { type: String, required: false },
  city:     { type: String, required: false },
  calle:    { type: String, required: false },
  callenro: { type: String, required: false },
  dia:      { type: String, required: false },
  hora:     { type: String, required: false },
  caja:     { type: String, required: false },
  slug:     { type: String, required: false },
  orden:    { type: String, required: false },
  estado:   { type: String, required: false , default: 'pendiente'},
  fecha:    { type: String, required: false },
  fe_ts:    { type: Number, required: false, default: 0 },
});
 

const Beneficiario = mongoose.model('Tarjetaalimentar', datosTarjetaSch, 'tarjetasalimentar');

function buildQuery(query){
    let q = {};

    if(query.dia){
        q["dia"] = query.dia;
    }

    return q;

}


exports.load = function (errcb, cb) {
    processAlimentarArchive(master, cb);
}

exports.importarnacion = function (errcb, cb) {
    processDatosBancoArchive(cb);
}

exports.dashboard = function (errcb, cb) {
    dashboardProcess(cb);
}

exports.update = function (id, beneficiario, errcb, cb) {

    Beneficiario.findByIdAndUpdate(id, beneficiario, { new: true }, function(err, entity) {
        if (err){
            console.log('[%s]validation error as validate() argument ', whoami)
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};

exports.findByDNI = function (id, errcb, cb) {
    let query = {ndoc: id};

    Beneficiario.find(query).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
            errcb(err);
        }else{
            cb(entities);
        }
    });


}

exports.findById = function (id, errcb, cb) {
    let token = {
        tieneBeneficio: false,
        beneficiario: '',
        slug: 'No figura en lista el documento: ' + id,
        dia: '',
        hora: ''
    }

    if(id && master[id]){

        token.tieneBeneficio = true;
        token.beneficiario = master[id].displayName;
        token.dia = master[id].dia;
        token.hora = master[id].hora;
        token.slug = 'RETIRA TARJETA'
    }
    cb(token);

};


/**
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */
exports.findByQuery = function (query, errcb, cb) {
    let regexQuery = buildQuery(query);

    Beneficiario.find(regexQuery).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
            errcb(err);
        }else{
            cb(entities);
        }
    });
};


const dashboardProcess = function(cb){



    Beneficiario.find().lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
            errcb(err);
        }else{
            processDashboardData(entities, cb)
        }
    });


}

function processDashboardData(records, cb){
    let master = {};

    if(records && records.length){


        records.forEach(beneficiario => {

            let dia = beneficiario.dia;

            if(!master[dia]){
                master[dia] = initAcumPorDia(beneficiario);
            }

            acumPorDia(master[dia], beneficiario.estado)
        })
        cb(master);

    }else{
        cb({error: 'no data'})
    }



}

/**
    {
        dia:   //día en cuestion
        total:  // total previstos en ése día
        entregadas: // total atendidos
    }
*/

function acumPorDia(token, estado){
    token.total += 1;
    if(estado === 'entregada'){
        token.entregadas += 1;
    }
    token.porciento = token.entregadas / token.total;

}

function initAcumPorDia(beneficiario){
    return {
        dia: beneficiario.dia,
        total: 0,
        entregadas: 0
    }

}

const processAlimentarArchive = function(master, cb){
    console.log('******  process ALIMENTAR ARCHIVE to BEGIN ********')
    const arch = path.join(config.rootPath, 'www/dsocial/migracion/alimentar/alimentarBeneficiariosCsv.csv');
    //const arch = path.join(config.rootPath,        'public/migracion/alimentar/alimentarBeneficiariosCsv.csv');

    function toLowerCase(name){
        return name.toLowerCase();
    }

    function toUpperCase(name){
        return name.toUpperCase();
    }

    csv({delimiter: ';'})
    .fromFile(arch)
    .then((persons) => {

        persons.forEach(per => {
            // console.log(" [%s]  [%s]" ,per.displayName, per.ndoc);
            // console.dir(per);

            master[per['ndoc']] = per;
            master[per['ncuil']] = per;
        })
                    
        console.log('******  processARCHIVE OK ********')
        cb({process: 'OK'});

    });
}

async function upsertBeneficiario(beneficiario){
    //let beneficiario = new Beneficiario(beneficiario);
    //delete beneficiario._id;

    let query = {ndoc: beneficiario.ndoc};
    //console.dir(beneficiario)


    await Beneficiario.findOneAndUpdate(query, beneficiario, {new: true, upsert: true});

}


const processDatosBancoArchive = function(cb ){
    console.log('******  process ALIMENTAR DATOS BANCO to BEGIN ********')
    //deploy
    const arch = path.join(config.rootPath, 'www/dsocial/migracion/alimentar/alimentarDatosBancoCsv.csv');

    //local
    //const arch = path.join(config.rootPath,        'public/migracion/alimentar/alimentarDatosBancoCsv.csv');

    function toLowerCase(name){
        return name.toLowerCase();
    }

    function toUpperCase(name){
        return name.toUpperCase();
    }

    let count = 0;

    csv({delimiter: ';'})
    .fromFile(arch)
    .then((persons) => {

        persons.forEach(per => {
            count +=1;

            if(true) {
                upsertBeneficiario(per);
            }


        })
                    
        console.log('******  processARCHIVE OK ********')
        cb({process: 'OK ' + count});

    });
}

