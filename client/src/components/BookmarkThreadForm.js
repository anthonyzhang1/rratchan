import {useEffect, useState} from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';

export default function BookmarkThreadForm(props) {
    const {threadId, passBookmarkThreadSuccessMessage} = props;
    
    const [form, setForm] = useState({
        username: '',
        password: '',
        threadId: threadId
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

        await fetch('/api/bookmarks/bookmark-thread', {
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
        if (result?.status === 'success') {
            setForm({username: '', password: '', threadId: threadId});
            passBookmarkThreadSuccessMessage(<h4>{result.message}</h4>);
        }
    }, [result, threadId, passBookmarkThreadSuccessMessage]);

    return (
        <div className='bookmark-thread-form-component'>
            <h4>{result?.message}</h4>
            <Form className='bookmark-thread-form' onSubmit={onSubmit}>
                <Form.Group as={Row} controlId='bookmark-thread-form-username'>
                    <Form.Label column='sm'>Username</Form.Label>
                    <Col sm={8}>
                        <Form.Control size='sm' type='text' placeholder='Username'
                         value={form.username} onChange={e => updateForm({username: e.target.value})} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId='bookmark-thread-form-password'>
                    <Form.Label column='sm'>Password</Form.Label>
                    <Col sm={8}>
                        <Form.Control size='sm' type='password' placeholder='Password'
                         value={form.password} onChange={e => updateForm({password: e.target.value})} />
                    </Col>
                </Form.Group>
                <Button variant='primary' type='submit'>Bookmark Thread</Button>
            </Form>
        </div>
    );
}