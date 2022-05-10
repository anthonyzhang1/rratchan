import {Link} from 'react-router-dom';

export default function UserProfileThreadRow(props) {
    const {shortName, threadId, subject, body} = props;

    return (
        <tr className='user-thread-table-row'>
            <td><Link to={`/board/${shortName}`} className='clickable'>/{shortName}/</Link></td>
            <td><Link to={`/thread/${threadId}`} className='clickable'>{threadId}</Link></td>
            <td><Link to={`/thread/${threadId}`} className='clickable'>{subject}</Link></td>
            <td><Link to={`/thread/${threadId}`} className='clickable'>{body}</Link></td>
        </tr>
    );
}