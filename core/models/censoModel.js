/**
 * Censo Industrias 2020 Secretaría de Producción - MAB
 */

const whoami = "models/censoindustriaModel: ";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Excel = require('exceljs');
const utils = require('../services/commons.utils');

const self = this;

const empresaSch = new Schema({
    empresaId: { type: String, required: false },
    slug: { type: String, required: false },
    tdoc: { type: String, required: false },
    ndoc: { type: String, required: false },

});

const responsableSch = new Schema({
    responsableId: { type: String, required: false },
    slug: { type: String, required: false },
    tdoc: { type: String, required: false },
    ndoc: { type: String, required: false },

});

const estadoCensoSch = new Schema({
    estado: { type: String, required: false },
    navance: { type: String, required: false },
    isCerrado: { type: Boolean, required: false },
    ts_alta: { type: Number, required: false },
    ts_umodif: { type: Number, required: false },
    fecierre_txa: { type: String, required: false },
    fecierre_tsa: { type: Number, required: false },
    cerradoPor: { type: responsableSch, required: false },
})

const censoDataSch = new Schema({
    codigo: { type: String, required: false, default: 'censo:empresarial:2021:01' },
    type: { type: String, required: false, default: 'censo:anual' },
    anio: { type: Number, required: false, default: 2020 },
    q: { type: String, required: false, default: 'q1' },
    sector: { type: String, required: false, default: 'produccion' },
    slug: { type: String, required: false, default: 'Censo Industrias - MAB 2020' },
});

const censoActividadSch = new Schema({
    codigo: { type: String, required: false },
    seccion: { type: String, required: false },
    rubro: { type: String, required: false },
    slug: { type: String, required: false },
    type: { type: String, required: false },
    level: { type: String, required: false },
    anio: { type: Number, required: false },
    rol: { type: String, required: false },
})

const censoProductosSch = new Schema({
    type: { type: String, required: false },
    slug: { type: String, required: false },
    tactividad: { type: String, required: false },
    actividadId: { type: String, required: false },
    parancelaria: { type: String, required: false },

    isProdpropia:  { type: Boolean, required: false },
    cenproductivo: { type: String, required: false },

    isImportada: { type: Boolean, required: false },
    origen: { type: String, required: false },

    isExportable: { type: Boolean, required: false },
    exportableTxt: { type: String, required: false },

    isSustituible: { type: Boolean, required: false },
    sustituibleTxt: { type: String, required: false },

    isInnovacion: { type: Boolean, required: false },
    innovacionTxt: { type: String, required: false },
    level: { type: Number, required: false },

    anio: { type: Number, required: false },
    destino: { type: String, required: false },
    capainstalada: { type: String, required: false },
    capautilizada: { type: String, required: false },

    competencia: { type: String, required: false },
    competenciaTxt: { type: String, required: false },
    competenciaOrigen: { type: String, required: false },

})

const censoBienesSch = new Schema({
    type: { type: String, required: false },
    slug: { type: String, required: false },
    tactividad: { type: String, required: false },
    actividadId: { type: String, required: false },
    parancelaria: { type: String, required: false },

    isProdpropia:  { type: Boolean, required: false },
    cenproductivo: { type: String, required: false },

    isImportada: { type: Boolean, required: false },
    origen: { type: String, required: false },

    isNacional:     { type: Boolean, required: false },
    origennacional: { type: String, required: false },

    isExportable: { type: Boolean, required: false },
    exportableTxt: { type: String, required: false },

    isSustituible: { type: Boolean, required: false },
    sustituibleTxt: { type: String, required: false },

    isInnovacion: { type: Boolean, required: false },
    innovacionTxt: { type: String, required: false },
    level: { type: Number, required: false },

    anio: { type: Number, required: false },
    destino: { type: String, required: false },
    capainstalada: { type: String, required: false },
    capautilizada: { type: String, required: false },

    competencia: { type: String, required: false },
    competenciaTxt: { type: String, required: false },
    competenciaOrigen: { type: String, required: false },

})


const censoMaquinariasSch = new Schema({
    type: { type: String, required: false },
    slug: { type: String, required: false },
    tactividad: { type: String, required: false },
    actividadId: { type: String, required: false },

    isImportada: { type: Boolean, required: false },
    origen: { type: String, required: false },
    parancelaria: { type: String, required: false },

    isExportable: { type: Boolean, required: false },
    exportableTxt: { type: String, required: false },

    isSustituible: { type: Boolean, required: false },
    sustituibleTxt: { type: String, required: false },

    isInnovacion: { type: Boolean, required: false },
    innovacionTxt: { type: String, required: false },
    level: { type: Number, required: false },

    anio: { type: Number, required: false },
    destino: { type: String, required: false },
    capainstalada: { type: String, required: false },
    capautilizada: { type: String, required: false },
    umecapacidad:  { type: String, required: false },


    competencia: { type: String, required: false },
    competenciaTxt: { type: String, required: false },
    competenciaOrigen: { type: String, required: false },

})
const censoPatentesSch = new Schema({
    type: { type: String, required: false },
    slug: { type: String, required: false },
    tactividad: { type: String, required: false },
    actividadId: { type: String, required: false },

    isImportada: { type: Boolean, required: false },
    origen: { type: String, required: false },
    otorgante: { type: String, required: false },

    isExportable: { type: Boolean, required: false },
    exportableTxt: { type: String, required: false },

    isSustituible: { type: Boolean, required: false },
    sustituibleTxt: { type: String, required: false },

    isInnovacion: { type: Boolean, required: false },
    innovacionTxt: { type: String, required: false },
    level: { type: Number, required: false },

    anio: { type: Number, required: false },
    destino: { type: String, required: false },
    capainstalada: { type: String, required: false },
    capautilizada: { type: String, required: false },

    competencia: { type: String, required: false },
    competenciaTxt: { type: String, required: false },
    competenciaOrigen: { type: String, required: false },

})


const nodoSeccionSch = new Schema({
    tipo:       { type: String, required: false },
    seccion:    { type: String, required: false },
    seccion_tx: { type: String, required: false },
    nivel:      { type: String, required: false },
    nivel_tx:   { type: String, required: false },
    codigo:     { type: String, required: false },
    qh:         { type: Number, required: false },
    qm:         { type: Number, required: false },
    qau:        { type: Number, required: false },
    
});

const crecimientoEmpleadosSch = new Schema({
    hasCrecimiento:      { type: Boolean, required: false},
    hasBrownEmplea:      { type: Boolean, required: false},
    hasDeseoBrownEmplea: { type: Boolean, required: false},
    
    qnuevos:         { type: Number,  required: false},
    qsecundarios:    { type: Number,  required: false},
    qterciarios:     { type: Number,  required: false},
    quniversitarios: { type: Number,  required: false},

    slug:            { type: String,  required: false},
})


const censoRecursosHumanosSch = new Schema({
    type: { type: String, required: false },
    slug: { type: String, required: false },

    qempleados:    { type: Number, required: false },
    qemplab:       { type: Number, required: false },
    qemplnoab:     { type: Number, required: false },

    competencia:  { type: String, required: false },
    competencias: [ String ],

    porNivelEducacion:   [ nodoSeccionSch ],
    porNivelJerarquico:  [ nodoSeccionSch ],

    crecimiento:   { type: crecimientoEmpleadosSch, required: false },    
});

const censoExpectativasSch = new Schema({
    type:             { type: String, required: false },
    slug:             { type: String, required: false },
	nactividad:       { type: String, required: false },
    tocupacion:       { type: Number, required: false }, 
    fplenaocupacion:  { type: String, required: false }, 
	nactividad_var:   { type: Number, required: false },
	qempleados_mod:   { type: String, required: false },
	qhorasprod_mod:   { type: String, required: false },
	capinstalada_mod: { type: String, required: false },
	vtaexter_mod:     { type: String, required: false },
	vtalocal_mod:     { type: String, required: false },
    factoresList:     [ String ],
    

    
    fortaleza1:    { type: String, required: false },
    fortaleza2:    { type: String, required: false },
    fortaleza3:    { type: String, required: false },
    debilidad1:    { type: String, required: false },
    debilidad2:    { type: String, required: false },
    debilidad3:    { type: String, required: false },
    oportunidad1:  { type: String, required: false },
    oportunidad2:  { type: String, required: false },
    oportunidad3:  { type: String, required: false },
    amenaza1:      { type: String, required: false },
    amenaza2:      { type: String, required: false },
    amenaza3:      { type: String, required: false },

});

const assetSch = new mongoose.Schema({
    entity: { type: String, required: false, default: "" },
    displayAs: { type: String, required: false, default: "" },
    predicate: { type: String, required: false, default: "" },
    slug: { type: String, required: false, default: "" },
    description: { type: String, required: false, default: "" },
    avatar: { type: Number, required: false, default: "" },
    entityId: { type: String, required: false, default: "" },

});

const mercadosOptList_old = [
	{val: 'brown',        isLocal: true,  label: 'Partido Almte Brown',  slug: 'Partido Almte Brown' },
	{val: 'pba',          isLocal: true,  label: 'Pcia de Buenos Aires', slug: 'Pcia de Buenos Aires' },
	{val: 'nacional',     isLocal: true,  label: 'Nacional',         slug: 'Nacional' },
	{val: 'brasil',       isLocal: false, label: 'Brasil',           slug: 'Brasil' },
	{val: 'mercosur',     isLocal: false, label: 'Mercosur',         slug: 'Mercosur' },
	{val: 'america',      isLocal: false, label: 'Región América',   slug: 'Región América' },
	{val: 'europa',       isLocal: false, label: 'EU',               slug: 'EU' },
	{val: 'resto',        isLocal: false, label: 'Otras regiones',   slug: 'Otras regiones' },
];

const mercadosOptList = [
	{val: 'brown',      isLocal: true,  label: 'Distrito Almte Brown',           slug: 'Partido Almte Brown' },
	{val: 'nacional',   isLocal: true,  label: 'Nacional (excluye Almte Brown)', slug: 'Nacional' },
	{val: 'brasil',     isLocal: false, label: 'Brasil',                         slug: 'Brasil' },
	{val: 'mercosur',   isLocal: false, label: 'Mercosur (excluye Brasil)',      slug: 'Mercosur' },
	{val: 'america',    isLocal: false, label: 'Resto América',                  slug: 'América' },
	{val: 'europa',     isLocal: false, label: 'Unión Europea',                  slug: 'Unión Europea' },
	{val: 'china',      isLocal: false, label: 'China',                          slug: 'China' },
	{val: 'asia',       isLocal: false, label: 'Resto de Asia',                  slug: 'Resto de Asia' },
	{val: 'resto',      isLocal: false, label: 'Otras regiones',                 slug: 'Otras regiones' },
]

const mercadoSch = new mongoose.Schema({
	target:         { type: String,  required: false},
	label:          { type: String,  required: false},
	isLocal:        { type: Boolean, required: false},
	propVentas:     { type: Number,  required: false},
	propCompras:    { type: Number,  required: false},
	montoVentas:    { type: Number,  required: false},
	montoCompras:   { type: Number,  required: false},
	slugCompras:    { type: String,  required: false},
	slugVentas:     { type: String,  required: false}
});

const censoComercializacionSch = new mongoose.Schema({
	type:                { type: String,  required: false },
	slug:                { type: String,  required: false },

    balanzaComMonto:     { type: Number,  required: false },
	balanzaComProp:      { type: Number,  required: false },
	balanzaImpProp:      { type: Number,  required: false },
	balanzaImpMonto:     { type: Number,  required: false },

    hasPlanAumentoExpo:  { type: Boolean, required: false },
    planAumentoExpo:     { type: String,  required: false },

    hasPlanPartFeriaInt: { type: Boolean, required: false },
	hasPlanPartFeriaLoc: { type: Boolean, required: false },
	hasPlanInvestigMerc: { type: Boolean, required: false },
	hasPlanRepresExt:    { type: Boolean, required: false },
	hasOtrosPlanes:      { type: Boolean, required: false },


    hasPlanSustImpo:     { type: Boolean, required: false },
	planSustImpo:        { type: String,  required: false },

    propComerPropia:     { type: Number,  required: false },
	propComerMayor:      { type: Number,  required: false },
	propComerMinor:      { type: Number,  required: false },
	propComerDigital:    { type: Number,  required: false },
	mercados:          [ mercadoSch ]
});

const factoresInversionSch = new mongoose.Schema({
	ftype:     { type: String,  required: false },
	flabel:    { type: String,  required: false },
	impacto:   { type: String,  required: false },
	alienta:   { type: Boolean, required: false },
	dificulta: { type: Boolean, required: false },
	slug:      { type: String,  required: false },
})

const censoInversionesSch = new mongoose.Schema({
    type:         { type: String,  required: false },
    stype:        { type: String,  required: false },
    slug:         { type: String,  required: false },
    hasRealizado: { type: Boolean, required: false },
    isPrevisto:   { type: Boolean, required: false },
    fuenteFinan:  { type: String,  required: false },
    factores:     [ factoresInversionSch ],


});
const censoFollowUpSch = new mongoose.Schema({
	isActive:      { type: Boolean, required: false },
	fe_inicio:     { type: String,  required: false },
	fets_inicio:   { type: Number,  required: false },
	slug:          { type: String,  required: false },
	isAsignado:    { type: Boolean, required: false },
	asignadoId:    { type: String,  required: false },
	asignadoSlug:  { type: String,  required: false },
})


/**************************/
/**   CENSO INDUSTRIAS  **/
/************************/
const censoindustriaSch = new Schema({
    compPrefix:   { type: String, required: false },
    compName:     { type: String, required: false },
    compNum:      { type: String, required: false },
    action:       { type: String, required: false },
    categoriaEmp: { type: String, required: false },
    rubroEmp:     { type: String, required: false },

    sector: { type: String, required: false },
    fecomp_txa: { type: String, required: false },
    fecomp_tsa: { type: Number, required: false },
    empresa: { type: empresaSch, required: false },
    responsable: { type: responsableSch, required: false },
    estado: { type: estadoCensoSch, required: false },
    censo: { type: censoDataSch, required: false },
    followUp: { type: censoFollowUpSch, required: false },
  
    actividades: [censoActividadSch],
    bienes:           [censoBienesSch],
    productos:        [censoProductosSch],
    maquinarias:      [censoMaquinariasSch],
    patentes:         [censoPatentesSch],
    rhumanos:         [censoRecursosHumanosSch],
    expectativas:     [censoExpectativasSch],
    comercializacion: [censoComercializacionSch],
    inversiones:      [censoInversionesSch],
    assets:           [assetSch],
});


censoindustriaSch.pre('save', function(next) {
    return next();
});


function buildQuery(query) {

    let q = {};

    if (query['empresaId']) {
        q['empresa.empresaId'] = query['empresaId'];
        return q;
    }

    // Rango de fecha
    if (query.fechaDesde && query.fechaHasta) {
        q['$and'] = [{ 'fecomp_tsa': { '$gte': parseInt(query.fechaDesde, 10), '$lt': parseInt(query.fechaHasta, 10) } }];
    }

    // Nivel de avance
    if (query.avance) {
        q['estado.navance'] = query.avance;
    }

    if (query['compPrefix']) {
        q["compPrefix"] = query['compPrefix'];
    }

    if (query['compName']) {
        q["compName"] = query['compName'];
    }

    if (query['compNum']) {
        q["compNum"] = query['compNum'];
    }

    if (query['search'] && query['search'] === "actual:censo") {
        q["empresa.empresaId"] = query['empresaId'];
        q["censo.codigo"] = query['codigo'];

    }


    return q;
}

/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Record = mongoose.model('Censoindustria', censoindustriaSch, 'censoindustrias');


/////////   CAPA DE SERVICIOS /////////////

/**
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */
exports.upsertNext = function(query, errcb, cb) {
    let regexQuery = buildQuery(query);

    Record.find(regexQuery).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] upsertNext ERROR: [%s]', whoami, err)
            errcb(err);

        } else {
            cb(entities);

        }
    });
};


/**
 * Retrieve all records
 * @param cb
 * @param errcb
 */
exports.findAll = function(errcb, cb) {
    Record.find().lean().exec(function(err, entities) {
        if (err) {
            errcb(err);
        } else {
            cb(entities);
        }
    });
};

/**
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */
exports.findByQuery = function(query, errcb, cb) {
    let regexQuery = buildQuery(query)
    console.dir(regexQuery);

    Record.find(regexQuery).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);
        } else {
            console.log('fetched: [%s]', entities && entities.length);
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
exports.findById = function(id, errcb, cb) {

    Record.findById(id, function(err, entity) {
        if (err) {
            console.log('[%s] findByID ERROR() argument [%s]', whoami, arguments.length);
            err.itsme = whoami;
            errcb(err);

        } else {
            cb(entity);
        }
    });

};


/**
 * Upddate a new record
 * @param id
 * @param record
 * @param cb
 * @param errcb
 */
exports.update = function(id, record, errcb, cb) {

    Record.findByIdAndUpdate(id, record, { new: true }, function(err, entity) {
        if (err) {
            console.log('[%s] validation error as validate() argument [%s]', whoami)
            err.itsme = whoami;
            errcb(err);

        } else {
            cb(entity);
        }
    });

};

/**
 * Sign up a new record
 * @param record
 * @param cb
 * @param errcb
 */
exports.create = function(record, errcb, cb) {
    delete record._id;
    console.dir(record)

    Record.create(record, function(err, entity) {
        if (err) {
            console.log('[%s] validation error as validate() argument ', whoami);
            err.itsme = whoami;
            errcb(err);

        } else {
            cb(entity);
        }
    });

};

exports.exportarMovimientos = function(query, req, res) {
    fetchMovimientos(query, req, res);
}

function fetchMovimientos(query, req, res) {
    const regexQuery = buildQuery(query);

    console.log('fetchMovimientos regexQuery -> %o', regexQuery);

    Record.find(regexQuery).lean().exec(function(error, results) {
        if (error) {
            console.log(error);
        } else {
            if (results && results.length) {
                dispatchExcelStream(results, query, req, res);
            }
        }
    })
}

function dispatchExcelStream(results, query, req, res) {
    buildExcelStream(results, query, req, res);
}

function buildExcelStream(censos, query, req, res) {
    let today = Date.now();
    let filename = 'censosindustriales_' + today + '.xlsx'

    res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="' + filename + '"',
        'Transfer-Encoding': 'chunked',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res })
    var worksheet = workbook.addWorksheet('censosIndustriales')

    worksheet.addRow(['Censos Industriales']).commit()
    worksheet.addRow(['Fecha de emisión', utils.dateToStr(new Date())]).commit()
    worksheet.addRow().commit()
    worksheet.addRow(['Fecha Alta', 'Avance', 'Empresa']).commit();

    censos.forEach((row, index) => {
        const fechaAlta = row.fecomp_txa;
        const avance = row.estado.navance;
        const empresa = row.empresa.slug;

        let censoArray = [fechaAlta, avance, empresa];

        worksheet.addRow([...censoArray]).commit()
    })

    worksheet.commit()
    workbook.commit()
}