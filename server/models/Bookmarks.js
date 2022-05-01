const db = require('../database/dbPool');
const BookmarksModel  = {};

/** Returns true if the user has already bookmarked the thread. */
BookmarksModel.bookmarkExists = (userId, threadId) => {
    const query = `SELECT user_id FROM bookmarks
                   WHERE user_id=? AND thread_id=?;`;

    return db.query(query, [userId, threadId])
    .then(([results]) => { return results.length > 0; })
    .catch(err => Promise.reject(err));
}

/** Creates a bookmark of a thread for a user.
  * On success, return the user's id. On failure, return -1. */
BookmarksModel.createBookmark = (userId, threadId) => {
    return db.query('INSERT INTO bookmarks (user_id, thread_id) VALUES (?, ?);', [userId, threadId])
    .then(([results]) => {
        if (results.affectedRows) return userId;
        else return -1;
    })
    .catch(err => Promise.reject(err));
}

module.exports = BookmarksModel;