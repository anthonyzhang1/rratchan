-- This file contains the MySQL DDL for inserting some initial entries into the boards table.
-- You do not need to use this: you can start with a blank slate if desired.
-- If you do want to use this, then copy and paste this entire file into MySQL Workbench.

---------------------- Boards ----------------------
INSERT INTO boards (short_name, name, description, user_id)
VALUES ('a', 'Anime & Manga', 'For Japanese anime and manga only. Not western cartoons or comics.', NULL);
INSERT INTO boards (short_name, name, description, user_id)
VALUES ('g', 'Technology', 'From desktops to tablets to phones, everything related to technology goes here.', NULL);
INSERT INTO boards (short_name, name, description, user_id)
VALUES ('jp', 'Japanese Culture', 'Discuss all things related to Japan, e.g. Touhou, idols, and virtual youtubers.', NULL);
INSERT INTO boards (short_name, name, description, user_id)
VALUES ('v', 'Video Games', NULL, NULL);