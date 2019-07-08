'use strict';

const mysql = require('mysql');

module.exports = class Database {
  constructor() {
    this.connection = mysql.createPool({
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      aquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      debug: false
    });
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(sql, args, (err, rows) => {
          connection.release();
          if (err)
            return reject(err);
          resolve(rows);
        });
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err)
          return reject(err);
        resolve();
      });
    });
  }
}