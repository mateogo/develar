/**
 * generación de PDF
 */



const express = require('express');
const router = express.Router();
const service = require('../services/pdfhisopado.js');

const whoami =  "Router:routes/zgenpdfRoutes.js: ";


/**
 * Regenera el campo asisprevencion.casoIndice.nucleo
 */
router.get('/solhisopadoform', function (req, res) {
    service.genHispadoForm(req, res);
});

router.get('/solhisopadoform/:id', function (req, res) {
    service.genHispadoForm(req, res);
});

router.get('/discover', function (req, res) {

    let apis = [
        {
            route: '/discover',
            description: 'service: pdfhisopado - generación de salidas en PDF'
        },
        {
            route: '/solhisopadoform/:asisprevencion',
            description: 'Emisión de la solicitud de laboratorio para hisopados covid',
            relacionadas: '/discover/:asis'
        },

    ]
    res.status(200).json(apis);
});



module.exports = router;