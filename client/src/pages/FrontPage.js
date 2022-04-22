import React, {useEffect, useState} from 'react';
import Table from 'react-bootstrap/Table';

/** Prepares the data from the backend and creates a table row with it.
  * The table row can then be inserted into a table. */
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
        fetch('/api/boards/getBoards')
        .then(res => res.json())
        .then(data => { setBoards(data); })
        .catch(console.log());
    }

    useEffect(() => {
        getBoards();
    }, []);

    /** Displays the boards in the boards table. */
    function displayBoards() {
        return boards.map(board => {
            return (
                <BoardTableEntry key={board.short_name} board={board} />
            );
        });
    }

    return (
        <div className='front-page'>
            <h1 className='page-title'>&#128000; rratchan</h1>
            <h4>[Create a New Board] (mods only)</h4>
            <hr />
            <h3>Boards</h3>
            <div className='d-flex justify-content-center'>
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
        </div>
    );
}