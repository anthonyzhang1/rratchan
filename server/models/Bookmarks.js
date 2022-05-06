const db = require('../database/dbPool');
const BookmarksModel  = {};

/** Get the number of bookmarks made by a user with the given user id. On error, return -1. */
BookmarksModel.getUserBookmarkCount = (userId) => {
    const query = `SELECT COUNT(*) AS bookmarkCount
                   FROM bookmarks B INNER JOIN users U
                   ON B.user_id = U.id
                   WHERE U.id = ?;`;
  
    return db.query(query, [userId])
    .then(([results]) => {
      if (results[0]) return results[0].bookmarkCount;
      else return -1;
    })
    .catch(err => Promise.reject(err));
  }

/** Get a user's bookmarks and the content of the bookmarked threads, given the user's id.
  * On error, return -1. */
BookmarksModel.getUserDetailedBookmarks = (userId) => {
    const query = `SELECT Brd.short_name, T.id AS threadId, T.subject,
                          T.body, Bmk.created_at AS dateBookmarked
                   FROM users U
                   INNER JOIN bookmarks Bmk ON U.id = Bmk.user_id
                   INNER JOIN threads T ON Bmk.thread_id = T.id
                   INNER JOIN boards Brd ON T.board_id = Brd.id
                   WHERE U.id = ?
                   ORDER BY Bmk.created_at DESC;`;
  
    return db.query(query, [userId])
    .then(([results]) => {
      if (results) return results;
      else return -1;
    })
    .catch(err => Promise.reject(err))
  }

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