const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const fs = require('fs');
const fileUploader = require('../middleware/fileUploader');
const {startThreadValidator} = require('../middleware/validation');
const RepliesModel = require('../models/Replies');
const ThreadsModel = require('../models/Threads');
const UsersModel = require('../models/Users');
const CustomError = require('../helpers/CustomError');

/** Creates a thread. */
router.post('/start-thread', fileUploader.single('threadImage'), startThreadValidator, (req, res) => {
    let result = {}; // for the frontend

    const username = req.body.username; // can be empty
    const password = req.body.password; // can be empty
    const subject = req.body.subject; // can be empty
    const body = req.body.body; // can be empty
    const imagePath = req.file.path;
    const thumbnailPath = req.file.destination + '/thumbnail-' + req.file.filename;
    const originalFilename = req.file.originalname;
    const boardId = req.body.boardId;

    sharp(imagePath) // create a thumbnail of the image to minimize data sent
    .resize(250, 250, { fit: 'inside' })
    .toFile(thumbnailPath)
    .then(() => {
        if (username.length > 0 && password.length > 0) {
            return UsersModel.authenticate(username, password);
        } else return ''; // anonymous thread author
    })
    .then(userId => {
        if (userId < 0) throw new CustomError('Error: Invalid username and/or password.');
        else { // create the thread
            return ThreadsModel.createThread(subject, body, imagePath, thumbnailPath,
                                             originalFilename, boardId, userId);
        }
    })
    .then(threadId => {
        if (threadId < 0) throw new Error('Error with createThread().');
        else { // thread created
            result.status = 'success';
            result.message = 'Thread created!';
            res.send(result);
        }
    })
    .catch(err => {
        result.status = 'error';
        if (err instanceof CustomError) result.message = err.message;
        else result.message = `Server Error: The thread could not be created.
                               Please ensure that you are uploading an image.`;
        
        // delete the images stored on the server on error
        fs.unlink(imagePath, () => {});
        fs.unlink(thumbnailPath, () => {});

        console.log(err);
        res.send(result);
    });
});

router.post('/get-thread', (req, res) => {
    let result = {}; // for the frontend
    const MAX_REPLIES = 7; // maximum number of replies to get from the database
    const threadId = req.body.threadId;

    ThreadsModel.getThreadData(threadId)
    .then(threadData => {
        if (threadData === -1) throw new Error('No thread found in getThreadData().');
        else {
            result.threadData = threadData;
            return RepliesModel.getRepliesToThread(threadId, MAX_REPLIES);
        }
    })
    .then(replyData => {
        if (replyData < 0) throw new Error('Error with getRepliesToThread().');
        else {
            result.replyData = replyData;
            res.send(result);
        }
    })
    .catch(err => {
        result = {status: 'error'}; // only send error
        console.log(err);
        res.send(result);
    });
});

module.exports = router;