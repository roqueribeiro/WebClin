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
    if (searchByName) dynamicFilter.push(`fullname LIKE '%${searchByName}%'`);
    let searchFilters = (dynamicFilter.length > 0) ? `WHERE ${dynamicFilter.join(" AND ")}` : '';

    let query = await db.query(`SELECT COUNT(*) AS NUMROWS FROM VIW_CLN_PAC ${searchFilters}`).then((results) => {
            countRows = results[0].NUMROWS;
            countPages = Math.ceil(countRows / perPage);
            return db.query(`SELECT * FROM VIW_CLN_PAC ${searchFilters} ORDER BY fullname LIMIT ${skipRows},${perPage}`);
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
            'INSERT INTO TB_CLN_PAC SET ?', {
                CLN_PAC_CON: req.body.agreementCode,
                CLN_PAC_NOM: req.body.name.trim().toUpperCase(),
                CLN_PAC_SNO: req.body.surname.trim().toUpperCase(),
                CLN_PAC_SEX: req.body.gender,
                CLN_PAC_TEL: req.body.housePhone,
                CLN_PAC_CEL: req.body.mobilePhone,
                CLN_PAC_PRG: req.body.rg,
                CLN_PAC_CPF: req.body.cpf,
                CLN_PAC_NAS: req.body.birthDate,
                CLN_PAC_CEP: req.body.zipcode,
                CLN_PAC_RUA: req.body.address.trim().toUpperCase(),
                CLN_PAC_NUM: req.body.houseNumber,
                CLN_PAC_BAI: req.body.district.trim().toUpperCase(),
                CLN_PAC_CID: req.body.city.trim().toUpperCase(),
                CLN_PAC_EST: req.body.state.trim().toUpperCase(),
                CLN_PAC_USR: req.body.creationUser,
                CLN_PAC_CLN: req.body.clinic
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
                TB_CLN_PAC
            SET
                CLN_PAC_CON = ?,
                CLN_PAC_NOM = ?,
                CLN_PAC_SNO = ?,
                CLN_PAC_SEX = ?,
                CLN_PAC_TEL = ?,
                CLN_PAC_CEL = ?,
                CLN_PAC_PRG = ?,
                CLN_PAC_CPF = ?,
                CLN_PAC_NAS = ?,
                CLN_PAC_CEP = ?,
                CLN_PAC_RUA = ?,
                CLN_PAC_NUM = ?,
                CLN_PAC_BAI = ?,
                CLN_PAC_CID = ?,
                CLN_PAC_EST = ?,
                CLN_PAC_CLN = ?
            WHERE 
                CLN_PAC_COD = ?`, [
                req.body.agreementCode,
                req.body.name.trim().toUpperCase(),
                req.body.surname.trim().toUpperCase(),
                req.body.gender,
                req.body.housePhone,
                req.body.mobilePhone,
                req.body.rg,
                req.body.cpf,
                req.body.birthDate,
                req.body.zipcode,
                req.body.address.trim().toUpperCase(),
                req.body.houseNumber,
                req.body.district.trim().toUpperCase(),
                req.body.city.trim().toUpperCase(),
                req.body.state.trim().toUpperCase(),
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
            'DELETE FROM TB_CLN_PAC WHERE CLN_PAC_COD = ?',
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