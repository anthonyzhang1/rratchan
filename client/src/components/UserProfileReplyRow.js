import {Link} from 'react-router-dom';

export default function UserProfileReplyRow(props) {
    const {shortName, threadId, subject, replyId, reply} = props;

    return (
        <tr>
            <td><Link to={`/board/${shortName}`} className='clickable'>/{shortName}/</Link></td>
            <td><Link to={`/thread/${threadId}`} className='clickable'>{threadId}</Link></td>
            <td><Link to={`/thread/${threadId}`} className='clickable'>{subject}</Link></td>
            <td><Link to={`/thread/${threadId}`} className='clickable'>{replyId}</Link></td>
            <td><Link to={`/thread/${threadId}`} className='clickable'>{reply}</Link></td>
        </tr>
    );
}