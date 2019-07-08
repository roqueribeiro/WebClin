'use strict';

module.exports = function (app) {
    var authVerify = require('../auth.verify');
    var utils = require('../controllers/utilsController');

    app.route('/utils/cep')
        .get(authVerify, utils.searchAddressByZipcode);
};