/**
 * Recordcard routes
 */
/**
 * Load module dependencies
 */
const express = require('express');
const passport = require('passport');

const router = express.Router();
const service = require('../models/recordcardModel.js');

const whoami =  "Router:routes/recordcardRouter: ";

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
 * search entities
 */
router.get('/search', function (req, res) {
    service.findByQuery(req, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});
 
/**
 * fetch entities
 */
router.get('/fetchnext', function (req, res) {
    service.fetchNext(req, function(err) {
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
 * Promote subcard as Card
 */
router.put('/promote/:id', function (req, res) {
    service.promote(req.params.id, req.body, function(err) {
        res.status(400).json(err);

    }, function(entity) {
        res.status(201).json(entity);

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