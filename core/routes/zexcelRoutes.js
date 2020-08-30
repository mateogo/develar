const express = require('express');
const router = express.Router();
const excelimport = require('../models/zcargaExcel.js');

const whoami =  "Router:routes/zexcelRoutes: ";

router.get('/nrows', function (req, res) {
    excelimport.getNRows(req, function(err) {
        res.status(400).json(err);
    }, function(entities) {
        res.status(200).json(entities);
    });
});

router.get('/registros', function (req, res) {
    excelimport.getRegistros(req, function(err) {
        res.status(400).json(err);
    }, function(entities) {
        res.status(200).json(entities);
    });
});

module.exports = router;