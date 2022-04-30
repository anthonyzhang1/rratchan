const express = require('express');
const router = express.Router();
const multer = require('multer');
const uuid = require('uuid');
const sharp = require('sharp');
const fs = require('fs');
const {startThreadValidator} = require('../middleware/validation');
const ThreadsModel = require('../models/Threads');
const UsersModel = require('../models/Users');
const CustomError = require('../helpers/CustomError');

const storage = multer.diskStorage({
    destination: function(_, _, cb) { cb(null, 'public/uploads'); },
    filename: function(_, file, cb) {
        const fileExtension = file.mimetype.split('/')[1];
        cb(null, `${uuid.v4()}.${fileExtension}`);
    }
});

const upload = multer({ storage: storage });

/** Creates a thread. */
router.post('/start-thread', upload.single('image'), startThreadValidator, (req, res) => {
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
    .resize(200)
    .toFile(thumbnailPath)
    .then(() => {
        if (username.length > 0 && password.length > 0) {
            return UsersModel.authenticate(username, password);
        } else return ''; // anonymous thread author
    })
    .then(userId => {
        console.log(userId); // debug
        if (userId < 0) throw new CustomError('Error: Invalid username and/or password.');
        else { // create the thread
            return ThreadsModel.createThread(subject, body, imagePath, thumbnailPath,
                                             originalFilename, boardId, userId);
        }
    })
    .then(threadId => {
        if (threadId < 0) return new Error('Error with createThread().');
        else { // thread created
            result.status = 'success';
            result.message = 'Thread created!';
            console.log(`DEBUG: threadId: ${threadId}`);
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

module.exports = router;