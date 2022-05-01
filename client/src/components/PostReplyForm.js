import {useEffect, useState, useRef} from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';

export default function PostReplyForm(props) {
    const {threadId, passPostReplySuccessMessage} = props;
    const fileInput = useRef();
    
    const [form, setForm] = useState({
        username: '',
        password: '',
        reply: '',
        threadId: threadId
    });
    const [replyImage, setReplyImage] = useState(null);
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
        
        const formData = new FormData();
        for (const key in form) formData.append(key, form[key]);
        if (replyImage) formData.append('replyImage', replyImage);

        await fetch('/api/replies/post-reply', {
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
            setForm({username: '', password: '', reply: '', threadId: threadId});
            setReplyImage(null);
            fileInput.current.value = '';
            passPostReplySuccessMessage(<h3>{result.message}</h3>);
        }
    }, [result, threadId, passPostReplySuccessMessage]);

    return (
        <div className='post-reply-form-component'>
            <h3>{result?.message}</h3>
            <Form onSubmit={onSubmit}>
                <Form.Group as={Row} controlId='post-reply-form-username'>
                    <Form.Label column='sm'>Username</Form.Label>
                    <Col sm={10}>
                        <Form.Control size='sm' type='text' placeholder='Username'
                         value={form.username} onChange={e => updateForm({username: e.target.value})} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className='mb-1' controlId='post-reply-form-password'>
                    <Form.Label column='sm'>Password</Form.Label>
                    <Col sm={10}>
                        <Form.Control size='sm' type='password' placeholder='Password'
                         value={form.password} onChange={e => updateForm({password: e.target.value})} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-1' controlId='post-reply-form-image'>
                    <Form.Label column='sm'>Image</Form.Label>
                    <Col sm={10}>
                        <Form.Control size='sm' type='file' name='replyImage' ref={fileInput}
                         onChange={e => setReplyImage(e.target.files[0])} />
                        <Form.Text>File must be an image, e.g. a JPEG or PNG.</Form.Text>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-1' controlId='post-reply-form-reply'>
                    <Form.Label column='sm' md={2}>Reply (required)</Form.Label>
                    <Col sm={10}>
                        <Form.Control required size='sm' as='textarea' rows={5} placeholder='Reply'
                         value={form.reply} onChange={e => updateForm({reply: e.target.value})} />
                         <Form.Text>Max 2000 characters.</Form.Text>
                    </Col>
                </Form.Group>

                <Button variant='primary' type='submit'>Post Reply</Button>
            </Form>
        </div>
    );
}