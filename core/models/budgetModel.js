/**
 * Proyectos Culturales o Eventos culturales CCK
 */

const whoami =  "models/budgetModel: ";

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const self = this;

const budgetItemSch = new Schema({
  productId:   { type: String, required: false },
  productSlug: { type: String, required: false },
  slug:        { type: String, required: false },

  currency:    { type: String, required: true },
  fume:        { type: String, required: true },
  qume:        { type: String, required: true },

  freq:        { type: Number, required: true },
  qty:         { type: Number, required: true },
  importe:     { type: Number, required: true },

  itemCost:    { type: Number, required: true },
  itemARSCost: { type: Number, required: true },
  changeRate:  { type: Number, required: true },
  feRate:      { type: String, required: true },

});

const pculturalItemSch = new Schema({
  pculturalId: { type: String, required: true  },
  slug:        { type: String, required: false },
  programa:    { type: String, required: false },
  sede:        { type: String, required: false },
  locacion:    { type: String, required: false },
});




const budgetSch = new Schema({

    compPrefix:   { type: String, required: true  },
    compName:     { type: String, required: true  },
    compNum:      { type: String, required: true  },

    type:         { type: String, required: true  },
    stype:        { type: String, required: true  },
    sector:       { type: String, required: true  },
    programa:     { type: String, required: false },
    sede:         { type: String, required: false },
    locacion:     { type: String, required: false },

    currency:     { type: String, required: false },
    
    e_currency:   { type: String, required: false },
    e_cost:       { type: Number, required: false },
    e_ARSCost:    { type: Number, required: false },
    e_changeRate: { type: Number, required: false },
    e_feRate:     { type: String, required: false },

    items:        [ budgetItemSch ],
    pculturals:   [ pculturalItemSch ],

    slug:         { type: String, required: false },
    description:  { type: String, required: false },

    estado:       { type: String, required: false },
    avance:       { type: String, required: false },
    aprobado:     { type: String, required: false },

    fecomp:       { type: String, required: false },
    fecomp_ts:    { type: Number, required: false },

    fe_req:       { type: String, required: false },
    fe_req_ts:    { type: Number, required: false },

    observacion:  { type: String, required: false },


})




budgetSch.pre('save', function (next) {
    return next();
});


function buildQuery(query){

  let q = {};
  if(query['estado']){
      q["estado"] = query['estado'];
  }

  if(query['avance']){
      q["avance"] = query['avance'];
  }


  if(query['compPrefix']){
      q["compPrefix"] = query['compPrefix'];
  }

  if(query['compName']){
      q["compName"] = query['compName'];
  }

  if(query['idPerson']){
      q["idPerson"] = query['idPerson'];
  }

  if(query['compNum']){
      q["compNum"] = query['compNum'];
  }


  if(query['sector']){
      q["sector"] = query['sector'];
  }

  if(query['type']){
      q["type"] = query['type'];
  }

  if(query['stype']){
      q["stype"] = query['stype'];
  }

  if(query['programa']){
      q["programa"] = query['programa'];
  }

  if(query['sede']){
      q["sede"] = query['sede'];
  }

  if(query['locacion']){
      q["locacion"] = query['locacion'];
  }

  if(query['pculturalId']){
      q["pculturals.pculturalId"] = query['pculturalId'];
  }


  let comp_range = [];

  if(query["compNum_d"]){
    console.log('compNum_d [%s]', query["compNum_d"])
    comp_range.push( {"compNum": { $gte: query["compNum_d"]} });
  }
    
  if(query["compNum_h"]){
    console.log('compNum_h [%s]', query["compNum_h"])
    comp_range.push( {"compNum": { $lte: query["compNum_h"]} });
  }

  if(query["fecomp_ts_d"]){
    console.log('fecomp_ts_d [%s]',query["fecomp_ts_d"]);

    comp_range.push( {"fecomp_ts": { $gte: query["fecomp_ts_d"]} });
  }

  if(query["fecomp_ts_h"]){
    console.log('fecomp_ts_h [%s]',query["fecomp_ts_h"]);

    comp_range.push( {"fecomp_ts": { $lte: query["fecomp_ts_h"]} });
  }

  if(comp_range.length){
    q["$and"] = comp_range;
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
const Record = mongoose.model('Budget', budgetSch, 'budgets');




/**
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */
exports.upsertNext = function (query, errcb, cb) {
    let regexQuery = buildQuery(query);

    Record.find(regexQuery, function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);

        }else{
            cb(entities);

        }
    });
};


/**
 * Retrieve all records
 * @param cb
 * @param errcb
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
 * @param cb
 * @param errcb
 */
exports.findByQuery = function (query, errcb, cb) {
    let regexQuery = buildQuery(query)
    console.dir(regexQuery)

    Record.find(regexQuery)
          .limit(100)
          .lean()
          .sort( '-fecomp_ts' )
          .exec(function(err, entities) {
              if (err) {
                  console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
                  errcb(err);
              }else{
                console.log('Search Result: [%s]', entities&&entities.length);
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
            console.log('[%s] validation error as validate() argument [%s]',whoami)
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
            console.log('[%s] validation error as validate() argument ',whoami);
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};


/**********************************/
/*          TABLERO              */
/********************************/

// exports.tablero = function(fecha, errcb, cb) {
//   console.log('****** Build TABLERO BEGIN [%s] *******', fecha);
 
//   let time_frame = utils.buildDateFrameForCurrentWeek(fecha);
//   console.dir(time_frame)

//   let query = {
//       fecomp_ts_d: time_frame.begin.getTime(),
//       fecomp_ts_h: time_frame.semh.getTime()
//     }
  
//   let regexQuery = buildQuery(query)

    
//   person.buildIdTree().then(pTree =>{
//     console.log('BuildPeronTree fullFilled [%s]', regexQuery);

//     Record.find(regexQuery).lean().exec(function(err, entities) {

//         if (err) {
//             console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
//             errcb(err);
//         }else{
//           console.log('entities [%s]', entities.length)
//           procesTableroAsistencia(pTree, entities, time_frame, errcb, cb);
//         }
//     });
//   })

// }
