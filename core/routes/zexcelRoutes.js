const express = require('express');
const router = express.Router();
const excelimport = require('../models/zcargaExcel.js');

const whoami =  "Router:routes/zexcelRoutes: ";

router.get('/', function (req, res) {
    excelimport.importExcel(req, function(err) {
        res.status(400).json(err);
    }, function(entities) {
        res.status(200).json(entities);
    });
    res.send({});
});

module.exports = router;