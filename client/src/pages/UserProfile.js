import {useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {Table} from 'react-bootstrap';
import UserProfileThreadRow from '../components/UserProfileThreadRow';
import UserProfileReplyRow from '../components/UserProfileReplyRow';
import UserProfileBookmarkRow from '../components/UserProfileBookmarkRow';

export default function UserProfile(props) {
    const {userId} = props;
    const [data, setData] = useState([]);
    
    useEffect(() => {
        (/** Get the board data, thread data, and replies from the database. */
        function displayProfile() {
            fetch('/api/users/get-profile', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userId: userId})
            })
            .then(res => res.json())
            .then(data => { setData(data); })
            .catch(console.log());
        })();
    }, [userId]);

    /** Displays the threads in the threads table. */
    function displayThreads() {
        return data.threads.map(thread => {
            return <UserProfileThreadRow key={thread.threadId} shortName={thread.short_name}
                    threadId={thread.threadId} subject={thread.subject} body={thread.body} />;
        });
    }

    /** Displays the replies in the replies table. */
    function displayReplies() {
        return data.replies.map(reply => {
            return <UserProfileReplyRow key={reply.replyId} shortName={reply.short_name}
                    threadId={reply.threadId} subject={reply.subject} replyId={reply.replyId}
                    reply={reply.reply} />;
        });
    }

    /** Displays the bookmarks in the bookmarks table. */
    function displayBookmarks() {
        return data.bookmarks.map(bookmark => {
            return <UserProfileBookmarkRow key={bookmark.threadId} shortName={bookmark.short_name}
                    threadId={bookmark.threadId} subject={bookmark.subject} body={bookmark.body}
                    dateBookmarked={bookmark.dateBookmarked} />;
        });
    }

    // if a user with the given user id does not exist, show the not found page
    if (data.status === 'error') return <Navigate to='/404' />;
    else if (!data.username) return <div />; // wait for the fetch to finish before rendering
    return (
        <div className='user-profile-page'>
            <h1 className='page-title'>{data.username}'s Profile</h1>
            <hr className='username-divider' />
            <p>Threads Started: {data.threadCount}</p>
            {data.threadCount > 0 && <h3>Recent Threads Started</h3>}
            {data.threadCount > 0 &&
                <Table className='recent-threads-table'>
                    <thead>
                        <tr>
                            <th>Board</th>
                            <th>Thread ID</th>
                            <th>Thread Subject</th>
                            <th>Body</th>
                        </tr>
                    </thead>
                    <tbody>{displayThreads()}</tbody>
                </Table>
            }

            <p>Replies Posted: {data.replyCount}</p>
            {data.replyCount > 0 && <h3>Recent Replies Posted</h3>}
            {data.replyCount > 0 &&
                <Table className='recent-replies-table'>
                    <thead>
                        <tr>
                            <th>Board</th>
                            <th>Thread ID</th>
                            <th>Thread Subject</th>
                            <th>Reply ID</th>
                            <th>Reply</th>
                        </tr>
                    </thead>
                    <tbody>{displayReplies()}</tbody>
                </Table>    
            }

            <p>Threads Bookmarked: {data.bookmarkCount}</p>
            {data.bookmarkCount > 0 && <h3>Bookmarks</h3>}
            {data.bookmarkCount > 0 &&
                <Table className='bookmarks-table'>
                    <thead>
                        <tr>
                            <th>Board</th>
                            <th>Thread ID</th>
                            <th>Thread Subject</th>
                            <th>Thread Body</th>
                            <th>Date Bookmarked</th>
                        </tr>
                    </thead>
                    <tbody>{displayBookmarks()}</tbody>
                </Table>
            }
        </div>
    );
}