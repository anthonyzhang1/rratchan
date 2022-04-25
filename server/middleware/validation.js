/** Validates the create board form on the server-side. If any of the fields are invalid,
  * stop the board creation attempt and display an error message.
  * If all fields are valid, call next(). */
const createBoardValidator = (req, res, next) => {
    const MAX_SHORT_NAME_LENGTH = 5;
    const MAX_BOARD_NAME_LENGTH = 64;
    const MAX_DESCRIPTION_LENGTH = 2000;
    const FORWARD_SLASH = '/';

    let result = {status: 'error', message: ''}; // for the frontend
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

    let result = {status: 'error', message: ''}; // for the frontend
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

module.exports = {createBoardValidator, registrationValidator};