const express = require('express');
const router = express.Router();
const excel = require('../models/zcargaExcel.js');
const saludimport = require('../models/zimportSalud.js');

const whoami =  "Router:routes/zexcelRoutes: ";

router.post('/', function (req, res) {
    excel.getData(req, function(err) {
        res.status(400).json(err);
    }, function(entities) {
        res.status(200).json(entities);
    });
});

router.post('/import', function (req, res) {
    saludimport.importSisaArchive(req, function(err) {
        res.status(400).json(err);
    }, function(entities) {
        res.status(200).json(entities);
    });
});

module.exports = router;