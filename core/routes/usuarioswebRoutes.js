const express = require('express');
const router = express.Router();
const service = require('../models/usuarioswebModel');
const passport = require('passport');
const whoami = 'Router : routes / usuariosWebRoutes';


/**
 * Ruta: /api/usuariosweb
 * Método: POST
 * Descripción: crear un nuevo usuario
 *
 */
router.post('', function(req, res) {
    service.create(req.body, function(error) {
            res.status(400).json(error);
        },
        function(result) {
            res.status(201).json(result);
        });
});

/**
 * Ruta: /api/usuariosweb
 * Método: GET
 * Descripción: recuperar todos los usuarios
 *
 */
router.get('', function(req, res) {
    service.findAll(function(error) {
        res.status(400).json(error);
    }, function(results) {
        res.status(200).json(results);
    });
});

/**
 * Ruta: /api/usuariosweb/search
 * Método: GET
 * Descripción: recuperar usuarios que cumplan el criterio de búsqueda
 *
 */
router.get('/search', function(req, res) {
    console.log('findByQuery query -> %o', req.query);

    service.findByQuery(req.query, function(error) {
        res.status(400).json(error);
    }, function(results) {
        res.status(200).json(results);
    });
});

/**
 * Ruta: /api/usuariosweb/:id
 * Método: GET
 * Descripción: recupera un usuario por ID
 *
 */
router.get('/:id', function(req, res) {
    // service.findById(req.params.id, function(error) {
    //     res.status(400).json(error);
    // }, function(results) {
    //     res.status(200).json(results);
    // });
    service.findById(req.params.id, function(error, result) {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(result);
        }
    });
});

/**
 * Ruta: /api/usuariosweb/:id/persona
 * Método: GET
 * Descripción: recupera los datos de la persona asociada al usuario ID
 *
 */
router.get('/:id/persona', function(req, res) {
    service.findPersonForUser(req.params.id, function(error) {
        res.status(400).json(error);
    }, function(result) {
        res.status(200).json(result);
    });
});


/**
 * Ruta: /api/usuariosweb/:id
 * Método: PUT
 * Descripción: modificar un usuario
 *
 */
router.put('/:id', function(req, res) {
    service.update(req.params.id, req.body, function(error) {
        res.status(400).json(error);
    }, function(results) {
        res.status(200).json(results);
    });
});

/**
 * Ruta: /api/usuariosweb/:id
 * Método: DELETE
 * Descripción: eliminar un usuario
 *
 */
router.delete('/:id', function(req, res) {
    service.delete(req.params.id, function(error) {
        res.status(400).json(error);
    }, function(result) {
        res.status(200).json(result);
    });
});

/**
 * Ruta: /api/usuariosweb/login
 * Método: POST
 * Descripción: inicia una sesión
 *
 */
router.post('/login', function(req, res, next) {
    passport.authenticate('usuarioweb-local', function(err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(400).json({
                error: {
                    message: 'Error en la autenticacion',
                    status: 400
                }
            });
        }

        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            service.recalcularEdad(user);
            return res.status(200).json(user);
        });
    })(req, res, next);
});

/**
 * Ruta: /api/usuariosweb/currentuser
 * Método: GET
 * Descripción: recupera un usuario desde la sesión iniciada
 *
 */

router.get('/currentuser', function(req, res) {
    console.log(req.user)
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(200).json({ message: 'Sin sesión iniciada' });
    }
});

/**
 * Ruta: /api/usuariosweb/logoutgit sta
 * Método: GET
 * Descripción: cierra una sesión
 *
 */
router.get('/logout', function(req, res) {
    req.logOut();
    req.session = null;
    res.status(200).json({ message: 'Sesión finalizada OK' });
});

/**
 * Ruta: /api/usuariosweb/resetpassword
 * Método: POST
 * Descripción: edita la contraseña
 *
 */
router.post('/resetpassword', function(req, res) {
    service.resetPassword(req.body, function(error) {
            res.status(400).json(error);
        },
        function(result) {
            res.status(200).json(result);
        });
});


module.exports = router;