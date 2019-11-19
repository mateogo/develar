/**
 * Product: producto (insumo, r esultado, objetivo, etc.)
 */

const whoami =  "models/productModel: ";

const mongoose = require('mongoose');

const { URL } = require('url');
const path = require('path');
const config = require('../config/config');

// necesarios para el proceso de importación
const fs = require('fs');
const xml2js = require('xml2js');
const utils = require('../services/commons.utils');




const Schema = mongoose.Schema;


const self = this;

 

/**
 * Creación de un Schema
 * @params
 *  productId:      link lógico, unívoco dentro de develar, nombre del archivo
 *  path:         link físico, URL del product
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

const assetInProductSch = new Schema({
    id:   String,
    path: String,
    slug: String,
    mimetype: String
});

const productSch = new Schema({
  code:        { type: String, required: true },
  name:        { type: String, required: true },
  slug:        { type: String, required: false },
  description: { type: String, required: false },
  estado:      { type: String, required: true },
  perms:       { owner: [String], persons: [String], other: [String] },

  pclass:      { type: String, required: true },
  ptype:       { type: String, required: false },
  pbrand:      { type: String, required: false },
  pmodel:      { type: String, required: false },
  
  pinventory:  { type: String, required: false },
  pume:        { type: String, required: false },
  pformula:    { type: String, required: false },


  user:        {type: String, required: false},
  userId:      {type: String, required: false},
  parents:     [String],
  persons:     [String],

  tokens:      [String],
  tagstr:       String,
  taglist:     [String],
  assets:    [assetInProductSch]

});

function buildQuery(query){
    let q = {};

    if(query.name){
        q["name"] = {"$regex": query.name, "$options": "i"};
    }

    if(query.slug){
        q["slug"] = {"$regex": query.slug, "$options": "i"};
    }

    return q;
}




productSch.pre('save', function (next) {
    return next();
});


/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Record = mongoose.model('Product', productSch, 'products');



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
    let regexQuery = buildQuery(query);


    Record.find(regexQuery).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
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


/**
 * Upddate a new record
 * @param id
 * @param record
 * @param cb
 * @param errcb
 */
exports.update = function (id, record, errcb, cb) {

    Record.findByIdAndUpdate(id, record, { new: true } ,function(err, entity) {
        if (err){
            console.log('[%s] validation error as validate() argument', whoami)
            err.itsme = whoami;
            errcb(err);
        
        }else{
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

const buildCoreData = function(producto, token){
  let pclass = "alimentos"
    if(token.categoria === "Alimentaria"){
      pclass = "alimentos";

    } else if(token.categoria === "Habitacional"){
      pclass = "habitacional";

    } else if(token.categoria === "Sanitaria"){
      pclass = "sanitaria";

    }

    producto.code = token.id;
    producto.name = token.nombre;
    producto.slug = token.nombre;
    producto.description = token.nombre;
    producto.estado = 'activo';
    producto.pclass = pclass;
    producto.ptype = 'general';
    producto.pbrand = '';
    producto.pmodel = 'migrado';
    producto.pinventory = '';
    producto.pume = 'unidad';
    producto.pformula = 'unidad';
    producto.user = 'Migracion';
    producto.userId = '';
    producto.parents = [];
    producto.persons = [];
    producto.tokens = [];
    producto.tagstr = '';
    producto.taglist = [];
    producto.assets = [];
}

/*

        <!-- Tabla producto -->
        <table name="producto">
            <column name="id">1</column>
            <column name="nombre">azucar</column>
            <column name="unidad">NULL</column>
            <column name="categoria">Alimentaria</column>
            <column name="requisitos"></column>
            <column name="timestamp">2012-02-29 18:53:57</column>
        </table>

const productSch = new Schema({
  code:        { type: String, required: true },
  name:        { type: String, required: true },
  slug:        { type: String, required: false },
  description: { type: String, required: false },
  estado:      { type: String, required: true },
  perms:       { owner: [String], persons: [String], other: [String] },

  pclass:      { type: String, required: true },
  ptype:       { type: String, required: false },
  pbrand:      { type: String, required: false },
  pmodel:      { type: String, required: false },
  
  pinventory:  { type: String, required: false },
  pume:        { type: String, required: false },
  pformula:    { type: String, required: false },


  user:        {type: String, required: false},
  userId:      {type: String, required: false},
  parents:     [String],
  persons:     [String],

  tokens:      [String],
  tagstr:       String,
  taglist:     [String],
  assets:    [assetInProductSch]

});




*/



async function saveRecord(product, master){
    if(master[product.idbrown]){
        product._id = master[product.idbrown];
        await Record.findByIdAndUpdate(product._id, product, { new: true }).exec();

    }else{
        if(product.idbrown){
            master[product.idbrown] = product._id;
        }
        await product.save();
    }

}


const insertImportedProduct = function(token, master){
    let product = new Record();
    buildCoreData(product, token);

    saveRecord(product, master);
}


const processOneProduct = function(token, master){
    let data = token.column,
        product = {};

    data.forEach((el,index)=>{
        if(!product[el.$.name]){
            product[el.$.name] = el._;
        }else{
            product[el.$.name + index] = el._;
        }
    });
    //console.dir(product);
    //console.log('---------------------------');

    insertImportedProduct(product, master);


}



const processImportedProducts = function(data, errcb, cb){
    let table = data.database.table;
    const productMaster = {};

    table.forEach((token, index) => {
        processOneProduct(token, productMaster);

    });




}


const procesProductMigration = function(req, errcb, cb){
    console.log('******  processARCHIVE to BEGIN ********')
    //const arch = path.join(config.rootPath, 'public/migracion/productos/producto.xml');

    const arch = path.join(config.rootPath, 'www/dsocial/migracion/productos/producto.xml');

    function toLowerCase(name){
        return name.toLowerCase();
    }

    function toUpperCase(name){
        return name.toUpperCase();
    }


    let parser = new xml2js.Parser();

    console.log('Ready to begin PROCESS: [%s]', arch);
    fs.readFile(arch, function( err, data){
        if(err){
            console.dir(err);

        }else{
            parser.parseString(data, 

            function(err, jdata){
                if(err){
                    console.log('error*************')
                    console.dir(err);

                }else{
                    console.log('Parser OK');
                    //console.dir(jdata);
                    cb({result: "ok"})
                    processImportedProducts(jdata, errcb, cb);
                }
            });
        }
    });


}
//http://localhost:8080/api/products/migracionproductos


exports.buildInvertedTree = function(){
    let promise = new Promise((resolve, reject)=> {
        Record.find(null, '_id name code pume ').lean().then(productos => {
            let master = {};
            productos.forEach(p => {
                if(p.code){
                    master[p.code] = {
                        _id: p._id,
                        code: p.code,
                        name: p.name,
                        pume: p.pume
                    }
                }

            })
            resolve(master);

        })


    });



    return promise;
}

exports.buildIdTree = function(){
    let promise = new Promise((resolve, reject)=> {
        Record.find(null, '_id code name pclass pume').lean().then(productos => {
            let master = {};
            productos.forEach(p => {
                master[p._id] = {
                    _id: p._id,
                    code: p.code,
                    name: p.name,
                    pclass: p.pclass,
                    pume: p.pume,
                }

            })
            resolve(master);

        })
    });
    return promise;
}


exports.migracionproductos = function(req, errcb, cb) {
  let fe = new Date();
  procesProductMigration(fe, errcb, cb);

}


