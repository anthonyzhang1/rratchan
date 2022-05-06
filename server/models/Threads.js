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
  .catch(err => Promise.reject(err));
}

/** Get the number of threads made by a user with the given user id. On error, return -1. */
ThreadsModel.getUserThreadCount = (userId) => {
  const query = `SELECT COUNT(*) AS threadCount
                 FROM threads T INNER JOIN users U
                 ON T.user_id = U.id
                 WHERE U.id = ?;`;

  return db.query(query, [userId])
  .then(([results]) => {
    if (results[0]) return results[0].threadCount;
    else return -1;
  })
  .catch(err => Promise.reject(err));
}

/** Get a user's last `numThreads` threads, given the user's id. On error, return -1. */
ThreadsModel.getUserLastNThreads = (userId, numThreads) => {
  const query = `SELECT B.short_name, T.id AS threadId, T.subject, T.body
                 FROM threads T
                 INNER JOIN users U ON T.user_id = U.id
                 INNER JOIN boards B ON B.id = T.board_id
                 WHERE U.id = ?
                 ORDER BY T.created_at DESC
                 LIMIT ?;`;

  return db.query(query, [userId, numThreads])
  .then(([results]) => {
    if (results) return results;
    else return -1;
  })
  .catch(err => Promise.reject(err))
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