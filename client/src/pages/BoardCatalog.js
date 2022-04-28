import {useEffect, useState} from 'react';
import {Link, Navigate} from 'react-router-dom';

export default function BoardCatalog(props) {
    const shortName = props.shortName;
    const [boardData, setBoardData] = useState([]); // first query
    const [catalog, setCatalog] = useState([]); // second query

    /** Get the board data and recent threads from the database. */

    useEffect(() => {
        (function displayCatalog() {
            fetch('/api/boards/get-catalog', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({shortName: shortName})
            })
            .then(res => res.json())
            .then(combinedResult => {
                if (combinedResult.status) setBoardData(combinedResult.status);
                else setBoardData(combinedResult.boardData);
            })
            .catch(console.log());
        })();
    }, [shortName]);

    // if a board with the given short name does not exist, show the not found page
    if (boardData === 'error') return <Navigate to='/404' />;
    else if (!boardData.name) return <div /> // wait for the fetch to finish before rendering
    else return (
        <div className='board-catalog-page'>
            <h1 className='page-title'>/{shortName}/ - {boardData.name}</h1>
            <h6 className='board-creator'>
                Board Creator: {boardData.username ? boardData.username : 'Server Owner'}
            </h6>
            <p className='page-description'>{boardData.description}</p>
            <hr className='board-data-divider' />
            <h4>[<Link to='#' className='clickable'>Create a New Thread</Link>]</h4>
        </div>
    );
}