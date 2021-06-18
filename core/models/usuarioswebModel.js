const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const crypto = require('crypto');
const key = Buffer.from('5ed90daa50a3d7fd1a1ea7a1d7883fc62ccffc49de570ec37eebf05067aa613a', 'hex');
const IV = Buffer.from('a2e50e8df4c5ad20b6af1269ba2552be', 'hex');
const person = require('../models/personModel');
const utils = require('../services/commons.utils');


const usuarioWebSch = new Schema({
    ndoc:              { type: String,  required: true },
    tipoDoc:           { type: String,  required: true, default: 'DNI' },
    numTramite:        { type: Number,  required: false, default: '00123456789' },
    nombre:            { type: String,  required: false },
    apellido:          { type: String,  required: false },
    username:          { type: String,  required: false },
    password:          { type: String,  required: true },
    email:             { type: String,  required: false },
    telefono:          { type: String,  required: true },
    fechaNacimiento:   { type: String,    required: true },
    tsFechaNacimiento: { type: Number,  required: true },
    preguntaSecreta:   { type: String,  required: true },
    respuestaSecreta:  { type: String,  required: true },
    isUsuarioWeb:      { type: Boolean, required: false, default: true },
    isMayorEdad:       { type: Boolean, required: false }
});

/******************************************************************************
 * Funciones utilitarias
 *
 */

function buildQuery(query) {
    let q = {};

    // TODO: En el modelo, este campo debiera llamarse tdoc
    if (query.tdoc) {
        q['tipoDoc'] = query.tdoc;
    }

    if (query.ndoc) {
        q['ndoc'] = query.ndoc;
    }

    if (query.email) {
        q['email'] = query.email;
    }

    return q;
}

function encrypt(input) {
    const cifrador = crypto.createCipheriv('aes-256-ctr', key, IV);
    let inputCifrado = cifrador.update(input, 'utf8', 'hex');

    inputCifrado += cifrador.final('hex');

    return inputCifrado;
}


function comparePasswords(plain, encrypted, callback) {
    if (encrypt(plain) === encrypted) {
        callback(false, true);
    } else {
        callback({ error: 'Contraseña errónea' }, false);
    }
}


/**
 * 'hook' para encriptar el password antes de insertar un usuario nuevo
 */
usuarioWebSch.pre('save', function(next) {
    let usuario = this;
    usuario.password = encrypt(usuario.password);
    next();
});

/**
 * método verificador de contraseña
 */
usuarioWebSch.methods.comparePassword = function(passwordToCompare, callback) {
    comparePasswords(passwordToCompare, this.password, callback);
}
// TODO : Renombrar Record
const Usuario = mongoose.model('UsuarioWeb', usuarioWebSch, 'usuariosweb');

/******************************************************************************
 * Métodos públicos
 *
 */

exports.create = function(data, errorCallback, successCallback) {
    
    Usuario.create(data, function(error, result) {
        if (error) {
            console.dir(error);
            errorCallback(error);
        } else {

            person.createPersonFromUser(result, successCallback)
                //successCallback(result);
        }
    });
}

exports.update = function(id, data, errorCallback, successCallback) {
    Usuario.findByIdAndUpdate(id, data, { new: true }, function(error, result) {
        if (error) {
            errorCallback(error);
        } else {
            successCallback(result);
        }
    });
}

exports.delete = function(id, errorCallback, successCallback) {
    Usuario.findByIdAndDelete(id, function(error, result) {
        if (error) {
            errorCallback(error);
        } else {
            successCallback(result);
        }
    });
}

exports.findAll = function(errorCallback, successCallback) {
    Usuario.find().lean().exec(function(error, result) {
        if (error) {
            errorCallback(error);
        } else {
            successCallback(result);
        }
    });
}

exports.findByQuery = function(query, errorCallback, successCallback) {
    const regexQuery = buildQuery(query);

    Usuario.find(regexQuery).lean().exec(function(error, result) {
        if (error) {
            errorCallback(error);
        } else {
            successCallback(result);
        }
    });
}

// exports.findById = function(id, errorCallback, successCallback) {
exports.findById = function(id, callback) {
    Usuario.findById(id, function(error, user) {
        callback(error, user);
        // if (error) {
        //     errorCallback(error);
        // } else {
        //     successCallback(user);
        // }
    });
}

exports.findByUsername = function(username, callback) {
    Usuario.findOne({ username: username }, function(error, user) {
        callback(error, user);
    });
}

exports.findPersonForUser = function(id, errorCallback, successCallback) {
    person.findByQuery({ userwebId: id }, function(error) {
        errorCallback(error);
    }, function(person) {
        successCallback(person);
    });
}

exports.verifyPassword = function(currentPassword, passwordToCompare, callback) {
    comparePasswords(currentPassword, passwordToCompare, callback);
};

exports.resetPassword = function(data, errorCallback, callback) {
    Usuario.findOneAndUpdate({ email: data.email, preguntaSecreta: data.preguntaSecreta, respuestaSecreta: data.respuestaSecreta }, { password: encrypt(data.password) }, function(error, result) {
        if (error) {
            errorCallback(error);
        } else {
            callback(result);
        }
    });
}

exports.recalcularEdad = function(user){
    if(!user.isMayorEdad){
        let edad = utils.calcularEdad(user.tsFechaNacimiento);
        if(edad >= 18){
            Usuario.findByIdAndUpdate(user._id, {isMayorEdad : true});
        }
    }
}