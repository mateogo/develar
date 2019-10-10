/**
 * Tag: recurso digital de cuerpo presente
 */

const whoami =  "models/tagModel: ";

const mongoose = require('mongoose');

const { URL } = require('url');
const path = require('path');
const config = require('../config/config');

const Schema = mongoose.Schema;


const self = this;

 

/**
 * Creación de un Schema
 * @params
 *  name:         nombre del tag
 *  slug:         descripción corta
 *  parentCol:    
 *  parentId:    
 *  parentSlug:  
 *  parentType:  
 *  parentStype: 
 *  userId:      



 */


const tagSch = new Schema({
  name:        { type: String, required: true  },
  slug:        { type: String, required: false },
  type:        { type: String, required: false },
  parentCol:   { type: String, required: false },
  parentId:    { type: Schema.Types.ObjectId, required: false} ,
  parentSlug:  { type: String, required: false },
  parentType:  { type: String, required: false },
  parentStype: { type: String, required: false },
  userId:        {type: String, required: false}, 

});

tagSch.pre('save', function (next) {
    return next();
});


/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Record = mongoose.model('Tag', tagSch, 'tags');



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


function buildQuery(query){
    let q = {};

    if(query.name){
        q["name"] = {"$regex": query.name, "$options": "i"};
    }

    if(query["parentCol"]){
        q["parentCol"] = query["parentCol"];
    }
        
    if(query["parentType"]){
        q["parentType"] = query["parentType"];
    }

    if(query["parentStype"]){
        q["parentStype"] = query["parentStype"];
    }

    return q;
}


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
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */
exports.searchUnique = function (query, errcb, cb) {
    let regexQuery = buildQuery(query);

    Record.aggregate([
        { $match: regexQuery },
        { $group: {
            _id: "$name", count: { $sum: 1 }
        }}

        ]).then(records => {
            cb(records);
        })
};



/******
db.tags.aggregate([
{$match: {parentType: 'propuesta'}},
{$group: {_id: "$name", count:{$sum:1}}}
])
*****/


/**
 * find by ID
 * @param id
 * @param cb
 * @param errcb
 */
exports.findById = function (id, errcb, cb) {

    Record.findById(id, function(err, entity) {
        if (err){
            console.log('[%s] findByID ERROR() argument [%s]',whoami, arguments.length);
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
            console.log('[%s] validation error as validate() argument ',whoami);
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
            console.log('[%s]validation error as validate() argument ',whoami);
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};


const updateTagRecord = function(tag, record, token){
    //record.name = tag
    //record.parentCol = token.col;
    //record.parentId = token.id;

    record.type = token.tagType
    record.slug = tag;
    record.parentSlug = token.slug;
    record.parentType = token.type;
    record.parentStype = token.stype;
    record.userId = token.userId;

    let update = Record.findByIdAndUpdate(record._id, record)
    update.then(record => {
        //console.log('[%s] record Updated: [%s]', whoami, record.name)
    })
}

const createTagRecord = function(tag, token){
    let record = {};
    record.name = tag;
    record.type = token.tagType;
    record.parentId = token.id;
    record.parentCol = token.col;
 
    record.slug = tag;
    record.parentSlug = token.slug;
    record.parentType = token.type;
    record.parentStype = token.stype;
    record.userId = token.userId;
    let create = Record.create(record)
    create.then(record => {
        //console.log('[%s]record Created: [%s]',whoami, record.name)
    })
}
const deleteTagRecord = function(record){
    let q = Record.findOneAndRemove({_id: record._id}).exec()

}

const isTagMember = function(tag, taglist){
    let index = taglist.indexOf(tag);
    if(taglist.indexOf(tag) !== -1){
        taglist.splice(index, 1);
        return true;
    }else{
        return false;
    }
}

const createNewTagRecords = function(taglist, token ){

    token.taglist.forEach(tag => {
        createTagRecord(tag, token);
    })    
}

const tagUpdate = function(token){
    let query = {
        parentCol: token.col,
        parentId: token.id
    }
    let taglist = token.taglist;

    let fetchTags = Record.find(query);
    fetchTags.then(records => {
        if(records && records.length){

            records.forEach(doc =>{
                if(isTagMember(doc.name, taglist)){
                    updateTagRecord(doc.name, doc, token);
                }else{
                    deleteTagRecord(doc);
                }
            })
        }
        createNewTagRecords(taglist, token)
    })
}

function buildRelationFromCommunity(parent, type, record){
    let token = {
        taglist: record.taglist.slice(0),
        tagType: type,
        id:      record._id,
        col:     parent,
        slug:    record.slug,
        type:    record.eclass,
        stype:   record.etype,
        userId:  record.userId
    }
    return token;
}

function buildRelationFromRecordcard(parent, type, record){
    let token = {
        taglist: record.taglist.slice(0),
        tagType: type,
        id:      record._id,
        col:     parent,
        slug:    record.slug,
        type:    record.cardType,
        stype:   record.cardCategory,
        userId:  record.userId
    }
    return token;
}


/**
 * Base de tags
 * @params
 *  parent: entidad-parent desde donde se menciona el tag: recordcard|community|etc.
 *  type:   
 *  record:    
 */

exports.tagRelationFrom = function(parent, type, record){
    let token;

    if(parent === 'community')  token = buildRelationFromCommunity(parent, type, record);
    if(parent === 'fichas')     token = buildRelationFromRecordcard(parent, type, record);

    if(token){
        tagUpdate(token);
    }
}

