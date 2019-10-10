/**
 * Asset: recurso digital de cuerpo presente
 */

const whoami =  "models/assetModel: ";

var mongoose = require('mongoose');

const { URL } = require('url');
const path = require('path');
const config = require('../config/config');

const storageDir = config.storagePath;




const self = this;

 

/**
 * Creación de un Schema
 * @params
 *  assetId:      link lógico, unívoco dentro de develar, nombre del archivo
 *  path:         link físico, URL del asset
 *  filename:     nombre del objeto, tal como quedó luego de subido al server
 *  slug:         descripción corta
 *  description:  descripción/ comentario/ anotciones del recurso
 *
 *  server:       server
 *  originalname: nombre original
 *  encoding:     encoding
 *  mimetype:     es el mimeType
 *  size:         tamaño
 */


var filedataSch = new mongoose.Schema({
    filename:     {type: String, required: false},
    path:         {type: String, required: false},
    originalname: {type: String, required: false},
    encoding:     {type: String, required: false},
    mimetype:     {type: String, required: false},
    size:         {type: String, required: false},
    destination:  {type: String, required: false},
    upload:       {type: Date, required: false },
    uploadtime:   {type: Number, required: false }

})


var assetSch = new mongoose.Schema({
    assetId:      { type: String,  required: true  },
    isUploaded:   { type: Boolean, required: true  },
    filename:     { type: String,  required: false },
    path:         { type: String,  required: true  },
    slug:         { type: String,  required: false },
    description:  { type: String,  required: false },
    server:       { type: String,  required: false },
    originalname: { type: String,  required: false },
    encoding:     { type: String,  required: false },
    mimetype:     { type: String,  required: false },
    size:         { type: String,  required: false },
    estado:       { type: String,  required: false },
    avance:       { type: String,  required: false },
    tagstr:       { type: String,  required: false },
    taglist:      { type: Array,   required: false },
    scope:        { type: Array,   required: false },
    upload:       { type: Date,    required: false },
    files:        [filedataSch], 
});

assetSch.pre('save', function (next) {
    return next();
});


/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
var Record = mongoose.model('Asset', assetSch, 'assets');



/////////   CAPA DE SERVICIOS /////////////
/**
 * Retrieve all records
 * @param cb
 * @param errcb
 */
exports.findAll = function (errcb, cb) {
    Record.find().lean().exec(function(err, entities) {
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
    let regexQuery = {"slug": {"$regex": query.slug, "$options": "i"} };
    Record.find(regexQuery).lean().exec(function(err, entities) {
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
exports.findPathById = function (id, errcb, cb) {

    Record.findById(id, function(err, entity) {
        if (err){
            console.log('[%s] findPathByID ERROR() argument [%s]',whoami, arguments.length);
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity.path);
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
            console.log('[%s]findByID ERROR() argument [%s]', whoami, arguments.length);
            err.itsme = whoami;
            errcb(err);
        
        }else{
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
exports.update = function (id, record, errcb, cb) {
    Record.findByIdAndUpdate(id, record, function(err, entity) {
        if (err){
            console.log('[%s] validation error as validate() argument ')
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};


exports.createAssetFromUpload = function(file, errcb, cb){
    let record = {
        assetId: file.originalname,
        path: file.path,
        isUploaded: true,

        slug: file.originalname,
        filename: file.filename,
        description: '',
        server: 'develar',
    
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        size: file.size,
        upload: file.upload,
        files: [file]
    }

    Record.create(record, function(err, entity) {
        if (err){
            console.log('[%s]createFromUpload result ', whoami)
            err.itsme = whoami + 'asset.createAssetFromUpload: Error';
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

}

/**
 * Sign up a new record
 * @param record
 * @param cb
 * @param errcb
 */
exports.create = function (record, errcb, cb) {
    delete record._id;

    Record.create(record, function(err, entity) {
        if (err){
            console.log('[%s] validation error as validate() argument ', whoami)
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};
