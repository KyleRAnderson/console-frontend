import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { root, rostersPath } from '../../../routes/AppLocations';
import Rosters from './Rosters';
import { AuthProps } from '../AuthPages';

function AppPage(props: AuthProps) {
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href={root}>Hunt Console</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href={rostersPath}>Rosters</Nav.Link>
                </Nav>
            </Navbar>
            <BrowserRouter>
                <Route path={rostersPath} render={() => <Rosters {...props} />} />
            </BrowserRouter>
        </>
    );
}
export default AppPage;
