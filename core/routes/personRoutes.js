/**
 * Person routes
 */
/**
 * Load module dependencies
 */
var express = require('express');
var router = express.Router();
var service = require('../models/personModel.js');

const whoami =  "Router:routes/personRouter: ";

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
 * upsert and [update | insert ]
 */
router.post('/upsert', function (req, res) {
    service.upsert(req, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

/**
 * import and [update | insert ]
 */
router.get('/import', function (req, res) {
    console.log('import ROUTE');
    service.import(req, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

/**
 * import and [update | insert ]
 */
router.get('/alimentar', function (req, res) {
    console.log('import ALIMENTAR ROUTE');
    // desactivado
    res.status(200).json([{error: 'ruta desactivada'}]);
    // service.alimentarImport(req, function(err) {
    //     res.status(400).json(err);

    // }, function(entities) {
    //     res.status(200).json(entities);

    // });
});


router.get('/saludimport', function (req, res) {
    console.log('import SALUD ROUTE');
    service.saludImport(req, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

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