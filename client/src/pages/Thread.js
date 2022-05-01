import {useEffect, useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import PostReplyForm from '../components/PostReplyForm';

export default function Thread(props) {
    const threadId = props.threadId;

    const [threadData, setThreadData] = useState([]); // first query
    const [threadImageIsMaximized, setThreadImageIsMaximized] = useState(false);
    const [postReplyFormIsVisible, setPostReplyFormIsVisible] = useState(false);
    const [postReplySuccessMessage, setPostReplySuccessMessage] = useState(null);

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
                }
            })
            .catch(console.log());
        })();
    }, [threadId]);

    /** Close the post  reply form upon successful thread creation. */
    useEffect(() => {
        if (postReplySuccessMessage) setPostReplyFormIsVisible(false);
    }, [postReplySuccessMessage]);

    /** Toggle whether the post reply form is visible.
      * Also clears any success messages from posting a reply. */
     function togglePostReplyForm() {
        setPostReplyFormIsVisible(!postReplyFormIsVisible);
        setPostReplySuccessMessage(null);
    }

    function getToggleText() {
        if (postReplyFormIsVisible) return 'Close Form';
        else return 'Post a Reply';
    }

    function getThreadImageHTML() {
        if (threadImageIsMaximized) {
            return <img src={'/' + threadData.image_path} className='maximized-thread-image'
            alt='Thread attachment' onClick={() => setThreadImageIsMaximized(!threadImageIsMaximized)} />
        } else {
            return (
                <Col md='auto' className='minimized-thread-image-col'>
                    <img src={'/' + threadData.image_path} className='minimized-thread-image'
                     alt='Thread attachment' onClick={() => setThreadImageIsMaximized(!threadImageIsMaximized)} />
                </Col>
            );
        }
    }

    if (threadData === 'error') return <Navigate to='/404' />;
    else if (!threadData.short_name) return <div /> // wait for the fetch to finish before rendering
    else return (
        <div className='thread-page'>
            <h2 className='page-title'>/{threadData.short_name}/ - {threadData.board_name}</h2>
            <hr className='board-data-divider' />
            <Container className='thread-content'>
                <Row>
                    <p className='thread-image-original-filename'>Filename: {threadData.orig_filename}</p>
                    {getThreadImageHTML()}
                    <Col className='thread-heading-col'>
                        <p className='thread-heading'>
                            <strong className='thread-subject'>{threadData.subject}</strong>&nbsp;
                            <strong className='username'>{threadData.username ?
                                                          threadData.username : 'Anonymous'}</strong>&nbsp;
                            {new Date(threadData.created_at).toLocaleString('en-US', {hour12: false})}&nbsp;
                            TID: {threadId}
                        </p>
                        <p className='thread-body'>{threadData.body}</p>
                    </Col>
                </Row>
            </Container>

            <hr className='last-reply-divider' />
            <h4 className='clickable-brackets'>
                [<Link to='#' className='clickable' onClick={togglePostReplyForm}>{getToggleText()}</Link>]
            </h4>
            {postReplySuccessMessage}
            {postReplyFormIsVisible &&
                <PostReplyForm threadId={threadId}
                 passPostReplySuccessMessage={setPostReplySuccessMessage} />
            }
        </div>
    );
}