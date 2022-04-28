import {useEffect, useState} from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';

export default function StartThreadForm(props) {
    const [form, setForm] = useState({
        username: '',
        password: '',
        image: '',
        subject: '',
        body: '',
        boardId: props.boardId
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
        console.log(form);

        await fetch('/api/threads/start-thread', {
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
            setForm({username: '', password: '', subject: '', body: '', file: ''});
        }
    }, [result]);

    return (
        <div className='start-thread-form-component'>
            <h3>{result?.message}</h3>
            <Form onSubmit={onSubmit}>
                <Form.Group as={Row} controlId='start-thread-form-username'>
                    <Form.Label column='sm'>Username</Form.Label>
                    <Col sm={10}>
                        <Form.Control size='sm' type='text' placeholder='Username'
                         value={form.username} onChange={e => updateForm({username: e.target.value})} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className='mb-1' controlId='start-thread-form-password'>
                    <Form.Label column='sm'>Password</Form.Label>
                    <Col sm={10}>
                        <Form.Control size='sm' type='password' placeholder='Password'
                         value={form.password} onChange={e => updateForm({password: e.target.value})} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-1' controlId='start-thread-form-image'>
                    <Form.Label column='sm'>Image (required)</Form.Label>
                    <Col sm={10}>
                        <Form.Control required size='sm' type='file' value={form.image}
                         onChange={e => updateForm({image: e.target.value})} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-1' controlId='start-thread-form-subject'>
                    <Form.Label column='sm' md={2}>Subject</Form.Label>
                    <Col sm={10}>
                        <Form.Control size='sm' as='textarea' rows={2} placeholder='Thread Subject'
                         value={form.subject} onChange={e => updateForm({subject: e.target.value})} />
                         <Form.Text>Max 255 characters.</Form.Text>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-1' controlId='start-thread-form-body'>
                    <Form.Label column='sm' md={2}>Body</Form.Label>
                    <Col sm={10}>
                        <Form.Control size='sm' as='textarea' rows={5} placeholder='Thread Body'
                         value={form.body} onChange={e => updateForm({body: e.target.value})} />
                         <Form.Text>Max 2000 characters.</Form.Text>
                    </Col>
                </Form.Group>

                <Button variant='primary' type='submit'>Start Thread</Button>
            </Form>
        </div>
    );
}