const db = require('../database/dbPool');
const ThreadsModel  = {};

/** Creates a thread instance in the database. The arguments should be validated first.
  * subject, body, userId are nullable.
  * On success, return the thread's id. On failure, return -1. */
ThreadsModel.createThread = (subject, body, imagePath, thumbnailPath,
                             originalFilename, boardId, userId) => {
    if (subject === '') subject = null;
    if (body === '') body = null;
    if (userId === '') userId = null;

    const query = `INSERT INTO threads (subject, body, image_path, thumbnail_path,
                                        orig_filename, board_id, user_id)
                   VALUES (?, ?, ?, ?, ?, ?, ?);`;

    return db.query(query, [subject, body, imagePath, thumbnailPath,
                            originalFilename, boardId, userId])
    .then(([results]) => {
        if (results.affectedRows) return results.insertId;
        else return -1;
    })
    .catch(err => Promise.reject(err));
}

module.exports = ThreadsModel;