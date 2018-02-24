/**
 * Google custom search API
 */
/**
 * Load module dependencies
 */
var express = require('express');
var router = express.Router();
var service = require('../services/gcse');

const whoami =  "Router:routes/gcseRoutes: ";

/**
 * ADVANCE search
 */
router.post('/', function (req, res) {

    service.gsearch(req.body.query, req.body.opts, function(err) {
        res.status(400).json(err);

    }, function(data) {
        res.status(200).json(data);

    });
});

/**
 * SIMPLE search
 * api/gcse?q=angular4
 */
router.get('/', function (req, res) {

    service.gsearch(req.query, {}, function(err) {
        res.status(400).json(err);

    }, function(data) {
        res.status(200).json(data);

    });
});




module.exports = router;