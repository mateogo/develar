/**
 * Asistencia routes
 */

var express = require('express');
var router = express.Router();
var service = require('../models/asistenciaModel.js');

const whoami =  "Router:routes/asistenciaRoutes: ";



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

/**
 * import and [update | insert ]
 */
router.get('/importalimentos', function (req, res) {
    console.log('process Alimentos IMPORT');
    service.importalimentos(req, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

/**
 * import and [update | insert ]
 */
router.get('/importhabitacional', function (req, res) {
    console.log('process HABITACIONAL IMPORT');
    service.importhabitacional(req, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

router.get('/importsanitaria', function (req, res) {
    console.log('process SANITARIA IMPORT');
    service.importsanitaria(req, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});



/**
 * import and [update | insert ]
 */
router.get('/tablero/:fecha', function (req, res) {
    console.log('generacion de tablero de control');
    let fechanum = parseInt(req.params.fecha, 10);
    service.tablero(fechanum, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

/**
 * Retrieve all entity
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