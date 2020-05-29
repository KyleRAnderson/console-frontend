import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import AppPaths from '../../../routes/AppPaths';
import Auth from '../../../auth';
import Roster from '../../../models/Roster';
import UserDashboard from './UserDashboard';

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
                    <Button
                        className="custom-button"
                        size="sm"
                        type="button"
                        href={AppPaths.root}
                        onClick={() => Auth.logout()}
                    >
                        Logout
                    </Button>
                </Container>
            </Navbar>
            <UserDashboard {...props} />
        </>
    );
}
export default AppPage;
