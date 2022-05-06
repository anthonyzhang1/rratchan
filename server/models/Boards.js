const db = require('../database/dbPool');
const BoardsModel = {};

/** Returns true if the board's short name has been taken. */
BoardsModel.shortNameExists = (short_name) => {
    return db.query('SELECT id FROM boards WHERE short_name=?;', [short_name])
    .then(([results]) => { return results.length > 0; })
    .catch(err => Promise.reject(err));
}

/** Returns true if the board's name has been taken. */
BoardsModel.nameExists = (name) => {
    return db.query('SELECT id FROM boards WHERE name=?;', [name])
    .then(([results]) => { return results.length > 0; })
    .catch(err => Promise.reject(err));
}

/** Get boards sorted in alphabetical order by short name. */
BoardsModel.getBoards = () => {
    const query = `SELECT short_name, name
                   FROM boards
                   ORDER BY short_name ASC;`;

    return db.query(query)
    .then(([results]) => { return results; })
    .catch(err => Promise.reject(err));
}

/** Returns a board's id, name, and description given its short name.
  * If a matching board was not found, return -1. */
BoardsModel.getBoardData = (short_name) => {
    const query = `SELECT B.id, B.name, B.description, U.username
                   FROM boards B LEFT OUTER JOIN users U
                   ON B.user_id = U.id
                   WHERE B.short_name=?;`;

    return db.query(query, [short_name])
    .then(([results]) => {
        if (results[0]) return results[0];
        else return -1;
    })
    .catch(err => Promise.reject(err));
}

/** Gets what is needed to show the `maxThreads` recent threads in a board's catalog.
  * The order in which the threads are returned is determined by `sortBy`.
  * `sortBy = 'creationDate'`: Gets the most recent `maxThreads` threads by creation date.
  * `sortBy = 'lastReply'`: Gets the most recent `maxThreads` threads by last reply date.
  * If `sortBy` is invalid, `maxThreads` < 0, or the query fails, then return -1. */
BoardsModel.getCatalogThreads = (board_id, maxThreads, sortBy) => {
    let query = '';

    if (maxThreads < 0) {
        console.log('getCatalogThreads() Error: maxThreads < 0.');
        return -1;
    } else if (sortBy === 'lastReply') {
        query = `SELECT T.id, T.subject, T.body, T.thumbnail_path, (
                    SELECT MAX(R.created_at) FROM replies R
                    WHERE R.thread_id = T.id
                 ) AS last_reply_date
                 FROM threads T WHERE board_id = ?
                 ORDER BY COALESCE(last_reply_date, T.created_at) DESC
                 LIMIT ?;`;
    } else if (sortBy === 'creationDate') {
        query = `SELECT id, subject, body, thumbnail_path
                 FROM threads WHERE board_id = ?
                 ORDER BY created_at DESC
                 LIMIT ?;`;
    }  else { // invalid `sortBy` argument
        console.log('getCatalogThreads() Error: invalid sortBy argument.');
        return -1;
    }

    return db.query(query, [board_id, maxThreads])
    .then(([results]) => {
        if (results) return results;
        else return -1;
    })
    .catch(err => Promise.reject(err));
}

/** Creates a board with the given arguments. The arguments should be validated first.
  * description is nullable.
  * On success, return the board's id. On failure, return -1. */
BoardsModel.createBoard = (short_name, name, description, user_id) => {
    if (description === '') description = null;

    const query = `INSERT INTO boards (short_name, name, description, user_id)
                   VALUES (?, ?, ?, ?);`;

    return db.query(query, [short_name, name, description, user_id])
    .then(([results]) => {
        if (results.affectedRows) return results.insertId;
        else return -1;
    })
    .catch(err => Promise.reject(err));
}

module.exports = BoardsModel;