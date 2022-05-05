const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const fs = require('fs');
const fileUploader = require('../middleware/fileUploader');
const {postReplyValidator} = require('../middleware/validation');
const RepliesModel = require('../models/Replies');
const UsersModel = require('../models/Users');
const CustomError = require('../helpers/CustomError');

router.post('/post-reply', fileUploader.single('replyImage'), postReplyValidator, (req, res) => {
    let result = {}; // for the frontend

    const username = req.body.username; // optional
    const password = req.body.password; // optional
    const reply = req.body.reply;
    const imagePath = req.file ? req.file.path : ''; // optional
    const thumbnailPath = req.file ? req.file.destination + '/thumbnail-' + req.file.filename : ''; // optional
    const originalFilename = req.file ? req.file.originalname : ''; // optional
    const threadId = req.body.threadId;

    /** Create a thumbnail for the image if an image was given.
      * If no image was given, return a resolved promise. */
    function createThumbnail(file) {
        if (file) {
            return sharp(imagePath)
            .resize(175, 175, { fit: 'inside' })
            .toFile(thumbnailPath)
            .catch(err => Promise.reject(err));
        } else return Promise.resolve();
    }

    createThumbnail(req.file)
    .then(() => {
        if (username.length > 0 && password.length > 0) {
            return UsersModel.authenticate(username, password);
        } else return ''; // // anonymous reply author
    })
    .then(userId => {
        if (userId < 0) throw new CustomError('Error: Invalid username and/or password.');
        else { // create the reply
            return RepliesModel.createReply(reply, imagePath, thumbnailPath,
                                            originalFilename, threadId, userId);
        }
    })
    .then(replyId => {
        if (replyId < 0) throw new Error('Error with createReply().');
        else { // reply created
            result.status = 'success';
            result.message = 'Reply posted!';
            res.send(result);
        }
    })
    .catch(err => {
        result.status = 'error';
        if (err instanceof CustomError) result.message = err.message;
        else result.message = `Server Error: Your reply could not be posted.
                               If you are uploading an image,
                               please ensure that it is a valid image type, e.g. JPEG or PNG.`;
        
        // delete the images stored on the server on error if they exist
        if (req.file) {
            fs.unlink(imagePath, () => {});
            fs.unlink(thumbnailPath, () => {});
        }

        console.log(err);
        res.send(result);
    });
});

module.exports = router;