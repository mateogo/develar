/**
 * Beneficiario tarjeta ALIMENTAR model
 */
/**
 * Load module dependencies
 */

const whoami =  "models/alimentarModel: ";
const Excel = require('exceljs')


// necesarios para el proceso de importación
const config = require('../config/config')
const fs = require('fs');
const path = require('path');
const utils = require('../services/commons.utils');
const person = require('./personModel');

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
  email:    { type: String, required: false },
  celular:    { type: String, required: false },
});
 

const Beneficiario = mongoose.model('Tarjetaalimentar', datosTarjetaSch, 'tarjetasalimentar');

function buildQuery(query){
    let q = {};

    if(query.dia){
        q["dia"] = query.dia;
    }

    if(query.estado){
        if(query.estado === 'pendiente'){
            q["estado"] = {$ne: 'entregada'}

        }else if(query.estado === 'entregada'){
            q["estado"] = "entregada";

        }
    }

    return q;

}


exports.load = function (errcb, cb) {
    processAlimentarArchive(master, cb);
}

exports.importarnacion = function (errcb, cb) {
    processDatosBancoArchive(cb);
}

exports.buildcontactdata = function (errcb, cb) {
    processContactData(cb);
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

        //Trucho OjO
        // master['lunes 20-01'].entregadas  = 1591;
        // master['lunes 20-01'].porciento  = master['lunes 20-01'].entregadas / master['lunes 20-01'].total * 100;

        //master['martes 21-01'].entregadas = 1887;
        //master['martes 21-01'].porciento  = master['martes 21-01'].entregadas / master['martes 21-01'].total * 100;
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
    token.porciento = token.entregadas / token.total * 100;

}

function initAcumPorDia(beneficiario){
    return {
        dia: beneficiario.dia,
        total: 0,
        entregadas: 0
    }

}

const processAlimentarArchive = function(master, cb){

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

            master[per['ndoc']] = per;
            master[per['ncuil']] = per;
        })
                    
        cb({process: 'OK'});

    });
}

async function upsertBeneficiario(beneficiario, today){
    //let beneficiario = new Beneficiario(beneficiario);
    //delete beneficiario._id;

    let query = {ndoc: beneficiario.ndoc};
    let editEntrega = beneficiario && beneficiario.editEntrega && beneficiario.editEntrega === "1";

    let editCaja = beneficiario && beneficiario.editCaja && beneficiario.editCaja === "1";

    if(editEntrega){
        let isEntregada = beneficiario && beneficiario.entregada && beneficiario.entregada === "1";
        let token = {
            estado: 'entregada',
            fecha: utils.dateToStr(today),
            fe_ts: today.getTime(),
        }

        if(!isEntregada){
            token.estado = 'pendiente';
        }

        await Beneficiario.findOneAndUpdate(query, token, {new: true, upsert: true});
    }


    if(editCaja){
        let token = {
            caja: beneficiario.caja,
            orden: beneficiario.orden,
            dia: beneficiario.dia,
            hora: beneficiario.hora
        }

        await Beneficiario.findOneAndUpdate(query, token, {new: true, upsert: true});

    }

    if(false){
        await Beneficiario.findOneAndUpdate(query, beneficiario, {new: true, upsert: true});
    }



}


const processDatosBancoArchive = function(cb ){

    const today = new Date();
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
                upsertBeneficiario(per, today);
            }
        })
                    
        cb({process: 'OK ' + count});

    });
}


const processContactData = function(cb){
    const today = new Date();

    person.buildInvertedTreeForContactData().then(pTree =>{

        Beneficiario.find().lean().exec(function(err, entities) {
            if (err) {
                console.log('[%s] processContactData ERROR: [%s]',whoami, err)
                errcb(err);
            }else{
                buildContactData(pTree, entities, cb)
            }
        });

        cb({proceso: "Cumplido OK"})




    });



}



function buildContactData(pTree, beneficiarios, cb){
    if(beneficiarios && beneficiarios.length){
        beneficiarios.forEach(bene => {
            let ndoc = bene.ndoc;
            if(pTree[ndoc] && pTree[ndoc].contactdata && pTree[ndoc].contactdata.length){
                updateContactData(bene, pTree[ndoc].contactdata);
            }
        })




    }

}

function updateContactData(beneficiario, cdata){
    let mail = '';
    let celu = '';
    cdata.forEach(data => {
        if(data.tdato === "CEL"){
            celu = celu ? data.data + " / " + celu : data.data;
        }

        if(data.tdato === "MAIL"){
            mail = mail ? data.data + " / " + mail : data.data;
        }
    })

    if(mail || celu){
        let contact_data = {email: mail, celular: celu};
        let query = {ndoc: beneficiario.ndoc};
        insertContacData(query, contact_data);

    }
}

async function insertContacData(query, token){
        await Beneficiario.findOneAndUpdate(query, token, {new: true, upsert: true});
}


exports.remanentes = function(req, res ){
    fetchRemanentes(req, res)

}


function fetchRemanentes(req, res){
    let query = {estado: 'pendiente'}
    let regexQuery = buildQuery(query);

    Beneficiario.find(regexQuery).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
            errcb(err);
        }else{

            buildExcelStream(entities, req, res)
        }
    });



}

function buildExcelStream(remanentes, req, res){
    res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="remanentes.xlsx"',
        'Transfer-Encoding': 'chunked',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res })
    var worksheet = workbook.addWorksheet('remanentes')

    remanentes.forEach(row => {
        const {ndoc, displayName, dia, prov, city, calle, callenro, email, celular } = row;

        worksheet.addRow([ndoc, displayName, dia, prov, city, calle, callenro, email, celular]).commit()

    })
    worksheet.commit()
    workbook.commit()


}

