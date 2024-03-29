/**
 * Observaciones routes
 */

var express = require('express');
var router = express.Router();
var service = require('../models/observacionesModel.js');

const whoami =  "Router:routes/observacionesRoutes: ";


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

router.get('/importobservaciones', function (req, res) {
    console.log('process OBSERVACIONES: IMPORT');
    service.importobservaciones(req, function(err) {
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

router.get('/export', (req, res) => {
    service.exportExcel(req.query, req, res);
})
  
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
