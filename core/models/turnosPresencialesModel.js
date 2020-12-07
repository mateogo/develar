const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const utils = require('../services/commons.utils');
const Excel = require('exceljs')
const usuarios = require('./usuarioswebModel');
const mailer = require('../services/sendmail');

/**
 * Slots de turnos
 *
 * sede: nombre de la sede para el que se establecen las plazas
 * capacidad: cantidad de asistentes para un horario determinado
 * estado: estado del slot (activo, cancelado, etc)
 * duracion: la duración de un turno dado en este slot, en minutos
 * thorario: tipo de horario; puede valor 0=puntoual o 1=hora y duracion
 * dow: día de la semana correspondiente al slot
 * hora: la hora puntual con que corresponde el slot
 */
const turnoNominalSch = new Schema({
    sede: { type: String, required: true },
    capacidad: { type: Number, required: true },
    estado: { type: String, required: false, default: 'activo' },
    duracion: { type: Number, required: false, default: 0 },
    thorario: { type: Number, required: true, default: 0 },
    dow: { type: Number, required: false, default: 0 },
    hora: { type: Number, required: false, default: 0 },
    slug: { type: String, required: false }
});


function buildNextTurnoQuery(query) {
    let q = {
        estado: 'activo'
    };

    if (query.sede) {
        q['sede'] = query.sede;
    }

    // TODO: Completar con los demás criterios de búsqueda, si existen
    return q;
}

function buildTurnosAsignadosQuery(query) {
    let q = {
        estado: 'activo'
    };

    if (query.sede) {
        q['sede'] = query.sede;
    }

    if (query.dateTx) {
        q['$and'] = [buildDayRangeQuery('tsFechaHora', query.dateTx)];
    }

    return q;
}

/**
 * Dada una fecha puntual, construye el rango en timestamp para la fecha
 *
 * @param {string} dateTx Es la fecha puntual, por ej: 11/10/2020
 */
function buildDayRangeQuery(field, dateTx) {
    let q = {};

    const fechaInicio = utils.parseDateStr(dateTx);
    const fechaFin = utils.parseDateStr(dateTx + ' 23:59');

    q[field] = {
        '$gte': parseInt(fechaInicio.getTime(), 10),
        '$lte': parseInt(fechaFin.getTime(), 10)
    };

    return q;
}


/**
 * Crea un turno ('turno asignado') con los datos dados como parámetro
 *
 * @param {*} data
 * @param {*} turno
 * @param {*} errorCallback
 * @param {*} successCallback
 */
const assignTurno = function(data, turno, errorCallback, successCallback) {
    //c onsole.log('assignTurno data [%o], turno [%o]', data, turno);

    let asignado = new Turno();
    asignado.turnoId = turno._id;
    asignado.sede = turno.sede;
    asignado.tipoConsulta = data.tipoConsulta;
    asignado.estado = 'activo';
    asignado.avance = 'pendiente';
    asignado.detalle = data.detalle;
    asignado.txFecha = data.txFecha;
    asignado.txHora = data.txHora;
    asignado.tsFechaHora = utils.parseDateStr(data.fecha);
    asignado.requirente = data.requirente;

    //c onsole.log('assignTurno asignado [%o]', asignado);

    asignado.save().then(turnoAsignado => {
        if (turnoAsignado && successCallback) {
            successCallback(turnoAsignado);
        } else {
            errorCallback({ error: 'Al guardar el turno' });
        }
    })

}

/**
 * Verifica que haya lugar para alojar el turno elegido; es decir, que dado
 * un dia y hora, efectivamente se pueda crear el turno
 *
 * slots es el o los slots disponibles
 * asignados son los turnos que haya para ese día en esa sede
 * query es el nuevo turno que estoy intentando almacenar
 *
 */

const validateCupo = function(slots, asignados, query) {
    let filterList = slots.filter(slot => {
        // Con este reduce cuento cuántos turnos hay asignados en el slot elegido...
        let cantidadAsignados = asignados.reduce((cantidad, asignado) => {
            if (asignado.turnoId == slot._id) {
                cantidad = cantidad + 1;
            }
            return cantidad;
        }, 0);

        //c onsole.log('validateCupo[slot=%o, capacidad=%s, ocupados=%s]', slot, slot.capacidad, cantidadAsignados);

        // ...y si la cantidad supera la capacidad permitida, el slot es filtrado ('filter-out')
        if (cantidadAsignados >= slot.capacidad) {
            return false;
        } else {
            return true;
        };
    });

    return filterList;
}

const dowValidate = function(dow, target) {
    return !(dow !== target.dow);
}

const filterTurnos = function(query, tokens) {
    const resultSet = tokens.filter(turno => {
        let ok = true;
        if (query.txFecha) {
            let fechaBuscada = utils.parseDateStr(query.txFecha);
            let dow = fechaBuscada.getDay();


            //c onsole.log('en FilterTurnos, fechaBuscada -> %s, dow -> %s', fechaBuscada, dow);

            return dowValidate(dow, turno);
        }
        return ok;
    });

    return resultSet;
}

// Query es el turno que quiero validar
// Tokens son los slots disponibles para meter dicho turno
const validateTurnos = function(query, tokens, errorCallback, successCallback) {
    let resultSet = filterTurnos(query, tokens);
    let validatedSet = [];

    if (resultSet && resultSet.length > 0) {
        fetchTurnos(query).then(list => {
            validatedSet = validateCupo(resultSet, list, query);
            successCallback(validatedSet);
        });
    } else {
        successCallback([]);
    }
}

/**
 * Obtiene todos los turnos asignados según los criterios pasados en el
 *  objeto query
 *
 * @param {Object} query Los criterios para filtrar los turnos asignados
 */
const fetchTurnos = function(query) {
    let regexQuery = buildTurnosAsignadosQuery(query);
    return Turno.find(regexQuery);
}

const fetchNextTurno = function(query, errorCallback, successCallback) {
    let regexQuery = buildNextTurnoQuery(query);

    TurnoNominal.find(regexQuery, function(error, entities) {
        let results = [];
        if (error) {
            errorCallback(error);
        } else {
            if (entities && entities.length) {
                results = validateTurnos(query, entities, errorCallback, successCallback);
            } else {
                successCallback(results)
            }
        }
    })
}

const processTurno = function(query, errorCallback, successCallback) {
    fetchNextTurno(query,
        function(error) {

        },
        function(records) {
            if (records && records.length > 0) {
                let first = records[0];
                assignTurno(query, first, function(error) {},
                    function(turnoElegido) {
                        successCallback([turnoElegido] || []);
                    });
            } else {
                successCallback(records || []);
            }
        })
}

/**
 * Calcula y devuelve el primer turno disponible para una determinada sede
 *
 * @param {string} sede La sede para la que se busca un turno
 * @param {function} errorCallback
 * @param {function} successCallback
 */
exports.fetchFirstAvailableSlot = function(query, errorCallback, successCallback) {
    const { sede } = query;

    // Primero obtengo todos los slots para la sede buscada
    TurnoNominal.find({ estado: 'activo', sede: sede }, function(error, turnosDisponiblesList) {
        if (error) {
            errorCallback(error);
        } else {
            // Luego obtengo todos los turnos asignados para la sede buscada
            let sedesConCupo = [];
            fetchTurnos({ estado: 'activo', sede: sede }).then(turnosAsignadosList => {
                // Valido los cupos, es decir, me fijo los slots con turno
                // disponible
                sedesConCupo = validateCupo(turnosDisponiblesList, turnosAsignadosList);
                //c onsole.log('fetchFirstAvailableSlot[BEFORE SORT][sedesConCupo=%o]', sedesConCupo);

                sedesConCupo.sort((a, b) => {
                    return a.dow - b.dow;
                });

                //c onsole.log('fetchFirstAvailableSlot[AFTER SORT][sedesConCupo=%o]', sedesConCupo);

                // Luego me tengo que fijar en qué día la semana estamos
                const hoy = new Date();
                const nextDayWithOffsetDate = nextLaborDay(new Date(), 2);
                const nextAvailableDay = nextDayWithOffsetDate.getDay();

                // Filtro las sedesConCupo, el día de la semana debe ser mayor que
                // nextAvailableDay, que contiene el próximo 'day-of-the-week' laborable
                const primeraSedeLibre = sedesConCupo.find(sede => sede.dow >= nextAvailableDay);



                //c onsole.log('fetchFirstAvailableSlot[primeraSedeLibre=%o]', primeraSedeLibre);

                successCallback(primeraSedeLibre);
            });
        }
    });
}

/**
 * Obtiene los turnos nominales para una sede y fecha determinadas
 *
 * @param {*} query
 * @param {*} errorCallback
 * @param {*} successCallback
 */
exports.fetchAvailableSlots = function(query, errorCallback, successCallback) {
    //c onsole.log('fetchAvailableSlots[query=%o]', query);

    const { sede, dateTx } = query;
    const dow = utils.parseDateStr(dateTx).getDay();

    //c onsole.log('fetchAvailableSlots[sede=%s, dateTx=%s, dow=%s]', sede, dateTx, dow);
    TurnoNominal.find({ estado: 'activo', sede: sede, dow: dow }, function(error, turnosDisponiblesList) {
        if (error) {
            errorCallback(error);
        } else {
            // Luego obtengo todos los turnos asignados para la sede buscada
            let sedesConCupo = [];
            fetchTurnos({ sede: sede, dateTx: dateTx }).then(turnosAsignadosList => {
                // Valido los cupos, es decir, me fijo los slots con turno
                // disponible

                //c onsole.log('fetchAvailableSlots[turnosAsignadosList=%o]', turnosAsignadosList);

                sedesConCupo = validateCupo(turnosDisponiblesList, turnosAsignadosList);
                //c onsole.log('fetchFirstAvailableSlot[BEFORE SORT][sedesConCupo=%o]', sedesConCupo);

                sedesConCupo.sort((a, b) => {
                    return a.hora - b.hora;
                });
                //c onsole.log('fetchFirstAvailableSlot[AFTER SORT][sedesConCupo=%o]', sedesConCupo);

                // Luego me tengo que fijar en qué día la semana estamos
                const nextDayWithOffsetDate = nextLaborDay(new Date(), 2);
                const nextAvailableDay = nextDayWithOffsetDate.getDay();
                // c onsole.log('fetchFirstAvailableSlot[nextAvailableDay=%s]', nextAvailableDay);

                // Filtro las sedesConCupo, el día de la semana debe ser mayor que
                // nextAvailableDay, que contiene el próximo 'day-of-the-week' laborable
                // const primeraSedeLibre = sedesConCupo.find(sede => sede.dow >= nextAvailableDay);

                //c onsole.log('fetchFirstAvailableSlot[primeraSedeLibre=%o]', primeraSedeLibre);

                successCallback(sedesConCupo);
            });
        }
    });
}

/**
 * Calcula y obtiene todos los turnos disponibles para una determinada sede
 *
 * @param {*} query
 * @param {*} errorCallback
 * @param {*} successCallback
 */
exports.findAllDisponibles = function(query, errorCallback, successCallback) {
    TurnoNominal.find({ sede: query.sede }).lean().exec(function(error, turnosDisponiblesList) {
        if (error) {
            errorCallback(error);
        } else {
            // Luego obtengo todos los turnos asignados para la sede buscada
            let sedesConCupo = [];
            fetchTurnos({ sede: query.sede }).then(turnosAsignadosList => {
                // Valido los cupos, es decir, me fijo los slots con turno
                // disponible

                //c onsole.log('fetchAvailableSlots[turnosAsignadosList=%o]', turnosAsignadosList);

                sedesConCupo = validateCupo(turnosDisponiblesList, turnosAsignadosList);
                //c onsole.log('fetchFirstAvailableSlot[BEFORE SORT][sedesConCupo=%o]', sedesConCupo);

                sedesConCupo.sort((a, b) => {
                    if (a.dow != b.dow) {
                        return a.hora < b.hora ? -1 : 1;
                    } else {
                        return a.dow - b.dow;
                    }
                });
                //c onsole.log('fetchFirstAvailableSlot[AFTER SORT][sedesConCupo=%o]', sedesConCupo);

                // Luego me tengo que fijar en qué día la semana estamos
                const nextDayWithOffsetDate = nextLaborDay(new Date(), 2);
                const nextAvailableDay = nextDayWithOffsetDate.getDay();
                // c onsole.log('fetchFirstAvailableSlot[nextAvailableDay=%s]', nextAvailableDay);

                // Filtro las sedesConCupo, el día de la semana debe ser mayor que
                // nextAvailableDay, que contiene el próximo 'day-of-the-week' laborable
                // const primeraSedeLibre = sedesConCupo.find(sede => sede.dow >= nextAvailableDay);

                //c onsole.log('fetchFirstAvailableSlot[primeraSedeLibre=%o]', primeraSedeLibre);

                successCallback(sedesConCupo);
            });
        }
    });
}


// feriados
const inactivosList = ["31/03/2020", "10/04/2020", "01/05/2020", "25/05/2020", "15/06/2020", "09/07/2020", "10/07/2020"]
const laborDayOfWeek = [0, 1, 1, 1, 1, 1, 0]

function nextLaborDay(date, offset) {
    let day = date.getDate();
    let m = date.getMonth();
    let y = date.getFullYear();
    let blackList = inactivosList.map(t => utils.parseDateStr(t));

    for (let i = 0; i < 10; i += 1) {
        let dd = day + i + offset;
        let test = new Date(y, m, dd);
        if (laborDayOfWeek[test.getDay()]) {
            let inac = blackList.find(t => t.getTime() == test.getTime())
            if (!inac) return test;
        }
    }
    return null;
}

exports.processTurno = processTurno;
exports.fetchNextTurno = fetchNextTurno;
exports.assignTurno = assignTurno;


/******************************************************************************/


const requirenteTurnoSch = new Schema({
    personId: { type: String, required: true },
    userId: { type: String, required: true },
    displayName: { type: String, required: false },
    ndoc: { type: String, required: false }
});

const TurnoPresencialSch = new Schema({
    // ID del slot donde se asignará este turno
    turnoId: { type: String, required: false },
    sede: { type: String, required: true },
    tipoConsulta: { type: String, required: true },
    estado: { type: String, required: false },
    avance: { type: String, required: false },
    detalle: { type: String, required: false },
    txFechaAlta: { type: String, required: false, default: utils.dateToStr(new Date()) },
    txFecha: { type: String, required: false },
    txHora: { type: String, required: false },
    tsFechaHora: { type: Number, required: false },
    tsFechaAlta: { type: Number, required: false, default: Date.now() },
    requirente: { type: requirenteTurnoSch, required: false },
    source: { type: String, required: false }
});


/******************************************************************************
 * Funciones utilitarias
 *
 */

function buildQuery(query) {
    let q = {};

    if (query.sede) {
        q['sede'] = query.sede;
    }

    if (query.tipoConsulta) {
        q['tipoConsulta'] = query.tipoConsulta;
    }

    // if (query.fechaDesde && query.fechaHasta) {
    //     q['tsFechaHora'] = { "$gte": parseInt(query.fechaDesde, 10), "$lte": parseInt(query.fechaHasta, 10) };
    // }

    if (query.fechaDesde && query.fechaHasta) {
        q['$and'] = [{ 'tsFechaHora': { '$gte': parseInt(query.fechaDesde, 10), '$lt': parseInt(query.fechaHasta, 10) } }];
    } else {
        if (query.fechaDesde) {
            q['tsFechaHora'] = { "$gte": parseInt(query.fechaDesde, 10) };
        }

        if (query.fechaHasta) {
            q['tsFechaHora'] = { "$lt": parseInt(query.fechaHasta, 10) };
        }
    }

    if (query.estado) {
        q['estado'] = query.estado;
    }

    if (query.avance) {
        q['avance'] = query.avance;
    }

    if (query.userId) {
        q['requirente.userId'] = query.userId;
    }

    return q;
}

TurnoPresencialSch.pre('save', function(next) {
    next();
});



const Turno = mongoose.model('TurnoWeb', TurnoPresencialSch, 'turnosasignados');
const TurnoNominal = mongoose.model('TurnoWebDisponible', turnoNominalSch, 'turnosnominales');

/******************************************************************************
 * Métodos públicos
 *
 */

exports.create = function(data, errorCallback, successCallback) {

    Turno.create(data, function(error, result) {
        if (error) {
            errorCallback(error);
        } else {
            // FIXME: Mandar mail acá? Preguntar a Mateo
            console.log('Create Turno result[%o]', result);
            buildAndSendTurnoEmail(result);
            successCallback(result);
        }
    });
}

exports.update = function(id, data, errorCallback, successCallback) {
    Turno.findByIdAndUpdate(id, data, { new: true }, function(error, result) {
        if (error) {
            errorCallback(error);
        } else {
            successCallback(result);
        }
    });
}

exports.delete = function(id, errorCallback, successCallback) {
    Turno.findByIdAndDelete(id, function(error, result) {
        if (error) {
            errorCallback(error);
        } else {
            successCallback(result);
        }
    });
}

exports.findAll = function(errorCallback, successCallback) {
    Turno.find().sort({ tsFechaHora: -1 }).lean().exec(function(error, result) {
        if (error) {
            errorCallback(error);
        } else {
            successCallback(result);
        }
    });
}

exports.findAllByPerson = function(personId, errorCallback, successCallback) {
    Turno.find({ 'requirente.personId': personId }).lean().exec(function(error, results) {
        if (error) {
            errorCallback(error);
        } else {
            successCallback(results);
        }
    });
}

exports.findAllByUser = function(userId, errorCallback, successCallback) {
    Turno.find({ 'requirente.userId': userId }).lean().exec(function(error, results) {
        if (error) {
            errorCallback(error);
        } else {
            successCallback(results);
        }
    });
}

exports.findById = function(id, callback) {
    Turno.findById(id, function(error, user) {
        callback(error, user);
    });
}

exports.findDisponibleById = function(id, errorCallback, successCallback) {

    TurnoNominal.findById(id, function(error, entity) {
        if (error) {
            errorCallback(error);
        } else {
            successCallback(entity);
        }
    })
}

exports.findByQuery = function(query, errorCallback, successCallback) {
    let regexQuery = buildQuery(query);

    //c onsole.dir(regexQuery);

    Turno.find(regexQuery).sort({ tsFechaHora: -1 }).lean().exec(function(error, results) {
        if (error) {
            errorCallback(error);
        } else {
            successCallback(results);
        }
    });
}

/******************************************************************************
 * Exportación de datos a planilla de XLSX
 */
exports.exportarMovimientos = function(query, req, res) {
    fetchMovimientos(query, req, res);
}

function fetchMovimientos(query, req, res) {
    const regexQuery = buildQuery(query);
    //c onsole.log('fetchMovimientos regexQuery -> %o', regexQuery);

    Turno.find(regexQuery).lean().exec(function(error, results) {
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

function buildExcelStream(turnos, query, req, res) {
    let today = Date.now();
    let filename = 'turnosweb_' + today + '.xlsx'

    res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="' + filename + '"',
        'Transfer-Encoding': 'chunked',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res })
    var worksheet = workbook.addWorksheet('turnosWeb')

    worksheet.addRow(['Turnos Web']).commit()
    worksheet.addRow(['Fecha de emisión', new Date().toString()]).commit()
    worksheet.addRow().commit()
    worksheet.addRow(['Fecha turno', 'Hora turno', 'Nombre y apellido', 'Documento Nº', 'Tipo Consulta', 'Sede', 'Estado', 'Avance', 'Detalle']).commit();

    turnos.forEach((row, index) => {
        const { txFecha, txHora, tipoConsulta, sede, estado, avance, detalle } = row;
        const displayName = row.requirente.displayName;
        const ndoc = row.requirente.ndoc;

        let turnoArray = [txFecha, txHora, displayName, ndoc, tipoConsulta, sede, estado, avance, detalle];

        worksheet.addRow([...turnoArray]).commit()
    })

    worksheet.commit()
    workbook.commit()
}

/******************************************************************************
 * Mailing y gestión de correo electrónico
 */

function buildConfirmacionTurnoEmail(data) {
    const template = `
    <p>Estimado/a  ${data.displayName}: </p>
    <p>Te acercamos los datos del turno que se te ha asignado.</p>
    <p>Recuerda que debes confirmarlo accediento a tu panel de gestión de turnos y solicitudes, haciendo click en <a href="https://industrias.brown.gob.ar">MAB Industrias - Modernización</a>.</p>

    <h2>Los datos de tu turno son:</h2>
    <p><strong>Día: </strong> ${data.txFecha}</p>
    <p><strong>Hora: </strong> ${data.txHora}</p>
    <p><strong>Sede: </strong> ${data.sede}</p>

    <h4>Recuerda concurrir con barbijo y tu DNI. El mismo te será solicitado al ingreso.</h4>
    <h4>El equipo de MAB</h4>
    <h5>Correo enviado en forma automática; por favor, no responder.</h5>
    `;

    return template;
}

function buildAndSendTurnoEmail(turno) {
    usuarios.findById(turno.requirente.userId, function(error, user) {
        if (error) {

        } else {
            //c onsole.log('buildAndSendTurnoEmail[user=%o]', user);
            const body = buildConfirmacionTurnoEmail({
                displayName: turno.requirente.displayName,
                email: user.email,
                txFecha: turno.txFecha,
                txHora: turno.txHora,
                sede: turno.sede
            });

            const mailOpt = {
                from: 'webmastermabnoreply@gmail.com',
                body: body,
                to: user.email,
                prefix: 'Municipalidad de Almirante Brown',
                subject: 'Asignación de turno'
            };
            //c onsole.log('buildAndSendTurnoEmail[mailOpt=%o]', mailOpt);
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

/******************************************************************************
 * Gestor de turnos
 */
exports.buildTurnoSlots = function() {
    const slots = [
        { sede: 'secretaria', dow: 1, hora: 9, slug: '09:00', capacidad: 10 },
        { sede: 'secretaria', dow: 2, hora: 9, slug: '09:00', capacidad: 10 },
        { sede: 'secretaria', dow: 3, hora: 9, slug: '09:00', capacidad: 10 },
        { sede: 'secretaria', dow: 4, hora: 9, slug: '09:00', capacidad: 10 },
        { sede: 'secretaria', dow: 5, hora: 9, slug: '09:00', capacidad: 10 },

        { sede: 'secretaria', dow: 1, hora: 12, slug: '12:00', capacidad: 10 },
        { sede: 'secretaria', dow: 2, hora: 12, slug: '12:00', capacidad: 10 },
        { sede: 'secretaria', dow: 3, hora: 12, slug: '12:00', capacidad: 10 },
        { sede: 'secretaria', dow: 4, hora: 12, slug: '12:00', capacidad: 10 },
        { sede: 'secretaria', dow: 5, hora: 12, slug: '12:00', capacidad: 10 },

        { sede: 'secretaria', dow: 1, hora: 15, slug: '15:00', capacidad: 10 },
        { sede: 'secretaria', dow: 2, hora: 15, slug: '15:00', capacidad: 10 },
        { sede: 'secretaria', dow: 3, hora: 15, slug: '15:00', capacidad: 10 },
        { sede: 'secretaria', dow: 4, hora: 15, slug: '15:00', capacidad: 10 },
        { sede: 'secretaria', dow: 5, hora: 15, slug: '15:00', capacidad: 10 },


        { sede: 'pindustrial', dow: 1, hora: 9, slug: '09:00', capacidad: 2 },
        { sede: 'pindustrial', dow: 2, hora: 9, slug: '09:00', capacidad: 2 },
        { sede: 'pindustrial', dow: 3, hora: 9, slug: '09:00', capacidad: 2 },
        { sede: 'pindustrial', dow: 4, hora: 9, slug: '09:00', capacidad: 2 },
        { sede: 'pindustrial', dow: 5, hora: 9, slug: '09:00', capacidad: 2 },

        { sede: 'pindustrial', dow: 1, hora: 12, slug: '12:00', capacidad: 2 },
        { sede: 'pindustrial', dow: 2, hora: 12, slug: '12:00', capacidad: 2 },
        { sede: 'pindustrial', dow: 3, hora: 12, slug: '12:00', capacidad: 2 },
        { sede: 'pindustrial', dow: 4, hora: 12, slug: '12:00', capacidad: 2 },
        { sede: 'pindustrial', dow: 5, hora: 12, slug: '12:00', capacidad: 2 },

        { sede: 'pindustrial', dow: 1, hora: 15, slug: '15:00', capacidad: 2 },
        { sede: 'pindustrial', dow: 2, hora: 15, slug: '15:00', capacidad: 2 },
        { sede: 'pindustrial', dow: 3, hora: 15, slug: '15:00', capacidad: 2 },
        { sede: 'pindustrial', dow: 4, hora: 15, slug: '15:00', capacidad: 2 },
        { sede: 'pindustrial', dow: 5, hora: 15, slug: '15:00', capacidad: 2 }
    ];

    function buildSlotRecord(token) {
        let turnoNominal = new TurnoNominal();

        turnoNominal.sede = token.sede;
        turnoNominal.capacidad = token.capacidad;
        turnoNominal.estado = 'activo';
        turnoNominal.duracion = 120; // Cada turno dura 3 horas
        turnoNominal.thorario = 2;
        turnoNominal.dow = token.dow;
        turnoNominal.hora = token.hora;
        turnoNominal.slug = token.slug;

        turnoNominal.save().then(entity => {
            //c onsole.log('turnoNominal grabación exitosa: %s', entity);
        }).catch(error => console.log(error));
    }

    const initialData = slots;
    initialData.forEach(token => {
        buildSlotRecord(token);
    });
}