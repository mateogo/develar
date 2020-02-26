/**
 * Ficha unitaria
 */
/**
 * Módulo Documentación y Presentaciones
 */

const whoami =  "models/recordcardModel: ";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const utils = require('../services/commons.utils');
const tagModel = require('./tagModel');

const self = this;

 

/**
 * Creación de un Schema
 */


const publicationSch = new Schema( {
    toPublish: { type: Boolean, required: false},
    scope:     { type: String, required: false},
    publishOrder: {type: String, required: false},
    dateFrom:  { type: Number, required: false},
    dateTo:    { type: Number, required: false},
    topics:    { type: Array, required: false},
    template:  { type: String, required: false},
    destaque:  { type: String, required: false},
    slug:      { type: String, required: false},
});

const cardgraphSch = new Schema({
    displayAs:   { type: String, required: false },
    slug:        { type: String, required: false },
    predicate:   { type: String, required: false },
    avatar:      { type: String, required: false },
    description: { type: String, required: false },
    entityId:    { type: String, required: false },
    entity:      { type: String, required: false }

});

const subrecordSch = new Schema({
    cardId:       { type: String, required: false },
    topic:        { type: String, required: false },
    slug:         { type: String, required: true  },
    subtitle:     { type: String, required: false },
    excerpt:      { type: String, required: false },
    linkTo:       { type: String, required: false },
    description:  { type: String, required: false },
    mainimage:    { type: String, required: false },
    imagecredit:  { type: String, required: false },
    cardType:     { type: String, required: false },
    cardCategory: { type: String, required: false },
    images:       { type: Array,  required: false },
    viewimages:   [cardgraphSch],
    userId:       { type: String, required: false },
    user:         { type: String, required: false },

});

const productgraphSch = new Schema({
    displayAs:   { type: String, required: false },
    slug:        { type: String, required: false },
    predicate:   { type: String, required: false },
    avatar:      { type: String, required: false },
    description: { type: String, required: false },
    entityId:    { type: String, required: false },
    entity:      { type: String, required: false },

    qt:          { type:  Number, required: false },
    ume:         { type:  String, required: false },
    freq:        { type:  Number, required: false },
    fume:        { type:  String, required: false },
    pu:          { type:  Number, required: false },
    fenec:       { type:  Date,   required: false },
    fenectx:     { type:  String, required: false },
    moneda:      { type:  String, required: false },
    countries:   { type:  Array,  required: false },
    stages:      { type:  Array,  required: false },
    milestoneId: { type:  String, required: false },
    goals:       { type:  Array,  required: false }

});




const recordSch = new Schema({
    cardId:       { type: String, required: false },
    topic:        { type: String, required: false },
    slug:         { type: String, required: true  },
    subtitle:     { type: String, required: false },
    excerpt:      { type: String, required: false },
    linkTo:       { type: String, required: false },
    publishDateTx:{ type: String, required: false },
    publishDate:  { type: String, required: false },

    description:  { type: String, required: false },
    mainimage:    { type: String, required: false },
    imagecredit:  { type: String, required: false },
    cardType:     { type: String, required: false },
    cardCategory: { type: String, required: false },
    images:       { type: Array,  required: false },
    parent:       { type: String, required: false },
    parents:      { type: Array,  required: false },
    userId:       { type: String, required: false },
    user:         { type: String, required: false },
    taglist:      { type: Array,  required: false },
    communitylist: { type: Array,  required: false },
    relatedcards: [subrecordSch],
    persons:      [cardgraphSch],
    resources:    [cardgraphSch],
    assets:       [cardgraphSch],
    viewimages:   [cardgraphSch],
    products:     [productgraphSch],
    publish:      { type: publicationSch, required: false}
});

recordSch.pre('save', function (next) {
    return next();
});

/********  PROMOTE CARD   *******/
function initNewPromotedCard(smodel){
    smodel.relatedcards = [];
    smodel.parents = [smodel.parent];
    return smodel;
}
function updatePromotedParents(model){
    if(!model.parent) return;
    if(!model.parents){
        model.parents = [model.parent];

    }else{
        if(model.parents.indexOf(model.parent) === -1){
            model.parents.push(model.parent);
        }
    }
}

/*******************************/
//  Actualiza relación FICHA-COMUNIDAD
/*******************************/
function updateTags(model){
    if(model.taglist && model.taglist.length){
        tagModel.tagRelationFrom('fichas', 'tag', model);
    }
}


function updatePromotedCard(card, subcard){
    card.cardId       = subcard.cardId;
    card.topic        = subcard.topic;
    card.slug         = subcard.slug;
    card.subtitle     = subcard.subtitle;
    card.excerpt      = subcard.excerpt;
    card.linkTo       = subcard.linkTo;
    card.description  = subcard.description;
    card.mainimage    = subcard.mainimage;
    card.imagecredit  = subcard.imagecredit;
    card.cardType     = subcard.cardType;
    card.cardCategory = subcard.cardCategory;
    card.images       = subcard.images;
    card.viewimages   = subcard.viewimages;
    card.parent       = subcard.parent;
    card.user         = subcard.user;
    card.userId       = subcard.userId;
    card.communitylist  = subcard.communitylist;
    card
    updatePromotedParents(card);
    return card;
}
/******** END PROMOTE CARD   *******/


/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Record = mongoose.model('Ficha', recordSch, 'fichas');



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

function buildQuery(query, user){
    let q = {};


    if(user && user.communityId){
        q["communitylist"] = user.communityId;
    }

    if(query.slug){
        q["slug"] = {"$regex": query.slug, "$options": "i"};
    }

    if(query["cardType"] && query["cardType"] !== 'no_definido'){
        q["cardType"] = query["cardType"] ;
    }

    if(query["cardCategory"] && query["cardCategory"] !== 'no_definido'){
        q["cardCategory"] = query["cardCategory"];
    }

    if(query["taglist"]){
        let tagl = query["taglist"].split(',');
        q["taglist"] = { $all: tagl};
    }

    if(query["communitylist"]){
        let communities = query["communitylist"].split(',');
        q["communitylist"] = communities;
    }

    if(query["communityId"]){
        q["communitylist"] = query["communityId"];
    }

    if(query["gtid"]){
        let token = query["gtid"];
        q["cardId"] = { $gt: token};
    }
        
    if(query["ltid"]){
        let token = query["ltid"];
        q["cardId"] = { $lt: token};
    }


    if(query['publish']){
        let actual = Date.now();

        if(query['publish.tag']){
            q["publish.topics"] = query['publish.tag'];
        }

        if(query['publish.topics']){
            q["publish.topics"] = query['publish.topics'];
        }

        if(query['publish.publishOrder']){
            q["publish.topics"] = query['publish.topics'];
        }

        if(query['publish.template']){
            q["publish.template"] = query['publish.template'];
        }

        if(query['publish.destaque']){
            q["publish.destaque"] = query['publish.destaque'];
        }

        q["publish.toPublish"] = true;
        q["publish.dateFrom"] = {$lte: actual};
        q["publish.dateTo"] = {$gte: actual};

    }
        
        
    return q;
}

function initNewRecordcard(token, person){
    let dateFrom = Date.now();
    let dateTo = utils.parseDateStr('31/12/2019');

    let recordcard = new Record({

        cardId: 'Bio-Principal',
        topic: token.topic,
        slug: token.slug,
        subtitle: token.subtitle,
        excerpt: token.excerpt,
        linkTo: '',
        description: '',
        mainimage: '',
        imagecredit: '',
        cardType: token.cardType,
        cardCategory: token.cardCategory,
        images: [],
        parent: '',
        parents: [],

        //
        userId: person.user.userId,
        user: person.user.username,
        taglist: [],
        communitylist: [person.communitylist[0]],
        relatedcards: [],
        persons: [
            {
                displayAs:   person.displayName,
                slug:        person.ambito,
                predicate:   'fichacv',
                avatar:      '',
                description: person.especialidad,
                entityId:    person._id,
                entity:      'person'
            }
        ],
        resources: [],
        assets: [],
        viewimages: [],
        products: [],
        publish: {
            toPublish: true,
            scope:     'publico',
            publishOrder: '',
            dateFrom:  dateFrom,
            dateTo:    dateTo,
            topics:    ['portfolio'],
            template:  'portfolio',
            destaque:  '',
            slug:      'Publicación automática',


        }
    });
    return recordcard;
}

exports.createRecordCardFromPerson = function(token, person, cb){
    console.log('createRecordcardFromPerson INIT')
    const recordcard = initNewRecordcard(token, person);
    recordcard.save(err => {
        if(err){
            console.log('[%s] error al crear RecordCardFromPerson', whoami);
            cb(err, null);
        }else {
            cb(null, recordcard);
        }

    });
}

/**
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */
exports.findByQuery = function (req, errcb, cb) {
    let query = req.query;
    let user = req.user;

    let regexQuery = buildQuery(query, user);

    Record.find(regexQuery).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', err)
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
exports.fetchNext = function (req, errcb, cb) {
    let query = req.query;
    let user = req.user;
    let nquery = buildQuery(query, user);
    let order;

    if(query['sort']){
        order = query['sort']

        Record.find(nquery)
        .sort({'cardId': order})
        .limit(10)
        .select(query['select'])
        .exec((err, entities) => {
            if(err){
                console.log('[%s] fetch Next ERROR: [%s]', err)
                errcb(err);
            }else{
                cb(entities)
            }
        })


    }else {
        Record.find(nquery)
        .limit(10)
        .select(query['select'])
        .exec((err, entities) => {
            if(err){
                console.log('[%s] fetch Next ERROR: [%s]', err)
                errcb(err);
            }else{
                cb(entities)
            }
        });
    }
}



/**
 * find by ID
 * @param id
 * @param cb
 * @param errcb
 */
exports.findById = function (id, errcb, cb) {

    Record.findById(id, function(err, entity) {
        if (err){
            err.itsme = 'yew i caughtit TOO';
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};


/**
 * Promote SubCard as Card
 * @param id
 * @param record
 * @param cb
 * @param errcb
 */
exports.promote = function (id, record, errcb, cb) {
    self.findById(id, function(err){
        record = initNewPromotedCard(record)

        self.create(record, function(err){
            errcb(err);

        }, function(entity){
            cb(entity);

        })


    }, function(entity){
        if(!entity){
            record = initNewPromotedCard(record)
            self.create(record, function(err){
                errcb(err);

            }, function(entity){
                cb(entity);

            })

        }else{
            entity = updatePromotedCard(entity, record);
            self.update(id, entity, function(err){
                errcb(err);

            }, function(entity){
                cb(entity);

            })
        }



    })
};


/**
 * Upddate a new record
 * @param id
 * @param record
 * @param cb
 * @param errcb
 */
exports.update = function (id, record, errcb, cb) {

    Record.findByIdAndUpdate(id, record,  { new: true }, function(err, entity) {
        if (err){
            console.log('validation error as validate() argument [%s]')
            err.itsme = 'yew i caughtit TOO';
            errcb(err);
        
        }else{
            updateTags(entity);
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
            console.log('validation error as validate() argument [%s]')
            err.itsme = 'yew i caughtit TOO';
            errcb(err);
        
        }else{
            updateTags(entity);
            cb(entity);
        }
    });

};

