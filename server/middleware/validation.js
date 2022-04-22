/** Validates the registration form on the server-side. If any of the fields are invalid,
  * stop the registration attempt and display an error message.
  * If all fields are valid, call next(). */
const registrationValidator = (req, res, next) => {
    const MAX_USERNAME_LENGTH = 64;
    const MAX_EMAIL_LENGTH = 128;
    const MAX_PASSWORD_LENGTH = 64;
    const EMAIL_FORMAT = /^\S+@\S+$/; // emails must be in the form username@domain.
    const HASHTAG = '#';

    let result = {status: 'error', message: ''}; // for the frontend
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (username.length === 0 || username.length > MAX_USERNAME_LENGTH) {
        result.message = `Error: Your username must be between 1 and ${MAX_USERNAME_LENGTH} characters long.`;
        res.send(result);
    } else if (username.includes(HASHTAG)) {
        result.message = `Error: Your username cannot contain the '${HASHTAG}' character.`;
        res.send(result);
    } else if (email.length === 0 || email.length > MAX_EMAIL_LENGTH) {
        result.message = `Error: Your email must be between 1 and ${MAX_EMAIL_LENGTH} characters long.`;
        res.send(result);
    } else if (!EMAIL_FORMAT.test(email)) {
        result.message = "Error: Your email must be in the form 'username@domain'.";
        res.send(result);
    } else if (password.length === 0 || password.length > MAX_PASSWORD_LENGTH) {
        result.message = `Error: Your password must be between 1 and ${MAX_PASSWORD_LENGTH} characters long.`;
        res.send(result);
    } else if (password.includes(HASHTAG)) {
        result.message = `Error: Your password cannot contain the '${HASHTAG}' character.`;
        res.send(result);
    } else if (password !== confirmPassword) {
        result.message = 'Error: Your password and confirm password do not match.';
        res.send(result);
    } else next();
}

module.exports = {registrationValidator}