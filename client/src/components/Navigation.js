import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Container, Nav, Navbar, Form, FormControl} from 'react-bootstrap';

export default function Navigation() {
    const navigate = useNavigate();
    const [form, setForm] = useState({username: ''});
    const [result, setResult] = useState(null);

    /** Update the form's state. */
    function updateForm(value) {
        return setForm((prev) => {
            return {...prev, ...value};
        });
    }

    /** Send form data to the backend so it can query the database.
      * The backend will tell us whether the query was fruitful or not. */
     async function onSubmit(e) {
        e.preventDefault();
        
        await fetch('/api/users/search', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') navigate(`/user/${data.userId}`);
            setResult(data);
        })
        .catch(console.log());
    }

    useEffect(() => {
        // Reset the form after successful search, or display an error on failed search
        if (result?.status === 'success') setForm({username: ''});
        else if (result?.status === 'error') alert(result.message);
    }, [result]);

    return (
        <Navbar className='navbar-component'>
            <Container>
                <Navbar.Brand href='/'>rratchan</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className='justify-content-end'>
                    <Form className='d-flex' onSubmit={onSubmit}>
                        <FormControl required type='search' placeholder='Lookup User' className='me-2'
                         value={form.username} onChange={e => updateForm({username: e.target.value})} />
                        <Button variant='primary' className='me-3' type='submit'>Search</Button>
                    </Form>
                    <Nav.Link href='/register'>Register</Nav.Link>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}