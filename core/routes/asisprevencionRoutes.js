/**
 * Asistencia de Prevención Sec SALUD routes
 */

const express = require('express');
const router = express.Router();
const service = require('../models/asisprevencionModel.js');

const whoami =  "Router:routes/asisprevencionRoutes: ";



/**
 * Retrieve all entities
 */
router.get('/', function (req, res) {
    service.findAll(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

router.get('/exportarmovimientos', function (req, res) {
    console.log('exportar movimientos ROUTER')
    service.exportarmovimientos(req.query, req, res);
});

router.get('/exportarseguimientos', function (req, res) {
    console.log('exportar movimientos ROUTER')
    service.exportarseguimientos(req.query, req, res);
});



/**
 * Retrieve Entity by ID
 */
router.get('/tablero', function (req, res) {
    console.log('tablero ROUTE BEGIN')
    service.dashboard(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

/**
 * Retrieve Entity by ID
 */
 router.get('/workload', function (req, res) {
    console.log('workload EPIDEMIO ROUTE BEGIN')
    service.userWorkload(req.query, 
        function(err) {
            res.status(400).json(err);

        }, function(entities) {
            res.status(200).json(entities);

        });
});

/**
 * Retrieve Entity by ID
 */
 router.get('/weekplanning', function (req, res) {
    console.log('weekplanning EPIDEMIO ROUTE BEGIN')
    service.userWeekPlanning(req.query, 
        function(err) {
            res.status(400).json(err);

        }, function(entities) {
            res.status(200).json(entities);

        });
});





router.get('/epidemio/:fecha', function (req, res) {
    console.log('generacion de tablero de control');
    let fechanum = parseInt(req.params.fecha, 10);
    service.tableroepidemio(fechanum, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});


// /**
//  * import and [update | insert ]
//  */
// router.get('/tablero/:fecha', function (req, res) {
//     let fechanum = parseInt(req.params.fecha, 10);
//     service.tablero(fechanum, function(err) {
//         res.status(400).json(err);

//     }, function(entities) {
//         res.status(200).json(entities);





//     });
// });

/**
 * Retrieve all entity
db.asisprevenciones.find({isVigilado: true, avance: { '$ne': 'anulado' }, fecomp_tsa: { '$gte': 1621009585073, '$lt': 1621787185073 }, 'followUp.asignadoId': '5efcc30e2e36303f04fe52da', 'infeccion.hasCovid': true, 'infeccion.actualState': { '$in': [ 1, 4, 5 ] }}, {followUp: 1})


*/
router.post('/nextitem', function (req, res) {
    service.upsertNext(req.body, function(err) {
        res.status(400).json(err);

    }, function(entity) {
        res.status(200).json(entity);

    });
});

/**
 * search entities
 */
router.get('/search', function (req, res) {
    service.findByQuery(req.query, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

/**
 * reporte seguimiento
 */
router.get('/seguimiento', function (req, res) {
    service.buildReporteSeguimiento(req.query, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    },
    req,
    res);
});

/**
 * Retrieve Entity by ID
 */
router.get('/:id', function (req, res) {
    service.findById(req.params.id, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});


/**
 * Create new entity
 */
router.post('/', function (req, res) {
    service.create(req.body, function(err) {
        res.status(400).json(err);

    }, function(entity) {
        res.status(201).json(entity);

    });
});



/**
 * Update entity
 */
router.put('/:id', function (req, res) {
    service.update(req.params.id, req.body, 
        function (err) {
            res.status(400).json(err);

        }, function(entity) {
            res.status(201).json(entity);

        });
});


module.exports = router;