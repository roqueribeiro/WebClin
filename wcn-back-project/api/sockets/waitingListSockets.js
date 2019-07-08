'use strict';

const Database = require('../db.config');

const getWaitingList = async () => {
    const db = new Database();
    return await db.query(
            'SELECT * FROM VIW_CLN_WLS',
        ).then((results) => {
            db.close();
            return results;
        })
        .catch(err => {
            return err;
        });
};

const addToWaitingList = async (data) => {
    const db = new Database();
    return await db.query(
            'INSERT INTO TB_CLN_WLS SET ?', {
                CLN_WLS_PAC: data.patient,
                CLN_WLS_CLN: data.clinic,
                CLN_WLS_USR: data.user
            },
        ).then((results) => {
            db.close();
            return results;
        })
        .catch(err => {
            return err;
        });
};

const removeFromWaitingList = async (data) => {
    const db = new Database();
    return await db.query(
            `UPDATE 
                TB_CLN_WLS 
            SET 
                CLN_WLS_STA = 0,
                CLN_WLS_DTA = CURRENT_TIMESTAMP,
                CLN_WLS_USA = ?
            WHERE 
                CLN_WLS_COD = ?`, [
                    data.user,
                    data.waitingCode
                ],
        ).then((results) => {
            db.close();
            return results;
        })
        .catch(err => {
            return err;
        });
};

module.exports = function (io) {
    const emitWaitingList = () => {
        getWaitingList().then((results) => {
            io.emit('WAITING_LIST', results);
        });
    }
    io.on('connection', function (socket) {
        emitWaitingList();
        socket.on('LOAD_WAITING_LIST', () => {
            emitWaitingList();
        });
        socket.on('ADD_TO_WAITING_LIST', (data) => {
            addToWaitingList(data).then(() => {
                emitWaitingList();
            });
        });
        socket.on('REMOVE_FROM_WAITING_LIST', (data) => {
            removeFromWaitingList(data).then(() => {
                emitWaitingList();
            });
        });
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });
};