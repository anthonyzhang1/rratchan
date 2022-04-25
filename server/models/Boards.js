const db = require('../database/dbPool');
const BoardsModel = {};

/** Returns true if the board's short name has been taken. */
BoardsModel.shortNameExists = (short_name) => {
    return db.query('SELECT id FROM boards WHERE short_name=?;', [short_name])
    .then(([results, fields]) => { return results.length > 0; })
    .catch(err => Promise.reject(err));
}

/** Returns true if the board's name has been taken. */
BoardsModel.nameExists = (name) => {
    return db.query('SELECT id FROM boards WHERE name=?;', [name])
    .then(([results, fields]) => { return results.length > 0; })
    .catch(err => Promise.reject(err));
}

/** Get boards sorted in alphabetical order by short name. */
BoardsModel.getBoards = () => {
    const query = `SELECT short_name, name
                   FROM boards
                   ORDER BY short_name ASC;`;

    return db.query(query)
    .then(([results, fields]) => { return results; })
    .catch(err => Promise.reject(err));
}

/** Creates a board with the given arguments. The arguments should be validated first.
  * description can be an empty string: it will be stored as null in the database.
  * On success, return the board's id. On failure, return -1. */
BoardsModel.createBoard = (short_name, name, description, user_id) => {
    if (description === '') description = null;

    const query = `INSERT INTO boards (short_name, name, description, user_id)
                   VALUES (?, ?, ?, ?);`;

    return db.query(query, [short_name, name, description, user_id])
    .then(([results, fields]) => {
        if (results.affectedRows) return results.insertId;
        else return -1;
    })
    .catch(err => Promise.reject(err));
}

module.exports = BoardsModel;