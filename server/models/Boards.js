const db = require('../database/dbPool');
const BoardsModel = {};

BoardsModel.getBoards = () => {
    // Get boards sorted in alphabetical order by short name
    let query = `SELECT short_name, name
                 FROM boards
                 ORDER BY short_name ASC;`;

    return db.query(query)
    .then(([rows, fields]) => {
        return rows;
    })
    .catch(err => Promise.reject(err));
}

module.exports = BoardsModel;