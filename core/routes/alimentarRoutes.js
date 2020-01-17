/**
 * Person routes
 */
/**
 * Load module dependencies
 */
var express = require('express');
var router = express.Router();
var service = require('../models/alimentarModel.js');

const whoami =  "Router:routes/alimentarRouter: ";


/**
 * Retrieve Entity by ID
 */
router.get('/load', function (req, res) {
    service.load(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

router.get('/:id', function (req, res) {
    service.findById(req.params.id, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});


module.exports = router;