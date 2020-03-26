/**
 * Esquema de turnos disponibles por recurso
 */

var express = require('express');
var router = express.Router();
var service = require('../models/gturnosModel.js');

const whoami =  "Router:routes/gturnosRoutes: ";

const record = 'turno';



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