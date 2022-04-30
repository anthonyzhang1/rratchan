import {useEffect, useState, useRef} from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';

export default function StartThreadForm(props) {
    const [form, setForm] = useState({
        username: '',
        password: '',
        subject: '',
        body: '',
        boardId: props.boardId
    });
    const [threadImage, setThreadImage] = useState(null);
    const [result, setResult] = useState(null);

    const fileInput = useRef();

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
        
        const formData = new FormData();
        for (const key in form) formData.append(key, form[key]);
        formData.append('image', threadImage);

        await fetch('/api/threads/start-thread', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => { setResult(data); })
        .catch(console.log());
    }

    useEffect(() => {
        // Reset the form after successful submission
        if (result?.status === 'success') {
            setForm({username: '', password: '', subject: '', body: '', boardId: props.boardId});
            setThreadImage(null);
            fileInput.current.value = '';
            props.passStartThreadSuccessMessage(<h3>{result.message}</h3>);
        }
    }, [result, props.boardId]);

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
                        <Form.Control required size='sm' type='file' name='image' ref={fileInput}
                         onChange={e => setThreadImage(e.target.files[0])} />
                        <Form.Text>File must be an image, e.g. a JPEG or PNG.</Form.Text>
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