import React from 'react';
import { Route } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { root, rostersPath } from '../../../routes/AppLocations';
import RosterView from './rosters/RosterView';

function AppPage() {
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href={root}>Hunt Console</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href={rostersPath}>Rosters</Nav.Link>
                </Nav>
            </Navbar>
            <Route path={`${rostersPath}(:rosterID)`}>
                <RosterView />
            </Route>
        </>
    );
}
export default AppPage;
