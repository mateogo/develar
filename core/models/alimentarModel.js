/**
 * Person model
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



exports.load = function (errcb, cb) {
    processAlimentarArchive(master, cb);
}



exports.findById = function (id, errcb, cb) {
    console.log('Alimentar: [%s]', id);
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


