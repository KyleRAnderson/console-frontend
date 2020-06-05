import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import AppPaths from '../../../routes/AppPaths';
import Roster from '../../../models/Roster';
import UserDashboard from './UserDashboard';
import LogoutButton from './LogoutButton';

function AppPage(props: RouteComponentProps) {
    const [] = useState<Roster | undefined>(undefined);

    return (
        <>
            <Navbar className="primary-color" variant="dark">
                <Navbar.Brand href={AppPaths.root}>Hunt Console</Navbar.Brand>
                <Nav className="mr-auto" activeKey={props.location.pathname}>
                    <Nav.Link href={AppPaths.rostersPath}>Rosters</Nav.Link>
                </Nav>
                <Container className="justify-content-end">
                    <LogoutButton />
                </Container>
            </Navbar>
            <UserDashboard {...props} />
        </>
    );
}
export default AppPage;
