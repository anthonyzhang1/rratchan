import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import '../css/FrontPage.css'

/** Prepares the data from the backend and creates a table row with it.
    The table row can then be inserted into a table. */
const BoardTableEntry = (props) => (
    <tr>
        <td>/{props.board.short_name}/</td>
        <td>{props.board.name}</td>
    </tr>
);

export default function FrontPage() {
    const [boards, setBoards] = useState([]);

    /** Get the boards from the database. */
    async function getBoards() {
        const boards = await fetch('/api/boards/getBoards');
        setBoards(await boards.json());
    }

    useEffect(() => {
        getBoards();
    }, []);

    /** Displays the boards in the boards table. */
    function displayBoards() {
        return boards.map(board => {
            return (
                <BoardTableEntry key={board.short_name} board={board}/>
            );
        });
    }

    return (
        <div>
            <h1>Welcome to rratchan!</h1>
            <h3>Select a Board:</h3>
            <Table bordered hover size='sm'>
                <thead>
                    <tr>
                        <th className='short-name-table-column'>Short Name</th>
                        <th>Board</th>
                    </tr>
                </thead>
                <tbody>{displayBoards()}</tbody>
            </Table>
        </div>
    );
}