/**
 * Commons routes
**/

const whoami =  "Router:routes/downloadRoutes: ";
const path = require('path');

const express = require('express');
const router = express.Router();
const asset = require('../models/assetModel');


router.get('/:id', function (req, res) {
    asset.findPathById(req.params.id, function(err) {
        res.status(400).json(err);

    }, function(target) {
        res.redirect(path.join('/', target));
 
    });
});


router.get('/*', function (req, res) {
		let target = req.originalUrl.substr(req.baseUrl.length);
    res.redirect(target); 
});


module.exports = router;