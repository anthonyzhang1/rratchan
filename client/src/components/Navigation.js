import React from 'react';
import {Navbar, Nav, Container} from 'react-bootstrap';

export default function Navigation() {
    return (
        <Navbar>
            <Container>
                <Navbar.Brand href='/'>rratchan</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className='justify-content-end'>
                    <Nav.Link href='/register'>Register</Nav.Link>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}