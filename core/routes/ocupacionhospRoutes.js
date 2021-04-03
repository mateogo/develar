/**
 * Partes diaros de ocupación de locaciones
 */

var express = require('express');
var router = express.Router();
var service = require('../models/ocupacionhospModel.js');

const whoami =  "Router:routes/ocupacionhospRoutes: ";

const RECORD = 'parteocupacion';

/**
 * Retrieve all entities
 */
router.get('/', function (req, res) {
    service.findAll(RECORD, 
        function(err) {
            res.status(400).json(err);

        }, function(entities) {
            res.status(200).json(entities);

        });
    });



/**
 * search entities
 */
router.get('/search', function (req, res) {
    service.findByQuery(RECORD, req.query, 
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
    service.findById(RECORD, req.params.id, 
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
    service.create(RECORD, req.body, 
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
    service.update(RECORD, req.params.id, req.body, 
        function (err) {
            res.status(400).json(err);

        }, function(entity) {
            res.status(201).json(entity);

        });
});


module.exports = router;