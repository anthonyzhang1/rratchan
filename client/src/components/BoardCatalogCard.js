import Card from 'react-bootstrap/Card';
import {Link} from 'react-router-dom';

export default function BoardCatalogCard(props) {
    const {id, subject, body, thumbnailPath} = props;

    return (
        <Card>
            <Card.Body>
                <Link to={`/thread/${id}`}>
                    <img src={'/' + thumbnailPath} alt='Thread thumbnail' />
                </Link>
                <Card.Text>
                    <strong>{subject}</strong>{subject && body && ':'} {body}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}