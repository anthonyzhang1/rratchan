const db = require('../database/dbPool');
const BoardsModel = {};

/** Get boards sorted in alphabetical order by short name. */
BoardsModel.getBoards = () => {
    const query = `SELECT short_name, name
                   FROM boards
                   ORDER BY short_name ASC;`;

    return db.query(query)
    .then(([results, fields]) => { return results; })
    .catch(err => Promise.reject(err));
}

module.exports = BoardsModel;