const express = require('express');
const router = express.Router();
const BoardsModel = require('../models/Boards');

/* Send a list of boards to the frontend. */
router.get('/getBoards', async (req, res) => {
    BoardsModel.getBoards()
    .then(rows => {
        res.send(rows);
    })
    .catch(err => console.log(err));
});

module.exports = router;