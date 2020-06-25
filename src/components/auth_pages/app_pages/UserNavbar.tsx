import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import LogoutButton from './LogoutButton';
import * as AppPaths from '../../../routes/AppPaths';
import { RouteComponentProps } from 'react-router-dom';

type Props = RouteComponentProps & {
    children?: React.ReactNode;
};

export default function UserNavbar(props: Props): JSX.Element {
    return (
        <Navbar collapseOnSelect expand="md" className="primary-color" variant="dark">
            <Navbar.Brand href={AppPaths.ROOT}>Hunt Console</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse>
                <Nav className="mr-auto" activeKey={props.location.pathname}>
                    <Nav.Link href={AppPaths.ROSTERS_PATH}>Rosters</Nav.Link>
                    {props.children}
                </Nav>
                <Nav>
                    <Nav.Item>
                        <LogoutButton />
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
