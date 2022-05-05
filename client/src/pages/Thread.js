import {useEffect, useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import BookmarkThreadForm from '../components/BookmarkThreadForm';
import PostReplyForm from '../components/PostReplyForm';
import ReplyRow from '../components/ReplyRow';

export default function Thread(props) {
    const {threadId} = props;

    const [threadData, setThreadData] = useState([]); // first query
    const [replyData, setReplyData] = useState([]); // second query
    const [threadImageIsMaximized, setThreadImageIsMaximized] = useState(false);
    const [replyImageIsMaximized, setReplyImageIsMaximized] = useState(null);

    const [postReplyFormIsVisible, setPostReplyFormIsVisible] = useState(false);
    const [postReplySuccessMessage, setPostReplySuccessMessage] = useState(null);
    const [bookmarkThreadFormIsVisible, setBookmarkThreadFormIsVisible] = useState(false);
    const [bookmarkThreadSuccessMessage, setBookmarkThreadSuccessMessage] = useState(null);

    useEffect(() => {
        (/** Get the board data, thread data, and replies from the database. */
        function displayThread() {
            fetch('/api/threads/get-thread', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({threadId: threadId})
            })
            .then(res => res.json())
            .then(combinedResult => {
                if (combinedResult.status) setThreadData(combinedResult.status);
                else {
                    setThreadData(combinedResult.threadData);
                    setReplyData(combinedResult.replyData);
                    setReplyImageIsMaximized(new Array(combinedResult.replyData.length).fill(false));
                }
            })
            .catch(console.log());
        })();
    }, [threadId]);

    /** Close the bookmark thread form upon successful bookmark. */
    useEffect(() => {
        if (bookmarkThreadSuccessMessage) setBookmarkThreadFormIsVisible(false);
    }, [bookmarkThreadSuccessMessage]);

    /** Close the post reply form upon successful thread creation. */
    useEffect(() => {
        if (postReplySuccessMessage) setPostReplyFormIsVisible(false);
    }, [postReplySuccessMessage]);

    /** Toggle whether the bookmark thread form is visible.
      * Also clears any success messages from booking a thread. */
    function toggleBookmarkThreadForm() {
        setBookmarkThreadFormIsVisible(!bookmarkThreadFormIsVisible);
        setBookmarkThreadSuccessMessage(null);
    }

    /** Toggle whether the post reply form is visible.
      * Also clears any success messages from posting a reply. */
    function togglePostReplyForm() {
        setPostReplyFormIsVisible(!postReplyFormIsVisible);
        setPostReplySuccessMessage(null);
    }

    function getBookmarkThreadToggleText() {
        if (bookmarkThreadFormIsVisible) return 'Close Form';
        else return 'Bookmark';
    }

    function getPostReplyToggleText() {
        if (postReplyFormIsVisible) return 'Close Form';
        else return 'Post a Reply';
    }

    // function getThreadImageHTML() {
    //     if (threadImageIsMaximized) {
    //         return <img src={'/' + threadData.image_path} className='maximized-thread-image'
    //                 alt='Thread attachment' onClick={() => setThreadImageIsMaximized(!threadImageIsMaximized)} />;
    //     } else {
    //         return <img src={'/' + threadData.image_path} className='minimized-thread-image'
    //                 alt='Thread attachment' onClick={() => setThreadImageIsMaximized(!threadImageIsMaximized)} />;
    //     }
    // }

    function displayReplies() {
        return replyData.map((reply, index) => {
            return (
                <ReplyRow key={index} index={index} id={reply.id} reply={reply.reply}
                 imagePath={reply.image_path} thumbnailPath={reply.thumbnail_path}
                 origFilename={reply.orig_filename} createdAt={reply.created_at}
                 username={reply.username} replyImageIsMaximized={replyImageIsMaximized}
                 setReplyImageIsMaximized={setReplyImageIsMaximized} />
            );
        })
    }

    console.log(replyData);

    if (threadData === 'error') return <Navigate to='/404' />;
    // wait for the fetch to finish before rendering
    else if (!threadData.short_name || !replyImageIsMaximized) return <div />;
    else return (
        <div className='thread-page'>
            <h2 className='page-title'>/{threadData.short_name}/ - {threadData.board_name}</h2>
            <div className='thread-nav'>
                [<Link to={`/board/${threadData.short_name}`} className='clickable'>Catalog</Link>]
                <div className='thread-nav-right'>
                    [<Link to='#' className='clickable thread-bookmark' onClick={toggleBookmarkThreadForm}>
                        {getBookmarkThreadToggleText()}
                    </Link>]
                    {bookmarkThreadSuccessMessage}
                    {bookmarkThreadFormIsVisible &&
                        <BookmarkThreadForm threadId={threadId}
                         passBookmarkThreadSuccessMessage={setBookmarkThreadSuccessMessage} />
                    }
                </div>
            </div>
            <hr className='board-data-divider' />
            <Container className='thread-content'>
                <Row>
                    <p className='thread-image-filename'>File: {threadData.orig_filename}</p>
                    <Col md='auto'>
                        <img src={'/' + threadData.image_path} alt='Thread attachment'
                         className={threadImageIsMaximized ? 'maximized-thread-image' : 'minimized-thread-image'}
                         onClick={() => setThreadImageIsMaximized(!threadImageIsMaximized)} />
                    </Col>
                    <Col className='thread-heading-col'>
                        <p className='thread-heading'>
                            <strong className='thread-subject'>{threadData.subject}</strong>&nbsp;
                            <strong className='username'>{threadData.username ?
                                                          threadData.username : 'Anonymous'}</strong>&nbsp;
                            {new Date(threadData.created_at).toLocaleString('en-US', {hourCycle: 'h23'})}&nbsp;
                            TID: {threadId}
                        </p>
                        <p className='thread-body'>{threadData.body}</p>
                    </Col>
                </Row>
                {displayReplies()}
            </Container>

            <hr className='last-reply-divider' />
            <h4 className='clickable-brackets'>
                [<Link to='#' className='clickable' onClick={togglePostReplyForm}>
                    {getPostReplyToggleText()}
                </Link>]
            </h4>
            {postReplySuccessMessage}
            {postReplyFormIsVisible &&
                <PostReplyForm threadId={threadId}
                 passPostReplySuccessMessage={setPostReplySuccessMessage} />
            }
        </div>
    );
}