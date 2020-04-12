/**
 * Instancias de locaciones, asignación de locaciones, alocación de locaciones
 */

var express = require('express');
var router = express.Router();
var service = require('../models/solinternacionModel.js');

const whoami =  "Router:routes/solinternacionRoutes: ";

const record = 'solinternacion';



/**
 * Retrieve all entities
 */
router.get('/', function (req, res) {
    service.findAll(record, 
        function(err) {
            res.status(400).json(err);

        }, function(entities) {
            res.status(200).json(entities);

        });
    });


/**
 * Retrieve all entity
 */
router.post('/nextitem', function (req, res) {
    service.upsertNext(record, req.body, 
        function(err) {
            res.status(400).json(err);

        }, function(entity) {
            res.status(200).json(entity);

        });
});

router.get('/test', function (req, res) {
});

router.get('/initdata', function (req, res) {
});

/**
 * Create new entity
 */
router.post('/updateprocess', function (req, res) {
    service.updateProcess(req.body, 
        function(err) {
            res.status(400).json(err);

        }, function(entity) {
            res.status(201).json(entity);

        });
});

/**
 * Create new entity
 */
router.get('/updateprocess', function (req, res) {
    service.fetchMasterAllocator(req.query,
        function(err) {
            res.status(400).json(err);

        }, function(entity) {
            res.status(201).json(entity);

        });
});


/**
 * search entities
 */
router.get('/search', function (req, res) {
    service.findByQuery(record, req.query, 
        function(err) {
            res.status(400).json(err);

        }, function(entities) {
            res.status(200).json(entities);

        });
});

/**
 * Retrieve Entity by ID
 */
router.get('/:id', function (req, res) {
    service.findById(record, req.params.id, 
        function(err) {
            res.status(400).json(err);

        }, function(entities) {
            res.status(200).json(entities);

        });
});


/**
 * Create new entity
 */
router.post('/', function (req, res) {
    service.create(record, req.body, 
        function(err) {
            res.status(400).json(err);

        }, function(entity) {
            res.status(201).json(entity);

        });
});

/**
 * Create new entity
 */


/**
 * Update entity
 */
router.put('/:id', function (req, res) {
    service.update(record, req.params.id, req.body, 
        function (err) {
            res.status(400).json(err);

        }, function(entity) {
            res.status(201).json(entity);

        });
});


module.exports = router;