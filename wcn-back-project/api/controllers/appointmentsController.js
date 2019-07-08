'use strict';

const Database = require('../db.config'),
    Errors = require('../errors.config');

exports.searchList = async (req, res, next) => {
    const db = new Database();
    const dynamicFilter = [];
    const searchById = req.params.id;
    const searchByName = req.query.searchByName;
    const searchByDescription = req.query.searchByDescription;
    const perPage = parseInt(req.query.perPage, 10) || 30;
    const currentPage = parseInt(req.query.currentPage, 10) || 0;
    const skipRows = currentPage * perPage;
    let countRows, countPages, searchResults;

    if (searchById) dynamicFilter.push(`userCode = ${searchById}`);
    if (searchByName) dynamicFilter.push(`fullname LIKE '%${searchByName}%'`);
    if (searchByDescription) dynamicFilter.push(`description LIKE '%${searchByDescription}%'`);
    let searchFilters = (dynamicFilter.length > 0) ? `WHERE ${dynamicFilter.join(" AND ")}` : '';

    let query = await db.query(`SELECT COUNT(*) AS NUMROWS FROM VIW_CLN_ATN ${searchFilters}`).then((results) => {
            countRows = results[0].NUMROWS;
            countPages = Math.ceil(countRows / perPage);
            return db.query(`SELECT * FROM VIW_CLN_ATN ${searchFilters} ORDER BY creationDate DESC LIMIT ${skipRows},${perPage}`);
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
            'INSERT INTO TB_CLN_ATN SET ?', {
                CLN_ATN_TPO: req.body.type,
                CLN_ATN_CID: req.body.cid,
                CLN_ATN_ANM: req.body.description,
                CLN_ATN_PAC: req.body.patient,
                CLN_ATN_USR: req.body.creationUser,
                CLN_ATN_CLN: req.body.clinic
            },
        ).then((results) => {
            res.json(results);
            return db.close();
        })
        .catch(err => {
            next(new Errors.InternalServerError(err));
        });
    return query;
};

exports.updateRow = async (req, res, next) => {
    const db = new Database();
    let query = await db.query(
            `UPDATE 
            TB_CLN_ATN 
        SET 
            CLN_ATN_TPO = ?,
            CLN_ATN_CID = ?,
            CLN_ATN_ANM = ?,
            CLN_ATN_PAC = ?,
            CLN_ATN_USR = ?,
            CLN_ATN_CLN = ?
        WHERE 
            CLN_ATN_COD = ?`, [
                req.body.type,
                req.body.cid,
                req.body.description,
                req.body.patient,
                req.body.creationUser,
                req.body.clinic,
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
            'DELETE FROM TB_CLN_ATN WHERE CLN_ATN_COD = ?',
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

exports.cid10 = async (req, res, next) => {
    const jsonFile = require('../_utils/cid10.json');
    const searchByCid = req.query.searchByCid || '';
    const searchByDescription = req.query.searchByDescription || '';
    let jsonFileFiltered = jsonFile.filter(item =>
        item.code.toString().trim().toUpperCase().includes(searchByCid.toString().trim().toUpperCase()) &&
        item.value.toString().trim().toUpperCase().includes(searchByDescription.toString().trim().toUpperCase())
    );
    res.json(jsonFileFiltered);
};