/**
 * Crawler URL
 */
/**
 * Load module dependencies
 */
var express = require('express');
var router = express.Router();
var service = require('../services/crawler');

const whoami =  "Router:routes/crawlerRoutes: ";



/**
 * SIMPLE crawl
 * api/q=angular4
 */
router.get('/', function (req, res) {

    service.crawlURL(req.query.q, {}, function(err) {
        res.status(400).json(err);

    }, function(data) {
        res.status(200).json(data);

    });
});


module.exports = router;