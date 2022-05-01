const db = require('../database/dbPool');
const ThreadsModel  = {};

/** Get the board and thread data given a thread id.
  * If a matching thread was not found, return -1. */
ThreadsModel.getThreadData = (threadId) => {
  const query = `SELECT B.short_name, B.name AS board_name, T.subject, T.body,
                 T.image_path, T.orig_filename, T.created_at, U.username
                 FROM threads T
                 INNER JOIN boards B ON T.board_id = B.id
                 LEFT OUTER JOIN users U ON T.user_id = U.id
                 WHERE T.id = ?;`;
            
  return db.query(query, [threadId])
  .then(([results]) => {
    if (results[0]) return results[0];
    else return -1;
  })
  .catch(err => Promise.return(err));
}

/** Creates a thread instance in the database. The arguments should be validated first.
  * subject, body, and userId are nullable.
  * On success, return the thread's id. On failure, return -1. */
ThreadsModel.createThread = (subject, body, imagePath, thumbnailPath, originalFilename, boardId, userId) => {
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