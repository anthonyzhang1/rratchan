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

module.exports = RepliesModel;