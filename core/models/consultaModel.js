/**
 * Consultas CONSULTAS
 */

const whoami = "models/consultaModel: ";

const mongoose = require('mongoose');

const config = require('../config/config')

const path = require('path');

const utils = require('../services/commons.utils');
const usuarios = require('./usuarioswebModel');
const mailer = require('../services/sendmail');

const Schema = mongoose.Schema;

const self = this;


const atendidoxSch = new Schema({
    userAdmId: { type: String, required: false },
    userWebId: { type: String, required: false },
    slug: { type: String, required: false }
});

const requirenteSch = new Schema({
    userId: { type: String, required: false },
    personId: { type: String, required: false },
    slug: { type: String, required: false },
});


const materialSch = new Schema({
    tmaterial: { type: String, required: false },
    identificador: { type: String, required: false },
    destino: { type: String, required: false },
});

const asesoramTecnicoSch = new Schema({
    institucion: { type: String, required: false },
    solicitud: { type: String, required: false },
    contacto: { type: String, required: false },
});

const paseSch = new Schema({
    fe_nov: { type: String, required: false },
    ho_nov: { type: String, required: false },
    fets_nov: { type: Number, required: false },
    ejecucion: { type: String, required: false },
    emisor: { type: String, required: false },
    novedadTx: { type: String, required: false },

    isCumplida: { type: Boolean, required: false }, //ESTADO TIENE QUE ESTAR EN CUMPLIDO

    //Inicio de pases
    sector: { type: String, required: false },
    estado: { type: String, required: false },
    paseTx: { type: String, required: false },
    //Fin pases

    atendidox: { type: atendidoxSch, required: false },

});

/**
 * Creación de un Schema
 * @params
 */
const consultaSch = new Schema({
    isActive: { type: Boolean, required: false },
    type: { type: String, required: false },

    //intervencion: { type: String, required: false },
    urgencia: { type: String, required: false },

    fecomp_txa: { type: String, required: false },
    fecomp_tsa: { type: Number, required: false },

    description: { type: String, required: false },
    sector: { type: String, required: false },

    hasNecesidad: { type: Boolean, required: false },
    fe_necesidad: { type: String, required: false },
    fets_necesidad: { type: Number, required: false },

    hasCumplimiento: { type: Boolean, required: false },

    estado: { type: String, required: false },
    // avance: { type: String, required: false },
    ejecucion: { type: String, required: false },

    pases: [paseSch],

    // atendidox: { type: atendidoxSch, required: false },
    requirente: { type: requirenteSch, required: false },

    asesoramiento: { type: asesoramTecnicoSch, required: false },
    material: { type: materialSch, required: false },
});


consultaSch.pre('save', function(next) {
    return next();
});


function buildQuery(query) {
    let q = {};

    if (query['type']) {
        q["type"] = query['type'];
    }

    if (query['userId']) {
        console.log("entro a consultar al requirente")
        q["requirente.userId"] = query['userId'];
    }

    if (query.fechaDesde && query.fechaHasta) {
        q['$and'] = [{ 'fecomp_tsa': { '$gte': parseInt(query.fechaDesde, 10), '$lt': parseInt(query.fechaHasta, 10) } }];
    } else {
        if (query.fechaDesde) {
            q['fecomp_tsa'] = { "$gte": parseInt(query.fechaDesde, 10) };
        }

        if (query.fechaHasta) {
            q['fecomp_tsa'] = { "$lt": parseInt(query.fechaHasta, 10) };
        }
    }

    if (query.estado) {
        q['estado'] = query.estado;
    }

    if (query.sector) {
        q['sector'] = query.sector;
    }

    if (query.ejecucion) {
        q['ejecucion'] = query.ejecucion;
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
const Record = mongoose.model('Consulta', consultaSch, 'consultas');


/**
 * Retrieve all records
 * @param cb
 * @param errcb
 */
exports.findAll = function(errcb, cb) {
    Record.find(function(err, entities) {
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

    Record.find(regexQuery).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);
        } else {
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
exports.update = function(id, record, user, errcb, cb) {

    Record.findByIdAndUpdate(id, record, { new: true }, function(err, entity) {
        if (err) {
            console.log('[%s] validation error as validate() argument [%s]', whoami)
            err.itsme = whoami;
            errcb(err);

        } else {
            //updateAvance(entity, id, user);
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

    Record.create(record, function(err, entity) {
        if (err) {
            console.log('[%s] validation error as validate() argument ', whoami);
            err.itsme = whoami;
            errcb(err);

        } else {
            buildAndSendConsultaEmail(entity);
            cb(entity);
        }
    });

};


/******************************************************************************
 * Mailing y gestión de correo electrónico
 */

function buildConsultaEmail(data) {
    const template = `
  <p>Estimado/a  ${data.displayName}: </p>
  <p>Te acercamos los datos de la consulta que has solicitado.</p>
  <p>Puedes ver todas tus solicitudes ingresando a tu panel de gestión de turnos y solicitudes.</p>

  <h2>Los datos de tu consulta son:</h2>
  <p><strong>Fecha de emisión: </strong> ${data.txFecha}</p>
  <p><strong>Descripción: </strong> ${data.description}</p>

  <h4>Te responderemos a la brevedad.</h4>
  <h4>El equipo de MAB</h4>
  <h5>Correo enviado en forma automática; por favor, no responder.</h5>
  `;

    return template;
}

function buildAndSendConsultaEmail(consulta) {
    usuarios.findById(consulta.requirente.userId, function(error, user) {
        if (error) {

        } else {
            console.log('buildAndSendConsultaEmail[user=%o]', user);
            const body = buildConsultaEmail({
                displayName: user.nombre + ' ' + user.apellido,
                email: user.email,
                txFecha: consulta.fecomp_txa,
                description: consulta.description
            });

            const mailOpt = {
                from: 'webmastermabnoreply@gmail.com',
                body: body,
                to: user.email,
                prefix: 'Municipalidad de Almirante Brown',
                subject: 'Generación de consulta'
            };
            console.log('buildAndSendConsultaEmail[mailOpt=%o]', mailOpt);
            sendNotificationEmail(mailOpt);
        }
    });
}

function sendNotificationEmail(mailOptions) {
    const mail = mailer.mailFactory(mailOptions);

    mailer.sendMail(mail.content, function(error) {
            console.log('Error al enviar correo elecrónico: %o', error);
        },
        function(success) {
            console.log('Se envió correo electrónico al usuario: %o', success);
        });
}

// updateAvance = function(entity, id, user) {
//     //Lo que se espera con este metodo, es que cada vez que se realice un update
//     // de una determinada consulta, la misma quede reflejada en los avances.
//    let avance = loadAvanceData(entity, user);
//     entity.pases.push(avance);
//     Record.findByIdAndUpdate(id, entity, {new : true}).then( x => {
//         console.log("Se insertó correctamente el avance --> %o",x)
//     }).catch( err => {
//         console.log("OOOOPPPSSS")
//     })
//     console.log(avance)
//     //c onsole.log("ENTITY [%o] \n RECORD [%o] \n USER [%o]",entity, record, user)
// }

// loadAvanceData = function(entity, user) {
//     let avance = {
//         fe_nov : utils.dateToStr(new Date()),
//         fets_nov : new Date().getTime(),
//         emisor : entity.requirente._id,
//         ejecucion : entity.estado, //Son opciones de un select de una OPTLIST (generar-turno <y la estaria dando por cumplida> , verificacion, en tramite,)
//         slug : 'breve descripción',
//         isCumplida : entity.estado === 'cumplido' ? true : false,
//         atendidox : {
//             userId : '',
//             slug : '',
//             sector :  ''//'comunicación, cineaudiovideo, fotografía, dirección'
//         }
//     }


//     if(user){
//         avance.atendidox.userId = user._id;
//         avance.atendidox.slug = user.username;
//         avance.atendidox.sector = 'direccion'
//     }

//     return avance;
// }



// const atendidoxSch = new Schema({
//     userId: { type: String, required: false },
//     slug: { type: String, required: false },
//     sector: { type: String, required: false },
// });
