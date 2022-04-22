const express = require('express');
const router = express.Router();
const UsersModel = require('../models/Users');
const MyError = require('../helpers/MyError');

// TODO: validate credentials, including confirm password
/** Create an account with the given credentials. */
router.post('/register', (req, res) => {
    console.log(req.body); // debug

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    let result = {status: '', message: ''} // for the frontend

    UsersModel.createAccount(username, email, password)
    .then(createdUserID => {
        if (createdUserID < 0) throw Error('createdUserID error.');
        else { // successful account creation
            result.status = 'success';
            result.message = `Successfully registered the account '${username}'!`;
            console.log('DEBUG: userID: ' + createdUserID); // debug
            res.send(result);
        }
    })
    .catch(err => {
        result.status = 'error';
        if (err instanceof MyError) result.message = err;
        else result.message = 'Server Error: User could not be created.';
        
        console.log(err);
        res.send(result);
    });
});

module.exports = router;