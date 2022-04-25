import React, {useEffect, useState} from 'react';
import {Button, Form} from 'react-bootstrap';

export default function BecomeAMod() {
    const [form, setForm] = useState({
        username: '',
        password: '',
    });
    const [result, setResult] = useState(null);

    /** Update the form's state. */
    function updateForm(value) {
        return setForm((prev) => {
            return {...prev, ...value};
        });
    }

    /** Push form data to the backend to verify it.
      * The backend will tell us whether the form was valid or not. */
    async function onSubmit(e) {
        e.preventDefault();
        
        await fetch('/api/users/become-a-mod', {
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
        if (result && result.status === 'success') setForm({username: '', password: ''});
    }, [result]);

    return (
        <div className='become-a-mod-page'>
            <h1 className='page-title'>Apply to Become a Mod</h1>
            <p className='page-description'>
            Enter your account credentials, and a server administrator shall review your
            account to determine whether you are suited for a moderator position.
            We will send you an email after the review process letting you know if you may proceed
            to the interview stage, or if you were denied moderator status.
            <br />
            <strong>Note: Since rratchan is not currently intended for public use and is locally hosted,
            we will automatically grant all applicants moderator status. No emails will be sent.</strong>
            </p>

            {result !== null && <h3>{result.message}</h3>}
            <Form onSubmit={onSubmit}>
                <Form.Group className='mb-3' controlId='become-a-mod-form-username'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control required type='text' placeholder='Username' value={form.username}
                        onChange={e => updateForm({username: e.target.value})}
                    />
                </Form.Group>

                <Form.Group className='mb-3' controlId='become-a-mod-form-password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type='password' placeholder='Password' value={form.password}
                        onChange={e => updateForm({password: e.target.value})}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">Apply</Button>
            </Form>
        </div>
    );
}