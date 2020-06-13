import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import * as AppPaths from '../../../routes/AppPaths';
import UserDashboard from './UserDashboard';
import LogoutButton from './LogoutButton';

function AppPage(props: RouteComponentProps) {
    return (
        <>
            <Navbar className="primary-color" variant="dark">
                <Navbar.Brand href={AppPaths.ROOT}>Hunt Console</Navbar.Brand>
                <Nav className="mr-auto" activeKey={props.location.pathname}>
                    <Nav.Link href={AppPaths.ROSTERS_PATH}>Rosters</Nav.Link>
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
