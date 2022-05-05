import {Row, Col} from 'react-bootstrap';

export default function ReplyRow(props) {
    const {index, id, reply, imagePath, thumbnailPath, origFilename,
           createdAt, username, replyImageIsMaximized, setReplyImageIsMaximized} = props;

    function toggleReplyImageIsMaximized() {
        const arrayCopy = replyImageIsMaximized.slice();
        arrayCopy[index] = !arrayCopy[index];
        setReplyImageIsMaximized(arrayCopy);
    }

    function getReplyImageHTML() {
        if (replyImageIsMaximized[index]) {
            return <img src={'/' + imagePath} alt='Reply attachment'
                    className='maximized-reply-image' onClick={toggleReplyImageIsMaximized} />;
        } else {
            return <img src={'/' + thumbnailPath} alt='Reply attachment'
                    className='minimized-reply-image' onClick={toggleReplyImageIsMaximized} />;
        }
    }
    
    return (
        <Row className='reply-row'>
            <p className='reply-heading'>
                <strong className='username'>{username ? username : 'Anonymous'}</strong>&nbsp;
                {new Date(createdAt).toLocaleString('en-US', {hourCycle: 'h23'})}&nbsp;
                RID: {id}
            </p>

            {imagePath && <p className='reply-filename'>File: {origFilename}</p>}
            {imagePath && <Col md='auto'>{getReplyImageHTML()}</Col>}
            <Col md='auto'><p className='reply-body'>{reply}</p></Col>
        </Row>
    );
}