import {Link} from 'react-router-dom';

/** A row for a board which can be clicked on to go to the respective board's page.
  * The format of the text in the row is: /short name/ - name. */
export default function FrontPageBoardRow(props) {
    const {shortName, name} = props;

    return (
        <Link to={`/board/${shortName}/`} className='clickable'>
            <strong>/{shortName}/</strong> - {name}<br />
        </Link>
    );
}