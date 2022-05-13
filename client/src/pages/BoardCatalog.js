import {useEffect, useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';
import BoardCatalogCard from '../components/BoardCatalogCard';
import StartThreadForm from '../components/StartThreadForm';

export default function BoardCatalog(props) {
    const {shortName} = props;

    // determines the order of the catalog's threads
    const [catalogSortBy, setCatalogSortBy] = useState('lastReply');
    const [boardData, setBoardData] = useState([]); // first query
    const [catalogData, setCatalogData] = useState([]); // second query
    const [startThreadFormIsVisible, setStartThreadFormIsVisible] = useState(false);
    const [startThreadSuccessMessage, setStartThreadSuccessMessage] = useState(null);

    useEffect(() => {
        (/** Get the board data and recent threads from the database. */
        async function displayCatalog() {
            fetch('/api/boards/get-board-and-catalog', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({shortName: shortName, catalogSortBy: catalogSortBy})
            })
            .then(res => res.json())
            .then(combinedResult => {
                if (combinedResult.status) setBoardData(combinedResult.status);
                else {
                    setBoardData(combinedResult.boardData);
                    setCatalogData(combinedResult.catalogData)
                }
            })
            .catch(console.log());
        })();
    }, [shortName, catalogSortBy]);

    /** Close the start thread form upon successful thread creation. */
    useEffect(() => {
        if (startThreadSuccessMessage) setStartThreadFormIsVisible(false);
    }, [startThreadSuccessMessage]);

    /** Toggle whether the start thread form is visible.
      * Also clears any success messages from starting a thread. */
    function toggleStartThreadForm() {
        setStartThreadFormIsVisible(!startThreadFormIsVisible);
        setStartThreadSuccessMessage(null);
    }

    function displayCatalog() {
        return catalogData.map(thread => {
            return (
                <Col className='catalog-col' key={thread.id}>
                    <BoardCatalogCard id={thread.id} subject={thread.subject} body={thread.body}
                     thumbnailPath={thread.thumbnail_path} />
                </Col>
            );
        });
    }

    let toggleText;
    if (startThreadFormIsVisible) toggleText = 'Close Form';
    else toggleText = 'Start a New Thread';

    // if a board with the given short name does not exist, show the not found page
    if (boardData === 'error') return <Navigate to='/404' />;
    else if (!boardData.name) return <div />; // wait for the fetch to finish before rendering
    else return (
        <div className='board-catalog-page'>
            <h2 className='page-title'>/{shortName}/ - {boardData.name}</h2>
            <h6 className='board-creator'>
                Board Creator: {boardData.username ? boardData.username : 'Server Admin'}
            </h6>
            <p className='page-description'>{boardData.description}</p>
            <hr className='board-data-divider' />

            <h4 className='start-thread-h4'>
                [<Link to='#' className='clickable' onClick={toggleStartThreadForm}>{toggleText}</Link>]
            </h4>
            {startThreadFormIsVisible &&
                <StartThreadForm boardId={boardData.id}
                 passStartThreadSuccessMessage={setStartThreadSuccessMessage} />
            }
            {startThreadSuccessMessage}
            <hr className='start-thread-divider' />
            
            {catalogData.length > 0 &&
                <div className='board-options'>
                    <label className='catalog-sort-by'>Sort By:&nbsp;
                        <select value={catalogSortBy} onChange={e => setCatalogSortBy(e.target.value)}>
                            <option value='lastReply'>Last Reply</option>
                            <option value='creationDate'>Creation Date</option>
                        </select>
                    </label>
                    <hr className='sort-by-divider' />
                </div>
            }
            
            <Row sm={6} className='g-4 catalog-row'>{displayCatalog()}</Row>
        </div>
    );
}