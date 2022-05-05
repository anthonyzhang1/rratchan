const db = require('../database/dbPool');
const RepliesModel  = {};

/** Creates a thread instance in the database. The arguments should be validated first.
  * imagePath, thumbnailPath, originalFilename, and userId are nullable.
  * On success, return the reply's id. On failure, return -1. */
RepliesModel.createReply = (reply, imagePath, thumbnailPath, originalFilename, threadId, userId) => {
    if (imagePath === '') imagePath = null;
    if (thumbnailPath === '') thumbnailPath = null;
    if (originalFilename === '') originalFilename = null;
    if (userId === '') userId = null;

    const query = `INSERT INTO replies (reply, image_path, thumbnail_path,
                                        orig_filename, thread_id, user_id)
                   VALUES (?, ?, ?, ?, ?, ?);`;

    return db.query(query, [reply, imagePath, thumbnailPath, originalFilename, threadId, userId])
    .then(([results]) => {
        if (results.affectedRows) return results.insertId;
        else return -1;
    })
    .catch(err => Promise.reject(err));
}

/** Gets `maxReplies` replies to a thread, given the thread's id.
  * If `maxReplies` < 0, or the query fails, then return -1. */
RepliesModel.getRepliesToThread = (threadId, maxReplies) => {
  if (maxReplies < 0) {
    console.log('getRepliesToThread() Error: maxReplies < 0.');
    return -1;
  }

  const query = `SELECT * FROM (
                     SELECT R.id, R.reply, R.image_path, R.thumbnail_path,
                            R.orig_filename, R.created_at, U.username
                     FROM replies R
                     INNER JOIN threads T ON R.thread_id = T.id
                     LEFT OUTER JOIN users U ON R.user_id = U.id
                     WHERE T.id = ?
                     ORDER BY R.created_at DESC
                     LIMIT ?) AS temp
                 ORDER BY temp.created_at ASC`;

  return db.query(query, [threadId, maxReplies])
  .then(([results]) => {
    if (results) return results;
    else return -1;
  })
  .catch(err => Promise.reject(err));
}

module.exports = RepliesModel;