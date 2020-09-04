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
    var type = req.body.importType;
    var isTesting = req.body.isTesting;

    if(type=="sisa"){
        if (!isTesting){
            saludimport.importSisaArchive(req, function(err) {
                res.status(400).json(err);
            }, function(entities) {
                res.status(200).json(entities);
            });
        }else{
            // TODO: implementar testing
            res.status(200).json({respuesta: "testing sisa"});
        }
    }else{
        // otro tipo de importacion
        if (!isTesting){
            res.status(200).json({respuesta: "otro tipo de importacion"});
        }else{
            res.status(200).json({respuesta: "testing de otro tipo de importacion"});
        }
    }
});

module.exports = router;