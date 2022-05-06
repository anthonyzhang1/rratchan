import {Link} from 'react-router-dom';

export default function UserProfileBookmarkRow(props) {
    const {shortName, threadId, subject, body, dateBookmarked} = props;

    return (
        <tr>
            <td><Link to={`/board/${shortName}`} className='clickable'>/{shortName}/</Link></td>
            <td><Link to={`/thread/${threadId}`} className='clickable'>{threadId}</Link></td>
            <td><Link to={`/thread/${threadId}`} className='clickable'>{subject}</Link></td>
            <td><Link to={`/thread/${threadId}`} className='clickable'>{body}</Link></td>
            <td>
                <Link to={`/thread/${threadId}`} className='clickable'>
                    {new Date(dateBookmarked).toLocaleString('en-US', {hourCycle: 'h23'})}
                </Link>
            </td>
        </tr>
    );
}