'use strict';

module.exports = function (app) {
    var authVerify = require('../auth.verify');
    var appointments = require('../controllers/appointmentsController');

    app.route('/appointments')
        .get(authVerify, appointments.searchList)
        .post(authVerify, appointments.createNewRow);

    app.route('/appointments/:id')
        .get(authVerify, appointments.searchList)
        .put(authVerify, appointments.updateRow)
        .delete(authVerify, appointments.deleteRow);

    app.route('/cid10')
        .get(authVerify, appointments.cid10);
};