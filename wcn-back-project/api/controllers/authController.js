'use strict';

require('dotenv-safe').load();
const Database = require('../db.config'),
    Errors = require('../errors.config'),
    jwt = require('jsonwebtoken');

exports.authentication = async function (req, res, next) {
    const db = new Database();
    let query = await db.query(
            'SELECT CLN_USR_COD FROM TB_CLN_USR WHERE CLN_USR_LOG = ? AND CLN_USR_SEN = ?',
            [
                req.body.username,
                req.body.password
            ]
        ).then((results) => {
            db.close();
            if (!results.length)
                next(new Errors.Unauthorized());

            const expiresIn = 60 * 60;
            const userId = results[0].CLN_USR_COD;
            res.status(200).json({
                auth: true,
                user: userId,
                token: `Bearer ${jwt.sign({userId}, process.env.SECRET, {expiresIn: expiresIn })}`,
                expiresIn: expiresIn
            });
        })
        .catch(err => {
            db.close();
            next(new Errors.InternalServerError(err.code));
        });
    return query;
};