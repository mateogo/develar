/**
 * Commons routes
**/

const whoami =  "Router:routes/commonRouter: ";

const express = require('express');
const router = express.Router();
const mailService = require('../services/sendmail.js');
const mapUtils = require('../services/maputils.js');
const asset = require('../models/assetModel');

/**
 * SendsMail thru GMAIL
 */
router.post('/sendmail', function (req, res) {
    //console.log('[%s][sendmail HIT] [%s]', whoami, req.body.to);
    //res.status(200).json({message: 'Enviado con exito'});
    mailService.sendMail(req.body, function(err) {
        res.status(400).json(err);

    }, function(data) {
        res.status(200).json(data);

    });
});

/**
 * SendsMail thru GMAIL
 */
router.post('/geocode', function (req, res) {
    //console.log('[%s][geocode HIT] [%s]', whoami, req.body.address);
    //res.status(200).json({message: 'Enviado con exito'});
    mapUtils.addressLookUp(req.body, function(err) {
        res.status(400).json(err);

    }, function(data) {
        res.status(200).json(data);

    });
});

router.get('/download/:id', function (req, res) {
    //console.log('[%s][download HIT] [%s]', whoami, req.params.id);
    //res.status(200).json({message: 'Enviado con exito'});
    asset.findPathById(req.params.id, function(err) {
        res.status(400).json(err);

    }, function(path) {
        res.redirect(path)
 
    });
});


module.exports = router;