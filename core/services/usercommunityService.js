/**
 * User model
 */
/**
 * Load module dependencies
 */
const whoami =  "service/usercommunityService: ";

const mongoose = require('mongoose');

/**
 * Creación de un Schema
 */
const usercomSch = new mongoose.Schema({
		communityId:    { type: String, required: true },
		userId:         { type: String, required: true },
		isOwner:        { type: Boolean, required: false },
		roles:          { type: Array, required: true },

        code:           { type: String, required: false },
        displayAs:      { type: String, required: false },
        slug:           { type: String, required: false },
        urlpath:        { type: String, required: true },
        name:           { type: String, required: false },
        eclass:         { type: String, required: false },
        etype:          { type: String, required: false },

		invMode:        { type: String, required: false },
		fealta:         { type: Date, default: Date.now },
		feacep:         { type: Date, default: Date.now },
		estado:         { type: String, required: true },
  })

usercomSch.pre('save', function (next) {
    return next();
});



// Define user mongoose model
/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Record = mongoose.model('Usercomm', usercomSch, 'usercommrels');




function buildQuery(query){
    let q = {};

    if(query['slug']){
      q["slug"] = {"$regex": query.slug, "$options": "i"};
    }

    if(query['userId']){
      q["userId"] = query['userId'];
    }


    return q;
}


function pkQuery(data){
    let query = {};

    query["userId"] = data['userId'];
    query["communityId"] = data['communityId'];

    return query;
}




/////////   CAPA DE SERVICIOS /////////////
/**
 * Retrieve all records
 * @param errcb
 * @param cb
 */
exports.findAll = function (errcb, cb) {
    Record.find(function(err, entities) {
        if (err) {
            errcb(err);
        }else{
            cb(entities);
        }
    });
};

/**
 * Retrieve records from query /search/?name=something
 * @param query
 * @param errcb
 * @param cb
 */
exports.findByQuery = function (query, errcb, cb) {
    let regexQuery = buildQuery(query);

    Record.find(regexQuery, function(err, entities) {
        if (err) {
            console.log('findByQuery ERROR')
            errcb(err);
        }else{
            cb(entities);
        }
    });
};


/**
 * find by ID
 * @param id
 * @param errcb
 * @param cb
 */
exports.findById = function (id, errcb, cb) {

    Record.findById(id, function(err, entity) {
        if (err){
            console.log('findByID ERROR() argument [%s]', arguments.length);
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
            console.log('validation error as validate() argument ')
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};


/**
 * Create a new record
 * @param record
 * @param errcb
 * @param cb
 */
exports.create = function (record, errcb, cb) {
    delete record._id;

    Record.create(record, function(err, entity) {
        if (err){
            console.log('validation error as validate() argument ')
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};



const updateRelation = function (record, cb) {
    let err = null;
    let query = pkQuery(record);

    let token = Record.findOne(query)
    token.then(entry => {
    	if(entry){
		    let update = Record.findByIdAndUpdate(entry._id, record)
		    update.then(entity => {
                if(cb) cb(err, entity);
		    })

    	}else{
		    let create = Record.create(record)
		    create.then(entity => {
                if(cb) cb(err, entity);
		    })
    	}
    })
};

// owner|admin|manager|user|public|
exports.updateFromCommunity = function(community, cb){
    if(!community || !community.userId || !community._id){
        let err = {message: 'registro community nulo'}
        cb(err, null);
        return;
    }

    let today = new Date();
    let token = {
        communityId:    community._id,
        userId:         community.userId,
        isOwner:        true,
        roles:          ['owner'],
        invMode:        'creator',
        fealta:         today,
        feacep:         today,
        estado:         'activo',
        code:           community.code,
        displayAs:      community.displayAs,
        slug:           community.slug,
        urlpath:        community.urlpath,
        name:           community.name,
        eclass:         community.eclass,
        etype:          community.etype
    }

    updateRelation(token, cb)
}

// owner|admin|manager|user|public|
exports.updateUserRelation = function(relation, cb){

    let today = new Date();
    relation.fealta = today;
    relation.feacep = today;

    updateRelation(relation, cb)
}

