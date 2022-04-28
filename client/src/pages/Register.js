import {useEffect, useState} from 'react';
import {Button, Form} from 'react-bootstrap';

export default function Register() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        
        await fetch('/api/users/register', {
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
            setForm({username: '', email: '', password: '', confirmPassword: ''});
        }
    }, [result]);

    return (
        <div className='registration-page'>
            <h1 className='page-title'>Registration</h1>
            <p className='page-description'>An asterisk (*) indicates a required field.</p>

            {result !== null && <h3>{result.message}</h3>}
            <Form onSubmit={onSubmit}>
                <Form.Group className='mb-3' controlId='registration-form-username'>
                    <Form.Label>*Username</Form.Label>
                    <Form.Control required type='text' placeholder='Username' value={form.username}
                        onChange={e => updateForm({username: e.target.value})}
                    />
                    <Form.Text>Max 64 characters.</Form.Text>
                </Form.Group>

                <Form.Group className='mb-3' controlId='registration-form-email'>
                    <Form.Label>*Email Address</Form.Label>
                    <Form.Control required type='email' placeholder='Email Address' value={form.email}
                        onChange={e => updateForm({email: e.target.value})}
                    />
                    <Form.Text>Max 128 characters, and must be in the form: username@domain.</Form.Text>
                </Form.Group>

                <Form.Group className='mb-3' controlId='registration-form-password'>
                    <Form.Label>*Password</Form.Label>
                    <Form.Control required type='password' placeholder='Password' value={form.password}
                        onChange={e => updateForm({password: e.target.value})}
                    />
                    <Form.Text>Max 64 characters.</Form.Text>
                </Form.Group>
                <Form.Group className='mb-3' controlId='registration-form-confirm-password'>
                    <Form.Label>*Confirm Password</Form.Label>
                    <Form.Control required type='password' placeholder='Confirm Password' value={form.confirmPassword}
                        onChange={e => updateForm({confirmPassword: e.target.value})}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">Register</Button>
            </Form>
        </div>
    );
}