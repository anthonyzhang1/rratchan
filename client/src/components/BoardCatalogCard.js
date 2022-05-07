import Card from 'react-bootstrap/Card';
import {Link} from 'react-router-dom';

export default function BoardCatalogCard(props) {
    const {id, subject, body, thumbnailPath} = props;
    // TODO: revert card text link back to normal after testing
    return (
        <Card>
            <Card.Body>
                <Link to={`/thread/${id}`}>
                    <img src={'/' + thumbnailPath} alt='Thread thumbnail' />
                </Link>
                <Link to={`/thread/${id}`} className='clickable'>
                    <Card.Text>
                        <strong>{subject}</strong>{subject && body && ':'} {body}
                    </Card.Text>
                </Link>
            </Card.Body>
        </Card>
    );
}