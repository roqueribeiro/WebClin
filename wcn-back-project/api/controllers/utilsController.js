'use strict';

const axios = require('axios'),
    Errors = require('../errors.config');

exports.searchAddressByZipcode = async (req, res, next) => {
    return await axios
        .get(`http://webservice.uni5.net/web_cep.php`, {
            responseType: "json",
            params: {
                auth: "295e6211c7941412237bef695f396379",
                formato: "json",
                cep: req.query.zipcode
            }
        })
        .then(response => {
            res.json(response.data);
        })
        .catch(err => {
            next(new Errors.InternalServerError(err.code));
        });
};