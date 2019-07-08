'use strict';

module.exports = function (app) {
    var authVerify = require('../auth.verify');
    var agreements = require('../controllers/agreementsController');

    app.route('/agreements')
        .get(authVerify, agreements.searchList);

    app.route('/agreements/:id')
        .get(authVerify, agreements.searchList);
};