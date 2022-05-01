import {useEffect, useState} from 'react';
import {Button, Form} from 'react-bootstrap';

export default function UserProfile(props) {
    const {userId} = props;

    

    return (
        <div className='user-profile-page'>
            <p>Hello: {userId}</p>
        </div>
    );
}