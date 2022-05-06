-- This file contains the MySQL DDL for setting up the database.
-- You can just copy and paste this entire file into MySQL Workbench to set everything up.

CREATE DATABASE rratchan;
USE rratchan;

---------------------- Tables ----------------------
CREATE TABLE users (
    id         int NOT NULL UNIQUE AUTO_INCREMENT,
    username   varchar(64) NOT NULL UNIQUE,
    email      varchar(128) NOT NULL,
    password   varchar(64) NOT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_mod     boolean NOT NULL DEFAULT false,
    PRIMARY KEY (id)
);

CREATE TABLE boards (
    id          int NOT NULL UNIQUE AUTO_INCREMENT,
    short_name  varchar(5) NOT NULL UNIQUE,
    name        varchar(64) NOT NULL UNIQUE,
    description varchar(1000),
    user_id     int,
    PRIMARY KEY (id),
    CONSTRAINT board_creator_id FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE threads (
    id             int NOT NULL UNIQUE AUTO_INCREMENT,
    subject        varchar(255),
    body           varchar(2000),
    image_path     varchar(500) NOT NULL,
    thumbnail_path varchar(500) NOT NULL,
    orig_filename  varchar(255) NOT NULL,
    created_at     datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    board_id       int NOT NULL,
    user_id        int,
    PRIMARY KEY (id),
    CONSTRAINT parent_board_id FOREIGN KEY (board_id) REFERENCES boards (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT thread_creator_id FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE replies (
    id             int NOT NULL UNIQUE AUTO_INCREMENT,
    reply          varchar(2000) NOT NULL,
    image_path     varchar(500),
    thumbnail_path varchar(500),
    orig_filename  varchar(255),
    created_at     datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    thread_id      int NOT NULL,
    user_id        int,
    PRIMARY KEY (id),
    CONSTRAINT parent_thread_id FOREIGN KEY (thread_id) REFERENCES threads (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT reply_author_id FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE bookmarks (
    user_id    int NOT NULL,
    thread_id  int NOT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, thread_id),
    CONSTRAINT bookmark_creator_id FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT bookmarked_thread_id FOREIGN KEY (thread_id) REFERENCES threads (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

---------------------- Indexes ----------------------
-- -- Duplicate Index
-- CREATE UNIQUE INDEX IdxUserId
-- ON users (id)
-- USING BTREE;

-- -- Duplicate Index
-- CREATE UNIQUE INDEX IdxUsername
-- ON users (username)
-- USING BTREE;

-- -- Duplicate Index
-- CREATE UNIQUE INDEX IdxBoardId
-- ON boards (id)
-- USING BTREE;

-- -- Duplicate Index
-- CREATE UNIQUE INDEX IdxShortName
-- ON boards (short_name)
-- USING BTREE;

-- -- Duplicate Index
-- CREATE UNIQUE INDEX IdxBoardName
-- ON boards (name)
-- USING BTREE;

-- -- Duplicate Index
-- CREATE UNIQUE INDEX IdxThreadId
-- ON threads (id)
-- USING BTREE;

CREATE INDEX IdxFkBoardId
ON threads (board_id)
USING BTREE;

CREATE INDEX IdxFkUserId
ON threads (user_id)
USING BTREE;

CREATE INDEX IdxFkThreadId
ON replies (thread_id)
USING BTREE;

CREATE INDEX IdxFkUserId
ON replies (user_id)
USING BTREE;

-- -- Duplicate Index
-- CREATE UNIQUE INDEX IdxFkUserThreadId
-- ON bookmarks (user_id, thread_id)
-- USING BTREE;

---------------------- Views ----------------------
-- Gets the date of the most recent reply to a thread.
-- last_reply_date is null if a thread has no replies.
CREATE VIEW latest_reply_dates AS
SELECT T.id AS thread_id, MAX(R.created_at) AS last_reply_date
FROM threads T LEFT OUTER JOIN replies R
ON T.id = R.thread_id
GROUP BY T.id;