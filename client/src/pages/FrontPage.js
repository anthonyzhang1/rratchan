import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

/** Creates a row for a board which can be clicked on to go to the respective board's catalog.
  * The format of the text in the row is: /short name/ - name. */
const BoardRow = (props) => (
    <Link to={`/board/${props.board.short_name}/`} className='clickable'>
        <strong>/{props.board.short_name}/</strong> - {props.board.name}<br />
    </Link>
);

export default function FrontPage() {
    const [boards, setBoards] = useState([]);

    /** Get the boards from the database. */
    async function getBoards() {
        fetch('/api/boards/get-boards')
        .then(res => res.json())
        .then(data => { setBoards(data); })
        .catch(console.log());
    }

    useEffect(() => { getBoards(); }, []);

    /** Displays the boards in the boards table. */
    function displayBoards() {
        return boards.map(board => {
            return <BoardRow key={board.short_name} board={board} />;
        });
    }

    return (
        <div className='front-page'>
            <h1 className='page-title'>&#128000; rratchan</h1>
            <h4>[<Link to='/become-a-mod' className='clickable'>Apply to Become a Mod</Link>]</h4>
            <h4>[<Link to='/create-board' className='clickable'>Create a New Board</Link>] (mods only)</h4>
            <hr />
            <h3>Boards</h3>
            <div className='boards-list'>{displayBoards()}</div>
        </div>
    );
}