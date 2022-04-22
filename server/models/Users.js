var db = require('../database/dbPool');
const UsersModel = {};

/** Returns true if the username already exists. */
UsersModel.usernameExists = (username) => {
    return db.query('SELECT id FROM users WHERE username=?', [username])
    .then(([rows, fields]) => {
        return rows.length > 0;
    })
    .catch(err => Promise.reject(err));
}

/** Create an account with the given credentials. The credentials should be validated first.
  * On success, return the userID. On failure, return -1. */
UsersModel.createAccount = (username, email, password) => {
    let query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?);`;

    return db.query(query, [username, email, password])
    .then(([rows, fields]) => {
        if (rows.affectedRows) return rows.insertId;
        else return -1;
    })
    .catch(err => Promise.reject(err));
}

module.exports = UsersModel;