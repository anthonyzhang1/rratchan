import {useEffect, useState} from 'react';

export default function BoardCatalog(props) {
    const shortName = props.shortName;
    const [boardData, setBoardData] = useState([]);

    function getBoardData() {
        
    }

    useEffect(() => { getBoardData(); }, []);

    return (
        <div>
            <h1>short name: {shortName}</h1>
        </div>
    );
}