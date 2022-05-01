const express = require('express');
const router = express.Router();
const BookmarksModel = require('../models/Bookmarks');
const UsersModel = require('../models/Users');
const CustomError = require('../helpers/CustomError');

router.post('/bookmark-thread', (req, res) => {
    let result = {}; // for the frontend
    const username = req.body.username;
    const password = req.body.password;
    let userId = -1; // stores the bookmarking user's id
    const threadId = req.body.threadId;

    UsersModel.authenticate(username, password) // check if credentials are valid
    .then(authenticatedUserId => {
        if (authenticatedUserId < 0) throw new CustomError('Error: Invalid username and/or password.');
        else {
            userId = authenticatedUserId;
            return BookmarksModel.bookmarkExists(userId, threadId);
        }
    })
    .then(bookmarkExists => {
        if (bookmarkExists) throw new CustomError('Error: You have already bookmarked this thread.');
        else return BookmarksModel.createBookmark(userId, threadId);
    })
    .then(userId => {
        if (userId < 0) throw new Error('Error with createBookmark().');
        else { // bookmark created
            result.status = 'success';
            result.message = 'Bookmark created.';
            res.send(result);
        }
    })
    .catch(err => {
        result.status = 'error';
        if (err instanceof CustomError) result.message = err.message;
        else result.message = 'Server Error: Your bookmark could not be created.';
        
        console.log(err);
        res.send(result);
    });
});

module.exports = router;