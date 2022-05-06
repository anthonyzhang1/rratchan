import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import FrontPageBoardRow from '../components/FrontPageBoardRow';

export default function FrontPage() {
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        (/** Get the boards from the database. */
        function getBoards() {
            fetch('/api/boards/get-boards')
            .then(res => res.json())
            .then(data => { setBoards(data); })
            .catch(console.log());
        })();
    }, []);

    /** Displays the boards in the boards list. */
    function displayBoards() {
        return boards.map(board => {
            return <FrontPageBoardRow key={board.short_name}
                    shortName={board.short_name} name={board.name} />;
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