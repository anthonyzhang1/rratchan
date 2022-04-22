const express = require('express');
const router = express.Router();
const BoardsModel = require('../models/Boards');

/* Send a list of boards to the frontend. */
router.get('/getBoards', async (req, res, next) => {
    BoardsModel.getBoards()
    .then(results => {
        res.send(results);
    })
    .catch(err => console.log(err));
});

module.exports = router;