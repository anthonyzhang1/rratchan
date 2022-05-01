const db = require('../database/dbPool');
const UsersModel = {};

/** Returns the user's id with the given username. If no matches, return -1. */
UsersModel.getIdWithUsername = (username) => {
    return db.query('SELECT id FROM users WHERE username=?;', [username])
    .then(([results]) => {
        if (results.length === 1) return results[0].id;
        else return -1;
    })
    .catch(err => Promise.reject(err));
}

/** Returns true if the username has been taken. */
UsersModel.usernameExists = (username) => {
    return db.query('SELECT id FROM users WHERE username=?;', [username])
    .then(([results]) => { return results.length > 0; })
    .catch(err => Promise.reject(err));
}

/** Create an account with the given credentials. The credentials should be validated first.
  * On success, return the user's id. On failure, return -1. */
UsersModel.createAccount = (username, email, password) => {
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?);`;

    return db.query(query, [username, email, password])
    .then(([results]) => {
        if (results.affectedRows) return results.insertId;
        else return -1;
    })
    .catch(err => Promise.reject(err));
}

/** Checks if the given username and password belong to an account.
  * If a matching account is found, return that account's id. The id will be a positive number.
  * If NO matching account is found, return -1. */
UsersModel.authenticate = (username, password) => {
    const query = `SELECT id FROM users WHERE username=? AND password = BINARY ?;`;

    return db.query(query, [username, password])
    .then(([results]) => {
        if (results.length === 1) return results[0].id;
        else return -1;
    })
    .catch(err => Promise.reject(err));
}

/** Checks if the given username and password belong to a moderator account.
  * If the account is a moderator account, return that account's id.
  *   The id will be a positive number.
  * If the account is NOT a moderator account, return 0.
  * If the username and password do not belong to an account, return -1. */
UsersModel.authenticateMod = (username, password) => {
    const query = `SELECT id, is_mod FROM users WHERE username=? AND password = BINARY ?;`;

    return db.query(query, [username, password])
    .then(([results]) => {
        if (results.length === 1 && results[0].is_mod === 1) return results[0].id; // mod
        else if (results.length === 1) return 0; // not mod
        else return -1; // no account found
    })
    .catch(err => Promise.reject(err));
}

/** Makes the user with the given id a moderator.
  * On success, return the user's id. If no such account exists, return -1. */
UsersModel.makeMod = (userId) => {
    return db.query(`UPDATE users SET is_mod=1 WHERE id=?;`, [userId])
    .then(([results]) => {
        if (results.affectedRows) return userId;
        else return -1;
    })
    .catch(err => Promise.reject(err));
}

module.exports = UsersModel;