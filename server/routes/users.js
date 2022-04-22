const express = require('express');
const router = express.Router();
const UsersModel = require('../models/Users');
const CustomError = require('../helpers/CustomError');

// TODO: validate credentials, including confirm password
/** Attempt to create an account with the given credentials. */
router.post('/register', (req, res) => {
    console.log(req.body); // debug
    let result = {status: '', message: ''} // for the frontend

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    UsersModel.usernameExists(username) // check if username exists
    .then((userExists) => {
        if (userExists) throw new CustomError(
            `Registration Failed: The username '${username}' has already been taken.`);
        else return UsersModel.createAccount(username, email, password); // create the account
    })
    .then(createdUserID => {
        if (createdUserID < 0) throw new Error('Error with createAccount().');
        else { // successfully created the account
            result.status = 'success';
            result.message = `Successfully registered the account '${username}'!`;
            console.log('DEBUG: userID: ' + createdUserID); // debug
            res.send(result);
        }
    })
    .catch(err => {
        if (err instanceof CustomError) result.message = err.message;
        else result.message = 'Server Error: Your account could not be created.';
        
        console.log(err);
        res.send(result);
    });
});

module.exports = router;