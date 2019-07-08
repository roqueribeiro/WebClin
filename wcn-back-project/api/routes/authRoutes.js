'use strict';

module.exports = function (app) {
    var auth = require('../controllers/authController');

    app.route('/authentication').post(auth.authentication);
};