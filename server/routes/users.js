const express = require('express');
const router = express.Router();
const {registrationValidator} = require('../middleware/validation');
const BookmarksModel = require('../models/Bookmarks');
const RepliesModel = require('../models/Replies');
const ThreadsModel = require('../models/Threads');
const UsersModel = require('../models/Users');
const CustomError = require('../helpers/CustomError');

router.post('/search', (req, res) => {
    let result = {}; // for the frontend
    const username = req.body.username;

    UsersModel.getIdWithUsername(username)
    .then(userId => {
        if (userId < 0) throw new CustomError(`There is no user with the username '${username}'.`);
        else {
            result.status = 'success';
            result.userId = userId;
            res.send(result);
        }
    })
    .catch(err => {
        result.status = 'error';
        if (err instanceof CustomError) result.message = err.message;
        else result.message = 'Server Error: User lookup failed.';
        
        console.log(err);
        res.send(result);
    });
});

/** Get all the necessary data to render a user's profile. */
router.post('/get-profile', (req, res) => {
    let result = {}; // for the frontend
    const NUM_THREADS = 5; // number of threads to return
    const NUM_REPLIES = 5; // number of replies to return

    const {userId} = req.body;

    UsersModel.getUsernameWithId(userId)
    .then(username => {
        if (username < 0) throw new Error(`No user found with user id ${userId}.`);
        else {
            result.username = username;
            return ThreadsModel.getUserThreadCount(userId);
        }
    })
    .then(threadCount => {
        if (threadCount < 0) throw new Error('Error with getUserThreadCount().');
        else {
            result.threadCount = threadCount;
            return ThreadsModel.getUserLastNThreads(userId, NUM_THREADS);
        }
    })
    .then(threads => {
        if (threads < 0) throw new Error('Error with getUserLastNThreads().');
        else {
            result.threads = threads;
            return RepliesModel.getUserReplyCount(userId);
        }
    })
    .then(replyCount => {
        if (replyCount < 0) throw new Error('Error with getUserReplyCount().');
        else {
            result.replyCount = replyCount;
            return RepliesModel.getUserLastNReplies(userId, NUM_REPLIES);
        }
    })
    .then(replies => {
        if (replies < 0) throw new Error('Error with getUserLastNReplies().');
        else {
            result.replies = replies;
            return BookmarksModel.getUserBookmarkCount(userId);
        }
    })
    .then(bookmarkCount => {
        if (bookmarkCount < 0) throw new Error('Error with getUserBookmarkCount().');
        else {
            result.bookmarkCount = bookmarkCount;
            return BookmarksModel.getUserDetailedBookmarks(userId);
        }
    })
    .then(bookmarks => {
        if (bookmarks < 0) throw new Error('Error with getUserDetailedBookmarks().');
        else {
            result.bookmarks = bookmarks;
            res.send(result);
        }
    })
    .catch(err => {
        result = {status: 'error'}; // only send error
        console.log(err);
        res.send(result);
    });
});

/** Validate the provided credentials on the server-side,
  * then attempt to create an account with those credentials. */
router.post('/register', registrationValidator, (req, res) => {
    let result = {}; // for the frontend
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    UsersModel.usernameExists(username) // check if username exists
    .then(userExists => {
        if (userExists) {
            throw new CustomError(`Error: The username '${username}' has already been taken.`);
        } else return UsersModel.createAccount(username, email, password); // create the account
    })
    .then(createdUserId => {
        if (createdUserId < 0) throw new Error('Error with createAccount().');
        else { // account created
            result.status = 'success';
            result.message = `Successfully registered the account '${username}'!`;
            res.send(result);
        }
    })
    .catch(err => {
        result.status = 'error';
        if (err instanceof CustomError) result.message = err.message;
        else result.message = 'Server Error: Your account could not be created.';
        
        console.log(err);
        res.send(result);
    });
});

router.post('/become-a-mod', (req, res) => {
    let result = {}; // for the frontend
    const username = req.body.username;
    const password = req.body.password;

    UsersModel.authenticate(username, password) // check if credentials are valid
    .then(userId => {
        if (userId < 0) throw new CustomError('Error: Invalid username and/or password.');
        else return UsersModel.makeMod(userId); // make the user a mod
    })
    .then(userId => {
        if (userId < 0) throw new Error('Error with makeMod().');
        else { // successfully made user a mod
            result.status = 'success';
            result.message = `Congratulations! '${username}' is now a moderator.`;
            res.send(result);
        }
    })
    .catch(err => {
        result.status = 'error';
        if (err instanceof CustomError) result.message = err.message;
        else result.message = 'Server Error: Your application could not be submitted.';
        
        console.log(err);
        res.send(result);
    })
});

module.exports = router;