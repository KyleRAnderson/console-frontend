import React from 'react';
import { ButtonGroup, Nav, Navbar } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import * as AppPaths from '../../../routes/AppPaths';
import ChangePasswordButton from './ChangePasswordButton';
import LogoutButton from './LogoutButton';

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
                    <ButtonGroup>
                        <ChangePasswordButton />
                        <LogoutButton />
                    </ButtonGroup>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
