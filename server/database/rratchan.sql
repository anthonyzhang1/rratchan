-- This file contains rratchan's MySQL DDL.
--
-- You can just copy and paste this entire file into MySQL Workbench to
-- create the database and tables.
--
-- Last updated 04/21/22, 16:26 PST.

CREATE DATABASE rratchan;
USE rratchan;

CREATE TABLE users (
    id         int NOT NULL UNIQUE AUTO_INCREMENT,
    username   varchar(64) NOT NULL UNIQUE,
    email      varchar(100) NOT NULL,
    password   varchar(64) NOT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_mod     boolean NOT NULL DEFAULT false,
    PRIMARY KEY (id)
);

CREATE TABLE boards (
    id          int NOT NULL UNIQUE AUTO_INCREMENT,
    short_name  varchar(5) NOT NULL UNIQUE,
    name        varchar(64) NOT NULL UNIQUE,
    description varchar(3000),
    user_id     int,
    PRIMARY KEY (id),
    CONSTRAINT board_creator_id FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE threads (
    id             int NOT NULL UNIQUE AUTO_INCREMENT,
    subject        varchar(255),
    body           varchar(5000),
    image_path     varchar(500) NOT NULL,
    thumbnail_path varchar(500) NOT NULL,
    orig_filename  varchar(255) NOT NULL,
    created_at     datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    archived       boolean NOT NULL DEFAULT false,
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
    reply          varchar(5000) NOT NULL,
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