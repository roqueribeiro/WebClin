'use strict';

const Database = require('../db.config'),
    Errors = require('../errors.config');

exports.searchList = async (req, res, next) => {
    const db = new Database();
    const dynamicFilter = [];
    const searchById = req.params.id;
    const searchByName = req.query.searchByName;
    const perPage = parseInt(req.query.perPage, 10) || 30;
    const currentPage = parseInt(req.query.currentPage, 10) || 0;
    const skipRows = currentPage * perPage;
    let countRows, countPages, searchResults;

    if (searchById) dynamicFilter.push(`code = ${searchById}`);
    if (searchByName) dynamicFilter.push(`fullname LIKE '%${searchByName}%'`);
    let searchFilters = (dynamicFilter.length > 0) ? `WHERE ${dynamicFilter.join(" AND ")}` : '';

    let query = await db.query(`SELECT COUNT(*) AS NUMROWS FROM VIW_CLN_USR ${searchFilters}`).then((results) => {
            countRows = results[0].NUMROWS;
            countPages = Math.ceil(countRows / perPage);
            return db.query(`SELECT * FROM VIW_CLN_USR ${searchFilters} ORDER BY fullname LIMIT ${skipRows},${perPage}`);
        }).then((results) => {
            searchResults = results;
            if (!results.length)
                next(new Errors.NotFound());
            return db.close();
        }).then(() => {
            res.json({
                results: searchResults,
                pagination: {
                    rows: countRows,
                    pages: countPages,
                    currentPage: currentPage,
                    perPage: perPage,
                    previous: currentPage > 0 ? currentPage - 1 : undefined,
                    next: currentPage < countPages - 1 ? currentPage + 1 : undefined
                }
            });
        })
        .catch(err => {
            next(new Errors.InternalServerError(err.code));
        });
    return query;
};

exports.createNewRow = async (req, res, next) => {
    const db = new Database();
    let query = await db.query(
            'INSERT INTO TB_CLN_USR SET ?', {
                CLN_USR_CLN: req.body.clinic,
                CLN_USR_NOM: req.body.name,
                CLN_USR_SNO: req.body.surname,
                CLN_USR_LOG: req.body.login,
                CLN_USR_SEN: req.body.password,
                CLN_USR_TYP: req.body.type,
                CLN_USR_ACS: req.body.level
            },
        ).then((results) => {
            res.json(results);
            return db.close();
        })
        .catch(err => {
            next(new Errors.InternalServerError(err.code));
        });
    return query;
};

exports.updateRow = async (req, res, next) => {
    const db = new Database();
    let query = await db.query(
            `UPDATE 
                TB_CLN_USR 
            SET 
                CLN_USR_NOM = ?, 
                CLN_USR_SNO = ?, 
                CLN_USR_SEN = ?, 
                CLN_USR_TYP = ?, 
                CLN_USR_ACS = ? 
            WHERE 
                CLN_USR_COD = ?`, [
                req.body.name,
                req.body.surname,
                req.body.password,
                req.body.type,
                req.body.level,
                req.params.id
            ],
        ).then((results) => {
            res.json(results);
            return db.close();
        })
        .catch(err => {
            next(new Errors.InternalServerError(err.code));
        });
    return query;
};

exports.deleteRow = async (req, res, next) => {
    const db = new Database();
    let query = await db.query(
            'DELETE FROM TB_CLN_USR WHERE CLN_USR_COD = ?',
            [req.params.id],
        ).then((results) => {
            res.json(results);
            return db.close();
        })
        .catch(err => {
            next(new Errors.InternalServerError(err.code));
        });
    return query;
};