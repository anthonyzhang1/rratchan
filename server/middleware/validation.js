const fs = require('fs');

/** Validates the create board form on the server-side. If any of the fields are invalid,
  * stop the board creation attempt and display an error message.
  * If all fields are valid, call next(). */
const createBoardValidator = (req, res, next) => {
    const MAX_SHORT_NAME_LENGTH = 5;
    const MAX_BOARD_NAME_LENGTH = 64;
    const MAX_DESCRIPTION_LENGTH = 1000;
    const FORWARD_SLASH = '/';

    let result = {status: 'error'}; // for the frontend
    const shortName = req.body.shortName;
    const boardName = req.body.boardName;
    const description = req.body.description;

    if (shortName.length === 0 || shortName.length > MAX_SHORT_NAME_LENGTH) {
        result.message = `Error: Your board's short name must be between
                          1 and ${MAX_SHORT_NAME_LENGTH} characters long.`;
        res.send(result);
    } else if (shortName.includes(FORWARD_SLASH)) {
        result.message = `Error: Your board's short name cannot contain '${FORWARD_SLASH}'.`;
        res.send(result);
    } else if (boardName.length === 0 || boardName.length > MAX_BOARD_NAME_LENGTH) {
        result.message = `Error: Your board's name must be between
                          1 and ${MAX_BOARD_NAME_LENGTH} characters long.`;
        res.send(result);
    } else if (description.length > MAX_DESCRIPTION_LENGTH) {
        result.message = `Error: Your description exceeded ${MAX_DESCRIPTION_LENGTH} characters.`;
        res.send(result);
    } else next();
}

/** Validates the registration form on the server-side. If any of the fields are invalid,
  * stop the registration attempt and display an error message.
  * If all fields are valid, call next(). */
const registrationValidator = (req, res, next) => {
    const MAX_USERNAME_LENGTH = 64;
    const MAX_EMAIL_LENGTH = 128;
    const MAX_PASSWORD_LENGTH = 64;
    const EMAIL_FORMAT = /^\S+@\S+$/; // emails must be in the form: username@domain.

    let result = {status: 'error'}; // for the frontend
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (username.length === 0 || username.length > MAX_USERNAME_LENGTH) {
        result.message = `Error: Your username must be between 1 and ${MAX_USERNAME_LENGTH} characters long.`;
        res.send(result);
    } else if (email.length === 0 || email.length > MAX_EMAIL_LENGTH) {
        result.message = `Error: Your email must be between 1 and ${MAX_EMAIL_LENGTH} characters long.`;
        res.send(result);
    } else if (!EMAIL_FORMAT.test(email)) {
        result.message = "Error: Your email must be in the form: username@domain.";
        res.send(result);
    } else if (password.length === 0 || password.length > MAX_PASSWORD_LENGTH) {
        result.message = `Error: Your password must be between 1 and ${MAX_PASSWORD_LENGTH} characters long.`;
        res.send(result);
    } else if (password !== confirmPassword) {
        result.message = 'Error: Your password and confirm password must match.';
        res.send(result);
    } else next();
}

/** Validates the start thread form on the server-side. If any of the fields are invalid,
  * stop the start thread attempt and display an error message.
  * If all fields are valid, call next(). */
const startThreadValidator = (req, res, next) => {
    const MAX_SUBJECT_LENGTH = 255;
    const MAX_BODY_LENGTH = 2000;
    const MAX_ORIGINAL_FILENAME_LENGTH = 255;

    let result = {status: 'error'}; // for the frontend
    const username = req.body.username; // can be empty
    const password = req.body.password; // can be empty
    const subject = req.body.subject; // can be empty
    const body = req.body.body; // can be empty
    const originalFilename = req.file?.originalname;

    /** Deletes the file multer made if it exists, then send an error response. */
    function cleanUpImageAndSendResult() {
        if (req.file) fs.unlink(req.file.path, () => {});
        res.send(result);
    }

    if (username.length > 0 && password.length === 0) {
        result.message = `Error: You must enter a password if you enter a username.`;
        cleanUpImageAndSendResult();
    } else if (username.length === 0 && password.length > 0) {
        result.message = `Error: You must enter a username if you enter a password.`;
        cleanUpImageAndSendResult();
    } else if (subject.length > MAX_SUBJECT_LENGTH) {
        result.message = `Error: Your thread subject exceeded ${MAX_SUBJECT_LENGTH} characters.`;
        cleanUpImageAndSendResult();
    } else if (body.length > MAX_BODY_LENGTH) {
        result.message = `Error: Your thread body exceeded ${MAX_BODY_LENGTH} characters.`;
        cleanUpImageAndSendResult();
    } else if (!req.file) { // check if a file was uploaded
        result.message = `Error: Threads are required to have an image.`;
        cleanUpImageAndSendResult();
    } else if (originalFilename.length === 0 || originalFilename.length > MAX_ORIGINAL_FILENAME_LENGTH) {
        result.message = `Error: Your image's filename must be between
                          1 and ${MAX_ORIGINAL_FILENAME_LENGTH} characters long.`;
        cleanUpImageAndSendResult();
    } else next();
}

/** Validates the post reply form on the server-side. If any of the fields are invalid,
  * stop the post reply attempt and display an error message.
  * If all fields are valid, call next(). */
const postReplyValidator = (req, res, next) => {
    const MAX_REPLY_LENGTH = 2000;
    const MAX_ORIGINAL_FILENAME_LENGTH = 255;

    let result = {status: 'error'}; // for the frontend
    const username = req.body.username; // can be empty
    const password = req.body.password; // can be empty
    const reply = req.body.reply;
    const originalFilename = req.file?.originalname; // can be empty

    /** Deletes the file multer made if it exists, then send an error response. */
    function cleanUpImageAndSendResult() {
        if (req.file) fs.unlink(req.file.path, () => {});
        res.send(result);
    }

    if (username.length > 0 && password.length === 0) {
        result.message = `Error: You must enter a password if you enter a username.`;
        cleanUpImageAndSendResult();
    } else if (username.length === 0 && password.length > 0) {
        result.message = `Error: You must enter a username if you enter a password.`;
        cleanUpImageAndSendResult();
    } else if (reply.length === 0 || reply.length > MAX_REPLY_LENGTH) {
        result.message = `Error: Your reply must be between 1 and ${MAX_REPLY_LENGTH} characters long.`;
        cleanUpImageAndSendResult();
    } else if (req.file &&
               (originalFilename.length === 0 || originalFilename.length > MAX_ORIGINAL_FILENAME_LENGTH)) {
        result.message = `Error: Your image's filename must be between
                          1 and ${MAX_ORIGINAL_FILENAME_LENGTH} characters long.`;
        cleanUpImageAndSendResult();
    } else next();
}

module.exports = {createBoardValidator, registrationValidator,
                  startThreadValidator, postReplyValidator};