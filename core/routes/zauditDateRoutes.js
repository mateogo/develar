/**
 * auditoría de datos
 */

var express = require('express');
var router = express.Router();
var service = require('../models/zauditDataService.js');

const whoami =  "Router:routes/zauditDataRoutes: ";



/**
 * autita personas con TipoNumero de documento Duplicados
 */
router.get('/auditpersonduplices', function (req, res) {
    service.auditPersonDuplices(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});


/**
 * Retrieve all entities
 */
router.get('/fetchduplices', function (req, res) {
    service.findDuplices(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});



module.exports = router;