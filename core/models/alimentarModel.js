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
const personModule = require('./personModel');
const asistenciaModule = require('./asistenciaModel');

const csv = require('csvtojson')
const Person = personModule.getRecord();
const Asistencia = asistenciaModule.getRecord();


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


// PROCESO DE CONTROL DE CRUCE DE BENEFICIARIOS
const cruceBeneficiarioSch = new Schema({
    tdoc:     { type: String, required: true },
    ndoc:     { type: String, required: true },
    nombre:   { type: String, required: true },
    apellido: { type: String, required: true },

    order:        { type: Number,  required: false, default: 0 },
    hasPerson:    { type: Boolean, required: false, default: false },
    hasCobertura: { type: Boolean, required: false, default: false },
    hasAlimentos: { type: Boolean, required: false, default: false },
    qAlimentos:   { type: Number, required: false, default: 0 },

    fecha:    { type: String, required: false },
    fe_ts:    { type: Number, required: false, default: 0 },
    slug:     { type: String, required: false }
  });
   
  const CruceBeneficiarioModel = mongoose.model('Crucebeneficiario', cruceBeneficiarioSch, 'crucebeneficiarios');
  

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

exports.importarpadron = function (errcb, cb) {
    processDatosPadronAlimentar(cb);
}

exports.crucealimentos = function (errcb, cb) {
    processCruceAlimentos(cb);
}

exports.excelcruce = function(req, res ){
    downloadExcelCruce(req, res)
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
    .then((records) => {

        records.forEach(per => {

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


/*****************************************/
/*   /api/alimentar/importarpadron     * /
/***************************************/
/*
    Columnas: caja; orden; displayName; ndoc; ncuil; dia; hora; entregada; editCaja; editEntrega
    Columnas: displayName; ndoc; ncuil; prov; city; calle; callenro; dia; hora;

**/

const processDatosPadronAlimentar = function(cb ){
    const today = new Date();
    //deploy
    //const arch = path.join(config.rootPath, 'www/dsocial/migracion/alimentar/alimentarBeneficiariosCsv.csv');

    //local
    const arch = path.join(config.rootPath,        'public/migracion/alimentar/alimentarBeneficiariosCsv.csv');

    function toLowerCase(name){
        return name.toLowerCase();
    }

    function toUpperCase(name){
        return name.toUpperCase();
    }

    let count = 0;

    console.log('processDatosPadronAlimentar BEGIN [%s]', arch);
    csv({delimiter: ';'})
    .fromFile(arch)
    .then((records) => {
        _upsertBeneficiarioOctubre2020(records, cb)


                    

    });
}

/******
 * Revisión padrón de beneficiarios
 * Solicitado 2021-02-25
 * Se trata
 */

 /*****************************************/
/*   /api/alimentar/crucealimentos     * /
/***************************************/
/*
    Columnas: caja; orden; displayName; ndoc; ncuil; dia; hora; entregada; editCaja; editEntrega
    Columnas: displayName; ndoc; ncuil; prov; city; calle; callenro; dia; hora;

**/

const processCruceAlimentos = function(cb ){
    const today = new Date();
    //deploy
    const arch = path.join(config.rootPath, 'www/dsocial/migracion/alimentar/crucealimentosCsv.csv');

    //local
    //const arch = path.join(config.rootPath,        'public/migracion/alimentar/crucealimentosCsv.csv');

    function toLowerCase(name){
        return name.toLowerCase();
    }

    function toUpperCase(name){
        return name.toUpperCase();
    }

    let count = 0;

    console.log('proceso CRUCE ALIMENTOS BEGIN [%s]', arch);
    csv({delimiter: ';'})
    .fromFile(arch)
    .then((records) => {
        _upsertCruceAlimentos(records, cb)


                    

    });
}

 /*****************************************/
/*   /api/alimentar/excelcruce     * /
/***************************************/
const downloadExcelCruce = function(req, res ){

    CruceBeneficiarioModel.find().lean().exec().then(beneficiarios => {
        if(beneficiarios && beneficiarios.length){
            let filteredList = beneficiarios.filter(be => {
                if(be.hasAlimentos || be.hasPerson || be.hasCobertura){
                    return true;
                }else{
                    return false;
                }
            })
        
            _buildExcelCruce(filteredList, req, res);
        }
    })
}


 async function _upsertCruceAlimentos(beneficiarios, cb){
    const today = new Date();
    const fealta = utils.dateToStr(today);
    const fets = today.getTime();
    if(!beneficiarios || !beneficiarios.length){
        cb({process: 'Error de lecutura del archivo cvs'})
        return;
    }
    console.log('upsert CRUCE BASE ALIMENTOS BEGIN [%s]', beneficiarios.length);

    for(let index = 0; index < beneficiarios.length; index++){
        let record = beneficiarios[index];
        //console.log('Processing: [%s] [%s] [%s]', record.nombre, record.apellido, record.ndoc);
        let beneficiario = _buildBeneficiarioCruce(record, index, fealta, fets);

        let hasCobertura = false;
        let hasPerson = false;
        let hasAlimentos = false;
        let qAlimentos = 0

        let query = {
            estado: {$not: {$in: [ 'baja', 'bajaxduplice' ]} },
            ndoc: record.ndoc
        }
        let person  = await Person.findOne(query).exec(); 
        
        if(person){
            hasPerson = true;
            hasCobertura = _personHasCobertura(person, record);

            let asis_query = {
                estado: 'activo',
                'requeridox.ndoc': record.ndoc
            }    
            let asistencias  = await Asistencia.find(asis_query).lean().exec(); 

            if(asistencias && asistencias.length){
                hasAlimentos = true;
                qAlimentos =  asistencias.length;
                
            }
        }

        beneficiario.hasPerson = hasPerson;
        beneficiario.hasCobertura = hasCobertura;
        beneficiario.hasAlimentos = hasAlimentos;
        beneficiario.qAlimentos = qAlimentos;

        if(hasPerson || hasCobertura || hasAlimentos){
            console.log('[%s] - Beneficiario: [%s]  per:[%s] cob:[%s] asis: [%s]', beneficiario.order, beneficiario.ndoc, hasPerson, hasCobertura, hasAlimentos)
        }
    
        // SAVE
        await beneficiario.save();
    }

    cb({process: 'OKK ' + beneficiarios.length });
}

function _buildExcelCruce(beneficiarios, req, res){
    res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="crucealimentos.xlsx"',
        'Transfer-Encoding': 'chunked',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res })
    var worksheet = workbook.addWorksheet('beneficiarios')
    worksheet.addRow(['ORDEN', 'TDOC', 'NDOC', 'APELLIDO', 'NOMBRE', 'Existe padrón', 'Tiene cobertura', 'Tiene SolAsistencia', 'Cant Solicitudes' ]).commit()

    beneficiarios.forEach(row => {
        const { order, tdoc, ndoc, apellido, nombre, hasPerson, hasCobertura, hasAlimentos, qAlimentos } = row;
        worksheet.addRow([order, tdoc, ndoc, apellido, nombre, hasPerson, hasCobertura, hasAlimentos, qAlimentos ]).commit()

    })
    worksheet.commit()
    workbook.commit()

}


function _personHasCobertura (person, record){
    return (person && person.cobertura && person.cobertura.length) ? true : false;
}

function _buildBeneficiarioCruce(data, index, fealta, fets){
    let beneficiario = new CruceBeneficiarioModel();
    beneficiario.ndoc = data.ndoc;
    beneficiario.tdoc = data.tdoc || 'DNI';
    beneficiario.nombre = data.nombre;
    beneficiario.apellido = data.apellido;
    beneficiario.order = index;

    beneficiario.slug = 'Cruce beneficiarios alimentos 2021 02 25';
    beneficiario.orden = index;
    beneficiario.fecha = fealta;
    beneficiario.fe_ts = fets;
    beneficiario.hasPerson = false; 
    beneficiario.hasCobertura = false; 
    beneficiario.hasAlimentos = false; 
 
    return beneficiario;
}

/******
 * crucealimentar END
 */

async function _upsertBeneficiarioOctubre2020(beneficiarios, cb){
    const today = new Date();
    const fealta = utils.dateToStr(today);
    const fets = today.getTime();
    if(!beneficiarios || !beneficiarios.length){
        cb({process: 'Error de lecutura del archivo cvs'})
        return;
    }
    console.log('upsertBeneficiariosOctubre 2020 BEGIN [%s]', beneficiarios.length);

    for(let index = 0; index < beneficiarios.length; index++){
        let record = beneficiarios[index];
        console.log('Processing: [%s] [%s] [%s]', record.nombre, record.apellido, record.ndoc);
        let beneficiario = _buildBeneficiarioAlimentar(record, index, fealta, fets);

        await beneficiario.save();
        let query = {
            estado: {$not: {$in: [ 'baja', 'bajaxduplice' ]} },
            ndoc: record.ndoc
        }

        let person  = await Person.findOne(query).exec(); 
        if(person){
            person = _buildCoberturaData(person, record);
            await Person.findByIdAndUpdate(person._id, person).exec();

        }else{
            person = _buildNewPerson(record);
            await Person.create(person);

        }


    }

    cb({process: 'OK ' + beneficiarios.length });
}

function _buildCoberturaData(person, record){
    person.idBrown = 'tarjeta_alimentar_20201022';

    let coberturas = person.cobertura;
    let cobertura = {
        type: 'auh',
        tingreso: 'talimentar',
        slug: 'Recibe tarjeta alimentar Octubre 2020',
        monto:0,
        observacion: 'fecha entrega: ' + record.fentrega + ' ' + record.horaentrega,
        fechafe_ts: 0,
        estado:'pendiente',
    }

    if(coberturas && coberturas.length ){
        let talimentar = coberturas.find(t => t.tingreso === 'talimentar');
        if(talimentar) {
            talimentar.observacion = 'Recibe tarjeta alimentar en Oct 2020: ' + record.fentrega + ' ' + record.horaentrega;
        }else{
            coberturas.push(cobertura);

        }

    }else {
        person.cobertura = [cobertura];
    }

    return person;
}

function _buildNewPerson(data){
    let person = new Person();
    person.nombre = data.nombre;
    person.apellido = data.apellido;

    person.displayName = data.apellido + ', ' + data.nombre;
    person.personType = 'fisica'
    person.email = '';
    person.tdoc = 'DNI';
    person.ndoc =  data.ndoc;
    person.ambito = '';
    person.isImported = true;
    person.idBrown = 'tarjeta_alimentar_20201022';
    person.alerta = 'Recibe tarjeta alimentar Oct-2020';


    let locacion = {
        estado: 'activa',
        addType: 'principal',
        street1: data.calle,
        city: data.city,
        state: 'buenosaires',
        estado: 'activo',
        country: 'AR'
    }
    person.locaciones = [locacion];

    let cobertura = {
        type: 'auh',
        tingreso: 'talimentar',
        slug: 'Recibe tarjeta alimentar Octubre 2020',
        monto:0,
        observacion: 'fecha entrega: ' + data.fentrega + ' ' + data.horaentrega,
        fechafe_ts: 0,
        estado:'pendiente',
    }
    person.cobertura = [cobertura];


    return person;

}


function _buildBeneficiarioAlimentar(data, index, fealta, fets){
    let beneficiario = new Beneficiario();
    beneficiario.ndoc = data.ndoc;
    beneficiario.cuil = data.cuil;
    beneficiario.displayName = data.apellido + ', ' + data.nombre;
    beneficiario.prov = 'BUENOS AIRES';
    beneficiario.city = data.city;
    beneficiario.calle = data.calle;
    beneficiario.callenro = '';
    beneficiario.dia = data.fentrega;
    beneficiario.hora = data.horaentrega;
    beneficiario.slug = '';
    beneficiario.orden = index + '';
    beneficiario.estado = 'pendiente';
    beneficiario.fecha = fealta;
    beneficiario.fe_ts = fets;
    beneficiario.celular = '';
    beneficiario.email = '';

    return beneficiario;
}




/*****************************************/
/*   /api/alimentar/importarnacion     * /
/***************************************/
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
    .then((records) => {

        records.forEach(per => {
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

    personModule.buildInvertedTreeForContactData().then(pTree =>{

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

