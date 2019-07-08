'use strict';

module.exports = function (app) {
    var authVerify = require('../auth.verify');
    var patients = require('../controllers/patientsController');

    app.route('/patients')
        .get(authVerify, patients.searchList)
        .post(authVerify, patients.createNewRow);

    app.route('/patients/:id')
        .get(authVerify, patients.searchList)
        .put(authVerify, patients.updateRow)
        .delete(authVerify, patients.deleteRow);
};