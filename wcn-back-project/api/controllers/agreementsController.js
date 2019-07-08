'use strict';

const Database = require('../db.config'),
    Errors = require('../errors.config');

exports.searchList = async (req, res, next) => {
    const db = new Database();
    const dynamicFilter = [];
    const searchById = req.params.id;
    const searchByClinic = req.query.searchByClinic;
    const searchByName = req.query.searchByName;
    const perPage = parseInt(req.query.perPage, 10) || 30;
    const currentPage = parseInt(req.query.currentPage, 10) || 0;
    const skipRows = currentPage * perPage;
    let countRows, countPages, searchResults;

    if (searchById) dynamicFilter.push(`code = ${searchById}`);
    if (searchByClinic) dynamicFilter.push(`clinicCode = ${searchByClinic}`);
    if (searchByName) dynamicFilter.push(`agreement LIKE '%${searchByName}%'`);
    let searchFilters = (dynamicFilter.length > 0) ? `WHERE ${dynamicFilter.join(" AND ")}` : '';

    let query = await db.query(`SELECT COUNT(*) AS NUMROWS FROM VIW_CLN_CON ${searchFilters}`).then((results) => {
            countRows = results[0].NUMROWS;
            countPages = Math.ceil(countRows / perPage);
            return db.query(`SELECT * FROM VIW_CLN_CON ${searchFilters} ORDER BY agreement DESC LIMIT ${skipRows},${perPage}`);
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