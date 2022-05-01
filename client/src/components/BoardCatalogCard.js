import Card from 'react-bootstrap/Card';
import {Link} from 'react-router-dom';

export default function BoardCatalogCard(props) {
    return (
        <Card>
            <Card.Body>
                <Link to={`./${props.id}`}>
                    <img src={'/' + props.thumbnailPath} />
                </Link>
                <Card.Text>
                    <strong>{props.subject}</strong>{props.subject && props.body && ':'} {props.body}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}