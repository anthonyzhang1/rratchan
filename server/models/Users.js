const db = require('../database/dbPool');
const UsersModel = {};

/** Returns true if the username has been taken. */
UsersModel.usernameExists = (username) => {
    return db.query('SELECT id FROM users WHERE username=?;', [username])
    .then(([results, fields]) => { return results.length > 0; })
    .catch(err => Promise.reject(err));
}

/** Create an account with the given credentials. The credentials should be validated first.
  * On success, return the user's id. On failure, return -1. */
UsersModel.createAccount = (username, email, password) => {
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?);`;

    return db.query(query, [username, email, password])
    .then(([results, fields]) => {
        if (results.affectedRows) return results.insertId;
        else return -1;
    })
    .catch(err => Promise.reject(err));
}

/** Checks if the given username and password pair are in the database.
  * If it is, return that user's id. If it is not, return -1. */
UsersModel.authenticate = (username, password) => {
    const query = `SELECT id FROM users WHERE username=? AND password=?;`;

    return db.query(query, [username, password])
    .then(([results, fields]) => {
        if (results.length === 1) return results[0].id;
        else return -1;
    })
    .catch(err => Promise.reject(err));
}

/** Makes the user with the given id a moderator.
  * On success, return the user's id. If no such account exists, return -1. */
UsersModel.makeMod = (userId) => {
    return db.query(`UPDATE users SET is_mod=1 WHERE id=?;`, [userId])
    .then(([results, fields]) => {
        if (results.affectedRows) return userId;
        else return -1;
    })
    .catch(err => Promise.reject(err));
}

module.exports = UsersModel;