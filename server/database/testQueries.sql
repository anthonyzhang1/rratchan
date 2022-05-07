-- This file contains some MySQL queries for testing the database.
--
-- NOTE: This file will be deleted later; this is just for testing.

---------------------- Required SQL Queries ----------------------
-- Find the thread id, thread subject, and number of replies in all threads
-- that have at least 2 replies. Then, sort the rows such that the number of replies
-- are in decreasing order.
SELECT T.id AS thread_id, T.subject AS thread_subject, COUNT(*) AS num_replies
FROM threads T INNER JOIN replies R
ON T.id = R.thread_id
GROUP BY T.id
HAVING COUNT(*) >= 2
ORDER BY num_replies DESC;

-- Find the board name and the date of the most recent reply in all boards which
-- have more than 2 replies.
-- Then, sort the rows such that the board names are in ascending alphabetical order.
SELECT B.name AS board_name, MAX(R.created_at) AS most_recent_reply_date
FROM boards B
INNER JOIN threads T ON B.id = T.board_id
INNER JOIN replies R ON T.id = R.thread_id
GROUP BY B.id
HAVING COUNT(*) >= 2
ORDER BY B.name ASC;

-- Find the thread id and subject of all the threads that belong
-- to the board with the short name 'mu'.
SELECT T.id AS thread_id, T.subject AS subject
FROM threads T
WHERE T.board_id IN (SELECT B.id
					 FROM boards B
                     WHERE B.short_name = 'mu');

-- Find the user id and username of the users who were created after
-- any user who is a mod.
SELECT U1.id, U1.username
FROM users U1
WHERE U1.created_at > ANY (SELECT U2.created_at
							FROM users U2
							WHERE U2.is_mod = 1);

---------------------- Additional SQL Queries ----------------------
-- For the user with id = 1, find the board name, thread id, thread subject,
-- and date bookmarked associated with each of the user’s bookmarks.
-- Then, sort the rows by the date bookmarked, with the newest bookmarks being at the top.
SELECT BRD.name AS board_name, T.id AS thread_id,
       T.subject AS thread_subject, BKMK.created_at AS date_bookmarked
FROM users U
INNER JOIN bookmarks BKMK ON U.id = BKMK.user_id
INNER JOIN threads T ON BKMK.thread_id = T.id
INNER JOIN boards BRD ON T.board_id = BRD.id
WHERE U.id = 1
ORDER BY BKMK.created_at DESC;

-- Find the thread id and subject of the threads started by
-- the user with the username 'TRYPTOPHAN'.
SELECT T.id AS thread_id, T.subject AS thread_subject
FROM threads T INNER JOIN users U
ON T.user_id = U.id
WHERE U.username = 'TRYPTOPHAN';