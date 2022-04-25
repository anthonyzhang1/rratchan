import React, {useEffect, useState} from 'react';
import {Button, Form} from 'react-bootstrap';

export default function CreateBoard() {
    const [form, setForm] = useState({
        username: '',
        password: '',
        shortName: '',
        boardName: '',
        description: ''
    });
    const [result, setResult] = useState(null);

    /** Update the form's state. */
    function updateForm(value) {
        return setForm((prev) => {
            return {...prev, ...value};
        });
    }

    /** Push form data to the backend so it can put it in the database.
      * The backend will tell us whether the insertion was successful or not. */
    async function onSubmit(e) {
        e.preventDefault();
        
        await fetch('/api/boards/create-board', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })
        .then(res => res.json())
        .then(data => { setResult(data); })
        .catch(console.log());
    }

    useEffect(() => {
        // Reset the form after successful submission
        if (result && result.status === 'success') {
            setForm({username: '', password: '', shortName: '', boardName: '', description: ''});
        }
    }, [result]);

    return (
        <div className='create-board-page'>
            <h1 className='page-title'>Create a New Board</h1>
            <p className='page-description'>
            Only moderators may create boards, so you must enter the credentials
            to your moderator account in addition to filling out the rest of the fields.
            <br />
            An asterisk (*) indicates a required field.
            </p>

            {result !== null && <h3>{result.message}</h3>}
            <Form onSubmit={onSubmit}>
            <Form.Group className='mb-2' controlId='create-board-form-username'>
                    <Form.Label>*Moderator Username</Form.Label>
                    <Form.Control required type='text' placeholder='Username' value={form.username}
                        onChange={e => updateForm({username: e.target.value})}
                    />
                </Form.Group>
                <Form.Group controlId='create-board-form-password'>
                    <Form.Label>*Moderator Password</Form.Label>
                    <Form.Control required type='password' placeholder='Password' value={form.password}
                        onChange={e => updateForm({password: e.target.value})}
                    />
                </Form.Group>

                <Form.Group className='mb-2' controlId='create-board-form-short-name'>
                    <Form.Label>*Board Short Name</Form.Label>
                    <Form.Control required type='text' placeholder='Board Short Name, e.g. jp'
                        value={form.shortName} onChange={e => updateForm({shortName: e.target.value})}
                    />
                    <Form.Text>Max 5 characters. Must be a new short name, and cannot contain '/'.</Form.Text>
                </Form.Group>
                <Form.Group className='mb-2' controlId='create-board-form-name'>
                    <Form.Label>*Board Name</Form.Label>
                    <Form.Control required type='text' placeholder='Board Name, e.g. Japanese Culture'
                        value={form.boardName} onChange={e => updateForm({boardName: e.target.value})}
                    />
                    <Form.Text>Max 64 characters and must be a new board name.</Form.Text>
                </Form.Group>

                <Form.Group className='mb-2' controlId='create-board-form-description'>
                    <Form.Label>Board Description</Form.Label>
                    <Form.Control as='textarea' rows={6} placeholder='Enter a description for the board.'
                        value={form.description} onChange={e => updateForm({description: e.target.value})}
                    />
                    <Form.Text>Max 2000 characters.</Form.Text>
                </Form.Group>

                <Button className='mb-5' variant='primary' type='submit'>Create Board</Button>
            </Form>
        </div>
    );
}