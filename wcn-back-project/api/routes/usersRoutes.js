'use strict';

module.exports = function (app) {
    var authVerify = require('../auth.verify');
    var users = require('../controllers/usersController');

    app.route('/users')
        .get(authVerify, users.searchList)
        .post(authVerify, users.createNewRow);

    app.route('/users/:id')
        .get(authVerify, users.searchList)
        .put(authVerify, users.updateRow)
        .delete(authVerify, users.deleteRow);
};