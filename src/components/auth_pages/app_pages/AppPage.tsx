import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import RostersView from './rosters/Rosters';
import AppPaths from '../../../routes/AppPaths';
import Auth from '../../../auth';

function AppPage(props: RouteComponentProps) {
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
            <Switch>
                <Route path={AppPaths.rostersPath} component={RostersView} />
            </Switch>
        </>
    );
}
export default AppPage;
