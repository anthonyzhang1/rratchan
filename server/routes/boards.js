const express = require('express');
const router = express.Router();
const {createBoardValidator} = require('../middleware/validation');
const BoardsModel = require('../models/Boards');
const UsersModel = require('../models/Users');
const CustomError = require('../helpers/CustomError');

/* Send a list of boards to the frontend. */
router.get('/get-boards', (_, res) => {
    BoardsModel.getBoards()
    .then(results => { res.send(results); })
    .catch(err => console.log(err));
});

router.post('/create-board', createBoardValidator, (req, res) => {
    let result = {}; // for the frontend
    const username = req.body.username;
    const password = req.body.password;
    const shortName = req.body.shortName.toLowerCase();
    const boardName = req.body.boardName;
    const description = req.body.description;
    let userId = -1; // stores the moderator's user id

    UsersModel.authenticateMod(username, password) // check if credentials belong to a mod account
    .then(authenticatedUserId => {
        if (authenticatedUserId < 0) {
            throw new CustomError('Error: Invalid username and/or password.');
        } else if (authenticatedUserId === 0) {
            throw new CustomError(`Error: Only moderators may create boards.
                                  '${username}' is not a moderator.`);
        } else {
            userId = authenticatedUserId;
            return BoardsModel.shortNameExists(shortName); // check if short name is in use
        }
    })
    .then(shortNameExists => {
        if (shortNameExists) {
            throw new CustomError(`Error: The board short name '${shortName}' is already in use.`);
        } else return BoardsModel.nameExists(boardName); // check if board name is in use
    })
    .then(boardNameExists => {
        if (boardNameExists) {
            throw new CustomError(`Error: The board name '${boardName}' is already in use.`);
        } else { // create the board
            return BoardsModel.createBoard(shortName, boardName, description, userId);
        }
    })
    .then(boardId => {
        if (boardId < 0) throw new Error('Error with createBoard().');
        else { // board created
            result.status = 'success';
            result.message = `Successfully created /${shortName}/!`;
            res.send(result);
        }
    })
    .catch(err => {
        result.status = 'error';
        if (err instanceof CustomError) result.message = err.message;
        else result.message = 'Server Error: The board could not be created.';
        
        console.log(err);
        res.send(result);
    });
});

router.post('/get-board-and-catalog', (req, res) => {
    let result = {}; // for the frontend
    const MAX_THREADS = 50; // maximum number of threads to get from the database
    const {shortName, catalogSortBy} = req.body;
    
    BoardsModel.getBoardData(shortName)
    .then(boardData => {
        if (boardData === -1) throw new Error('No board found in getBoardData().');
        else {
            result.boardData = boardData;
            return BoardsModel.getCatalogThreads(boardData.id, MAX_THREADS, catalogSortBy);
        }
    })
    .then(catalogResults => {
        if (catalogResults < 0) throw new Error('Error with getCatalogThreads().');
        else {
            result.catalogData = catalogResults;
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